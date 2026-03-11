#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const gamePath = path.join(projectRoot, "src", "game.js");
const htmlPath = path.join(projectRoot, "index.html");
const defaultOutput = path.join(projectRoot, "exports", "unreal", "level-data.json");

function parseArgs(argv) {
  const args = {
    output: defaultOutput,
    scale: 1
  };

  for (const arg of argv) {
    if (arg.startsWith("--scale=")) {
      const parsed = Number(arg.slice("--scale=".length));
      if (Number.isFinite(parsed) && parsed > 0) {
        args.scale = parsed;
      }
      continue;
    }

    if (!arg.startsWith("--")) {
      args.output = path.resolve(projectRoot, arg);
    }
  }

  return args;
}

function extractCanvasSize(htmlSource) {
  const match = htmlSource.match(/<canvas[^>]*id="game"[^>]*width="(\d+)"[^>]*height="(\d+)"/i);
  if (!match) {
    throw new Error("Could not find canvas#game width/height in index.html");
  }

  return {
    width: Number(match[1]),
    height: Number(match[2])
  };
}

function findConstExpression(source, name) {
  const pattern = new RegExp(`\\bconst\\s+${name}\\s*=`, "g");
  const match = pattern.exec(source);
  if (!match) {
    throw new Error(`Could not find const ${name}`);
  }

  let i = match.index + match[0].length;
  while (i < source.length && /\s/.test(source[i])) {
    i += 1;
  }

  let start = i;
  let depthCurly = 0;
  let depthSquare = 0;
  let depthParen = 0;
  let stringQuote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (; i < source.length; i += 1) {
    const char = source[i];
    const next = i + 1 < source.length ? source[i + 1] : "";

    if (lineComment) {
      if (char === "\n") {
        lineComment = false;
      }
      continue;
    }

    if (blockComment) {
      if (char === "*" && next === "/") {
        blockComment = false;
        i += 1;
      }
      continue;
    }

    if (stringQuote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === stringQuote) {
        stringQuote = null;
      }
      continue;
    }

    if (char === "/" && next === "/") {
      lineComment = true;
      i += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      blockComment = true;
      i += 1;
      continue;
    }

    if (char === "'" || char === "\"" || char === "`") {
      stringQuote = char;
      continue;
    }

    if (char === "{") {
      depthCurly += 1;
      continue;
    }
    if (char === "}") {
      depthCurly -= 1;
      continue;
    }
    if (char === "[") {
      depthSquare += 1;
      continue;
    }
    if (char === "]") {
      depthSquare -= 1;
      continue;
    }
    if (char === "(") {
      depthParen += 1;
      continue;
    }
    if (char === ")") {
      depthParen -= 1;
      continue;
    }

    if (char === ";" && depthCurly === 0 && depthSquare === 0 && depthParen === 0) {
      return source.slice(start, i).trim();
    }
  }

  throw new Error(`Could not parse initializer for const ${name}`);
}

function safeEvalExpression(expression, scope) {
  const names = Object.keys(scope);
  const values = names.map((name) => scope[name]);
  const fn = new Function(...names, `return (${expression});`);
  return fn(...values);
}

function buildNumericScope(source, canvas) {
  const scope = {
    VIEW_WIDTH: canvas.width,
    VIEW_HEIGHT: canvas.height
  };

  const declarationRegex = /^const\s+([A-Z0-9_]+)\s*=\s*([^;]+);/gm;
  let match;

  while ((match = declarationRegex.exec(source))) {
    const name = match[1];
    const expression = match[2].trim();

    if (scope[name] !== undefined) {
      continue;
    }

    if (!/^[A-Z0-9_+\-*/%().\s]+$/.test(expression)) {
      continue;
    }

    try {
      const value = safeEvalExpression(expression, scope);
      if (typeof value === "number" && Number.isFinite(value)) {
        scope[name] = value;
      }
    } catch {
      // Skip expressions that depend on unavailable symbols.
    }
  }

  return scope;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function toUnrealRect(rect, refHeight, scale) {
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  return {
    x_cm: round(centerX * scale),
    z_cm_top_origin: round(-centerY * scale),
    z_cm_bottom_origin: round((refHeight - centerY) * scale),
    extent_x_cm: round((rect.width / 2) * scale),
    extent_z_cm: round((rect.height / 2) * scale)
  };
}

function enrichRects(rects, refHeight, scale) {
  return rects.map((rect, index) => ({
    id: rect.id || `${rect.type || "rect"}-${index + 1}`,
    ...rect,
    center: {
      x: round(rect.x + rect.width / 2),
      y: round(rect.y + rect.height / 2)
    },
    unreal: toUnrealRect(rect, refHeight, scale)
  }));
}

function buildTeleporters(scope, scale) {
  const teleporterRects = [
    {
      id: "entry",
      scene: "tower",
      x: scope.TOWER_ENTRY_TELEPORTER_X - scope.TELEPORTER_HITBOX_WIDTH / 2,
      y: scope.BOSS_TELEPORTER_PLATFORM_Y - scope.TELEPORTER_HITBOX_HEIGHT,
      width: scope.TELEPORTER_HITBOX_WIDTH,
      height: scope.TELEPORTER_HITBOX_HEIGHT
    },
    {
      id: "base",
      scene: "tower",
      x: scope.TOWER_BASE_TELEPORTER_X - scope.TELEPORTER_HITBOX_WIDTH / 2,
      y: scope.FLOOR_Y - scope.TELEPORTER_HITBOX_HEIGHT,
      width: scope.TELEPORTER_HITBOX_WIDTH,
      height: scope.TELEPORTER_HITBOX_HEIGHT
    },
    {
      id: "exit",
      scene: "arena",
      x: scope.ARENA_EXIT_TELEPORTER_X - scope.TELEPORTER_HITBOX_WIDTH / 2,
      y: scope.ARENA_FLOOR_Y - scope.TELEPORTER_HITBOX_HEIGHT,
      width: scope.TELEPORTER_HITBOX_WIDTH,
      height: scope.TELEPORTER_HITBOX_HEIGHT
    }
  ];

  return teleporterRects.map((teleporter) => ({
    ...teleporter,
    unreal: toUnrealRect(
      teleporter,
      teleporter.scene === "tower" ? scope.WORLD_HEIGHT : scope.VIEW_HEIGHT,
      scale
    )
  }));
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const gameSource = fs.readFileSync(gamePath, "utf8");
  const htmlSource = fs.readFileSync(htmlPath, "utf8");
  const canvas = extractCanvasSize(htmlSource);
  const scope = buildNumericScope(gameSource, canvas);

  const platforms = safeEvalExpression(findConstExpression(gameSource, "platforms"), scope);
  const arenaPlatforms = safeEvalExpression(findConstExpression(gameSource, "arenaPlatforms"), scope);
  const forestRouteZones = safeEvalExpression(findConstExpression(gameSource, "forestRouteZones"), scope);
  const towerForestExitZone = safeEvalExpression(findConstExpression(gameSource, "TOWER_FOREST_EXIT_ZONE"), scope);
  const goal = safeEvalExpression(findConstExpression(gameSource, "goal"), scope);

  const towerPlatforms = platforms.filter((platform) => platform.type !== "forest-path");
  const towerSpecialPlatforms = platforms.filter((platform) => platform.type === "forest-path");

  const exportData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      sourceFiles: ["src/game.js", "index.html"],
      coordinateSystem:
        "Source is canvas pixels (origin top-left, +Y down). Unreal fields include top-origin and bottom-origin Z variants.",
      unrealScaleCmPerPixel: args.scale
    },
    dimensions: {
      view: { width: scope.VIEW_WIDTH, height: scope.VIEW_HEIGHT },
      world: { width: scope.WORLD_WIDTH, height: scope.WORLD_HEIGHT }
    },
    constants: {
      tower: {
        left: scope.TOWER_LEFT,
        right: scope.TOWER_RIGHT,
        floorY: scope.FLOOR_Y
      },
      arena: {
        left: scope.ARENA_LEFT,
        right: scope.ARENA_RIGHT,
        floorY: scope.ARENA_FLOOR_Y,
        playerSpawnX: scope.ARENA_PLAYER_SPAWN_X
      },
      forest: {
        left: scope.FOREST_LEFT,
        right: scope.FOREST_RIGHT,
        floorY: scope.FOREST_FLOOR_Y,
        entryX: scope.FOREST_ENTRY_X,
        bonfireX: scope.FOREST_BONFIRE_X
      }
    },
    scenes: {
      tower: {
        platforms: enrichRects(towerPlatforms, scope.WORLD_HEIGHT, args.scale),
        specialPlatforms: enrichRects(towerSpecialPlatforms, scope.WORLD_HEIGHT, args.scale),
        forestExitZone: {
          ...towerForestExitZone,
          unreal: toUnrealRect(towerForestExitZone, scope.WORLD_HEIGHT, args.scale)
        },
        goal: {
          ...goal,
          unreal: toUnrealRect(goal, scope.WORLD_HEIGHT, args.scale)
        },
        implicitBounds: {
          leftWallX: scope.TOWER_LEFT,
          rightWallX: scope.TOWER_RIGHT
        }
      },
      arena: {
        platforms: enrichRects(arenaPlatforms, scope.VIEW_HEIGHT, args.scale),
        implicitBounds: {
          leftWallX: scope.ARENA_LEFT,
          rightWallX: scope.ARENA_RIGHT
        }
      },
      forest: {
        zones: forestRouteZones.map((zone, zoneIndex) => ({
          index: zoneIndex,
          id: zone.id,
          title: zone.title,
          subtitle: zone.subtitle || "",
          floorY: zone.floorY,
          platforms: enrichRects(zone.platforms || [], scope.VIEW_HEIGHT, args.scale),
          walls: enrichRects(zone.walls || [], scope.VIEW_HEIGHT, args.scale),
          transitions: enrichRects(
            (zone.transitions || []).map((transition, transitionIndex) => ({
              id: `zone-${zoneIndex}-transition-${transitionIndex + 1}`,
              type: "transition",
              x: transition.x,
              y: transition.y,
              width: transition.width,
              height: transition.height,
              targetZone: transition.targetZone,
              spawnX: transition.spawnX,
              spawnY: transition.spawnY
            })),
            scope.VIEW_HEIGHT,
            args.scale
          )
        })),
        bonfire: {
          x: scope.FOREST_BONFIRE_X,
          floorY: scope.FOREST_FLOOR_Y
        }
      }
    },
    teleporters: buildTeleporters(scope, args.scale)
  };

  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(exportData, null, 2)}\n`, "utf8");
  console.log(`Unreal level export written to ${path.relative(projectRoot, args.output)}`);
}

run();
