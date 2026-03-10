const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const statusLabel = document.getElementById("status-label");
const heightLabel = document.getElementById("height-label");
const characterSelect = document.getElementById("character-select");

context.imageSmoothingEnabled = false;

const VIEW_WIDTH = canvas.width;
const VIEW_HEIGHT = canvas.height;
const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 4860;
const TOWER_LEFT = 112;
const TOWER_RIGHT = 848;
const FLOOR_Y = WORLD_HEIGHT - 132;
const GRAVITY = 1720;
const MOVE_SPEED = 170;
const AIR_DRAG = 0.986;
const MAX_CHARGE = 1.18;
const MIN_JUMP = 120;
const MAX_JUMP = 920;
const SIDE_BOOST = 395;
const CAMERA_LERP = 0.085;
const CHARGE_CURVE = 1.45;
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 46;
const CHARACTER_DRAW_WIDTH = 92;
const CHARACTER_DRAW_HEIGHT = 92;
const TOWER_WIDTH = TOWER_RIGHT - TOWER_LEFT;
const DEFAULT_CHARACTER_ID = "shinobi";
const CHARACTER_STORAGE_KEY = "jumpking-selected-character";

const platforms = [
  { x: TOWER_LEFT - 18, y: FLOOR_Y, width: TOWER_WIDTH + 36, height: 160, type: "floor" },
  { x: 138, y: 4520, width: 180, height: 24 },
  { x: 350, y: 4368, width: 170, height: 24 },
  { x: 612, y: 4210, width: 130, height: 24 },
  { x: 454, y: 4052, width: 140, height: 24 },
  { x: 220, y: 3896, width: 170, height: 24 },
  { x: 520, y: 3740, width: 180, height: 24 },
  { x: 348, y: 3586, width: 120, height: 24 },
  { x: 136, y: 3430, width: 160, height: 24 },
  { x: 430, y: 3274, width: 180, height: 24 },
  { x: 642, y: 3118, width: 120, height: 24 },
  { x: 510, y: 2960, width: 140, height: 24 },
  { x: 286, y: 2800, width: 190, height: 24 },
  { x: 150, y: 2640, width: 120, height: 24 },
  { x: 420, y: 2480, width: 160, height: 24 },
  { x: 628, y: 2320, width: 130, height: 24 },
  { x: 458, y: 2160, width: 140, height: 24 },
  { x: 230, y: 2000, width: 150, height: 24 },
  { x: 520, y: 1840, width: 210, height: 24 },
  { x: 360, y: 1680, width: 120, height: 24 },
  { x: 170, y: 1520, width: 130, height: 24 },
  { x: 460, y: 1360, width: 200, height: 24 },
  { x: 620, y: 1200, width: 120, height: 24 },
  { x: 330, y: 1040, width: 150, height: 24 },
  { x: 170, y: 880, width: 200, height: 24 },
  { x: 450, y: 720, width: 180, height: 24 },
  { x: 292, y: 560, width: 160, height: 24, type: "goal-rest" }
];

const goal = { x: 336, y: 446, width: 76, height: 92 };

const stars = Array.from({ length: 44 }, (_, index) => ({
  x: (index * 149) % VIEW_WIDTH,
  y: 36 + ((index * 83) % 180),
  size: 1 + (index % 3),
  alpha: 0.18 + (index % 5) * 0.06
}));

const player = {
  spawnX: 180,
  spawnY: FLOOR_Y - PLAYER_HEIGHT,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  x: 180,
  y: FLOOR_Y - PLAYER_HEIGHT,
  vx: 0,
  vy: 0,
  grounded: true,
  charge: 0,
  charging: false,
  facing: 1,
  won: false
};

const input = {
  left: false,
  right: false,
  chargeHeld: false
};

const customCharacterAsset = createOptionalAssetPaths(
  ["assets/characters/custom/player", "assets/characters/player"],
  false
);
const characters = {
  fighter: createCharacterSet("fighter", "Fighter", "assets/characters/fighter"),
  samurai: createCharacterSet("samurai", "Samurai", "assets/characters/samurai"),
  shinobi: createCharacterSet("shinobi", "Shinobi", "assets/characters/shinobi"),
  custom: {
    id: "custom",
    label: "Custom",
    states: {
      idle: customCharacterAsset,
      run: customCharacterAsset,
      jump: customCharacterAsset
    }
  }
};
const storedCharacterId = getStoredCharacterId();
let activeCharacterId = characters[storedCharacterId] ? storedCharacterId : DEFAULT_CHARACTER_ID;

const assets = {
  background: createOptionalAsset("assets/textures/background", false),
  wall: createOptionalAsset("assets/textures/wall", true),
  ledge: createOptionalAsset("assets/textures/ledge", true),
  goal: createOptionalAsset("assets/textures/goal", false)
};

let lastTime = performance.now();
let cameraY = WORLD_HEIGHT - VIEW_HEIGHT;
let animationClock = 0;

function createOptionalAsset(basePath, usePattern) {
  return createOptionalAssetPaths([basePath], usePattern);
}

function createOptionalAssetPaths(basePaths, usePattern) {
  const candidates = basePaths.flatMap((basePath) =>
    ["png", "webp", "jpg", "jpeg"].map((extension) => `${basePath}.${extension}`)
  );
  const image = new Image();
  const asset = {
    image,
    loaded: false,
    pattern: null,
    source: null
  };

  let candidateIndex = 0;

  function attemptLoad() {
    if (candidateIndex >= candidates.length) {
      return;
    }

    image.src = candidates[candidateIndex];
    candidateIndex += 1;
  }

  image.addEventListener("load", () => {
    asset.loaded = true;
    asset.source = candidates[candidateIndex - 1];

    if (usePattern) {
      asset.pattern = context.createPattern(image, "repeat");
    }
  });

  image.addEventListener("error", () => {
    if (!asset.loaded) {
      attemptLoad();
    }
  });

  attemptLoad();
  return asset;
}

function createExactAsset(source, usePattern = false) {
  const image = new Image();
  const asset = {
    image,
    loaded: false,
    pattern: null,
    source
  };

  image.addEventListener("load", () => {
    asset.loaded = true;
    if (usePattern) {
      asset.pattern = context.createPattern(image, "repeat");
    }
  });

  image.addEventListener("error", () => {});
  image.src = source;
  return asset;
}

function createCharacterSet(id, label, basePath) {
  return {
    id,
    label,
    states: {
      idle: createExactAsset(`${basePath}/Idle.png`),
      run: createExactAsset(`${basePath}/Run.png`),
      jump: createExactAsset(`${basePath}/Jump.png`)
    }
  };
}

function getStoredCharacterId() {
  try {
    return window.localStorage.getItem(CHARACTER_STORAGE_KEY);
  } catch {
    return null;
  }
}

function persistCharacterId(characterId) {
  try {
    window.localStorage.setItem(CHARACTER_STORAGE_KEY, characterId);
  } catch {}
}

function setupCharacterSelect() {
  if (!characterSelect) {
    return;
  }

  for (const character of Object.values(characters)) {
    const option = document.createElement("option");
    option.value = character.id;
    option.textContent = character.label;
    characterSelect.append(option);
  }

  characterSelect.value = activeCharacterId;
  characterSelect.addEventListener("change", () => {
    if (!characters[characterSelect.value]) {
      return;
    }

    activeCharacterId = characterSelect.value;
    persistCharacterId(activeCharacterId);
  });
}

function getActiveCharacter() {
  return characters[activeCharacterId] || characters[DEFAULT_CHARACTER_ID];
}

function getPlayerSpriteState() {
  if (!player.grounded) {
    return "jump";
  }

  if (Math.abs(player.vx) > 35 && !player.charging) {
    return "run";
  }

  return "idle";
}

function getActiveCharacterAsset(state) {
  const activeCharacter = getActiveCharacter();
  const requested = activeCharacter.states[state] || activeCharacter.states.idle;

  if (requested.loaded) {
    return requested;
  }

  if (activeCharacter.states.idle.loaded) {
    return activeCharacter.states.idle;
  }

  return requested;
}

function getFrameCount(asset) {
  if (!asset || !asset.loaded || asset.image.naturalHeight === 0) {
    return 1;
  }

  return Math.max(1, Math.round(asset.image.naturalWidth / asset.image.naturalHeight));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function blendFactor(rate, deltaTime) {
  return 1 - Math.pow(1 - rate, deltaTime * 60);
}

function resetPlayer() {
  player.x = player.spawnX;
  player.y = player.spawnY;
  player.vx = 0;
  player.vy = 0;
  player.grounded = true;
  player.charge = 0;
  player.charging = false;
  player.facing = 1;
  player.won = false;
  cameraY = clamp(FLOOR_Y - VIEW_HEIGHT, 0, WORLD_HEIGHT - VIEW_HEIGHT);
}

function currentAim() {
  if (input.left && !input.right) {
    return -1;
  }

  if (input.right && !input.left) {
    return 1;
  }

  return 0;
}

function beginCharge() {
  if (!player.grounded || player.won) {
    return;
  }

  const aim = currentAim();
  if (aim !== 0) {
    player.facing = aim;
  }

  player.charging = true;
  player.vx = 0;
}

function releaseCharge() {
  if (!player.charging || !player.grounded || player.won) {
    player.charging = false;
    player.charge = 0;
    return;
  }

  const direction = currentAim();
  if (direction !== 0) {
    player.facing = direction;
  }

  const chargeRatio = clamp(player.charge / MAX_CHARGE, 0, 1);
  const power = MIN_JUMP + (MAX_JUMP - MIN_JUMP) * Math.pow(chargeRatio, CHARGE_CURVE);
  player.vy = -power;
  player.vx = direction * SIDE_BOOST;
  player.grounded = false;
  player.charging = false;
  player.charge = 0;
}

function clearInputState() {
  input.left = false;
  input.right = false;
  input.chargeHeld = false;
  player.charging = false;
  player.charge = 0;
}

function handleKeyChange(event, pressed) {
  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    input.left = pressed;
  }

  if (event.code === "ArrowRight" || event.code === "KeyD") {
    input.right = pressed;
  }

  if (event.code === "Space") {
    event.preventDefault();
    input.chargeHeld = pressed;

    if (pressed) {
      beginCharge();
    } else {
      releaseCharge();
    }
  }

  if (pressed && event.code === "KeyR") {
    resetPlayer();
  }
}

window.addEventListener("keydown", (event) => handleKeyChange(event, true));
window.addEventListener("keyup", (event) => handleKeyChange(event, false));
window.addEventListener("blur", clearInputState);

canvas.addEventListener("mousedown", () => {
  input.chargeHeld = true;
  beginCharge();
});

window.addEventListener("mouseup", () => {
  if (input.chargeHeld) {
    input.chargeHeld = false;
    releaseCharge();
  }
});

function resolvePlatforms(previousBottom) {
  player.grounded = false;

  const feetLeft = player.x + 5;
  const feetRight = player.x + player.width - 5;

  for (const platform of platforms) {
    const withinX = feetRight > platform.x && feetLeft < platform.x + platform.width;
    const crossedTop = previousBottom <= platform.y + 8 && player.y + player.height >= platform.y;

    if (withinX && crossedTop && player.vy >= 0) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.grounded = true;
      return platform;
    }
  }

  if (player.y + player.height >= WORLD_HEIGHT) {
    player.y = FLOOR_Y - player.height;
    player.vy = 0;
    player.grounded = true;
  }

  return null;
}

function update(deltaTime) {
  animationClock += deltaTime;

  if (!player.won) {
    const previousBottom = player.y + player.height;

    if (player.charging && player.grounded) {
      player.charge = clamp(player.charge + deltaTime, 0, MAX_CHARGE);
      const aim = currentAim();
      if (aim !== 0) {
        player.facing = aim;
      }
    } else if (!input.chargeHeld) {
      player.charge = 0;
    }

    if (player.grounded) {
      if (player.charging) {
        player.vx = 0;
      } else {
        const aim = currentAim();
        player.vx = aim * MOVE_SPEED;
        if (aim !== 0) {
          player.facing = aim;
        }
      }
    }

    player.vy += GRAVITY * deltaTime;
    player.x += player.vx * deltaTime;
    player.y += player.vy * deltaTime;

    if (!player.grounded) {
      player.vx *= Math.pow(AIR_DRAG, deltaTime * 60);
    }

    player.x = clamp(player.x, TOWER_LEFT + 8, TOWER_RIGHT - player.width - 8);

    resolvePlatforms(previousBottom);

    const goalOverlap =
      player.x + player.width > goal.x &&
      player.x < goal.x + goal.width &&
      player.y + player.height > goal.y &&
      player.y < goal.y + goal.height;

    if (goalOverlap) {
      player.won = true;
      player.grounded = true;
      player.vx = 0;
      player.vy = 0;
      player.charging = false;
      player.charge = 0;
    }
  }

  const targetCamera = clamp(player.y - VIEW_HEIGHT * 0.56, 0, WORLD_HEIGHT - VIEW_HEIGHT);
  cameraY += (targetCamera - cameraY) * blendFactor(CAMERA_LERP, deltaTime);
}

function fillPattern(asset, x, y, width, height, fallback, alpha = 1) {
  if (asset.pattern) {
    context.save();
    context.globalAlpha = alpha;
    context.fillStyle = asset.pattern;
    context.fillRect(x, y, width, height);
    context.restore();
    return;
  }

  context.fillStyle = fallback;
  context.fillRect(x, y, width, height);
}

function drawSky() {
  const sky = context.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  sky.addColorStop(0, "#07111d");
  sky.addColorStop(0.42, "#1a2438");
  sky.addColorStop(0.78, "#241727");
  sky.addColorStop(1, "#12090c");
  context.fillStyle = sky;
  context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  if (assets.background.loaded) {
    context.save();
    context.globalAlpha = 0.14;
    context.drawImage(assets.background.image, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    context.restore();
  }

  const moonY = 92 - cameraY * 0.045;
  context.fillStyle = "rgba(244, 218, 162, 0.78)";
  context.beginPath();
  context.arc(760, moonY, 38, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "rgba(255, 255, 255, 0.18)";
  for (const star of stars) {
    context.globalAlpha = star.alpha;
    context.fillRect(star.x, star.y, star.size, star.size);
  }
  context.globalAlpha = 1;

  drawRidge(
    VIEW_HEIGHT - 80 - cameraY * 0.03,
    "#161c29",
    [0, 24, 120, 6, 240, 58, 400, 18, 620, 76, 760, 24, VIEW_WIDTH, 72]
  );
  drawRidge(
    VIEW_HEIGHT - 30 - cameraY * 0.055,
    "#0e131c",
    [0, 78, 90, 44, 220, 92, 360, 36, 560, 96, 720, 48, VIEW_WIDTH, 84]
  );
}

function drawRidge(baseY, color, points) {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, VIEW_HEIGHT);

  for (let i = 0; i < points.length; i += 2) {
    context.lineTo(points[i], baseY - points[i + 1]);
  }

  context.lineTo(VIEW_WIDTH, VIEW_HEIGHT);
  context.closePath();
  context.fill();
}

function drawTower() {
  const visibleStart = Math.floor(cameraY / 40) * 40 - 80;
  const visibleEnd = cameraY + VIEW_HEIGHT + 80;

  context.save();
  context.translate(0, -cameraY);

  context.fillStyle = "#08090e";
  context.fillRect(0, visibleStart, TOWER_LEFT, visibleEnd - visibleStart);
  context.fillRect(TOWER_RIGHT, visibleStart, WORLD_WIDTH - TOWER_RIGHT, visibleEnd - visibleStart);

  context.fillStyle = "#241c25";
  context.fillRect(TOWER_LEFT, visibleStart, TOWER_WIDTH, visibleEnd - visibleStart);
  fillPattern(assets.wall, TOWER_LEFT, visibleStart, TOWER_WIDTH, visibleEnd - visibleStart, "#312730", 0.18);

  context.fillStyle = "rgba(255, 240, 208, 0.05)";
  context.fillRect(TOWER_LEFT + 8, visibleStart, 3, visibleEnd - visibleStart);
  context.fillRect(TOWER_RIGHT - 11, visibleStart, 3, visibleEnd - visibleStart);

  for (let y = visibleStart; y < visibleEnd; y += 40) {
    const rowOffset = Math.floor(y / 40) % 2 === 0 ? 18 : 42;
    context.fillStyle = "rgba(255, 238, 204, 0.07)";
    context.fillRect(TOWER_LEFT + 14, y, TOWER_WIDTH - 28, 2);
    context.fillStyle = "rgba(0, 0, 0, 0.25)";
    context.fillRect(TOWER_LEFT + 14, y + 18, TOWER_WIDTH - 28, 2);

    for (let x = TOWER_LEFT + rowOffset; x < TOWER_RIGHT - 12; x += 56) {
      context.fillStyle = "rgba(255, 240, 210, 0.04)";
      context.fillRect(x, y, 2, 18);
    }
  }

  for (let windowY = 420; windowY < WORLD_HEIGHT - 240; windowY += 320) {
    if (windowY < visibleStart - 70 || windowY > visibleEnd + 70) {
      continue;
    }

    const leftSide = Math.floor(windowY / 320) % 2 === 0;
    const windowX = leftSide ? TOWER_LEFT + 72 : TOWER_RIGHT - 112;
    drawWindow(windowX, windowY);
  }

  drawBanner(TOWER_LEFT + 24, 1260, "#7f2320");
  drawBanner(TOWER_RIGHT - 60, 2220, "#77531c");
  drawBanner(TOWER_LEFT + 28, 3180, "#5c1f48");

  context.restore();
}

function drawWindow(x, y) {
  context.fillStyle = "#100f15";
  context.fillRect(x, y, 34, 52);
  context.beginPath();
  context.arc(x + 17, y, 17, Math.PI, 0);
  context.fill();
  context.fillStyle = "rgba(242, 184, 92, 0.16)";
  context.fillRect(x + 8, y + 10, 18, 26);
}

function drawBanner(x, y, color) {
  if (y < cameraY - 120 || y > cameraY + VIEW_HEIGHT + 160) {
    return;
  }

  context.fillStyle = "#7b5e36";
  context.fillRect(x + 8, y - 22, 4, 24);
  context.fillStyle = color;
  context.fillRect(x, y, 20, 54);
}

function drawPlatforms() {
  context.save();
  context.translate(0, -cameraY);

  for (const platform of platforms) {
    if (platform.y > cameraY + VIEW_HEIGHT + 60 || platform.y + platform.height < cameraY - 60) {
      continue;
    }

    if (platform.type === "floor") {
      context.fillStyle = "#3a281e";
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      fillPattern(assets.wall, platform.x, platform.y, platform.width, platform.height, "#49372a", 0.24);
      context.fillStyle = "rgba(255, 235, 204, 0.08)";
      context.fillRect(platform.x, platform.y, platform.width, 6);
      continue;
    }

    const isGoalRest = platform.type === "goal-rest";
    context.fillStyle = isGoalRest ? "#70562e" : "#6b4d38";
    context.fillRect(platform.x, platform.y, platform.width, platform.height);
    fillPattern(assets.ledge, platform.x, platform.y, platform.width, platform.height, "#84624b", 0.22);

    context.fillStyle = isGoalRest ? "#cda75a" : "#b68861";
    context.fillRect(platform.x, platform.y, platform.width, 6);
    context.fillStyle = "rgba(0, 0, 0, 0.2)";
    context.fillRect(platform.x, platform.y + platform.height - 5, platform.width, 5);

    for (let supportX = platform.x + 18; supportX < platform.x + platform.width - 16; supportX += 48) {
      context.fillStyle = "rgba(42, 26, 18, 0.45)";
      context.beginPath();
      context.moveTo(supportX, platform.y + platform.height);
      context.lineTo(supportX + 10, platform.y + platform.height);
      context.lineTo(supportX + 4, platform.y + platform.height + 14);
      context.closePath();
      context.fill();
    }
  }

  context.restore();
}

function drawGoal() {
  context.save();
  context.translate(0, -cameraY);

  if (assets.goal.loaded) {
    context.drawImage(assets.goal.image, goal.x, goal.y, goal.width, goal.height);
  } else {
    context.fillStyle = "#c49a38";
    context.beginPath();
    context.moveTo(goal.x + 16, goal.y + 20);
    context.lineTo(goal.x + goal.width - 16, goal.y + 20);
    context.lineTo(goal.x + goal.width - 8, goal.y + 58);
    context.lineTo(goal.x + 8, goal.y + 58);
    context.closePath();
    context.fill();

    context.fillStyle = "#e2bf68";
    context.fillRect(goal.x + 12, goal.y + 10, goal.width - 24, 12);
    context.fillStyle = "#7c4e12";
    context.fillRect(goal.x + goal.width / 2 - 5, goal.y + 36, 10, 16);
  }

  context.fillStyle = "rgba(255, 216, 116, 0.3)";
  context.fillRect(goal.x - 6, goal.y + goal.height - 2, goal.width + 12, 4);
  context.restore();
}

function drawPlayer() {
  const drawX = Math.round(player.x);
  const drawY = Math.round(player.y - cameraY);
  const crouchOffset = player.charging && player.grounded ? 5 : 0;
  const direction = currentAim() || player.facing;
  const spriteState = getPlayerSpriteState();
  const activeSprite = getActiveCharacterAsset(spriteState);

  if (player.charging) {
    const glowRadius = 14 + (player.charge / MAX_CHARGE) * 18;
    context.fillStyle = "rgba(233, 169, 70, 0.18)";
    context.beginPath();
    context.arc(drawX + player.width / 2, drawY + player.height / 2, glowRadius, 0, Math.PI * 2);
    context.fill();
  }

  context.save();
  context.translate(drawX + player.width / 2, drawY);
  context.scale(direction < 0 ? -1 : 1, 1);

  if (activeSprite && activeSprite.loaded) {
    drawPlayerSprite(activeSprite, spriteState);
  } else {
    context.fillStyle = "#2a1610";
    context.fillRect(-10, 34 + crouchOffset, 7, 11);
    context.fillRect(4, 34 + crouchOffset, 7, 11);

    context.fillStyle = "#8e3327";
    context.fillRect(-12, 14 + crouchOffset, 24, 24);
    context.fillStyle = "#a9472f";
    context.fillRect(-10, 16 + crouchOffset, 20, 20);

    context.fillStyle = "#f0d0ac";
    context.fillRect(-8, 6 + crouchOffset, 16, 13);
    context.fillStyle = "#5e1b15";
    context.fillRect(-11, 0 + crouchOffset, 22, 15);
    context.fillRect(-13, 11 + crouchOffset, 5, 12);

    context.fillStyle = "#221a1a";
    context.fillRect(2, 10 + crouchOffset, 3, 3);
  }

  context.restore();

  drawAimArrow(direction, drawX, drawY);
}

function drawPlayerSprite(asset, spriteState) {
  const frameCount = getFrameCount(asset);
  const frameWidth = asset.image.naturalWidth / frameCount;
  let frameIndex = 0;

  if (spriteState === "jump" && frameCount > 1) {
    const fallRatio = clamp((player.vy + 320) / 1100, 0, 1);
    frameIndex = Math.round(fallRatio * (frameCount - 1));
  } else if (spriteState === "run" && frameCount > 1) {
    frameIndex = Math.floor(animationClock * 12) % frameCount;
  } else if (spriteState === "idle" && frameCount > 1) {
    frameIndex = Math.floor(animationClock * 4) % frameCount;
  }

  context.drawImage(
    asset.image,
    frameIndex * frameWidth,
    0,
    frameWidth,
    asset.image.naturalHeight,
    -CHARACTER_DRAW_WIDTH / 2,
    -42,
    CHARACTER_DRAW_WIDTH,
    CHARACTER_DRAW_HEIGHT
  );
}

function drawAimArrow(direction, drawX, drawY) {
  const arrowDirection = direction || player.facing;
  const centerX = drawX + player.width / 2;
  const arrowY = drawY - 16;

  context.strokeStyle = "rgba(224, 171, 79, 0.95)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(centerX, arrowY);
  context.lineTo(centerX + arrowDirection * 24, arrowY);
  context.stroke();

  if (arrowDirection !== 0) {
    context.fillStyle = "rgba(224, 171, 79, 0.95)";
    context.beginPath();
    context.moveTo(centerX + arrowDirection * 24, arrowY);
    context.lineTo(centerX + arrowDirection * 15, arrowY - 6);
    context.lineTo(centerX + arrowDirection * 15, arrowY + 6);
    context.closePath();
    context.fill();
  }
}

function drawChargeBar() {
  const frameX = VIEW_WIDTH / 2 - 145;
  const frameY = VIEW_HEIGHT - 36;
  const barWidth = 290;
  const barHeight = 14;

  context.fillStyle = "rgba(14, 11, 12, 0.75)";
  context.fillRect(frameX - 12, frameY - 10, barWidth + 24, barHeight + 20);
  context.strokeStyle = "rgba(243, 213, 165, 0.2)";
  context.strokeRect(frameX - 12, frameY - 10, barWidth + 24, barHeight + 20);

  context.fillStyle = "rgba(255, 243, 220, 0.11)";
  context.fillRect(frameX, frameY, barWidth, barHeight);

  const ratio = clamp(player.charge / MAX_CHARGE, 0, 1);
  const fillWidth = barWidth * ratio;
  const fill = context.createLinearGradient(frameX, frameY, frameX + barWidth, frameY);
  fill.addColorStop(0, "#df8e3c");
  fill.addColorStop(0.55, "#efbc57");
  fill.addColorStop(1, "#f9df86");
  context.fillStyle = fill;
  context.fillRect(frameX, frameY, fillWidth, barHeight);

  context.strokeStyle = "rgba(255, 241, 211, 0.22)";
  context.strokeRect(frameX, frameY, barWidth, barHeight);

  context.fillStyle = "rgba(243, 231, 207, 0.72)";
  context.font = "16px Georgia";
  context.fillText("charge", frameX, frameY - 8);
}

function drawVignette() {
  const vignette = context.createRadialGradient(
    VIEW_WIDTH / 2,
    VIEW_HEIGHT / 2,
    120,
    VIEW_WIDTH / 2,
    VIEW_HEIGHT / 2,
    560
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.38)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
}

function drawOverlayText() {
  context.fillStyle = "rgba(243, 231, 207, 0.92)";
  context.font = "20px Georgia";
  context.fillText("Bell Tower", 24, 34);

  context.fillStyle = "rgba(211, 192, 158, 0.84)";
  context.font = "14px Georgia";
  context.fillText("Reach the chamber at the top", 24, 56);

  if (!player.won) {
    return;
  }

  context.fillStyle = "rgba(12, 8, 8, 0.74)";
  context.fillRect(VIEW_WIDTH / 2 - 170, 96, 340, 84);
  context.strokeStyle = "rgba(243, 213, 165, 0.24)";
  context.strokeRect(VIEW_WIDTH / 2 - 170, 96, 340, 84);
  context.fillStyle = "#f3e7cf";
  context.font = "28px Georgia";
  context.fillText("You reached the bell", VIEW_WIDTH / 2 - 114, 130);
  context.font = "16px Georgia";
  context.fillText("Press R to run it again", VIEW_WIDTH / 2 - 82, 156);
}

function render() {
  drawSky();
  drawTower();
  drawPlatforms();
  drawGoal();
  drawPlayer();
  drawChargeBar();
  drawOverlayText();
  drawVignette();
}

function updateHud() {
  const heightPercent = 1 - clamp((player.y + player.height - goal.y) / (FLOOR_Y - goal.y), 0, 1);
  const meters = Math.round(heightPercent * 100);
  heightLabel.textContent = `Height ${meters} m`;

  if (player.won) {
    statusLabel.textContent = "Victory";
    statusLabel.style.color = "#f3d383";
    return;
  }

  if (player.charging) {
    statusLabel.textContent = player.charge >= MAX_CHARGE ? "Full charge" : "Charging";
    statusLabel.style.color = "#e0ab4f";
    return;
  }

  if (player.grounded) {
    statusLabel.textContent = "Ready";
    statusLabel.style.color = "#f3e7cf";
    return;
  }

  statusLabel.textContent = "Airborne";
  statusLabel.style.color = "#d97373";
}

function tick(now) {
  const deltaTime = clamp((now - lastTime) / 1000, 0, 0.033);
  lastTime = now;

  update(deltaTime);
  render();
  updateHud();

  requestAnimationFrame(tick);
}

setupCharacterSelect();
resetPlayer();
requestAnimationFrame((now) => {
  lastTime = now;
  tick(now);
});
