const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const statusLabel = document.getElementById("status-label");
const heightLabel = document.getElementById("height-label");
const characterSelect = document.getElementById("character-select");
const stageFrame = document.querySelector(".stage-frame");

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
const BOSS_APPROACH_TRIGGER_Y = 1540;
const BOSS_TELEPORTER_PLATFORM_Y = 1320;
const TOWER_RETURN_PLATFORM_Y = 1120;
const TOWER_ENTRY_TELEPORTER_X = 480;
const TOWER_BASE_TELEPORTER_X = 250;
const TOWER_RETURN_X = 654;
const ARENA_LEFT = 72;
const ARENA_RIGHT = 888;
const ARENA_FLOOR_Y = 468;
const ARENA_PLAYER_SPAWN_X = 152;
const ARENA_EXIT_TELEPORTER_X = 792;
const FOREST_LEFT = 48;
const FOREST_RIGHT = 912;
const FOREST_FLOOR_Y = 472;
const FOREST_ENTRY_X = 132;
const FOREST_BONFIRE_X = 246;
const FOREST_BONFIRE_DRAW_WIDTH = 92;
const FOREST_BONFIRE_DRAW_HEIGHT = 92;
const FOREST_BONFIRE_HITBOX_WIDTH = 42;
const FOREST_BONFIRE_HITBOX_HEIGHT = 58;
const TOWER_FOREST_EXIT_ZONE = {
  x: TOWER_RIGHT - 40,
  y: 480,
  width: 36,
  height: 120
};
const BOSS_MIN_X = ARENA_LEFT + 48;
const BOSS_MAX_X = ARENA_RIGHT - 48;
const BOSS_SPAWN_X = 710;
const TELEPORTER_FRAME_WIDTH = 512;
const TELEPORTER_FRAME_HEIGHT = 512;
const TELEPORTER_FRAME_COLUMNS = 3;
const TELEPORTER_FRAME_ROWS = 2;
const TELEPORTER_FRAME_COUNT = TELEPORTER_FRAME_COLUMNS * TELEPORTER_FRAME_ROWS;
const TELEPORTER_DRAW_WIDTH = 140;
const TELEPORTER_DRAW_HEIGHT = 140;
const TELEPORTER_HITBOX_WIDTH = 44;
const TELEPORTER_HITBOX_HEIGHT = 84;
const PLAYER_MAX_HEALTH = 100;
const BOSS_MAX_HEALTH = 150;
const PLAYER_ATTACK_DAMAGE = 22;
const BOSS_ATTACK_DAMAGE = 18;
const PLAYER_ATTACK_RANGE = 108;
const BOSS_ATTACK_RANGE = 112;
const PLAYER_ATTACK_DURATION = 0.32;
const PLAYER_ATTACK_COOLDOWN = 0.4;
const PLAYER_DASH_SPEED = 410;
const PLAYER_DASH_DURATION = 0.2;
const PLAYER_DASH_COOLDOWN = 0.55;
const PLAYER_DASH_DAMAGE = 12;
const BOSS_ATTACK_DURATION = 0.72;
const BOSS_ATTACK_COOLDOWN = 1.2;
const HURT_DURATION = 0.28;
const PLAYER_IFRAME_DURATION = 0.55;
const BOSS_IFRAME_DURATION = 0.3;

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
  { x: 184, y: BOSS_TELEPORTER_PLATFORM_Y, width: 592, height: 32, type: "teleporter-floor" },
  { x: 610, y: TOWER_RETURN_PLATFORM_Y, width: 156, height: 24, type: "return-landing" },
  { x: 330, y: 1040, width: 150, height: 24 },
  { x: 170, y: 880, width: 200, height: 24 },
  { x: 450, y: 720, width: 180, height: 24 },
  { x: 292, y: 560, width: 160, height: 24, type: "goal-rest" },
  { x: 452, y: 548, width: 352, height: 18, type: "forest-path" }
];

const arenaPlatforms = [
  { x: ARENA_LEFT - 24, y: ARENA_FLOOR_Y, width: ARENA_RIGHT - ARENA_LEFT + 48, height: 96, type: "arena-floor" }
];

const forestPlatforms = [
  { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
  { x: 166, y: FOREST_FLOOR_Y - 86, width: 136, height: 18, type: "forest-step" },
  { x: 372, y: FOREST_FLOOR_Y - 138, width: 146, height: 18, type: "forest-step" },
  { x: 610, y: FOREST_FLOOR_Y - 92, width: 124, height: 18, type: "forest-step" }
];

const goal = { x: 336, y: 446, width: 76, height: 92 };
const forestBonfire = {
  x: FOREST_BONFIRE_X,
  floorY: FOREST_FLOOR_Y,
  active: false,
  playerNearby: false,
  healFlashTime: 0
};
const checkpoint = {
  active: false,
  scene: "tower",
  x: 180,
  y: FLOOR_Y - PLAYER_HEIGHT
};
const boss = {
  x: BOSS_SPAWN_X,
  minX: BOSS_MIN_X,
  maxX: BOSS_MAX_X,
  speed: 72,
  direction: -1,
  state: "idle",
  stateTime: 0,
  drawWidth: 146,
  drawHeight: 146,
  maxHealth: BOSS_MAX_HEALTH,
  health: BOSS_MAX_HEALTH,
  attackCooldown: 0,
  attackHitDone: false,
  attackCycleIndex: 0,
  currentAttackIndex: 0,
  hurtTime: 0,
  invulnerableTime: 0,
  dead: false
};

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
  won: false,
  maxHealth: PLAYER_MAX_HEALTH,
  health: PLAYER_MAX_HEALTH,
  attackTime: 0,
  attackCooldown: 0,
  attackHitDone: false,
  attackCycleIndex: 0,
  currentAttackIndex: 0,
  dashTime: 0,
  dashCooldown: 0,
  dashHitDone: false,
  blocking: false,
  hurtTime: 0,
  invulnerableTime: 0,
  dead: false,
  deathTimer: 0
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
      jump: customCharacterAsset,
      attack: [customCharacterAsset],
      dash: customCharacterAsset,
      block: customCharacterAsset,
      hurt: customCharacterAsset,
      dead: customCharacterAsset
    }
  }
};
const storedCharacterId = getStoredCharacterId();
let activeCharacterId = characters[storedCharacterId] ? storedCharacterId : DEFAULT_CHARACTER_ID;

const assets = {
  background: createOptionalAsset("assets/textures/background", false),
  wall: createOptionalAsset("assets/textures/wall", true),
  ledge: createOptionalAsset("assets/textures/ledge", true),
  goal: createOptionalAsset("assets/textures/goal", false),
  arenaBackground: createExactAsset("assets/textures/backgrounds-pixel-art/m8/2.png"),
  bonfire: [
    createExactAsset("assets/textures/Bonfire/Bonfire_1.png"),
    createExactAsset("assets/textures/Bonfire/Bonfire_2.png"),
    createExactAsset("assets/textures/Bonfire/Bonfire_3.png"),
    createExactAsset("assets/textures/Bonfire/Bonfire_4.png")
  ],
  teleporterDoor: createOptionalAssetPaths(["assets/textures/TP/door"], false),
  boss: {
    idle: createExactAsset("assets/characters/Enemis/enemy sprites/Gotoku/Idle.png"),
    run: createExactAsset("assets/characters/Enemis/enemy sprites/Gotoku/Run.png"),
    attack: [
      createExactAsset("assets/characters/Enemis/enemy sprites/Gotoku/Attack_1.png"),
      createExactAsset("assets/characters/Enemis/enemy sprites/Gotoku/Attack_2.png"),
      createExactAsset("assets/characters/Enemis/enemy sprites/Gotoku/Attack_3.png")
    ],
    hurt: createExactAsset("assets/characters/Enemis/enemy sprites/Gotoku/Hurt.png"),
    dead: createExactAsset("assets/characters/Enemis/enemy sprites/Gotoku/Dead.png")
  }
};

let lastTime = performance.now();
let cameraY = WORLD_HEIGHT - VIEW_HEIGHT;
let animationClock = 0;
let gameInputActive = false;
let currentScene = "tower";
let towerProgressY = player.spawnY;
const GAME_CONTROL_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "KeyA",
  "KeyD",
  "Space",
  "ShiftLeft",
  "ShiftRight",
  "KeyR"
]);
const PAGE_NAV_KEYS = new Set(["ArrowUp", "ArrowDown"]);
const TELEPORTER_ANIMATIONS = {
  idle: { fps: 4, loop: true },
  activating: { fps: 10, loop: false, next: "active" },
  active: { fps: 7, loop: true },
  using: { fps: 10, loop: false }
};
const encounter = {
  bossStarted: false,
  bossDefeated: false,
  forestUnlocked: false
};
const teleportTransition = {
  active: false,
  teleporterId: null
};
const teleporters = {
  entry: createTeleporter("entry", "tower", TOWER_ENTRY_TELEPORTER_X, BOSS_TELEPORTER_PLATFORM_Y),
  base: createTeleporter("base", "tower", TOWER_BASE_TELEPORTER_X, FLOOR_Y),
  exit: createTeleporter("exit", "arena", ARENA_EXIT_TELEPORTER_X, ARENA_FLOOR_Y, true)
};

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
      jump: createExactAsset(`${basePath}/Jump.png`),
      attack: [
        createExactAsset(`${basePath}/Attack_1.png`),
        createExactAsset(`${basePath}/Attack_2.png`),
        createExactAsset(`${basePath}/Attack_3.png`)
      ],
      dash: createOptionalAssetPaths([`${basePath}/dash`, `${basePath}/Dash`, `${basePath}/Run`], false),
      block: createExactAsset(`${basePath}/Shield.png`),
      hurt: createExactAsset(`${basePath}/Hurt.png`),
      dead: createExactAsset(`${basePath}/Dead.png`)
    }
  };
}

function createTeleporter(id, scene, x, floorY, hidden = false) {
  return {
    id,
    scene,
    x,
    floorY,
    width: TELEPORTER_HITBOX_WIDTH,
    height: TELEPORTER_HITBOX_HEIGHT,
    drawWidth: TELEPORTER_DRAW_WIDTH,
    drawHeight: TELEPORTER_DRAW_HEIGHT,
    state: hidden ? "hidden" : "idle",
    stateTime: 0
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
    player.dashTime = 0;
    player.dashCooldown = 0;
    persistCharacterId(activeCharacterId);
  });
}

function getActiveCharacter() {
  return characters[activeCharacterId] || characters[DEFAULT_CHARACTER_ID];
}

function resolveAssetVariant(assetOrVariants, variantIndex = 0) {
  if (!Array.isArray(assetOrVariants)) {
    return assetOrVariants;
  }

  if (assetOrVariants.length === 0) {
    return null;
  }

  return assetOrVariants[variantIndex % assetOrVariants.length];
}

function getVariantCount(assetOrVariants) {
  return Array.isArray(assetOrVariants) ? assetOrVariants.length : 1;
}

function getPlayerSpriteState() {
  if (player.dead) {
    return "dead";
  }

  if (player.hurtTime > 0) {
    return "hurt";
  }

  if (isPlayerAttacking()) {
    return "attack";
  }

  if (isPlayerBlocking()) {
    return "block";
  }

  if (isPlayerDashing()) {
    return "dash";
  }

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
  const requested =
    state === "attack"
      ? resolveAssetVariant(activeCharacter.states.attack, player.currentAttackIndex)
      : activeCharacter.states[state] || activeCharacter.states.idle;

  if (requested && requested.loaded) {
    return requested;
  }

  if (state === "attack") {
    const firstAttackAsset = resolveAssetVariant(activeCharacter.states.attack, 0);
    if (firstAttackAsset && firstAttackAsset.loaded) {
      return firstAttackAsset;
    }
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

function isPlayerBlocking() {
  return player.blocking && !player.dead && player.hurtTime <= 0;
}

function canUseDash() {
  return getActiveCharacter().id === "samurai";
}

function isPlayerDashing() {
  return canUseDash() && player.dashTime > 0 && !player.dead && player.hurtTime <= 0;
}

function isPlayerAttacking() {
  return player.attackTime > 0 && !player.dead;
}

function getPlayerCenterX() {
  return player.x + player.width / 2;
}

function getBossCenterX() {
  return boss.x;
}

function canPlayerFight() {
  return !player.dead && !player.won && !isTeleporting();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function blendFactor(rate, deltaTime) {
  return 1 - Math.pow(1 - rate, deltaTime * 60);
}

function isTowerScene() {
  return currentScene === "tower";
}

function isArenaScene() {
  return currentScene === "arena";
}

function isForestScene() {
  return currentScene === "forest";
}

function isBossApproachVisible() {
  return (
    isTowerScene() &&
    !encounter.bossStarted &&
    cameraY < BOSS_TELEPORTER_PLATFORM_Y + 320 &&
    cameraY + VIEW_HEIGHT > BOSS_TELEPORTER_PLATFORM_Y - 180
  );
}

function isBossEncounterActive() {
  return isArenaScene() && !boss.dead;
}

function isTeleporting() {
  return teleportTransition.active;
}

function isPlatformActive(platform) {
  if (platform.type === "forest-path") {
    return encounter.forestUnlocked;
  }

  return true;
}

function getScenePlatforms() {
  if (isArenaScene()) {
    return arenaPlatforms;
  }

  if (isForestScene()) {
    return forestPlatforms;
  }

  return platforms.filter((platform) => isPlatformActive(platform));
}

function getTowerHeightReferenceY() {
  return isTowerScene() ? player.y : towerProgressY;
}

function resetBoss() {
  boss.x = BOSS_SPAWN_X;
  boss.minX = BOSS_MIN_X;
  boss.maxX = BOSS_MAX_X;
  boss.direction = -1;
  boss.state = "idle";
  boss.stateTime = 0;
  boss.health = boss.maxHealth;
  boss.attackCooldown = 0;
  boss.attackHitDone = false;
  boss.attackCycleIndex = 0;
  boss.currentAttackIndex = 0;
  boss.hurtTime = 0;
  boss.invulnerableTime = 0;
  boss.dead = false;
}

function getTeleporterAnimation(state) {
  return TELEPORTER_ANIMATIONS[state] || TELEPORTER_ANIMATIONS.idle;
}

function setTeleporterState(teleporter, state) {
  teleporter.state = state;
  teleporter.stateTime = 0;
}

function resetTeleporters() {
  setTeleporterState(teleporters.entry, "idle");
  setTeleporterState(teleporters.base, "active");
  setTeleporterState(teleporters.exit, "hidden");
}

function getTeleporterStateDuration(state) {
  const animation = getTeleporterAnimation(state);
  return TELEPORTER_FRAME_COUNT / animation.fps;
}

function getTeleporterHitbox(teleporter) {
  return {
    x: teleporter.x - teleporter.width / 2,
    y: teleporter.floorY - teleporter.height,
    width: teleporter.width,
    height: teleporter.height
  };
}

function playerTouchesTeleporter(teleporter) {
  const hitbox = getTeleporterHitbox(teleporter);
  return (
    player.x + player.width > hitbox.x &&
    player.x < hitbox.x + hitbox.width &&
    player.y + player.height > hitbox.y &&
    player.y < hitbox.y + hitbox.height
  );
}

function getForestBonfireHitbox() {
  return {
    x: forestBonfire.x - FOREST_BONFIRE_HITBOX_WIDTH / 2,
    y: forestBonfire.floorY - FOREST_BONFIRE_HITBOX_HEIGHT,
    width: FOREST_BONFIRE_HITBOX_WIDTH,
    height: FOREST_BONFIRE_HITBOX_HEIGHT
  };
}

function playerTouchesForestBonfire() {
  const hitbox = getForestBonfireHitbox();
  return (
    player.x + player.width > hitbox.x &&
    player.x < hitbox.x + hitbox.width &&
    player.y + player.height > hitbox.y &&
    player.y < hitbox.y + hitbox.height
  );
}

function activateForestCheckpointAndHeal() {
  if (!forestBonfire.active) {
    forestBonfire.active = true;
    checkpoint.active = true;
    checkpoint.scene = "forest";
    checkpoint.x = clamp(forestBonfire.x + 42 - player.width / 2, FOREST_LEFT + 8, FOREST_RIGHT - player.width - 8);
    checkpoint.y = FOREST_FLOOR_Y - player.height;
  }

  if (player.health < player.maxHealth) {
    player.health = player.maxHealth;
  }

  player.hurtTime = 0;
  player.invulnerableTime = 0;
  forestBonfire.healFlashTime = 0.45;
}

function updateForestBonfire(deltaTime) {
  forestBonfire.playerNearby = false;
  forestBonfire.healFlashTime = Math.max(0, forestBonfire.healFlashTime - deltaTime);

  if (!isForestScene() || player.dead) {
    return;
  }

  if (playerTouchesForestBonfire()) {
    forestBonfire.playerNearby = true;
    activateForestCheckpointAndHeal();
  }
}

function respawnPlayerAfterDeath() {
  if (!checkpoint.active) {
    resetPlayer();
    return;
  }

  teleportTransition.active = false;
  teleportTransition.teleporterId = null;
  movePlayerToScene(checkpoint.scene, checkpoint.x, checkpoint.y);
  player.facing = 1;
  player.won = false;
  player.health = player.maxHealth;
  player.attackTime = 0;
  player.attackCooldown = 0;
  player.attackHitDone = false;
  player.attackCycleIndex = 0;
  player.currentAttackIndex = 0;
  player.dashTime = 0;
  player.dashCooldown = 0;
  player.dashHitDone = false;
  player.blocking = false;
  player.hurtTime = 0;
  player.invulnerableTime = 0;
  player.dead = false;
  player.deathTimer = 0;
  clearInputState();

  if (checkpoint.scene === "forest") {
    encounter.bossStarted = true;
    encounter.bossDefeated = true;
    encounter.forestUnlocked = true;
    forestBonfire.active = true;
    setTeleporterState(teleporters.entry, "hidden");
    setTeleporterState(teleporters.base, "active");
    setTeleporterState(teleporters.exit, "hidden");
  }
}

function movePlayerToScene(scene, x, y) {
  currentScene = scene;
  player.x = x;
  player.y = y;
  player.vx = 0;
  player.vy = 0;
  player.grounded = true;
  player.charge = 0;
  player.charging = false;
  player.attackTime = 0;
  player.attackHitDone = false;
  player.blocking = false;

  if (isTowerScene()) {
    cameraY = clamp(player.y - VIEW_HEIGHT * 0.56, 0, WORLD_HEIGHT - VIEW_HEIGHT);
    towerProgressY = Math.min(towerProgressY, player.y);
  } else {
    cameraY = 0;
  }
}

function beginTeleport(teleporter) {
  if (teleportTransition.active || teleporter.state !== "active" || !player.grounded) {
    return;
  }

  teleportTransition.active = true;
  teleportTransition.teleporterId = teleporter.id;
  clearInputState();
  player.vx = 0;
  player.vy = 0;
  player.attackTime = 0;
  player.attackHitDone = false;
  player.blocking = false;
  setTeleporterState(teleporter, "using");
}

function completeTeleport(teleporter) {
  teleportTransition.active = false;
  teleportTransition.teleporterId = null;

  if (teleporter.id === "entry" || teleporter.id === "base") {
    encounter.bossStarted = true;
    encounter.forestUnlocked = false;
    setTeleporterState(teleporters.entry, "hidden");
    setTeleporterState(teleporters.base, "active");
    setTeleporterState(teleporters.exit, "hidden");
    towerProgressY = Math.min(towerProgressY, BOSS_TELEPORTER_PLATFORM_Y - player.height);
    resetBoss();
    movePlayerToScene("arena", ARENA_PLAYER_SPAWN_X, ARENA_FLOOR_Y - player.height);
    player.facing = 1;
    return;
  }

  encounter.bossDefeated = true;
  encounter.forestUnlocked = false;
  setTeleporterState(teleporters.base, "active");
  setTeleporterState(teleporters.exit, "hidden");
  movePlayerToScene("tower", TOWER_RETURN_X, TOWER_RETURN_PLATFORM_Y - player.height);
}

function updateSingleTeleporter(teleporter, deltaTime) {
  if (teleporter.scene !== currentScene || teleporter.state === "hidden") {
    return;
  }

  teleporter.stateTime += deltaTime;

  const animation = getTeleporterAnimation(teleporter.state);
  const duration = getTeleporterStateDuration(teleporter.state);

  if (!animation.loop && teleporter.stateTime >= duration) {
    if (teleporter.state === "using") {
      completeTeleport(teleporter);
      return;
    }

    setTeleporterState(teleporter, animation.next || "active");
  }
}

function updateTeleporters(deltaTime) {
  if (isTowerScene() && !encounter.bossStarted) {
    const nearEntryTeleporter =
      player.y <= BOSS_APPROACH_TRIGGER_Y &&
      Math.abs(getPlayerCenterX() - teleporters.entry.x) < 84 &&
      Math.abs(player.y + player.height - BOSS_TELEPORTER_PLATFORM_Y) < 84;

    if (teleporters.entry.state === "idle" && nearEntryTeleporter) {
      setTeleporterState(teleporters.entry, "activating");
    }

    if (teleporters.entry.state === "active" && !teleportTransition.active && playerTouchesTeleporter(teleporters.entry)) {
      beginTeleport(teleporters.entry);
    }
  }

  if (isTowerScene()) {
    if (teleporters.base.state === "idle") {
      setTeleporterState(teleporters.base, "active");
    }

    if (teleporters.base.state === "active" && !teleportTransition.active && playerTouchesTeleporter(teleporters.base)) {
      beginTeleport(teleporters.base);
    }
  }

  if (isArenaScene()) {
    if (boss.dead && teleporters.exit.state === "hidden") {
      setTeleporterState(teleporters.exit, "activating");
    }

    if (teleporters.exit.state === "active" && !teleportTransition.active && playerTouchesTeleporter(teleporters.exit)) {
      beginTeleport(teleporters.exit);
    }
  }

  updateSingleTeleporter(teleporters.entry, deltaTime);
  updateSingleTeleporter(teleporters.base, deltaTime);
  updateSingleTeleporter(teleporters.exit, deltaTime);
}

function getBossAsset() {
  if (boss.state === "attack") {
    return resolveAssetVariant(assets.boss.attack, boss.currentAttackIndex) || assets.boss.idle;
  }

  return assets.boss[boss.state] || assets.boss.idle;
}

function resetPlayer() {
  currentScene = "tower";
  towerProgressY = player.spawnY;
  encounter.bossStarted = false;
  encounter.bossDefeated = false;
  encounter.forestUnlocked = false;
  checkpoint.active = false;
  checkpoint.scene = "tower";
  checkpoint.x = player.spawnX;
  checkpoint.y = player.spawnY;
  forestBonfire.active = false;
  forestBonfire.playerNearby = false;
  forestBonfire.healFlashTime = 0;
  teleportTransition.active = false;
  teleportTransition.teleporterId = null;
  player.x = player.spawnX;
  player.y = player.spawnY;
  player.vx = 0;
  player.vy = 0;
  player.grounded = true;
  player.charge = 0;
  player.charging = false;
  player.facing = 1;
  player.won = false;
  player.health = player.maxHealth;
  player.attackTime = 0;
  player.attackCooldown = 0;
  player.attackHitDone = false;
  player.attackCycleIndex = 0;
  player.currentAttackIndex = 0;
  player.dashTime = 0;
  player.dashCooldown = 0;
  player.dashHitDone = false;
  player.blocking = false;
  player.hurtTime = 0;
  player.invulnerableTime = 0;
  player.dead = false;
  player.deathTimer = 0;
  cameraY = clamp(FLOOR_Y - VIEW_HEIGHT, 0, WORLD_HEIGHT - VIEW_HEIGHT);
  resetBoss();
  resetTeleporters();
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
  if (
    !player.grounded ||
    player.won ||
    player.dead ||
    isTeleporting() ||
    isPlayerAttacking() ||
    isPlayerBlocking() ||
    isPlayerDashing() ||
    player.hurtTime > 0
  ) {
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
  player.dashTime = 0;
  player.blocking = false;
}

function setPlayerBlocking(active) {
  if (!canPlayerFight()) {
    player.blocking = false;
    return;
  }

  if (active && (isPlayerAttacking() || player.charging || isPlayerDashing() || player.hurtTime > 0 || !player.grounded)) {
    return;
  }

  player.blocking = active;
}

function triggerPlayerAttack() {
  if (!canPlayerFight() || player.charging || isPlayerBlocking() || isPlayerDashing() || player.hurtTime > 0 || !player.grounded) {
    return;
  }

  if (player.attackCooldown > 0 || player.dead) {
    return;
  }

  player.attackTime = PLAYER_ATTACK_DURATION;
  player.attackCooldown = PLAYER_ATTACK_COOLDOWN;
  player.attackHitDone = false;
  player.currentAttackIndex = player.attackCycleIndex;
  player.attackCycleIndex =
    (player.attackCycleIndex + 1) % getVariantCount(getActiveCharacter().states.attack);
  player.blocking = false;
  player.vx = 0;
}

function triggerPlayerDash() {
  if (
    !canUseDash() ||
    !canPlayerFight() ||
    player.charging ||
    isPlayerAttacking() ||
    isPlayerBlocking() ||
    player.hurtTime > 0 ||
    !player.grounded
  ) {
    return;
  }

  if (player.dashCooldown > 0 || isPlayerDashing()) {
    return;
  }

  const aim = currentAim();
  if (aim !== 0) {
    player.facing = aim;
  }

  player.charging = false;
  player.charge = 0;
  player.blocking = false;
  player.dashTime = PLAYER_DASH_DURATION;
  player.dashCooldown = PLAYER_DASH_COOLDOWN;
  player.dashHitDone = false;
  player.vx = player.facing * PLAYER_DASH_SPEED;
}

function damageBoss(amount) {
  if (boss.dead || boss.invulnerableTime > 0) {
    return;
  }

  boss.health = clamp(boss.health - amount, 0, boss.maxHealth);
  boss.invulnerableTime = BOSS_IFRAME_DURATION;
  boss.hurtTime = HURT_DURATION;
  boss.state = boss.health <= 0 ? "dead" : "hurt";
  boss.stateTime = 0;
  boss.attackHitDone = true;

  if (boss.health <= 0) {
    boss.dead = true;
    boss.attackCooldown = 0;
  }
}

function damagePlayer(amount) {
  if (player.dead || player.invulnerableTime > 0) {
    return;
  }

  const bossIsOnRight = getBossCenterX() > getPlayerCenterX();
  const playerFacingBoss =
    (bossIsOnRight && player.facing === 1) || (!bossIsOnRight && player.facing === -1);
  const blocked = isPlayerBlocking() && playerFacingBoss;
  const appliedDamage = blocked ? 0 : amount;

  if (blocked) {
    player.invulnerableTime = 0.18;
    return;
  }

  player.health = clamp(player.health - appliedDamage, 0, player.maxHealth);
  player.hurtTime = HURT_DURATION;
  player.invulnerableTime = PLAYER_IFRAME_DURATION;
  player.blocking = false;
  player.dashTime = 0;
  player.attackTime = 0;
  player.attackHitDone = true;
  player.vx = bossIsOnRight ? -130 : 130;

  if (player.health <= 0) {
    player.dead = true;
    player.deathTimer = 1.1;
    player.vx = 0;
    player.vy = 0;
    clearInputState();
  }
}

function activateGameInput() {
  gameInputActive = true;
  canvas.focus({ preventScroll: true });
}

function deactivateGameInput() {
  gameInputActive = false;
  clearInputState();
}

function gameHasFocus() {
  return gameInputActive || document.activeElement === canvas;
}

function handleKeyChange(event, pressed) {
  const isGameKey = GAME_CONTROL_KEYS.has(event.code);
  const shouldBlockPageNavigation = PAGE_NAV_KEYS.has(event.code);
  const shouldHandleGameInput = isGameKey && gameHasFocus();

  if (!shouldBlockPageNavigation && !shouldHandleGameInput) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (!shouldHandleGameInput) {
    return;
  }

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

  if (pressed && (event.code === "ShiftLeft" || event.code === "ShiftRight")) {
    triggerPlayerDash();
  }

  if (pressed && event.code === "KeyR") {
    resetPlayer();
  }
}

document.addEventListener("keydown", (event) => handleKeyChange(event, true), true);
document.addEventListener("keyup", (event) => handleKeyChange(event, false), true);
window.addEventListener("blur", clearInputState);
canvas.addEventListener("focus", () => {
  gameInputActive = true;
});
canvas.addEventListener("blur", () => {
  gameInputActive = false;
  clearInputState();
});

document.addEventListener(
  "pointerdown",
  (event) => {
    if (stageFrame && stageFrame.contains(event.target)) {
      activateGameInput();
      return;
    }

    deactivateGameInput();
  },
  true
);

canvas.addEventListener("mousedown", (event) => {
  event.preventDefault();
  activateGameInput();

  if (event.button === 0) {
    triggerPlayerAttack();
  }

  if (event.button === 2) {
    setPlayerBlocking(true);
  }
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

window.addEventListener("mouseup", (event) => {
  if (event.button === 2) {
    setPlayerBlocking(false);
  }
});

function resolvePlatforms(previousBottom) {
  player.grounded = false;

  const feetLeft = player.x + 5;
  const feetRight = player.x + player.width - 5;

  for (const platform of getScenePlatforms()) {
    const withinX = feetRight > platform.x && feetLeft < platform.x + platform.width;
    const crossedTop = previousBottom <= platform.y + 8 && player.y + player.height >= platform.y;

    if (withinX && crossedTop && player.vy >= 0) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.grounded = true;
      return platform;
    }
  }

  if (isArenaScene() && player.y + player.height >= VIEW_HEIGHT + 120) {
    player.y = ARENA_FLOOR_Y - player.height;
    player.vy = 0;
    player.grounded = true;
    return arenaPlatforms[0];
  }

  if (isForestScene() && player.y + player.height >= VIEW_HEIGHT + 120) {
    player.y = FOREST_FLOOR_Y - player.height;
    player.vy = 0;
    player.grounded = true;
    return forestPlatforms[0];
  }

  if (isTowerScene() && player.y + player.height >= WORLD_HEIGHT) {
    player.y = FLOOR_Y - player.height;
    player.vy = 0;
    player.grounded = true;
  }

  return null;
}

function updateBoss(deltaTime) {
  if (player.dead || player.won || !isArenaScene()) {
    boss.state = boss.dead ? "dead" : "idle";
    return;
  }

  if (boss.invulnerableTime > 0) {
    boss.invulnerableTime = Math.max(0, boss.invulnerableTime - deltaTime);
  }

  if (boss.hurtTime > 0) {
    boss.hurtTime = Math.max(0, boss.hurtTime - deltaTime);
  }

  if (boss.attackCooldown > 0) {
    boss.attackCooldown = Math.max(0, boss.attackCooldown - deltaTime);
  }

  if (boss.dead) {
    boss.state = "dead";
    boss.stateTime += deltaTime;
    return;
  }

  boss.stateTime += deltaTime;

  if (boss.hurtTime > 0) {
    boss.state = "hurt";
    return;
  }

  const playerCenter = getPlayerCenterX();
  const bossNearPlayer = Math.abs(playerCenter - boss.x) < BOSS_ATTACK_RANGE && player.y < ARENA_FLOOR_Y + 40;

  if (boss.state === "attack") {
    if (!boss.attackHitDone && boss.stateTime >= 0.32 && bossNearPlayer) {
      damagePlayer(BOSS_ATTACK_DAMAGE);
      boss.attackHitDone = true;
    }

    if (boss.stateTime > BOSS_ATTACK_DURATION) {
      boss.state = "run";
      boss.stateTime = 0;
    }
    return;
  }

  if (bossNearPlayer && boss.attackCooldown <= 0) {
    if (boss.state !== "attack") {
      boss.state = "attack";
      boss.stateTime = 0;
      boss.attackHitDone = false;
      boss.currentAttackIndex = boss.attackCycleIndex;
      boss.attackCycleIndex = (boss.attackCycleIndex + 1) % getVariantCount(assets.boss.attack);
      boss.attackCooldown = BOSS_ATTACK_COOLDOWN;
    }
    return;
  }

  boss.state = "run";
  boss.direction = playerCenter < boss.x ? -1 : 1;
  boss.x += boss.direction * boss.speed * deltaTime;

  if (boss.x <= boss.minX) {
    boss.x = boss.minX;
    boss.direction = 1;
  } else if (boss.x >= boss.maxX) {
    boss.x = boss.maxX;
    boss.direction = -1;
  }
}

function update(deltaTime) {
  animationClock += deltaTime;
  updateBoss(deltaTime);
  updateTeleporters(deltaTime);

  if (player.attackCooldown > 0) {
    player.attackCooldown = Math.max(0, player.attackCooldown - deltaTime);
  }

  if (player.attackTime > 0) {
    player.attackTime = Math.max(0, player.attackTime - deltaTime);
  }

  if (player.dashTime > 0) {
    player.dashTime = Math.max(0, player.dashTime - deltaTime);
  }

  if (player.dashCooldown > 0) {
    player.dashCooldown = Math.max(0, player.dashCooldown - deltaTime);
  }

  if (player.hurtTime > 0) {
    player.hurtTime = Math.max(0, player.hurtTime - deltaTime);
  }

  if (player.invulnerableTime > 0) {
    player.invulnerableTime = Math.max(0, player.invulnerableTime - deltaTime);
  }

  if (player.dead) {
    player.deathTimer = Math.max(0, player.deathTimer - deltaTime);
    if (player.deathTimer <= 0) {
      respawnPlayerAfterDeath();
    }
    return;
  }

  if (isTeleporting()) {
    const targetCamera = isTowerScene()
      ? clamp(player.y - VIEW_HEIGHT * 0.56, 0, WORLD_HEIGHT - VIEW_HEIGHT)
      : 0;
    cameraY += (targetCamera - cameraY) * blendFactor(CAMERA_LERP, deltaTime);
    return;
  }

  if (!player.won) {
    const previousBottom = player.y + player.height;

    if (
      isPlayerDashing() &&
      !player.dashHitDone &&
      isBossEncounterActive() &&
      !boss.dead &&
      Math.abs(getBossCenterX() - getPlayerCenterX()) <= PLAYER_ATTACK_RANGE * 0.82 &&
      ((player.facing === 1 && getBossCenterX() >= getPlayerCenterX()) ||
        (player.facing === -1 && getBossCenterX() <= getPlayerCenterX())) &&
      Math.abs(player.y - (ARENA_FLOOR_Y - player.height)) < 90
    ) {
      damageBoss(PLAYER_DASH_DAMAGE);
      player.dashHitDone = true;
    }

    if (isPlayerAttacking()) {
      if (
        !player.attackHitDone &&
        isBossEncounterActive() &&
        !boss.dead &&
        player.attackTime <= PLAYER_ATTACK_DURATION - 0.1 &&
        Math.abs(getBossCenterX() - getPlayerCenterX()) <= PLAYER_ATTACK_RANGE &&
        ((player.facing === 1 && getBossCenterX() >= getPlayerCenterX()) ||
          (player.facing === -1 && getBossCenterX() <= getPlayerCenterX())) &&
        Math.abs(player.y - (ARENA_FLOOR_Y - player.height)) < 90
      ) {
        damageBoss(PLAYER_ATTACK_DAMAGE);
        player.attackHitDone = true;
      }
    }

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
      if (player.charging || isPlayerAttacking() || isPlayerBlocking() || player.hurtTime > 0) {
        player.vx = 0;
      } else if (isPlayerDashing()) {
        player.vx = player.facing * PLAYER_DASH_SPEED;
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

    const minX = isArenaScene() ? ARENA_LEFT + 8 : isForestScene() ? FOREST_LEFT + 8 : TOWER_LEFT + 8;
    const maxX = isArenaScene()
      ? ARENA_RIGHT - player.width - 8
      : isForestScene()
        ? FOREST_RIGHT - player.width - 8
        : TOWER_RIGHT - player.width - 8;
    player.x = clamp(player.x, minX, maxX);

    resolvePlatforms(previousBottom);

    if (isTowerScene()) {
      towerProgressY = Math.min(towerProgressY, player.y);
    }

    const goalOverlap =
      isTowerScene() &&
      player.x + player.width > goal.x &&
      player.x < goal.x + goal.width &&
      player.y + player.height > goal.y &&
      player.y < goal.y + goal.height;

    if (goalOverlap) {
      if (encounter.bossDefeated) {
        encounter.forestUnlocked = true;
      } else {
        player.won = true;
        player.grounded = true;
        player.vx = 0;
        player.vy = 0;
        player.charging = false;
        player.charge = 0;
        player.dashTime = 0;
      }
    }

    const forestExitOverlap =
      isTowerScene() &&
      encounter.forestUnlocked &&
      player.x + player.width > TOWER_FOREST_EXIT_ZONE.x &&
      player.x < TOWER_FOREST_EXIT_ZONE.x + TOWER_FOREST_EXIT_ZONE.width &&
      player.y + player.height > TOWER_FOREST_EXIT_ZONE.y &&
      player.y < TOWER_FOREST_EXIT_ZONE.y + TOWER_FOREST_EXIT_ZONE.height;

    if (forestExitOverlap) {
      movePlayerToScene("forest", FOREST_ENTRY_X, FOREST_FLOOR_Y - player.height);
      player.facing = 1;
    }

    updateForestBonfire(deltaTime);
  }

  const targetCamera = isTowerScene() ? clamp(player.y - VIEW_HEIGHT * 0.56, 0, WORLD_HEIGHT - VIEW_HEIGHT) : 0;
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
  if (isForestScene()) {
    const forestSky = context.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
    forestSky.addColorStop(0, "#1b2b1e");
    forestSky.addColorStop(0.5, "#2b4b31");
    forestSky.addColorStop(1, "#1a2a1d");
    context.fillStyle = forestSky;
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    context.fillStyle = "rgba(175, 224, 154, 0.1)";
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    drawRidge(VIEW_HEIGHT - 144, "#24382b", [0, 42, 120, 20, 260, 58, 430, 24, 620, 62, 760, 30, VIEW_WIDTH, 44]);
    drawRidge(VIEW_HEIGHT - 98, "#1d2f24", [0, 62, 140, 34, 280, 68, 460, 40, 680, 78, VIEW_WIDTH, 54]);
    return;
  }

  if (isArenaScene()) {
    const arenaSky = context.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
    arenaSky.addColorStop(0, "#071017");
    arenaSky.addColorStop(0.58, "#1b2735");
    arenaSky.addColorStop(1, "#14090b");
    context.fillStyle = arenaSky;
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    if (assets.arenaBackground.loaded) {
      context.drawImage(assets.arenaBackground.image, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    }

    context.fillStyle = "rgba(10, 7, 10, 0.3)";
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    drawRidge(VIEW_HEIGHT - 110, "#121720", [0, 38, 120, 76, 260, 24, 420, 92, 560, 34, 720, 84, VIEW_WIDTH, 42]);
    return;
  }

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
  if (isArenaScene() || isForestScene()) {
    return;
  }

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

  if (encounter.forestUnlocked) {
    const openingY = TOWER_FOREST_EXIT_ZONE.y - 12;
    const openingHeight = TOWER_FOREST_EXIT_ZONE.height + 26;

    context.fillStyle = "#0f1a14";
    context.fillRect(TOWER_RIGHT - 14, openingY, 24, openingHeight);
    context.fillStyle = "#386243";
    context.fillRect(TOWER_RIGHT - 10, openingY + 10, 16, openingHeight - 20);

    context.fillStyle = "#6d523b";
    context.fillRect(TOWER_RIGHT - 52, TOWER_FOREST_EXIT_ZONE.y + 98, 48, 8);
    context.fillRect(TOWER_RIGHT - 40, TOWER_FOREST_EXIT_ZONE.y + 86, 36, 6);
  }

  context.restore();
}

function drawArenaShell() {
  context.fillStyle = "rgba(8, 8, 12, 0.72)";
  context.fillRect(0, ARENA_FLOOR_Y - 36, VIEW_WIDTH, VIEW_HEIGHT - ARENA_FLOOR_Y + 36);

  context.fillStyle = "rgba(11, 9, 12, 0.74)";
  context.fillRect(0, 0, 62, VIEW_HEIGHT);
  context.fillRect(VIEW_WIDTH - 62, 0, 62, VIEW_HEIGHT);

  context.fillStyle = "rgba(255, 233, 204, 0.08)";
  context.fillRect(62, ARENA_FLOOR_Y - 36, VIEW_WIDTH - 124, 2);
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

  for (const platform of getScenePlatforms()) {
    if (platform.y > cameraY + VIEW_HEIGHT + 60 || platform.y + platform.height < cameraY - 60) {
      continue;
    }

    if (platform.type === "arena-floor") {
      context.fillStyle = "#3a281e";
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      fillPattern(assets.wall, platform.x, platform.y, platform.width, platform.height, "#49372a", 0.24);
      context.fillStyle = "#b38a61";
      context.fillRect(platform.x, platform.y, platform.width, 8);
      context.fillStyle = "rgba(0, 0, 0, 0.24)";
      context.fillRect(platform.x, platform.y + platform.height - 8, platform.width, 8);

      for (let crackX = platform.x + 40; crackX < platform.x + platform.width - 32; crackX += 92) {
        context.fillStyle = "rgba(255, 235, 208, 0.05)";
        context.fillRect(crackX, platform.y + 18, 26, 2);
        context.fillRect(crackX + 12, platform.y + 34, 2, 14);
      }
      continue;
    }

    if (platform.type === "forest-floor") {
      context.fillStyle = "#2a3c2c";
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      context.fillStyle = "#4f7a4e";
      context.fillRect(platform.x, platform.y, platform.width, 10);
      context.fillStyle = "rgba(19, 31, 18, 0.35)";
      context.fillRect(platform.x, platform.y + platform.height - 10, platform.width, 10);

      for (let tuftX = platform.x + 8; tuftX < platform.x + platform.width - 12; tuftX += 28) {
        context.fillStyle = "rgba(128, 190, 118, 0.35)";
        context.fillRect(tuftX, platform.y - 4, 8, 4);
      }
      continue;
    }

    if (platform.type === "forest-step") {
      context.fillStyle = "#40583f";
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      context.fillStyle = "#74a36d";
      context.fillRect(platform.x, platform.y, platform.width, 5);
      context.fillStyle = "rgba(18, 28, 16, 0.3)";
      context.fillRect(platform.x, platform.y + platform.height - 4, platform.width, 4);
      continue;
    }

    if (platform.type === "forest-path") {
      context.fillStyle = "#4b3a2a";
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      context.fillStyle = "#8f7554";
      context.fillRect(platform.x, platform.y, platform.width, 4);

      for (let plankX = platform.x + 12; plankX < platform.x + platform.width - 10; plankX += 36) {
        context.fillStyle = "rgba(34, 22, 15, 0.35)";
        context.fillRect(plankX, platform.y + 5, 2, platform.height - 7);
      }
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
    const isTeleporterFloor = platform.type === "teleporter-floor";
    const isReturnLanding = platform.type === "return-landing";
    context.fillStyle = isTeleporterFloor ? "#47303f" : isGoalRest ? "#70562e" : "#6b4d38";
    context.fillRect(platform.x, platform.y, platform.width, platform.height);
    fillPattern(
      assets.ledge,
      platform.x,
      platform.y,
      platform.width,
      platform.height,
      isTeleporterFloor ? "#5d4054" : "#84624b",
      0.22
    );

    context.fillStyle = isTeleporterFloor ? "#9d7eb0" : isReturnLanding ? "#d1a26f" : isGoalRest ? "#cda75a" : "#b68861";
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

function getTeleporterTransitionProgress(teleporter) {
  const animation = getTeleporterAnimation(teleporter.state);
  if (animation.loop) {
    return 1;
  }

  const duration = getTeleporterStateDuration(teleporter.state);
  if (duration <= 0) {
    return 1;
  }

  return clamp(teleporter.stateTime / duration, 0, 1);
}

function getTeleporterDoorOpenAmount(teleporter) {
  if (teleporter.state === "active" || teleporter.state === "using") {
    return 1;
  }

  if (teleporter.state === "activating") {
    return getTeleporterTransitionProgress(teleporter);
  }

  return 0;
}

function drawTeleporterDoor(teleporter) {
  const centerX = Math.round(teleporter.x);
  const floorY = Math.round(teleporter.floorY - cameraY);
  const doorSprite = assets.teleporterDoor;

  if (doorSprite && doorSprite.loaded) {
    const spriteWidth = doorSprite.image.naturalWidth;
    const spriteHeight = doorSprite.image.naturalHeight;
    const targetWidth = Math.round(teleporter.drawWidth * 0.95);
    const targetHeight = Math.round(targetWidth * (spriteHeight / spriteWidth));
    const drawX = Math.round(centerX - targetWidth / 2);
    const drawY = Math.round(floorY - targetHeight + 8);

    context.drawImage(doorSprite.image, 0, 0, spriteWidth, spriteHeight, drawX, drawY, targetWidth, targetHeight);

    if (teleporter.state === "active" || teleporter.state === "using") {
      context.fillStyle = "rgba(133, 198, 255, 0.26)";
      context.fillRect(centerX - 30, floorY - 8, 60, 8);
    }

    return;
  }

  const doorWidth = Math.round(teleporter.drawWidth * 0.58);
  const doorHeight = Math.round(teleporter.drawHeight * 0.9);
  const frameThickness = 8;
  const doorTop = floorY - doorHeight;
  const doorLeft = centerX - Math.round(doorWidth / 2);
  const panelMaxWidth = Math.floor(doorWidth / 2);
  const openAmount = getTeleporterDoorOpenAmount(teleporter);
  const pulse = 0.72 + Math.sin(animationClock * 8) * 0.28;
  const usingBoost = teleporter.state === "using" ? 0.25 : 0;
  const lightAlpha = clamp(openAmount * (0.55 + pulse * 0.25 + usingBoost), 0, 0.95);
  const panelWidth = Math.max(2, Math.round(panelMaxWidth * (1 - openAmount)));
  const innerTop = doorTop + 8;
  const innerHeight = doorHeight - 10;
  const innerRight = doorLeft + doorWidth;
  const leftPanelX = doorLeft;
  const rightPanelX = innerRight - panelWidth;

  context.fillStyle = "#2d1e18";
  context.fillRect(
    doorLeft - frameThickness,
    doorTop - frameThickness,
    doorWidth + frameThickness * 2,
    doorHeight + frameThickness + 6
  );

  context.fillStyle = "#8d6c45";
  context.fillRect(doorLeft - frameThickness, doorTop - frameThickness, doorWidth + frameThickness * 2, 6);
  context.fillRect(doorLeft - frameThickness, doorTop, 6, doorHeight + 6);
  context.fillRect(doorLeft + doorWidth + frameThickness - 6, doorTop, 6, doorHeight + 6);

  if (openAmount > 0.02) {
    const blueGlow = context.createLinearGradient(doorLeft, innerTop, doorLeft, innerTop + innerHeight);
    blueGlow.addColorStop(0, `rgba(178, 229, 255, ${lightAlpha})`);
    blueGlow.addColorStop(0.55, `rgba(88, 178, 255, ${lightAlpha * 0.85})`);
    blueGlow.addColorStop(1, `rgba(23, 96, 198, ${lightAlpha * 0.75})`);
    context.fillStyle = blueGlow;
    context.fillRect(doorLeft + 1, innerTop, doorWidth - 2, innerHeight);

    context.fillStyle = `rgba(184, 234, 255, ${lightAlpha * 0.38})`;
    context.fillRect(centerX - 6, innerTop + 8, 12, innerHeight - 16);
  }

  context.fillStyle = "#4c372b";
  context.fillRect(leftPanelX, innerTop, panelWidth, innerHeight);
  context.fillRect(rightPanelX, innerTop, panelWidth, innerHeight);

  context.fillStyle = "#2a1f1a";
  context.fillRect(leftPanelX + panelWidth - 2, innerTop, 2, innerHeight);
  context.fillRect(rightPanelX, innerTop, 2, innerHeight);

  if (teleporter.state === "active" || teleporter.state === "using") {
    context.fillStyle = `rgba(133, 198, 255, ${0.18 + pulse * 0.1})`;
    context.fillRect(centerX - 34, floorY - 8, 68, 8);
  }
}

function drawTeleporters() {
  for (const teleporter of Object.values(teleporters)) {
    if (teleporter.scene !== currentScene || teleporter.state === "hidden") {
      continue;
    }

    drawTeleporterDoor(teleporter);
  }
}

function drawBoss() {
  if (!isArenaScene()) {
    return;
  }

  const asset = getBossAsset();
  const drawX = Math.round(boss.x);
  const drawY = Math.round(ARENA_FLOOR_Y - cameraY);
  const frameCount = getFrameCount(asset);
  const frameWidth = asset && asset.loaded ? asset.image.naturalWidth / frameCount : 0;
  let frameIndex = 0;

  if (boss.state === "run" && frameCount > 1) {
    frameIndex = Math.floor(animationClock * 10) % frameCount;
  } else if (boss.state === "attack" && frameCount > 1) {
    frameIndex = Math.min(frameCount - 1, Math.floor(boss.stateTime * 12));
  } else if (boss.state === "hurt" && frameCount > 1) {
    frameIndex = Math.min(frameCount - 1, Math.floor(boss.stateTime * 10));
  } else if (boss.state === "dead" && frameCount > 1) {
    frameIndex = frameCount - 1;
  } else if (frameCount > 1) {
    frameIndex = Math.floor(animationClock * 4) % frameCount;
  }

  context.save();
  context.translate(drawX, drawY);
  context.scale(boss.direction < 0 ? -1 : 1, 1);

  context.fillStyle = "rgba(0, 0, 0, 0.32)";
  context.beginPath();
  context.ellipse(0, 10, 54, 14, 0, 0, Math.PI * 2);
  context.fill();

  if (asset && asset.loaded) {
    context.drawImage(
      asset.image,
      frameIndex * frameWidth,
      0,
      frameWidth,
      asset.image.naturalHeight,
      -boss.drawWidth / 2,
      -boss.drawHeight + 10,
      boss.drawWidth,
      boss.drawHeight
    );
  } else {
    context.fillStyle = "#7b3137";
    context.fillRect(-36, -88, 72, 98);
    context.fillStyle = "#f3d2b8";
    context.fillRect(-18, -76, 36, 30);
  }

  context.restore();

  drawHealthBar(drawX - 44, drawY - boss.drawHeight - 10, 88, 5, boss.health, boss.maxHealth, "#b53b3b");
}

function drawGoal() {
  if (!isTowerScene()) {
    return;
  }

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

function drawForestBonfire() {
  if (!isForestScene()) {
    return;
  }

  const centerX = Math.round(forestBonfire.x);
  const floorY = Math.round(forestBonfire.floorY - cameraY);
  const drawX = Math.round(centerX - FOREST_BONFIRE_DRAW_WIDTH / 2);
  const drawY = Math.round(floorY - FOREST_BONFIRE_DRAW_HEIGHT + 10);
  const loadedFrames = assets.bonfire.filter((frame) => frame.loaded);
  const pulse = 0.74 + Math.sin(animationClock * 8) * 0.26;
  const checkpointBoost = forestBonfire.active ? 0.2 : 0;
  const healBoost = forestBonfire.healFlashTime > 0 ? 0.26 : 0;
  const glowAlpha = clamp(0.18 + checkpointBoost + healBoost + pulse * 0.06, 0.2, 0.82);

  context.fillStyle = `rgba(252, 176, 88, ${glowAlpha})`;
  context.beginPath();
  context.ellipse(centerX, floorY - 2, 34, 10, 0, 0, Math.PI * 2);
  context.fill();

  if (loadedFrames.length > 0) {
    const frameIndex = Math.floor(animationClock * 10) % loadedFrames.length;
    const frame = loadedFrames[frameIndex];
    context.drawImage(frame.image, 0, 0, frame.image.naturalWidth, frame.image.naturalHeight, drawX, drawY, FOREST_BONFIRE_DRAW_WIDTH, FOREST_BONFIRE_DRAW_HEIGHT);
  } else {
    context.fillStyle = "#4a2d1e";
    context.fillRect(centerX - 15, floorY - 18, 30, 18);
    context.fillStyle = "#e28935";
    context.beginPath();
    context.moveTo(centerX, floorY - 52);
    context.lineTo(centerX - 10, floorY - 22);
    context.lineTo(centerX + 10, floorY - 22);
    context.closePath();
    context.fill();
  }
}

function drawPlayer() {
  const drawX = Math.round(player.x);
  const drawY = Math.round(player.y - cameraY);
  const crouchOffset = player.charging && player.grounded ? 5 : 0;
  const direction = currentAim() || player.facing;
  const spriteState = getPlayerSpriteState();
  const activeSprite = getActiveCharacterAsset(spriteState);
  const flashing = player.invulnerableTime > 0 && Math.floor(player.invulnerableTime * 18) % 2 === 0;

  if (player.charging && !isPlayerAttacking() && !isPlayerBlocking()) {
    const glowRadius = 14 + (player.charge / MAX_CHARGE) * 18;
    context.fillStyle = "rgba(233, 169, 70, 0.18)";
    context.beginPath();
    context.arc(drawX + player.width / 2, drawY + player.height / 2, glowRadius, 0, Math.PI * 2);
    context.fill();
  }

  context.save();
  if (flashing) {
    context.globalAlpha = 0.58;
  }
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

  drawHealthBar(drawX - 8, drawY - 22, 46, 5, player.health, player.maxHealth, "#c24646");
}

function drawPlayerSprite(asset, spriteState) {
  const frameCount = getFrameCount(asset);
  const frameWidth = asset.image.naturalWidth / frameCount;
  let frameIndex = 0;

  if (spriteState === "dead" && frameCount > 1) {
    frameIndex = frameCount - 1;
  } else if (spriteState === "hurt" && frameCount > 1) {
    frameIndex = Math.min(frameCount - 1, 1);
  } else if (spriteState === "attack" && frameCount > 1) {
    const attackProgress = 1 - player.attackTime / PLAYER_ATTACK_DURATION;
    frameIndex = Math.min(frameCount - 1, Math.floor(attackProgress * frameCount));
  } else if (spriteState === "block" && frameCount > 1) {
    frameIndex = Math.min(frameCount - 1, 1);
  } else if (spriteState === "jump" && frameCount > 1) {
    const fallRatio = clamp((player.vy + 320) / 1100, 0, 1);
    frameIndex = Math.round(fallRatio * (frameCount - 1));
  } else if (spriteState === "dash" && frameCount > 1) {
    frameIndex = Math.floor(animationClock * 18) % frameCount;
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

function drawHealthBar(x, y, width, height, health, maxHealth, fillColor) {
  context.fillStyle = "rgba(8, 7, 8, 0.72)";
  context.fillRect(x - 2, y - 2, width + 4, height + 4);
  context.fillStyle = "rgba(255, 241, 219, 0.12)";
  context.fillRect(x, y, width, height);
  context.fillStyle = fillColor;
  context.fillRect(x, y, width * clamp(health / maxHealth, 0, 1), height);
  context.strokeStyle = "rgba(255, 233, 201, 0.18)";
  context.strokeRect(x, y, width, height);
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
  if (isForestScene()) {
    context.fillStyle = "rgba(233, 248, 217, 0.94)";
    context.font = "22px Georgia";
    context.fillText("Forest Edge", 24, 34);
    context.fillStyle = "rgba(170, 222, 160, 0.9)";
    context.font = "14px Georgia";
    if (forestBonfire.active) {
      context.fillText("Bonfire bound: checkpoint active and healing", 24, 56);
    } else {
      context.fillText("Touch the bonfire to bind checkpoint and heal", 24, 56);
    }
  } else if (isArenaScene()) {
    context.fillStyle = "rgba(243, 231, 207, 0.94)";
    context.font = "22px Georgia";
    context.fillText("Boss Arena", 24, 34);
    context.fillStyle = "rgba(224, 171, 79, 0.84)";
    context.font = "14px Georgia";
    context.fillText(
      boss.dead ? "The return gate is open" : "Defeat Gotoku to reopen the gate",
      24,
      56
    );
  } else if (isBossApproachVisible()) {
    context.fillStyle = "rgba(243, 231, 207, 0.94)";
    context.font = "22px Georgia";
    context.fillText("Ancient Gate", 24, 34);
    context.fillStyle = "rgba(170, 204, 255, 0.84)";
    context.font = "14px Georgia";
    context.fillText("Step into the blue door to challenge Gotoku", 24, 56);
  } else {
    context.fillStyle = "rgba(243, 231, 207, 0.92)";
    context.font = "20px Georgia";
    context.fillText("Bell Tower", 24, 34);

    context.fillStyle = "rgba(211, 192, 158, 0.84)";
    context.font = "14px Georgia";
    if (encounter.forestUnlocked) {
      context.fillText("Path unlocked: move right to exit into the forest", 24, 56);
    } else if (encounter.bossDefeated) {
      context.fillText("Touch the bell, then head right for the outside path", 24, 56);
    } else {
      context.fillText("Reach the chamber at the top", 24, 56);
    }
  }

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
  if (isArenaScene()) {
    drawArenaShell();
  }
  drawTower();
  drawPlatforms();
  drawTeleporters();
  drawBoss();
  drawGoal();
  drawForestBonfire();
  drawPlayer();
  drawChargeBar();
  drawOverlayText();
  drawVignette();
}

function updateHud() {
  const heightPercent = 1 - clamp((getTowerHeightReferenceY() + player.height - goal.y) / (FLOOR_Y - goal.y), 0, 1);
  const meters = Math.round(heightPercent * 100);
  heightLabel.textContent = `Height ${meters} m`;

  if (player.dead) {
    statusLabel.textContent = "Fallen";
    statusLabel.style.color = "#d97373";
    return;
  }

  if (player.won) {
    statusLabel.textContent = "Victory";
    statusLabel.style.color = "#f3d383";
    return;
  }

  if (isTeleporting()) {
    statusLabel.textContent = "Teleporting";
    statusLabel.style.color = "#9fc4ff";
    return;
  }

  if (boss.dead && isArenaScene()) {
    statusLabel.textContent = "Boss defeated";
    statusLabel.style.color = "#f3d383";
    return;
  }

  if (isArenaScene()) {
    statusLabel.textContent = "Boss fight";
    statusLabel.style.color = "#e0ab4f";
    return;
  }

  if (isForestScene()) {
    if (forestBonfire.playerNearby) {
      statusLabel.textContent = "Resting";
      statusLabel.style.color = "#f0c777";
      return;
    }

    if (forestBonfire.active) {
      statusLabel.textContent = "Checkpoint active";
      statusLabel.style.color = "#9fd18d";
      return;
    }

    statusLabel.textContent = "Forest";
    statusLabel.style.color = "#9fd18d";
    return;
  }

  if (isTowerScene() && encounter.forestUnlocked) {
    statusLabel.textContent = "Forest path open";
    statusLabel.style.color = "#9fd18d";
    return;
  }

  if (player.hurtTime > 0) {
    statusLabel.textContent = "Hurt";
    statusLabel.style.color = "#d97373";
    return;
  }

  if (isPlayerAttacking()) {
    statusLabel.textContent = "Attacking";
    statusLabel.style.color = "#e0ab4f";
    return;
  }

  if (isPlayerBlocking()) {
    statusLabel.textContent = "Blocking";
    statusLabel.style.color = "#9fc4ff";
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
activateGameInput();
resetPlayer();
requestAnimationFrame((now) => {
  lastTime = now;
  tick(now);
});
