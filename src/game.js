const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const statusLabel = document.getElementById("status-label");
const heightLabel = document.getElementById("height-label");
const characterSelect = document.getElementById("character-select");
const stageFrame = document.querySelector(".stage-frame");
const pauseMenu = document.getElementById("pause-menu");
const resumeButton = document.getElementById("resume-button");
const restartButton = document.getElementById("restart-button");
const fullscreenButton = document.getElementById("fullscreen-button");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const fsMenu = document.getElementById("fs-menu");
const fsResumeBtn = document.getElementById("fs-resume-btn");
const fsRestartBtn = document.getElementById("fs-restart-btn");
const fsExitFsBtn = document.getElementById("fs-exit-fs-btn");
let fsMenuOpen = false;

context.imageSmoothingEnabled = false;

const VIEW_WIDTH = canvas.width;
const VIEW_HEIGHT = canvas.height;
const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 4860;
const TOWER_LEFT = 112;
const TOWER_RIGHT = 848;
const FLOOR_Y = WORLD_HEIGHT - 132;
const GRAVITY = 1800;
const MAX_FALL_SPEED = 1320;
const MOVE_SPEED = 248;
const GROUND_ACCEL = 1880;
const AIR_ACCEL = 1220;
const GROUND_FRICTION = 2400;
const JUMP_VELOCITY = 910;
const COYOTE_TIME = 0.11;
const JUMP_BUFFER_TIME = 0.12;
const JUMP_CUT_MULTIPLIER = 0.5;
const WALL_SLIDE_SPEED = 190;
const WALL_JUMP_VELOCITY = 860;
const WALL_JUMP_HORIZONTAL_SPEED = 420;
const WALL_JUMP_INPUT_LOCK = 0.14;
const CAMERA_LERP = 0.085;
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
const PLAYER_AIR_ATTACK_VERTICAL_RANGE = 170;
const BOSS_ATTACK_RANGE = 112;
const PLAYER_ATTACK_DURATION = 0.24;
const PLAYER_ATTACK_COOLDOWN = 0.22;
const PLAYER_ATTACK_CANCEL_PROGRESS = 0.42;
const PLAYER_SPECIAL_DAMAGE = 38;
const PLAYER_SPECIAL_RANGE = 164;
const PLAYER_SPECIAL_VERTICAL_RANGE = 210;
const PLAYER_SPECIAL_DURATION = 0.56;
const PLAYER_SPECIAL_COOLDOWN = 1.25;
const PLAYER_SPECIAL_HIT_START = 0.3;
const PLAYER_SPECIAL_HIT_END = 0.72;
const PLAYER_SPECIAL_PROJECTILE_SPEED = 760;
const PLAYER_SPECIAL_PROJECTILE_LIFETIME = 0.74;

// Lightning Stab (R key ability — hold to channel)
const LIGHTNING_STAB_DAMAGE = 18;
const LIGHTNING_STAB_DAMAGE_TICK = 0.18;
const LIGHTNING_STAB_DURATION = 0.25;
const LIGHTNING_STAB_COOLDOWN = 1.4;
const LIGHTNING_STAB_BOLT_DELAY = 0.15;
const LIGHTNING_STAB_BOLT_FADE = 0.35;
const LIGHTNING_STAB_RANGE = 220;
const PLAYER_JUMP_ATTACK_DAMAGE = 36;
const PLAYER_JUMP_ATTACK_RANGE = 156;
const PLAYER_JUMP_ATTACK_VERTICAL_RANGE = 220;
const PLAYER_JUMP_ATTACK_DURATION = 0.62;
const PLAYER_JUMP_ATTACK_COOLDOWN = 1.08;
const PLAYER_JUMP_ATTACK_HIT_START = 0.14;
const PLAYER_JUMP_ATTACK_HIT_END = 0.62;
const PLAYER_DASH_SPEED = 1100;
const PLAYER_DASH_DURATION = 0.22;
const PLAYER_DASH_COOLDOWN = 0.52;
const PLAYER_DASH_DAMAGE = 12;
const BOSS_BASE_SPEED = 98;
const BOSS_LUNGE_SPEED = 220;
const BOSS_PERSONAL_SPACE = 96;
const BOSS_PURSUIT_DISTANCE = 210;
const BOSS_ATTACK_DURATION = 0.72;
const BOSS_ATTACK_COOLDOWN = 0.95;
const HURT_DURATION = 0.28;
const PLAYER_IFRAME_DURATION = 0.55;
const BOSS_IFRAME_DURATION = 0.3;

// ── Nightborne Boss (Zone 4) ──
const NB_FLOOR_Y = FOREST_FLOOR_Y - 99;
const NB_SPAWN_X = 700;
const NB_MIN_X = FOREST_LEFT + 60;
const NB_MAX_X = FOREST_RIGHT - 60;
const NB_MAX_HEALTH = 200;
const NB_ATTACK_DAMAGE = 22;
const NB_ATTACK_RANGE = 120;
const NB_BASE_SPEED = 110;
const NB_LUNGE_SPEED = 250;
const NB_PERSONAL_SPACE = 100;
const NB_PURSUIT_DISTANCE = 220;
const NB_ATTACK_DURATION = 0.8;
const NB_ATTACK_COOLDOWN = 0.85;
const NB_IFRAME_DURATION = 0.3;
// Sprite sheet: 1840x400, 5 rows of 80px, each frame 80x80
const NB_FRAME_SIZE = 80;
const NB_DRAW_SIZE = 160; // draw size on screen
const NB_ROWS = { idle: 0, run: 1, attack: 2, hurt: 3, dead: 4 };
const NB_FRAME_COUNTS = { idle: 9, run: 6, attack: 12, hurt: 5, dead: 23 };

// ── Zone Mobs (zones 1-3) ──
const MOB_FRAME_SIZE = 150;
const MOB_TYPES = {
  mushroom: {
    health: 35, damage: 10, speed: 40, chaseSpeed: 70,
    attackRange: 50, chaseRange: 220, attackDuration: 0.65, attackCooldown: 1.6,
    iframeDuration: 0.25, drawSize: 140, hitW: 28, hitH: 40, footRatio: 0.70,
    anims: {
      idle:   { key: "mushroomIdle",   frames: 4, fps: 5 },
      run:    { key: "mushroomRun",    frames: 8, fps: 8 },
      attack: { key: "mushroomAttack", frames: 8, fps: 12 },
      hurt:   { key: "mushroomHurt",   frames: 4, fps: 10 },
      dead:   { key: "mushroomDead",   frames: 4, fps: 6 }
    },
    healthBarColor: "#6b8e23"
  },
  skeleton: {
    health: 50, damage: 14, speed: 35, chaseSpeed: 60,
    attackRange: 58, chaseRange: 240, attackDuration: 0.7, attackCooldown: 1.3,
    iframeDuration: 0.25, drawSize: 150, hitW: 30, hitH: 44, footRatio: 0.73,
    anims: {
      idle:   { key: "skeletonIdle",   frames: 4, fps: 5 },
      run:    { key: "skeletonWalk",   frames: 4, fps: 6 },
      attack: { key: "skeletonAttack", frames: 8, fps: 12 },
      hurt:   { key: "skeletonHurt",   frames: 4, fps: 10 },
      dead:   { key: "skeletonDead",   frames: 4, fps: 6 }
    },
    healthBarColor: "#b0b0b0"
  },
  goblin: {
    health: 40, damage: 12, speed: 55, chaseSpeed: 85,
    attackRange: 48, chaseRange: 200, attackDuration: 0.6, attackCooldown: 1.1,
    iframeDuration: 0.25, drawSize: 140, hitW: 26, hitH: 38, footRatio: 0.73,
    anims: {
      idle:   { key: "goblinIdle",   frames: 4, fps: 5 },
      run:    { key: "goblinRun",    frames: 8, fps: 10 },
      attack: { key: "goblinAttack", frames: 8, fps: 13 },
      hurt:   { key: "goblinHurt",   frames: 4, fps: 10 },
      dead:   { key: "goblinDead",   frames: 4, fps: 6 }
    },
    healthBarColor: "#4a8f3f"
  },
  flyingEye: {
    health: 25, damage: 8, speed: 50, chaseSpeed: 90,
    attackRange: 44, chaseRange: 250, attackDuration: 0.6, attackCooldown: 1.4,
    iframeDuration: 0.2, drawSize: 120, hitW: 24, hitH: 24, flying: true, footRatio: 0.55,
    anims: {
      idle:   { key: "eyeFlight",  frames: 8, fps: 7 },
      run:    { key: "eyeFlight",  frames: 8, fps: 10 },
      attack: { key: "eyeAttack", frames: 8, fps: 12 },
      hurt:   { key: "eyeHurt",   frames: 4, fps: 10 },
      dead:   { key: "eyeDead",   frames: 4, fps: 6 }
    },
    healthBarColor: "#c44"
  }
};

// Per-zone mob spawns (forest zone index → array of spawn defs)
const ZONE_MOB_SPAWNS = {
  // Zone 1 — Crimson Cavern
  1: [
    // Mushroom on stone structure top (platform y=FOREST_FLOOR_Y-88, x=688–988)
    { type: "mushroom", x: 780, floorY: FOREST_FLOOR_Y - 88, patrolMin: 700, patrolMax: 960 },
    // Skeleton on cave floor shelf (platform y=FOREST_FLOOR_Y-15, x=48–548)
    { type: "skeleton", x: 350, floorY: FOREST_FLOOR_Y - 15, patrolMin: 270, patrolMax: 520 },
  ],
  // Zone 2 — Dark Temple
  2: [
    // Goblin on upper balcony (platform y=FOREST_FLOOR_Y-265, x=142–578)
    { type: "goblin",    x: 350, floorY: FOREST_FLOOR_Y - 265, patrolMin: 160, patrolMax: 560 },
    // Flying eye above the main floor area
    { type: "flyingEye", x: 480, floorY: FOREST_FLOOR_Y - 180, patrolMin: 150, patrolMax: 620 },
    // Skeleton on main ground floor (platform y=FOREST_FLOOR_Y-20, full width)
    { type: "skeleton",  x: 450, floorY: FOREST_FLOOR_Y - 20,  patrolMin: 280, patrolMax: 630 },
  ],
  // Zone 3 — Ruined Citadel (single ground platform y=FOREST_FLOOR_Y-99)
  3: [
    { type: "skeleton", x: 250, floorY: FOREST_FLOOR_Y - 99, patrolMin: 100, patrolMax: 420 },
    { type: "goblin",   x: 550, floorY: FOREST_FLOOR_Y - 99, patrolMin: 400, patrolMax: 700 },
    { type: "skeleton", x: 780, floorY: FOREST_FLOOR_Y - 99, patrolMin: 660, patrolMax: 870 },
  ],
  // Zone 5 — Shattered Spire (ascending platforms)
  5: [
    // Skeleton guards the central arch platform
    { type: "skeleton", x: 400, floorY: FOREST_FLOOR_Y - 170, patrolMin: 320, patrolMax: 500 },
    // Flying eye patrols the upper air space
    { type: "flyingEye", x: 500, floorY: FOREST_FLOOR_Y - 260, patrolMin: 200, patrolMax: 700 },
    // Mushroom on ground floor right side
    { type: "mushroom", x: 700, floorY: FOREST_FLOOR_Y, patrolMin: 550, patrolMax: 880 },
  ],
  // Zone 6 — Windswept Heights (two paths, more enemies)
  6: [
    // Goblin on main path ledge 2
    { type: "goblin", x: 300, floorY: FOREST_FLOOR_Y - 140, patrolMin: 280, patrolMax: 400 },
    // Skeleton guarding main path high ledge
    { type: "skeleton", x: 400, floorY: FOREST_FLOOR_Y - 290, patrolMin: 380, patrolMax: 520 },
    // Flying eye between the two paths
    { type: "flyingEye", x: 480, floorY: FOREST_FLOOR_Y - 200, patrolMin: 300, patrolMax: 650 },
    // Goblin on optional right path step 2
    { type: "goblin", x: 560, floorY: FOREST_FLOOR_Y - 160, patrolMin: 530, patrolMax: 640 },
    // Skeleton on optional right path step 3
    { type: "skeleton", x: 740, floorY: FOREST_FLOOR_Y - 240, patrolMin: 720, patrolMax: 820 },
  ],
  // Zone 7 — The Pinnacle (dense gauntlet)
  7: [
    // Skeleton on step 3 (right wall ledge)
    { type: "skeleton", x: 820, floorY: FOREST_FLOOR_Y - 160, patrolMin: 780, patrolMax: 920 },
    // Goblin on step 4 (center)
    { type: "goblin", x: 520, floorY: FOREST_FLOOR_Y - 210, patrolMin: 480, patrolMax: 610 },
    // Flying eye in upper zone
    { type: "flyingEye", x: 350, floorY: FOREST_FLOOR_Y - 300, patrolMin: 200, patrolMax: 600 },
    // Skeleton on step 6 (center high)
    { type: "skeleton", x: 450, floorY: FOREST_FLOOR_Y - 320, patrolMin: 400, patrolMax: 540 },
    // Flying eye near the peak
    { type: "flyingEye", x: 550, floorY: FOREST_FLOOR_Y - 400, patrolMin: 350, patrolMax: 700 },
    // Goblin on ground right island
    { type: "goblin", x: 720, floorY: FOREST_FLOOR_Y, patrolMin: 620, patrolMax: 900 },
  ]
};

const CAMERA_LOOKAHEAD_UP = -84;
const CAMERA_LOOKAHEAD_DOWN = 66;
const CAMERA_LOOKAHEAD_LERP = 420;
const DEV_SPAWN_AT_BONFIRE = true;

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

const FOREST_ZONE_DEFAULT_PALETTE = {
  sky: ["#1b2b1e", "#2b4b31", "#1a2a1d"],
  haze: "rgba(175, 224, 154, 0.1)",
  ridgeFar: "#24382b",
  ridgeNear: "#1d2f24",
  floorBase: "#2a3c2c",
  floorTop: "#4f7a4e",
  stepBase: "#40583f",
  stepTop: "#74a36d",
  pathBase: "#4b3a2a",
  pathTop: "#8f7554",
  wallBase: "#314535",
  wallEdge: "#7cad71"
};

const forestRouteZones = [
  {
    id: "forest-edge",
    title: "Forest Edge",
    subtitle: "Bonfire clearing",
    theme: "first-cp",
    decorations: [
    ],
    palette: {
      sky: ["#1b2b1e", "#2b4b31", "#1a2a1d"],
      haze: "rgba(175, 224, 154, 0.1)",
      ridgeFar: "#24382b",
      ridgeNear: "#1d2f24",
      floorBase: "#2a3c2c",
      floorTop: "#4f7a4e",
      stepBase: "#40583f",
      stepTop: "#74a36d",
      pathBase: "#4b3a2a",
      pathTop: "#8f7554",
      wallBase: "#314535",
      wallEdge: "#7cad71"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y,       width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" }, // ZONE0 floor    (canvas y=472, x=16–928)
      { x: 166,              y: FOREST_FLOOR_Y - 86,  width: 136, height: 18, type: "forest-step" },  // ZONE0 left-step   (canvas y=386, x=166–302)
      { x: 372,              y: FOREST_FLOOR_Y - 138, width: 146, height: 18, type: "forest-step" },  // ZONE0 center-step (canvas y=334, x=372–518)
      { x: 610,              y: FOREST_FLOOR_Y - 92,  width: 124, height: 18, type: "forest-step" }   // ZONE0 right-step  (canvas y=380, x=610–734)
    ],
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor", invisible: true }
    ],
    walls: [],
    transitions: [
      // right edge → zone 1, spawn at top of cave arch opening (player drops in from above)
      {
        x: FOREST_RIGHT - 24,
        y: FOREST_FLOOR_Y - 132,
        width: 24,
        height: 132,
        targetZone: 1,
        spawnX: FOREST_LEFT + 30,
        spawnY: FOREST_FLOOR_Y - 247
      }
    ]
  },
  {
    id: "crimson-cavern",
    title: "Crimson Cavern",
    subtitle: "Glowing depths",
    theme: "crimson-cavern",
    decorations: [],
    palette: {
      sky: ["#080507", "#100b0e", "#080507"],
      haze: "rgba(40, 80, 40, 0.08)",
      ridgeFar: "#0e0a0a",
      ridgeNear: "#0a0808",
      floorBase: "#141a14",
      floorTop: "#2a402a",
      stepBase: "#1a221a",
      stepTop: "#3a5a3a",
      pathBase: "#141a14",
      pathTop: "#2a402a",
      wallBase: "#141a14",
      wallEdge: "#3a5a3a"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor", invisible: true },
      // upper cave interior ledge — top shelf inside the rocky arch
      { x: FOREST_LEFT, y: FOREST_FLOOR_Y - 200, width: 220, height: 20, type: "forest-step", invisible: true },
      // pillar from bottom of upper ledge down to ground (canvas x=48–268, y=292→472)
      { x: FOREST_LEFT, y: FOREST_FLOOR_Y - 180, width: 220, height: 180, type: "forest-step", invisible: true },
      // cave floor shelf — bottom of the cave arch, player lands here after dropping in
      { x: FOREST_LEFT, y: FOREST_FLOOR_Y - 15, width: 500, height: 30, type: "forest-step", invisible: true },
      // staircase ramp — floor up to stone structure (canvas x=520→656, y=472→316)
      { x: 520, y: FOREST_FLOOR_Y, degrees: 28, width: 180, type: "forest-ramp", invisible: true },
      // left stone structure top (wide, 2 blue torches)
      { x: 688, y: FOREST_FLOOR_Y - 88, width: 300, height: 20, type: "forest-step", invisible: true },
    ],
    walls: [
      // pillar wall — blocks horizontal movement through the pillar
      { x: FOREST_LEFT, y: FOREST_FLOOR_Y - 180, width: 220, height: 180, invisible: true }
    ],
    transitions: [
      // left edge → back to zone 0 (bonfire), full height trigger
      {
        x: FOREST_LEFT,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 0,
        spawnX: FOREST_RIGHT - 120,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      // right edge → forward to zone 2 (dark temple), spawn on nr1 Temple Lower Balcony
      {
        x: FOREST_RIGHT - 24,
        y: FOREST_FLOOR_Y - 400,
        width: 24,
        height: 400,
        targetZone: 2,
        spawnX: 80,
        spawnY: FOREST_FLOOR_Y - 70 - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "dark-temple",
    title: "Dark Temple",
    subtitle: "Ancient gateway",
    theme: "dark-temple",
    decorations: [],
    palette: {
      sky: ["#0d0507", "#150a0c", "#0d0507"],
      haze: "rgba(80, 20, 20, 0.12)",
      ridgeFar: "#1a0a0c",
      ridgeNear: "#130709",
      floorBase: "#1a1010",
      floorTop: "#3d2828",
      stepBase: "#241414",
      stepTop: "#5a3030",
      pathBase: "#1a1010",
      pathTop: "#3d2828",
      wallBase: "#1a1010",
      wallEdge: "#5a3030"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y - 20, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 140, type: "forest-floor", invisible: true },
      // first Staircase Ramp — ascending slope from ground to temple entrance
      { x: 120, y: FOREST_FLOOR_Y - 70, y2: FOREST_FLOOR_Y, degrees: -15, width: 140, type: "forest-ramp", invisible: true },
      // nr1.Temple Lower Balcony — ledge at the base of the left columns
      { x: 0, y: FOREST_FLOOR_Y - 70, width: 120, height: 20, type: "forest-step", invisible: true },
      // Temple Upper Balcony — ledge above the left arch columns
      { x: 142, y: FOREST_FLOOR_Y - 265, width: 436, height: 20, type: "forest-step", invisible: true },
      // Overgrown Wall — raised stone wall on the right side
      { x: 648, y: FOREST_FLOOR_Y - 115, width: 135, height: 200, type: "forest-step", invisible: true },
      // Wall Ascent Ramp — slope up to Torch Pillar Peak
      { x: 730, y: FOREST_FLOOR_Y - 115, y2: FOREST_FLOOR_Y - 130, degrees: -40, width: 90, type: "forest-ramp", invisible: true },
      // Torch Pillar Peak — top of the far-right obelisk
      { x: 820, y: FOREST_FLOOR_Y - 130, width: 150, height: 30, type: "forest-step", invisible: true }
    ],
    walls: [
      // Overgrown Wall — solid block
      { x: 648, y: FOREST_FLOOR_Y - 115, width: 155, height: 200, invisible: true },
      // Torch Pillar Peak — wall underneath
      { x: 820, y: FOREST_FLOOR_Y - 130, width: 150, height: 160, invisible: true },
    ],
    transitions: [
      // left edge → back to zone 1 (crimson cavern), spawn on last platform (stone structure top)
      {
        x: FOREST_LEFT,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 1,
        spawnX: 800,
        spawnY: FOREST_FLOOR_Y - 88 - PLAYER_HEIGHT
      },
      // right edge → forward to zone 3 (ruined citadel), spawn on first platform
      {
        x: FOREST_RIGHT - 24,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 3,
        spawnX: 80,
        spawnY: FOREST_FLOOR_Y - 99 - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "ruined-citadel",
    title: "Ruined Citadel",
    subtitle: "Crumbling heights",
    theme: "ruined-citadel",
    decorations: [],
    palette: {
      sky: ["#0a0608", "#140c10", "#0a0608"],
      haze: "rgba(60, 20, 40, 0.1)",
      ridgeFar: "#160d10",
      ridgeNear: "#0e080b",
      floorBase: "#18130e",
      floorTop: "#3a2a1a",
      stepBase: "#1e1810",
      stepTop: "#4a3820",
      pathBase: "#18130e",
      pathTop: "#3a2a1a",
      wallBase: "#18130e",
      wallEdge: "#4a3820"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      // Ground floor
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y - 99, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 450, type: "forest-floor", invisible: true },
    ],
    walls: [],
    transitions: [
      // left edge → back to zone 2 (dark temple), spawn on Torch Pillar Peak
      {
        x: FOREST_LEFT,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 2,
        spawnX: 840,
        spawnY: FOREST_FLOOR_Y - 130 - PLAYER_HEIGHT
      },
      // right edge → forward to zone 4 (boss room)
      {
        x: FOREST_RIGHT - 24,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 4,
        spawnX: 80,
        spawnY: FOREST_FLOOR_Y - 99 - PLAYER_HEIGHT
      }
    ]
  },
  // ── Zone 4: Boss Room ──
  {
    id: "boss-room",
    title: "Boss Room",
    subtitle: "The final stand",
    theme: "boss-room",
    decorations: [],
    palette: {
      sky: ["#0a0608", "#140c10", "#0a0608"],
      haze: "rgba(60, 20, 40, 0.1)",
      ridgeFar: "#160d10",
      ridgeNear: "#0e080b",
      floorBase: "#18130e",
      floorTop: "#3a2a1a",
      stepBase: "#1e1810",
      stepTop: "#4a3820",
      pathBase: "#18130e",
      pathTop: "#3a2a1a",
      wallBase: "#18130e",
      wallEdge: "#4a3820"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      // Ground floor
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y - 99, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 450, type: "forest-floor", invisible: true },
    ],
    walls: [
      // Right wall — block exit until Nightborne dead
      { x: FOREST_RIGHT, y: 0, width: 32, height: FOREST_FLOOR_Y, invisible: true },
    ],
    transitions: [
      // left edge → back to zone 3 (only after Nightborne is defeated)
      {
        x: FOREST_LEFT,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 3,
        spawnX: 840,
        spawnY: FOREST_FLOOR_Y - 99 - PLAYER_HEIGHT,
        requireNightborneDead: true
      },
      // right edge → forward to zone 5 (only after Nightborne is defeated)
      {
        x: FOREST_RIGHT - 24,
        y: FOREST_FLOOR_Y - 400,
        width: 24,
        height: 400,
        targetZone: 5,
        spawnX: FOREST_LEFT + 60,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT,
        requireNightborneDead: true
      }
    ]
  },
  // ── Zone 5: Shattered Spire — the ascent begins ──
  {
    id: "shattered-spire",
    title: "Shattered Spire",
    subtitle: "Where the sky breaks through",
    theme: "shattered-spire",
    decorations: [],
    palette: {
      sky: ["#0c1020", "#1a2040", "#0e1428"],
      haze: "rgba(100, 140, 200, 0.08)",
      ridgeFar: "#141a2e",
      ridgeNear: "#0e1220",
      floorBase: "#1a1c28",
      floorTop: "#2e3450",
      stepBase: "#222840",
      stepTop: "#4a5478",
      pathBase: "#1a1c28",
      pathTop: "#2e3450",
      wallBase: "#1a1c28",
      wallEdge: "#4a5478"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      // Ground floor — rubble-strewn base
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      // Low rubble step — first jump
      { x: 160, y: FOREST_FLOOR_Y - 60, width: 140, height: 20, type: "forest-step" },
      // Broken pillar ledge — left side ascending
      { x: 60, y: FOREST_FLOOR_Y - 140, width: 120, height: 18, type: "forest-step" },
      // Central crumbling arch — main route up
      { x: 320, y: FOREST_FLOOR_Y - 170, width: 180, height: 18, type: "forest-step" },
      // Right wall fragment — optional path
      { x: 680, y: FOREST_FLOOR_Y - 110, width: 130, height: 18, type: "forest-step" },
      // High right ledge — connects to central
      { x: 600, y: FOREST_FLOOR_Y - 230, width: 150, height: 18, type: "forest-step" },
      // Upper left spire fragment — near the top
      { x: 140, y: FOREST_FLOOR_Y - 280, width: 160, height: 18, type: "forest-step" },
      // Summit ledge — exit platform
      { x: 440, y: FOREST_FLOOR_Y - 340, width: 200, height: 18, type: "forest-step" },
      // Ramp ascending from ground right side
      { x: 520, y: FOREST_FLOOR_Y, degrees: 30, width: 160, type: "forest-ramp" },
    ],
    walls: [
      // Broken pillar wall underneath left ledge
      { x: 60, y: FOREST_FLOOR_Y - 140, width: 120, height: 140 },
    ],
    transitions: [
      // left edge → back to zone 4 (boss room)
      {
        x: FOREST_LEFT,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 4,
        spawnX: FOREST_RIGHT - 120,
        spawnY: FOREST_FLOOR_Y - 99 - PLAYER_HEIGHT
      },
      // right edge → forward to zone 6
      {
        x: FOREST_RIGHT - 24,
        y: FOREST_FLOOR_Y - 400,
        width: 24,
        height: 400,
        targetZone: 6,
        spawnX: FOREST_LEFT + 60,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  // ── Zone 6: Windswept Heights — branching paths, verticality ──
  {
    id: "windswept-heights",
    title: "Windswept Heights",
    subtitle: "The wind howls between the stones",
    theme: "windswept-heights",
    decorations: [],
    palette: {
      sky: ["#0a1218", "#162838", "#0c1a24"],
      haze: "rgba(140, 180, 220, 0.1)",
      ridgeFar: "#12202c",
      ridgeNear: "#0a1620",
      floorBase: "#1c2430",
      floorTop: "#344868",
      stepBase: "#243040",
      stepTop: "#506888",
      pathBase: "#1c2430",
      pathTop: "#344868",
      wallBase: "#1c2430",
      wallEdge: "#506888"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      // Ground — narrow broken floor, gaps force climbing
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: 250, height: 110, type: "forest-floor" },
      // Right ground island — separated by gap
      { x: 620, y: FOREST_FLOOR_Y, width: 340, height: 110, type: "forest-floor" },
      // ── MAIN PATH (left side ascending) ──
      // Ledge 1 — start of the climb
      { x: 80, y: FOREST_FLOOR_Y - 80, width: 130, height: 18, type: "forest-step" },
      // Ledge 2 — hop across
      { x: 280, y: FOREST_FLOOR_Y - 140, width: 120, height: 18, type: "forest-step" },
      // Ledge 3 — central platform
      { x: 160, y: FOREST_FLOOR_Y - 220, width: 150, height: 18, type: "forest-step" },
      // Ledge 4 — high left
      { x: 380, y: FOREST_FLOOR_Y - 290, width: 140, height: 18, type: "forest-step" },
      // ── OPTIONAL UPPER PATH (right side — harder, more enemies) ──
      // Right ascent step 1
      { x: 680, y: FOREST_FLOOR_Y - 90, width: 120, height: 18, type: "forest-step" },
      // Right ascent step 2
      { x: 530, y: FOREST_FLOOR_Y - 160, width: 110, height: 18, type: "forest-step" },
      // Right ascent step 3 — narrow and exposed
      { x: 720, y: FOREST_FLOOR_Y - 240, width: 100, height: 18, type: "forest-step" },
      // Right ascent step 4 — connects to main path near top
      { x: 580, y: FOREST_FLOOR_Y - 310, width: 120, height: 18, type: "forest-step" },
      // ── TOP — both paths converge ──
      // Summit bridge — exit to zone 7
      { x: 350, y: FOREST_FLOOR_Y - 370, width: 260, height: 18, type: "forest-step" },
    ],
    walls: [],
    transitions: [
      // left edge → back to zone 5
      {
        x: FOREST_LEFT,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 5,
        spawnX: FOREST_RIGHT - 120,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      // right edge → forward to zone 7
      {
        x: FOREST_RIGHT - 24,
        y: FOREST_FLOOR_Y - 400,
        width: 24,
        height: 400,
        targetZone: 7,
        spawnX: FOREST_LEFT + 60,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  // ── Zone 7: The Pinnacle — final ascent gauntlet ──
  {
    id: "the-pinnacle",
    title: "The Pinnacle",
    subtitle: "Above the clouds, the end awaits",
    theme: "the-pinnacle",
    decorations: [],
    palette: {
      sky: ["#08081a", "#141430", "#0a0a20"],
      haze: "rgba(180, 160, 220, 0.12)",
      ridgeFar: "#141428",
      ridgeNear: "#0c0c1e",
      floorBase: "#1a1428",
      floorTop: "#322848",
      stepBase: "#221a38",
      stepTop: "#584880",
      pathBase: "#1a1428",
      pathTop: "#322848",
      wallBase: "#1a1428",
      wallEdge: "#584880"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      // Narrow ground — barely any safe floor
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: 200, height: 110, type: "forest-floor" },
      // ── Ascending gauntlet — zig-zag climb ──
      // Step 1 — right
      { x: 300, y: FOREST_FLOOR_Y - 60, width: 110, height: 18, type: "forest-step" },
      // Step 2 — far right
      { x: 580, y: FOREST_FLOOR_Y - 100, width: 120, height: 18, type: "forest-step" },
      // Step 3 — right wall ledge
      { x: 780, y: FOREST_FLOOR_Y - 160, width: 140, height: 18, type: "forest-step" },
      // Step 4 — back to center
      { x: 480, y: FOREST_FLOOR_Y - 210, width: 130, height: 18, type: "forest-step" },
      // Step 5 — left side
      { x: 200, y: FOREST_FLOOR_Y - 260, width: 120, height: 18, type: "forest-step" },
      // Step 6 — center high
      { x: 400, y: FOREST_FLOOR_Y - 320, width: 140, height: 18, type: "forest-step" },
      // Step 7 — right high
      { x: 650, y: FOREST_FLOOR_Y - 370, width: 110, height: 18, type: "forest-step" },
      // ── The Peak — final platform ──
      { x: 340, y: FOREST_FLOOR_Y - 420, width: 280, height: 20, type: "forest-step" },
      // Right ground island for enemies
      { x: 600, y: FOREST_FLOOR_Y, width: 360, height: 110, type: "forest-floor" },
    ],
    walls: [],
    transitions: [
      // left edge → back to zone 6
      {
        x: FOREST_LEFT,
        y: 0,
        width: 24,
        height: FOREST_FLOOR_Y,
        targetZone: 6,
        spawnX: FOREST_RIGHT - 120,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  }
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
  y: FLOOR_Y - PLAYER_HEIGHT,
  forestZone: 0
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

const nightborne = {
  x: NB_SPAWN_X,
  direction: -1,
  state: "idle",
  stateTime: 0,
  maxHealth: NB_MAX_HEALTH,
  health: NB_MAX_HEALTH,
  attackCooldown: 0,
  attackHitDone: false,
  hurtTime: 0,
  invulnerableTime: 0,
  dead: false,
  active: false
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
  coyoteTimer: 0,
  jumpBufferTimer: 0,
  jumpHeld: false,
  facing: 1,
  won: false,
  maxHealth: PLAYER_MAX_HEALTH,
  health: PLAYER_MAX_HEALTH,
  attackTime: 0,
  attackCooldown: 0,
  attackHitDone: false,
  attackCycleIndex: 0,
  currentAttackIndex: 0,
  specialTime: 0,
  specialCooldown: 0,
  specialHitDone: false,
  lightningStabTime: 0,
  lightningStabCooldown: 0,
  lightningBoltSpawned: false,
  lightningDamageTick: 0,
  lightningChanneling: false,
  jumpAttackTime: 0,
  jumpAttackCooldown: 0,
  jumpAttackHitDone: false,
  jumpAttackQueued: false,
  dashTime: 0,
  dashCooldown: 0,
  dashHitDone: false,
  airDashAvailable: true,
  wallContact: 0,
  wallJumpLockTime: 0,
  blocking: false,
  hurtTime: 0,
  invulnerableTime: 0,
  dead: false,
  deathTimer: 0
};

const input = {
  left: false,
  right: false,
  down: false,
  attackHeld: false,
  jumpHeld: false,
  lightningHeld: false
};

const customCharacterAsset = createOptionalAssetPaths(
  ["assets/characters/custom/player", "assets/characters/player"],
  false
);
const destinyIdleAsset = createExactAsset("assets/characters/destiny/idle_strip.png");
const destinyCharacter = {
  id: "destiny",
  label: "Destiny",
  states: {
    idle: destinyIdleAsset,
    run: destinyIdleAsset,
    jump: destinyIdleAsset,
    attack: [destinyIdleAsset, destinyIdleAsset, destinyIdleAsset],
    special: destinyIdleAsset,
    jumpAttack: destinyIdleAsset,
    dash: destinyIdleAsset,
    block: destinyIdleAsset,
    hurt: destinyIdleAsset,
    dead: destinyIdleAsset
  }
};
const characters = {
  fighter: createCharacterSet("fighter", "Fighter", "assets/characters/fighter"),
  samurai: createCharacterSet("samurai", "Samurai", "assets/characters/samurai"),
  shinobi: createCharacterSet("shinobi", "Shinobi", "assets/characters/shinobi"),
  destiny: destinyCharacter,
  custom: {
    id: "custom",
    label: "Custom",
    states: {
      idle: customCharacterAsset,
      run: customCharacterAsset,
      jump: customCharacterAsset,
      attack: [customCharacterAsset],
      special: customCharacterAsset,
      jumpAttack: customCharacterAsset,
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
  forestThemes: {
    firstCp: {
      bg: createExactAsset("assets/textures/first levels/firstcp.png")
    },
    artForest: {
      depth: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0010_1.png"),
      far: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0009_2.png"),
      mid: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0008_3.png"),
      near: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0006_4.png"),
      canopy: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0005_5.png"),
      lights: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0007_Lights.png"),
      tiles: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0003_6.png", true)
    },
    darkTemple: {
      bg: createExactAsset("assets/textures/TmFFA7.jpg")
    },
    crimsonCavern: {
      bg: createExactAsset("assets/textures/UFACsd.jpg")
    },
    ruinedCitadel: {
      bg: createExactAsset("assets/textures/first levels/blead.png")
    },
    bossRoom: {
      bg: createExactAsset("assets/textures/first levels/bossroom.png")
    },
  },
  nightborne: {
    sheet: createExactAsset("assets/characters/Enemis/NightBorne/NightBorne.png")
  },
  mobs: {
    mushroomIdle:   createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Mushroom/Idle.png"),
    mushroomRun:    createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Mushroom/Run.png"),
    mushroomAttack: createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Mushroom/Attack.png"),
    mushroomHurt:   createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Mushroom/Take Hit.png"),
    mushroomDead:   createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Mushroom/Death.png"),
    skeletonIdle:   createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Skeleton/Idle.png"),
    skeletonWalk:   createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Skeleton/Walk.png"),
    skeletonAttack: createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Skeleton/Attack.png"),
    skeletonHurt:   createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Skeleton/Take Hit.png"),
    skeletonDead:   createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Skeleton/Death.png"),
    goblinIdle:     createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Goblin/Idle.png"),
    goblinRun:      createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Goblin/Run.png"),
    goblinAttack:   createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Goblin/Attack.png"),
    goblinHurt:     createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Goblin/Take Hit.png"),
    goblinDead:     createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Goblin/Death.png"),
    eyeFlight:      createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Flying eye/Flight.png"),
    eyeAttack:      createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Flying eye/Attack.png"),
    eyeHurt:        createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Flying eye/Take Hit.png"),
    eyeDead:        createExactAsset("assets/characters/Enemis/zone1-3/Monsters_Creatures_Fantasy/Monsters_Creatures_Fantasy/Flying eye/Death.png"),
  },
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
let cameraLookAhead = 0;
let animationClock = 0;
let gameInputActive = false;
let pauseMenuOpen = false;
let currentScene = "tower";
let forestRouteIndex = 0;
let towerProgressY = player.spawnY;
const GAME_CONTROL_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "KeyA",
  "KeyD",
  "KeyS",
  "KeyW",
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
  forestUnlocked: false,
  nightborneDefeated: false
};
const teleportTransition = {
  active: false,
  teleporterId: null
};
const specialProjectiles = [];
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
  const specialStateAsset =
    id === "samurai"
      ? createOptionalAssetPaths(
          [
            `${basePath}/specialMove/attack_animation (1)`,
            `${basePath}/specialMove/attack_animation`,
            `${basePath}/specialMove/attack`,
            `${basePath}/Attack_3`
          ],
          false
        )
      : createOptionalAssetPaths([`${basePath}/special`, `${basePath}/Attack_3`], false);
  const jumpAttackStateAsset =
    id === "samurai"
      ? createOptionalAssetPaths(
          [
            `${basePath}/specialMove/jump_attack`,
            `${basePath}/specialMove/jumpAttack`,
            `${basePath}/Attack_3`
          ],
          false
        )
      : createOptionalAssetPaths([`${basePath}/jumpAttack`, `${basePath}/Attack_3`], false);

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
      special: specialStateAsset,
      jumpAttack: jumpAttackStateAsset,
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

function updateFullscreenButtonLabel() {
  if (!fullscreenButton) {
    return;
  }

  fullscreenButton.textContent = document.fullscreenElement ? "Exit Fullscreen" : "Enter Fullscreen";
}

function setPauseMenuOpen(open) {
  pauseMenuOpen = open;

  if (pauseMenu) {
    pauseMenu.hidden = !open;
    pauseMenu.setAttribute("aria-hidden", String(!open));
  }

  if (open) {
    clearInputState();
    gameInputActive = false;
    characterSelect?.focus({ preventScroll: true });
    return;
  }

  activateGameInput();
}

function togglePauseMenu() {
  setPauseMenuOpen(!pauseMenuOpen);
}

async function toggleFullscreenMode() {
  try {
    if (document.fullscreenElement) {
      if (navigator.keyboard && navigator.keyboard.unlock) {
        navigator.keyboard.unlock();
      }
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      if (navigator.keyboard && navigator.keyboard.lock) {
        await navigator.keyboard.lock(["Escape"]);
      }
    }
  } catch {}

  updateFullscreenButtonLabel();
}

function setupPauseMenu() {
  if (!pauseMenu) {
    return;
  }

  resumeButton?.addEventListener("click", () => {
    setPauseMenuOpen(false);
  });

  restartButton?.addEventListener("click", () => {
    resetPlayer();
    setPauseMenuOpen(false);
  });

  fullscreenButton?.addEventListener("click", () => {
    void toggleFullscreenMode();
  });

  document.addEventListener("fullscreenchange", updateFullscreenButtonLabel);
  setPauseMenuOpen(false);
  updateFullscreenButtonLabel();
}

// ── Fullscreen menu (ESC dropdown in fullscreen) ──
function setFsMenuOpen(open) {
  fsMenuOpen = open;
  if (fsMenu) {
    fsMenu.hidden = !open;
  }
  if (open) {
    clearInputState();
    gameInputActive = false;
  } else {
    activateGameInput();
  }
}

function setupFullscreenMenu() {
  // Header fullscreen button
  fullscreenBtn?.addEventListener("click", async () => {
    try {
      await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      if (navigator.keyboard && navigator.keyboard.lock) {
        await navigator.keyboard.lock(["Escape"]);
      }
    } catch {}
    setTimeout(() => canvas.focus(), 100);
  });

  // Resume button in fullscreen menu
  fsResumeBtn?.addEventListener("click", () => {
    setFsMenuOpen(false);
  });

  // Restart button in fullscreen menu
  fsRestartBtn?.addEventListener("click", () => {
    resetPlayer();
    setFsMenuOpen(false);
  });

  // Exit fullscreen button in menu
  fsExitFsBtn?.addEventListener("click", async () => {
    setFsMenuOpen(false);
    try {
      if (navigator.keyboard && navigator.keyboard.unlock) {
        navigator.keyboard.unlock();
      }
      await document.exitFullscreen();
    } catch {}
  });

  // When exiting fullscreen, close the menu
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && fsMenuOpen) {
      setFsMenuOpen(false);
    }
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

  if (isPlayerJumpAttacking()) {
    return "jumpAttack";
  }

  if (isLightningStabActive()) {
    return "lightningStab";
  }

  if (isPlayerSpecialAttacking()) {
    return "special";
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

  if (Math.abs(player.vx) > 35) {
    return "run";
  }

  return "idle";
}

function getActiveCharacterAsset(state) {
  const activeCharacter = getActiveCharacter();
  const requested =
    state === "attack"
      ? resolveAssetVariant(activeCharacter.states.attack, player.currentAttackIndex)
      : state === "lightningStab"
        ? resolveAssetVariant(activeCharacter.states.attack, 2)
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

  if (state === "lightningStab") {
    // Always use Attack_3 (index 2) for lightning stab
    const attack3 = resolveAssetVariant(activeCharacter.states.attack, 2);
    if (attack3 && attack3.loaded) return attack3;
    const fallback = resolveAssetVariant(activeCharacter.states.attack, 0);
    if (fallback && fallback.loaded) return fallback;
  }

  if (state === "special") {
    const specialFallback = activeCharacter.states.special || resolveAssetVariant(activeCharacter.states.attack, 2);
    if (specialFallback && specialFallback.loaded) {
      return specialFallback;
    }

    const firstAttackAsset = resolveAssetVariant(activeCharacter.states.attack, 0);
    if (firstAttackAsset && firstAttackAsset.loaded) {
      return firstAttackAsset;
    }
  }

  if (state === "jumpAttack") {
    const jumpAttackFallback =
      activeCharacter.states.jumpAttack ||
      activeCharacter.states.special ||
      resolveAssetVariant(activeCharacter.states.attack, 2);
    if (jumpAttackFallback && jumpAttackFallback.loaded) {
      return jumpAttackFallback;
    }

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
  if (asset._frameCount) return asset._frameCount;

  return Math.max(1, Math.round(asset.image.naturalWidth / asset.image.naturalHeight));
}

function getSpriteRenderableDimensions(sprite) {
  return {
    width: sprite.naturalWidth || sprite.width || 1,
    height: sprite.naturalHeight || sprite.height || 1
  };
}

function buildSamuraiEffectSprite(asset) {
  if (!asset || !asset.loaded) {
    return null;
  }

  if (asset.samuraiEffectSprite) {
    return asset.samuraiEffectSprite;
  }

  const source = asset.image;
  const { width, height } = getSpriteRenderableDimensions(source);
  const canvasBuffer = document.createElement("canvas");
  canvasBuffer.width = width;
  canvasBuffer.height = height;
  const bufferContext = canvasBuffer.getContext("2d", { willReadFrequently: true });

  if (!bufferContext) {
    return source;
  }

  bufferContext.drawImage(source, 0, 0, width, height);
  const imageData = bufferContext.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const alpha = pixels[index + 3];
    const maxChannel = Math.max(red, green, blue);

    if (maxChannel < 22) {
      pixels[index + 3] = 0;
      continue;
    }

    if (maxChannel < 74) {
      const fade = (maxChannel - 22) / 52;
      pixels[index + 3] = Math.min(alpha, Math.round(alpha * fade));
    }

    if (blue > red + 8 && blue > green + 8) {
      pixels[index] = Math.min(255, Math.round(red * 0.9));
      pixels[index + 1] = Math.min(255, Math.round(green * 1.1));
      pixels[index + 2] = Math.min(255, Math.round(blue * 1.42));
    }
  }

  bufferContext.putImageData(imageData, 0, 0);
  asset.samuraiEffectSprite = canvasBuffer;
  return asset.samuraiEffectSprite;
}

function getSpriteRenderSource(asset, spriteState) {
  const activeCharacter = getActiveCharacter();
  const isSamuraiEffectState =
    activeCharacter.id === "samurai" &&
    (spriteState === "special" || spriteState === "jumpAttack");

  if (isSamuraiEffectState) {
    return buildSamuraiEffectSprite(asset) || asset.image;
  }

  return asset.image;
}

function isPlayerBlocking() {
  return player.blocking && !player.dead && player.hurtTime <= 0;
}

function canUseDash() {
  return true;
}

function isPlayerDashing() {
  return canUseDash() && player.dashTime > 0 && !player.dead && player.hurtTime <= 0;
}

function isPlayerAttacking() {
  return player.attackTime > 0 && !player.dead;
}

function isPlayerSpecialAttacking() {
  return player.specialTime > 0 && !player.dead;
}

function isPlayerJumpAttacking() {
  return player.jumpAttackTime > 0 && !player.dead;
}

function getSpecialProgress() {
  if (!isPlayerSpecialAttacking() || PLAYER_SPECIAL_DURATION <= 0) {
    return 1;
  }

  return clamp(1 - player.specialTime / PLAYER_SPECIAL_DURATION, 0, 1);
}

function getJumpAttackProgress() {
  if (!isPlayerJumpAttacking() || PLAYER_JUMP_ATTACK_DURATION <= 0) {
    return 1;
  }

  return clamp(1 - player.jumpAttackTime / PLAYER_JUMP_ATTACK_DURATION, 0, 1);
}

function getAttackProgress() {
  if (!isPlayerAttacking() || PLAYER_ATTACK_DURATION <= 0) {
    return 1;
  }

  return clamp(1 - player.attackTime / PLAYER_ATTACK_DURATION, 0, 1);
}

function canCancelAttack() {
  return isPlayerAttacking() && getAttackProgress() >= PLAYER_ATTACK_CANCEL_PROGRESS;
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

function clearSpecialProjectiles() {
  specialProjectiles.length = 0;
}

function spawnSamuraiSpecialProjectile() {
  specialProjectiles.push({
    scene: currentScene,
    x: getPlayerCenterX() + player.facing * 34,
    y: player.y + player.height * 0.45,
    direction: player.facing,
    speed: PLAYER_SPECIAL_PROJECTILE_SPEED,
    lifetime: PLAYER_SPECIAL_PROJECTILE_LIFETIME,
    age: 0,
    hitDone: false
  });
}

function updateSpecialProjectiles(deltaTime) {
  for (let index = specialProjectiles.length - 1; index >= 0; index -= 1) {
    const projectile = specialProjectiles[index];

    if (projectile.scene !== currentScene) {
      specialProjectiles.splice(index, 1);
      continue;
    }

    projectile.age += deltaTime;
    projectile.x += projectile.direction * projectile.speed * deltaTime;

    if (
      !projectile.hitDone &&
      isBossEncounterActive() &&
      !boss.dead &&
      Math.abs(getBossCenterX() - projectile.x) <= PLAYER_SPECIAL_RANGE * 0.52 &&
      Math.abs(player.y - (ARENA_FLOOR_Y - player.height)) < PLAYER_SPECIAL_VERTICAL_RANGE
    ) {
      damageBoss(PLAYER_SPECIAL_DAMAGE);
      projectile.hitDone = true;
      projectile.age = projectile.lifetime;
    }

    // Special projectile hits Nightborne
    if (
      !projectile.hitDone &&
      isNightborneZone() &&
      nightborne.active && !nightborne.dead &&
      Math.abs(nightborne.x - projectile.x) <= PLAYER_SPECIAL_RANGE * 0.52
    ) {
      damageNightborne(PLAYER_SPECIAL_DAMAGE);
      projectile.hitDone = true;
      projectile.age = projectile.lifetime;
    }

    // Special projectile hits zone mobs
    if (!projectile.hitDone && checkMobProjectileHit(projectile.x, PLAYER_SPECIAL_DAMAGE)) {
      projectile.hitDone = true;
      projectile.age = projectile.lifetime;
    }

    if (projectile.age >= projectile.lifetime || projectile.x < -160 || projectile.x > WORLD_WIDTH + 160) {
      specialProjectiles.splice(index, 1);
    }
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function moveToward(value, target, maxDelta) {
  if (value < target) {
    return Math.min(value + maxDelta, target);
  }

  if (value > target) {
    return Math.max(value - maxDelta, target);
  }

  return target;
}

function blendFactor(rate, deltaTime) {
  return 1 - Math.pow(1 - rate, deltaTime * 60);
}

function getTargetCameraY() {
  if (!isTowerScene()) {
    return 0;
  }

  const baseTarget = player.y - VIEW_HEIGHT * 0.56;
  return clamp(baseTarget + cameraLookAhead, 0, WORLD_HEIGHT - VIEW_HEIGHT);
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

function getForestRouteIndex() {
  return clamp(forestRouteIndex, 0, forestRouteZones.length - 1);
}

function getForestZone() {
  return forestRouteZones[getForestRouteIndex()] || forestRouteZones[0];
}

function isBonfireZone() {
  const idx = getForestRouteIndex();
  return idx === 0 || idx === 3;
}

function getForestZonePalette() {
  const zone = getForestZone();
  if (zone?.palette) {
    return {
      ...FOREST_ZONE_DEFAULT_PALETTE,
      ...zone.palette
    };
  }

  const themeId = getForestThemeId();

  if (themeId === "art-forest") {
    return {
      ...FOREST_ZONE_DEFAULT_PALETTE,
      floorBase: "#21392c",
      floorTop: "#568264",
      stepBase: "#2b4535",
      stepTop: "#6ea17a",
      pathBase: "#2f4132",
      pathTop: "#628f70",
      wallBase: "#253d2f",
      wallEdge: "#6ea780"
    };
  }

  if (themeId === "first-cp") {
    return {
      ...FOREST_ZONE_DEFAULT_PALETTE,
      floorBase: "#21392c",
      floorTop: "#568264",
      stepBase: "#2b4535",
      stepTop: "#6ea17a",
      pathBase: "#2f4132",
      pathTop: "#628f70",
      wallBase: "#253d2f",
      wallEdge: "#6ea780"
    };
  }

  return FOREST_ZONE_DEFAULT_PALETTE;
}

function getForestThemeId() {
  return getForestZone()?.theme || "art-forest";
}

function getForestThemePatternAssets() {
  return {
    floor: null,
    step: null,
    wall: null,
    path: null
  };
}

function getForestPatternAlpha(themeId, surfaceType) {
  return surfaceType === "floor" ? 0.34 : 0;
}


function getForestDecorationAsset(assetId) {
  return null;
}

function getForestFloorY() {
  const zone = getForestZone();
  return typeof zone.floorY === "number" ? zone.floorY : FOREST_FLOOR_Y;
}

function setForestRoute(index) {
  forestRouteIndex = clamp(index, 0, forestRouteZones.length - 1);
  forestBonfire.floorY = getForestFloorY();
  // Update bonfire position per zone
  if (forestRouteIndex === 0) {
    forestBonfire.x = FOREST_BONFIRE_X;
    forestBonfire.floorY = FOREST_FLOOR_Y;
  } else if (forestRouteIndex === 3) {
    forestBonfire.x = 480;
    forestBonfire.floorY = FOREST_FLOOR_Y - 85;
  }
  forestBonfire.playerNearby = false;
  forestBonfire.healFlashTime = 0;

  // Reset Nightborne when entering zone 4
  if (forestRouteIndex === 4) {
    resetNightborne();
  }

  // Reset zone mobs
  resetZoneMobs();
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

function getForestRoutePlatforms() {
  const zone = getForestZone();
  if (Array.isArray(zone?.platforms) && zone.platforms.length > 0) {
    return zone.platforms;
  }

  const floorY = getForestFloorY();
  return [{ x: FOREST_LEFT - 32, y: floorY, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" }];
}

function getForestRouteTransitions() {
  const zone = getForestZone();
  if (Array.isArray(zone?.transitions) && zone.transitions.length > 0) {
    return zone.transitions;
  }

  const index = getForestRouteIndex();
  const floorY = getForestFloorY();
  const transitions = [];

  if (index > 0) {
    transitions.push({
      x: FOREST_LEFT,
      y: floorY - 132,
      width: 24,
      height: 132,
      targetZone: index - 1,
      spawnX: FOREST_RIGHT - 86,
      spawnY: floorY - player.height
    });
  }

  if (index < forestRouteZones.length - 1) {
    transitions.push({
      x: FOREST_RIGHT - 24,
      y: floorY - 132,
      width: 24,
      height: 132,
      targetZone: index + 1,
      spawnX: FOREST_LEFT + 52,
      spawnY: floorY - player.height
    });
  }

  return transitions;
}

function getScenePlatforms() {
  if (isArenaScene()) {
    return arenaPlatforms;
  }

  if (isForestScene()) {
    return getForestRoutePlatforms();
  }

  return platforms.filter((platform) => isPlatformActive(platform));
}

function getSceneWalls() {
  if (!isForestScene()) {
    return [];
  }

  const zone = getForestZone();
  if (!Array.isArray(zone?.walls)) {
    return [];
  }
  // In boss room, remove right wall once Nightborne is dead so player can exit right
  if (getForestRouteIndex() === 4 && nightborne.dead) {
    return zone.walls.filter(w => w.x < FOREST_RIGHT);
  }
  return zone.walls;
}

function getSceneHorizontalBounds() {
  if (isArenaScene()) {
    return {
      minX: ARENA_LEFT + 8,
      maxX: ARENA_RIGHT - player.width - 8
    };
  }

  if (isForestScene()) {
    return {
      minX: FOREST_LEFT + 8,
      maxX: FOREST_RIGHT - player.width - 8
    };
  }

  return {
    minX: TOWER_LEFT + 8,
    maxX: TOWER_RIGHT - player.width - 8
  };
}

function refreshWallContact() {
  if (player.grounded || isTeleporting() || player.dead) {
    player.wallContact = 0;
    return;
  }

  const { minX, maxX } = getSceneHorizontalBounds();
  const leftContact = player.x <= minX + 0.5;
  const rightContact = player.x >= maxX - 0.5;
  let wallContact = leftContact ? -1 : rightContact ? 1 : 0;
  const playerTop = player.y + 4;
  const playerBottom = player.y + player.height - 4;

  for (const wall of getSceneWalls()) {
    const overlapsY = playerBottom > wall.y && playerTop < wall.y + wall.height;
    if (!overlapsY) {
      continue;
    }

    if (Math.abs(player.x - (wall.x + wall.width)) <= 1) {
      wallContact = -1;
    }

    if (Math.abs(player.x + player.width - wall.x) <= 1) {
      wallContact = 1;
    }
  }

  player.wallContact = wallContact;

  if (player.wallContact !== 0 && player.vy > WALL_SLIDE_SPEED) {
    player.vy = WALL_SLIDE_SPEED;
  }
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

// ── Nightborne Boss ──
function isNightborneZone() {
  return isForestScene() && getForestRouteIndex() === 4;
}

function resetNightborne() {
  nightborne.x = NB_SPAWN_X;
  nightborne.direction = -1;
  nightborne.state = "idle";
  nightborne.stateTime = 0;
  nightborne.health = nightborne.maxHealth;
  nightborne.attackCooldown = 0;
  nightborne.attackHitDone = false;
  nightborne.hurtTime = 0;
  nightborne.invulnerableTime = 0;
  nightborne.dead = false;
  nightborne.active = false;
}

function activateNightborne() {
  if (!nightborne.active && !nightborne.dead) {
    nightborne.active = true;
    nightborne.state = "idle";
    nightborne.stateTime = 0;
  }
}

function damageNightborne(amount) {
  if (nightborne.dead || nightborne.invulnerableTime > 0) return;

  nightborne.health = clamp(nightborne.health - amount, 0, nightborne.maxHealth);
  nightborne.invulnerableTime = NB_IFRAME_DURATION;
  nightborne.hurtTime = HURT_DURATION;
  nightborne.state = nightborne.health <= 0 ? "dead" : "hurt";
  nightborne.stateTime = 0;
  nightborne.attackHitDone = true;

  if (nightborne.health <= 0) {
    nightborne.dead = true;
    encounter.nightborneDefeated = true;
  }
}

function updateNightborne(deltaTime) {
  if (!isNightborneZone() || player.dead || !nightborne.active) return;

  if (nightborne.invulnerableTime > 0) {
    nightborne.invulnerableTime = Math.max(0, nightborne.invulnerableTime - deltaTime);
  }
  if (nightborne.hurtTime > 0) {
    nightborne.hurtTime = Math.max(0, nightborne.hurtTime - deltaTime);
  }
  if (nightborne.attackCooldown > 0) {
    nightborne.attackCooldown = Math.max(0, nightborne.attackCooldown - deltaTime);
  }

  if (nightborne.dead) {
    nightborne.state = "dead";
    nightborne.stateTime += deltaTime;
    return;
  }

  nightborne.stateTime += deltaTime;

  if (nightborne.hurtTime > 0) {
    nightborne.state = "hurt";
    return;
  }

  const playerCenter = getPlayerCenterX();
  const distanceToPlayer = playerCenter - nightborne.x;
  const absDistance = Math.abs(distanceToPlayer);
  const nearPlayer = absDistance < NB_ATTACK_RANGE && player.y < NB_FLOOR_Y + 40;

  if (nightborne.state === "attack") {
    if (nightborne.stateTime >= 0.18 && nightborne.stateTime <= 0.40) {
      const dir = distanceToPlayer < 0 ? -1 : 1;
      nightborne.direction = dir;
      nightborne.x += dir * NB_LUNGE_SPEED * deltaTime;
    }
    if (!nightborne.attackHitDone && nightborne.stateTime >= 0.28 && nearPlayer) {
      if (isPlayerDashing()) {
        nightborne.attackHitDone = true;
      } else {
        damagePlayer(NB_ATTACK_DAMAGE);
        nightborne.attackHitDone = true;
      }
    }
    if (nightborne.stateTime > NB_ATTACK_DURATION) {
      nightborne.state = "run";
      nightborne.stateTime = 0;
    }
    return;
  }

  if (nearPlayer && nightborne.attackCooldown <= 0) {
    nightborne.state = "attack";
    nightborne.stateTime = 0;
    nightborne.attackHitDone = false;
    nightborne.attackCooldown = NB_ATTACK_COOLDOWN;
    return;
  }

  nightborne.state = "run";
  if (absDistance > NB_PERSONAL_SPACE) {
    nightborne.direction = distanceToPlayer < 0 ? -1 : 1;
  } else if (nightborne.attackCooldown > 0.2) {
    nightborne.direction = distanceToPlayer < 0 ? 1 : -1;
  }

  const runSpeed =
    absDistance > NB_PURSUIT_DISTANCE ? NB_BASE_SPEED * 1.2
    : absDistance > NB_PERSONAL_SPACE ? NB_BASE_SPEED
    : NB_BASE_SPEED * 0.6;
  nightborne.x += nightborne.direction * runSpeed * deltaTime;
  nightborne.x = clamp(nightborne.x, NB_MIN_X, NB_MAX_X);
}

function drawNightborne() {
  if (!isNightborneZone() || !nightborne.active) return;

  const sheet = assets.nightborne?.sheet;
  if (!sheet || !sheet.loaded) return;

  const state = nightborne.state;
  const row = NB_ROWS[state] ?? NB_ROWS.idle;
  const maxFrames = NB_FRAME_COUNTS[state] ?? 9;

  let frameIndex = 0;
  if (state === "idle") {
    frameIndex = Math.floor(animationClock * 6) % maxFrames;
  } else if (state === "run") {
    frameIndex = Math.floor(animationClock * 10) % maxFrames;
  } else if (state === "attack") {
    frameIndex = Math.min(maxFrames - 1, Math.floor(nightborne.stateTime * 15));
  } else if (state === "hurt") {
    frameIndex = Math.min(maxFrames - 1, Math.floor(nightborne.stateTime * 10));
  } else if (state === "dead") {
    frameIndex = Math.min(maxFrames - 1, Math.floor(nightborne.stateTime * 8));
  }

  const sx = frameIndex * NB_FRAME_SIZE;
  const sy = row * NB_FRAME_SIZE;
  const drawX = Math.round(nightborne.x);
  const drawY = Math.round(NB_FLOOR_Y - cameraY);

  context.save();
  context.translate(drawX, drawY);
  context.scale(nightborne.direction < 0 ? -1 : 1, 1);

  // Shadow
  context.fillStyle = "rgba(0, 0, 0, 0.35)";
  context.beginPath();
  context.ellipse(0, 10, 50, 12, 0, 0, Math.PI * 2);
  context.fill();

  // Invulnerability flash
  if (nightborne.invulnerableTime > 0 && Math.floor(nightborne.invulnerableTime * 20) % 2) {
    context.globalAlpha = 0.4;
  }

  context.drawImage(
    sheet.image,
    sx, sy, NB_FRAME_SIZE, NB_FRAME_SIZE,
    -NB_DRAW_SIZE / 2, -NB_DRAW_SIZE + 14,
    NB_DRAW_SIZE, NB_DRAW_SIZE
  );

  context.restore();

  // Health bar
  if (!nightborne.dead) {
    drawHealthBar(drawX - 50, drawY - NB_DRAW_SIZE + 2, 100, 6, nightborne.health, nightborne.maxHealth, "#8b3fbf");
  }
}

// ── Zone Mobs ──
let zoneMobs = [];
const zoneMobCache = {}; // persists mob state per zone

function createMob(spawn) {
  const typeDef = MOB_TYPES[spawn.type];
  return {
    type: spawn.type,
    typeDef,
    x: spawn.x,
    floorY: spawn.floorY,
    patrolMin: spawn.patrolMin,
    patrolMax: spawn.patrolMax,
    direction: Math.random() < 0.5 ? -1 : 1,
    state: "idle",
    stateTime: 0,
    health: typeDef.health,
    attackCooldown: 0,
    attackHitDone: false,
    invulnerableTime: 0,
    hurtTime: 0,
    dead: false,
    idleTimer: 1 + Math.random() * 2
  };
}

function resetZoneMobs() {
  const zoneIndex = getForestRouteIndex();
  const spawns = ZONE_MOB_SPAWNS[zoneIndex];
  if (!spawns) { zoneMobs = []; return; }

  // First visit: create mobs. Revisit: restore saved state.
  if (!zoneMobCache[zoneIndex]) {
    zoneMobCache[zoneIndex] = spawns.map(s => createMob(s));
  }
  zoneMobs = zoneMobCache[zoneIndex];
}

function damagePlayerFromMob(amount, attackerX) {
  if (player.dead || player.invulnerableTime > 0) return;
  if (isPlayerDashing()) return;

  const attackerOnRight = attackerX > getPlayerCenterX();
  const playerFacing = (attackerOnRight && player.facing === 1) || (!attackerOnRight && player.facing === -1);
  if (isPlayerBlocking() && playerFacing) {
    player.invulnerableTime = 0.18;
    return;
  }

  player.health = clamp(player.health - amount, 0, player.maxHealth);
  player.hurtTime = HURT_DURATION;
  player.invulnerableTime = PLAYER_IFRAME_DURATION;
  player.blocking = false;
  player.dashTime = 0;
  player.attackTime = 0;
  player.specialTime = 0;
  player.jumpAttackTime = 0;
  player.jumpAttackQueued = false;
  if (player.lightningChanneling) {
    player.lightningChanneling = false;
    player.lightningStabCooldown = LIGHTNING_STAB_COOLDOWN;
    for (const bolt of lightningBolts) { bolt.releasing = true; bolt.fadeTime = 0; }
  }
  player.jumpAttackHitDone = true;
  player.specialHitDone = true;
  player.attackHitDone = true;
  player.vx = attackerOnRight ? -130 : 130;

  if (player.health <= 0) {
    player.dead = true;
    player.deathTimer = 1.1;
    player.vx = 0;
    player.vy = 0;
    clearInputState();
  }
}

function damageMob(mob, amount) {
  if (mob.dead || mob.invulnerableTime > 0) return;
  mob.health = Math.max(0, mob.health - amount);
  mob.invulnerableTime = mob.typeDef.iframeDuration;
  mob.hurtTime = HURT_DURATION;
  mob.state = mob.health <= 0 ? "dead" : "hurt";
  mob.stateTime = 0;
  mob.attackHitDone = true;
  if (mob.health <= 0) mob.dead = true;
}

function getMobCenterX(mob) { return mob.x; }
function getMobFloorY(mob) { return mob.floorY; }

function updateMobs(deltaTime) {
  if (!isForestScene() || player.dead) return;
  const zoneIndex = getForestRouteIndex();
  if (!ZONE_MOB_SPAWNS[zoneIndex]) return;

  for (const mob of zoneMobs) {
    if (mob.invulnerableTime > 0) mob.invulnerableTime = Math.max(0, mob.invulnerableTime - deltaTime);
    if (mob.hurtTime > 0) mob.hurtTime = Math.max(0, mob.hurtTime - deltaTime);
    if (mob.attackCooldown > 0) mob.attackCooldown = Math.max(0, mob.attackCooldown - deltaTime);

    if (mob.dead) {
      mob.stateTime += deltaTime;
      continue;
    }

    mob.stateTime += deltaTime;

    if (mob.hurtTime > 0) { mob.state = "hurt"; continue; }

    const td = mob.typeDef;
    const pcx = getPlayerCenterX();
    const pcy = player.y + player.height;
    const dist = Math.abs(pcx - mob.x);
    const vertDist = Math.abs(pcy - mob.floorY);
    const nearPlayer = dist < td.attackRange && vertDist < 80;
    const canSee = dist < td.chaseRange && vertDist < 120;

    // Attack state
    if (mob.state === "attack") {
      if (!mob.attackHitDone && mob.stateTime >= td.attackDuration * 0.45 && nearPlayer) {
        if (!isPlayerDashing()) {
          damagePlayerFromMob(td.damage, mob.x);
        }
        mob.attackHitDone = true;
      }
      if (mob.stateTime >= td.attackDuration) {
        mob.state = "idle";
        mob.stateTime = 0;
        mob.idleTimer = 0.3 + Math.random() * 0.5;
      }
      continue;
    }

    // Start attack
    if (nearPlayer && mob.attackCooldown <= 0) {
      mob.state = "attack";
      mob.stateTime = 0;
      mob.attackHitDone = false;
      mob.attackCooldown = td.attackCooldown;
      mob.direction = pcx > mob.x ? 1 : -1;
      continue;
    }

    // Chase player
    if (canSee) {
      mob.state = "run";
      mob.direction = pcx > mob.x ? 1 : -1;
      mob.x += mob.direction * td.chaseSpeed * deltaTime;
      mob.x = clamp(mob.x, mob.patrolMin, mob.patrolMax);
      continue;
    }

    // Patrol / idle
    if (mob.idleTimer > 0) {
      mob.state = "idle";
      mob.idleTimer -= deltaTime;
      if (mob.idleTimer <= 0) {
        mob.direction = -mob.direction;
      }
      continue;
    }

    mob.state = "run";
    mob.x += mob.direction * td.speed * deltaTime;
    if (mob.x <= mob.patrolMin || mob.x >= mob.patrolMax) {
      mob.direction = -mob.direction;
      mob.x = clamp(mob.x, mob.patrolMin, mob.patrolMax);
      mob.state = "idle";
      mob.idleTimer = 1 + Math.random() * 2;
    }
  }
}

function drawMobs() {
  if (!isForestScene()) return;
  const zoneIndex = getForestRouteIndex();
  if (!ZONE_MOB_SPAWNS[zoneIndex]) return;

  for (const mob of zoneMobs) {
    const td = mob.typeDef;
    const anim = td.anims[mob.state] || td.anims.idle;
    const spriteAsset = assets.mobs[anim.key];
    if (!spriteAsset || !spriteAsset.loaded) continue;

    // Dead mobs: fade out after death animation completes
    const deathDone = mob.dead && mob.stateTime > anim.frames / anim.fps;
    if (deathDone && mob.stateTime > anim.frames / anim.fps + 1.5) continue; // fully gone

    let frameIndex;
    if (mob.state === "attack" || mob.state === "hurt" || mob.state === "dead") {
      frameIndex = Math.min(anim.frames - 1, Math.floor(mob.stateTime * anim.fps));
    } else {
      frameIndex = Math.floor(animationClock * anim.fps) % anim.frames;
    }

    const sx = frameIndex * MOB_FRAME_SIZE;
    const drawSize = td.drawSize;
    const drawX = Math.round(mob.x);
    const drawY = Math.round(mob.floorY - cameraY);

    context.save();
    context.translate(drawX, drawY);
    context.scale(mob.direction < 0 ? -1 : 1, 1);

    // Shadow
    context.fillStyle = "rgba(0,0,0,0.3)";
    context.beginPath();
    context.ellipse(0, 4, drawSize * 0.35, 7, 0, 0, Math.PI * 2);
    context.fill();

    // Invulnerability flash
    if (mob.invulnerableTime > 0 && Math.floor(mob.invulnerableTime * 20) % 2) {
      context.globalAlpha = 0.4;
    }
    // Fade out dead mobs
    if (deathDone) {
      const fadeProgress = (mob.stateTime - anim.frames / anim.fps) / 1.5;
      context.globalAlpha = Math.max(0, 1 - fadeProgress);
    }

    const footOffset = drawSize * (td.footRatio || 0.73);
    context.drawImage(
      spriteAsset.image,
      sx, 0, MOB_FRAME_SIZE, MOB_FRAME_SIZE,
      -drawSize / 2, -footOffset,
      drawSize, drawSize
    );
    context.restore();

    // Health bar (only if alive and damaged)
    if (!mob.dead && mob.health < td.health) {
      drawHealthBar(drawX - 30, drawY - footOffset + 2, 60, 5, mob.health, td.health, td.healthBarColor);
    }
  }
}

function checkMobHit(attackerX, attackerFacing, range, vertRange, damage) {
  if (!isForestScene()) return false;
  let hit = false;
  for (const mob of zoneMobs) {
    if (mob.dead || mob.invulnerableTime > 0) continue;
    const dist = Math.abs(mob.x - attackerX);
    const inRange = dist <= range;
    const correctSide = (attackerFacing === 1 && mob.x >= attackerX) || (attackerFacing === -1 && mob.x <= attackerX);
    const vertOk = Math.abs((player.y + player.height) - mob.floorY) < vertRange;
    if (inRange && correctSide && vertOk) {
      damageMob(mob, damage);
      hit = true;
      break; // one hit per attack swing
    }
  }
  return hit;
}

function checkMobProjectileHit(projectileX, damage) {
  if (!isForestScene()) return false;
  for (const mob of zoneMobs) {
    if (mob.dead || mob.invulnerableTime > 0) continue;
    if (Math.abs(mob.x - projectileX) <= PLAYER_SPECIAL_RANGE * 0.52) {
      damageMob(mob, damage);
      return true;
    }
  }
  return false;
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
    checkpoint.forestZone = getForestRouteIndex();
    checkpoint.x = clamp(forestBonfire.x + 42 - player.width / 2, FOREST_LEFT + 8, FOREST_RIGHT - player.width - 8);
    checkpoint.y = forestBonfire.floorY - player.height;
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

  if (!isForestScene() || player.dead || !isBonfireZone()) {
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
  clearSpecialProjectiles();
  movePlayerToScene(
    checkpoint.scene,
    checkpoint.x,
    checkpoint.y,
    checkpoint.scene === "forest" ? checkpoint.forestZone : null
  );
  player.facing = 1;
  player.won = false;
  player.health = player.maxHealth;
  player.attackTime = 0;
  player.attackCooldown = 0;
  player.attackHitDone = false;
  player.attackCycleIndex = 0;
  player.currentAttackIndex = 0;
  player.specialTime = 0;
  player.specialCooldown = 0;
  player.specialHitDone = false;
  player.lightningStabTime = 0;
  player.lightningStabCooldown = 0;
  player.lightningBoltSpawned = false;
  player.lightningDamageTick = 0;
  player.lightningChanneling = false;
  player.jumpAttackTime = 0;
  player.jumpAttackCooldown = 0;
  player.jumpAttackHitDone = false;
  player.jumpAttackQueued = false;
  player.dashTime = 0;
  player.dashCooldown = 0;
  player.dashHitDone = false;
  player.airDashAvailable = true;
  player.wallContact = 0;
  player.wallJumpLockTime = 0;
  player.blocking = false;
  player.hurtTime = 0;
  player.invulnerableTime = 0;
  player.dead = false;
  player.deathTimer = 0;
  clearInputState();
  player.coyoteTimer = COYOTE_TIME;
  player.jumpBufferTimer = 0;
  player.jumpHeld = false;
  player.airDashAvailable = true;

  if (checkpoint.scene === "forest") {
    encounter.bossStarted = true;
    encounter.bossDefeated = true;
    encounter.forestUnlocked = true;
    encounter.nightborneDefeated = true;
    forestBonfire.active = true;
    setTeleporterState(teleporters.entry, "hidden");
    setTeleporterState(teleporters.base, "active");
    setTeleporterState(teleporters.exit, "hidden");
  }
}

function movePlayerToScene(scene, x, y, forestZone = null) {
  const previousScene = currentScene;
  clearSpecialProjectiles();
  currentScene = scene;
  if (scene === "forest") {
    if (typeof forestZone === "number") {
      setForestRoute(forestZone);
    } else if (previousScene !== "forest") {
      setForestRoute(0);
    }
  }
  player.x = x;
  player.y = y;
  player.vx = 0;
  player.vy = 0;
  player.grounded = true;
  player.coyoteTimer = COYOTE_TIME;
  player.jumpBufferTimer = 0;
  player.jumpHeld = false;
  player.airDashAvailable = true;
  player.wallContact = 0;
  player.wallJumpLockTime = 0;
  player.attackTime = 0;
  player.specialTime = 0;
  player.specialCooldown = 0;
  player.attackHitDone = false;
  player.specialHitDone = false;
  player.jumpAttackTime = 0;
  player.jumpAttackCooldown = 0;
  player.jumpAttackHitDone = false;
  player.jumpAttackQueued = false;
  player.blocking = false;

  if (isTowerScene()) {
    cameraLookAhead = 0;
    cameraY = getTargetCameraY();
    towerProgressY = Math.min(towerProgressY, player.y);
  } else {
    cameraLookAhead = 0;
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
  clearSpecialProjectiles();
  player.vx = 0;
  player.vy = 0;
  player.attackTime = 0;
  player.specialTime = 0;
  player.specialHitDone = false;
  player.jumpAttackTime = 0;
  player.jumpAttackHitDone = false;
  player.jumpAttackQueued = false;
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
  clearSpecialProjectiles();
  currentScene = "tower";
  setForestRoute(0);
  towerProgressY = player.spawnY;
  encounter.bossStarted = false;
  encounter.bossDefeated = false;
  encounter.forestUnlocked = false;
  encounter.nightborneDefeated = false;
  checkpoint.active = false;
  checkpoint.scene = "tower";
  checkpoint.x = player.spawnX;
  checkpoint.y = player.spawnY;
  checkpoint.forestZone = 0;
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
  player.coyoteTimer = COYOTE_TIME;
  player.jumpBufferTimer = 0;
  player.jumpHeld = false;
  player.facing = 1;
  player.won = false;
  player.health = player.maxHealth;
  player.attackTime = 0;
  player.attackCooldown = 0;
  player.attackHitDone = false;
  player.attackCycleIndex = 0;
  player.currentAttackIndex = 0;
  player.specialTime = 0;
  player.specialCooldown = 0;
  player.specialHitDone = false;
  player.lightningStabTime = 0;
  player.lightningStabCooldown = 0;
  player.lightningBoltSpawned = false;
  player.lightningDamageTick = 0;
  player.lightningChanneling = false;
  player.jumpAttackTime = 0;
  player.jumpAttackCooldown = 0;
  player.jumpAttackHitDone = false;
  player.jumpAttackQueued = false;
  player.dashTime = 0;
  player.dashCooldown = 0;
  player.dashHitDone = false;
  player.airDashAvailable = true;
  player.wallContact = 0;
  player.wallJumpLockTime = 0;
  player.blocking = false;
  player.hurtTime = 0;
  player.invulnerableTime = 0;
  player.dead = false;
  player.deathTimer = 0;
  cameraLookAhead = 0;
  cameraY = clamp(FLOOR_Y - VIEW_HEIGHT, 0, WORLD_HEIGHT - VIEW_HEIGHT);

  if (DEV_SPAWN_AT_BONFIRE) {
    const bonfireSpawnX = clamp(
      forestBonfire.x + 42 - player.width / 2,
      FOREST_LEFT + 8,
      FOREST_RIGHT - player.width - 8
    );
    const bonfireSpawnY = forestBonfire.floorY - player.height;
    currentScene = "forest";
    encounter.bossStarted = true;
    encounter.bossDefeated = true;
    encounter.forestUnlocked = true;
    encounter.nightborneDefeated = true;
    checkpoint.active = true;
    checkpoint.scene = "forest";
    checkpoint.forestZone = 0;
    checkpoint.x = bonfireSpawnX;
    checkpoint.y = bonfireSpawnY;
    forestBonfire.active = true;
    player.x = bonfireSpawnX;
    player.y = bonfireSpawnY;
    cameraY = 0;
  }

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

function canStartJump() {
  const attackBlocksJump =
    (isPlayerAttacking() && !canCancelAttack()) ||
    isPlayerSpecialAttacking() ||
    isLightningStabActive() ||
    isPlayerJumpAttacking();
  return (
    !player.won &&
    !player.dead &&
    !isTeleporting() &&
    !attackBlocksJump &&
    !isPlayerBlocking() &&
    !isPlayerDashing() &&
    player.hurtTime <= 0
  );
}

function tryWallJump() {
  if (
    player.jumpBufferTimer <= 0 ||
    player.wallContact === 0 ||
    player.grounded ||
    !canStartJump()
  ) {
    return false;
  }

  const jumpDirection = -player.wallContact;
  player.facing = jumpDirection;
  player.vx = jumpDirection * WALL_JUMP_HORIZONTAL_SPEED;
  player.vy = -WALL_JUMP_VELOCITY;
  player.grounded = false;
  player.coyoteTimer = 0;
  player.jumpBufferTimer = 0;
  player.wallContact = 0;
  player.wallJumpLockTime = WALL_JUMP_INPUT_LOCK;
  return true;
}

function tryConsumeBufferedJump() {
  if (player.jumpBufferTimer <= 0 || !canStartJump()) {
    return false;
  }

  if (player.coyoteTimer > 0) {
    const aim = currentAim();
    if (aim !== 0) {
      player.facing = aim;
    }

    player.vy = -JUMP_VELOCITY;
    player.grounded = false;
    player.coyoteTimer = 0;
    player.jumpBufferTimer = 0;
    return true;
  }

  return tryWallJump();
}

function beginJump() {
  if (
    !canStartJump() ||
    player.jumpBufferTimer > 0
  ) {
    return;
  }

  player.jumpHeld = true;
  input.jumpHeld = true;
  player.jumpBufferTimer = JUMP_BUFFER_TIME;
  if (canCancelAttack()) {
    player.attackTime = 0;
    player.attackHitDone = true;
  }
  tryConsumeBufferedJump();
}

function endJump() {
  player.jumpHeld = false;
  input.jumpHeld = false;

  if (player.vy < 0) {
    player.vy *= JUMP_CUT_MULTIPLIER;
  }
}

function clearInputState() {
  input.left = false;
  input.right = false;
  input.down = false;
  input.attackHeld = false;
  input.jumpHeld = false;
  input.lightningHeld = false;
  player.jumpHeld = false;
  player.jumpBufferTimer = 0;
  player.coyoteTimer = 0;
  player.dashTime = 0;
  player.specialTime = 0;
  player.jumpAttackTime = 0;
  player.jumpAttackQueued = false;
  player.blocking = false;
}

function setPlayerBlocking(active) {
  if (!canPlayerFight()) {
    player.blocking = false;
    return;
  }

  if (
    active &&
    (isPlayerAttacking() ||
      isPlayerSpecialAttacking() ||
      isPlayerJumpAttacking() ||
      isPlayerDashing() ||
      player.hurtTime > 0 ||
      !player.grounded)
  ) {
    return;
  }

  player.blocking = active;
}

function isSamuraiSpecialInputActive() {
  return getActiveCharacter().id === "samurai" && isPlayerBlocking() && input.down;
}

function triggerSamuraiJumpAttack() {
  if (
    !canPlayerFight() ||
    getActiveCharacter().id !== "samurai" ||
    player.hurtTime > 0 ||
    !player.grounded
  ) {
    return false;
  }

  if (
    player.jumpAttackCooldown > 0 ||
    isPlayerJumpAttacking() ||
    isPlayerSpecialAttacking() ||
    isPlayerDashing() ||
    isPlayerBlocking()
  ) {
    return false;
  }

  player.jumpAttackTime = PLAYER_JUMP_ATTACK_DURATION;
  player.jumpAttackCooldown = PLAYER_JUMP_ATTACK_COOLDOWN;
  player.jumpAttackHitDone = false;
  player.jumpAttackQueued = false;
  player.attackTime = 0;
  player.attackHitDone = true;
  player.specialTime = 0;
  player.specialHitDone = true;
  player.blocking = false;
  player.vx = 0;
  return true;
}

function triggerSamuraiSpecial(fromGamepad) {
  if (
    !canPlayerFight() ||
    getActiveCharacter().id !== "samurai" ||
    (!fromGamepad && !isSamuraiSpecialInputActive()) ||
    player.hurtTime > 0 ||
    !player.grounded
  ) {
    return false;
  }

  if (player.specialCooldown > 0 || isPlayerSpecialAttacking() || isPlayerJumpAttacking() || isPlayerDashing()) {
    return false;
  }

  player.specialTime = PLAYER_SPECIAL_DURATION;
  player.specialCooldown = PLAYER_SPECIAL_COOLDOWN;
  player.specialHitDone = false;
  player.attackTime = 0;
  player.attackHitDone = true;
  player.blocking = false;
  player.vx = 0;
  spawnSamuraiSpecialProjectile();
  return true;
}

function triggerPlayerAttack() {
  if (!canPlayerFight()) {
    return;
  }

  if (triggerSamuraiSpecial()) {
    return;
  }

  if (
    isPlayerBlocking() ||
    isPlayerSpecialAttacking() ||
    isPlayerJumpAttacking() ||
    isPlayerDashing() ||
    player.hurtTime > 0
  ) {
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
  player.vx = player.grounded ? 0 : player.vx * 0.55;
}

function triggerPlayerDash() {
  const attackBlocksDash = isPlayerAttacking() && !canCancelAttack();
  const canDashFromGround = player.grounded;
  const canDashFromAir = !player.grounded && player.airDashAvailable;

  if (
    !canUseDash() ||
    !canPlayerFight() ||
    attackBlocksDash ||
    isPlayerSpecialAttacking() ||
    isPlayerJumpAttacking() ||
    isPlayerBlocking() ||
    player.hurtTime > 0 ||
    (!canDashFromGround && !canDashFromAir)
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

  if (canCancelAttack()) {
    player.attackTime = 0;
    player.attackHitDone = true;
  }

  if (!player.grounded) {
    player.airDashAvailable = false;
  }

  player.jumpBufferTimer = 0;
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

  // Dash is unstoppable: enemy attacks should not interrupt or damage the player mid-dash.
  if (isPlayerDashing()) {
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
  player.specialTime = 0;
  player.jumpAttackTime = 0;
  player.jumpAttackQueued = false;
  player.jumpAttackHitDone = true;
  player.specialHitDone = true;
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
  if (pauseMenuOpen) {
    return;
  }

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
  if (event.code === "Escape" && pressed) {
    event.preventDefault();
    event.stopPropagation();
    if (document.fullscreenElement) {
      setFsMenuOpen(!fsMenuOpen);
    } else {
      togglePauseMenu();
    }
    return;
  }

  if (event.code === "Escape") {
    return;
  }

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

  if (pauseMenuOpen) {
    return;
  }

  if (event.code === "ArrowLeft" || event.code === "KeyA") {
    input.left = pressed;
  }

  if (event.code === "ArrowRight" || event.code === "KeyD") {
    input.right = pressed;
  }

  if (event.code === "ArrowDown" || event.code === "KeyS") {
    input.down = pressed;
  }

  if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
    event.preventDefault();

    if (pressed) {
      beginJump();
    } else {
      endJump();
    }
  }

  if (pressed && (event.code === "ShiftLeft" || event.code === "ShiftRight")) {
    triggerPlayerDash();
  }

  if (event.code === "KeyR") {
    input.lightningHeld = pressed;
    if (pressed) {
      triggerLightningStab();
    }
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
    if (pauseMenuOpen) {
      return;
    }

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

  if (pauseMenuOpen) {
    return;
  }

  activateGameInput();

  if (event.button === 0) {
    input.attackHeld = true;
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
  if (event.button === 0) {
    input.attackHeld = false;
    player.jumpAttackQueued = false;
  }

  if (event.button === 2) {
    setPlayerBlocking(false);
  }
});

// ── PS4 / Generic Gamepad Support ──
const GAMEPAD_DEADZONE = 0.25;
const gpPrev = {
  jump: false, attack: false, dash: false, block: false,
  special: false, lightning: false, pause: false, anyDirection: false
};

function getActiveGamepad() {
  if (!navigator.getGamepads) return null;
  const pads = navigator.getGamepads();
  for (let i = 0; i < pads.length; i++) {
    if (pads[i] && pads[i].connected) return pads[i];
  }
  return null;
}

function pollGamepad() {
  const gp = getActiveGamepad();
  if (!gp) return;

  // Ensure game accepts input when controller is used
  if (!gameInputActive) activateGameInput();

  // Left stick
  const lx = gp.axes[0] || 0;
  const ly = gp.axes[1] || 0;

  // D-pad buttons (PS4: 12=up, 13=down, 14=left, 15=right)
  const dpadLeft  = gp.buttons[14] && gp.buttons[14].pressed;
  const dpadRight = gp.buttons[15] && gp.buttons[15].pressed;
  const dpadDown  = gp.buttons[13] && gp.buttons[13].pressed;

  const gpLeft  = lx < -GAMEPAD_DEADZONE || dpadLeft;
  const gpRight = lx >  GAMEPAD_DEADZONE || dpadRight;
  const gpDown  = ly >  GAMEPAD_DEADZONE || dpadDown;

  // Only override input if any gamepad direction is active, otherwise leave keyboard input alone
  if (gpLeft || gpRight || gpDown) {
    input.left  = gpLeft;
    input.right = gpRight;
    input.down  = gpDown;
  } else if (gpPrev.anyDirection) {
    input.left  = false;
    input.right = false;
    input.down  = false;
  }
  gpPrev.anyDirection = gpLeft || gpRight || gpDown;

  // PS4 buttons: 0=Cross(X), 1=Circle, 2=Square, 3=Triangle
  // 4=L1, 5=R1, 9=Options
  const jumpBtn       = gp.buttons[0] && gp.buttons[0].pressed;
  const dashBtn       = gp.buttons[1] && gp.buttons[1].pressed;
  const attackBtn     = gp.buttons[2] && gp.buttons[2].pressed;
  const specialBtn    = gp.buttons[3] && gp.buttons[3].pressed;
  const lightningBtn  = gp.buttons[4] && gp.buttons[4].pressed;  // L1
  const blockBtn      = gp.buttons[5] && gp.buttons[5].pressed;
  const pauseBtn      = gp.buttons[9] && gp.buttons[9].pressed;

  if (pauseMenuOpen || fsMenuOpen) {
    // Only handle pause toggle from controller when paused
    if (pauseBtn && !gpPrev.pause) {
      if (document.fullscreenElement) {
        setFsMenuOpen(!fsMenuOpen);
      } else {
        togglePauseMenu();
      }
    }
    gpPrev.pause = pauseBtn;
    return;
  }

  // Jump: trigger on press, release on release
  if (jumpBtn && !gpPrev.jump) {
    beginJump();
  } else if (!jumpBtn && gpPrev.jump) {
    endJump();
  }

  // Attack: trigger on press, release clears
  if (attackBtn && !gpPrev.attack) {
    input.attackHeld = true;
    triggerPlayerAttack();
  } else if (!attackBtn && gpPrev.attack) {
    input.attackHeld = false;
    player.jumpAttackQueued = false;
  }

  // Dash: trigger on press
  if (dashBtn && !gpPrev.dash) {
    triggerPlayerDash();
  }

  // Block: hold R1
  if (blockBtn && !gpPrev.block) {
    setPlayerBlocking(true);
  } else if (!blockBtn && gpPrev.block) {
    setPlayerBlocking(false);
  }

  // Special: Triangle
  if (specialBtn && !gpPrev.special) {
    triggerSamuraiSpecial(true);
  }

  // Lightning Stab: L1
  input.lightningHeld = !!lightningBtn;
  if (lightningBtn && !gpPrev.lightning) {
    triggerLightningStab();
  }

  // Pause: Options
  if (pauseBtn && !gpPrev.pause) {
    if (document.fullscreenElement) {
      setFsMenuOpen(!fsMenuOpen);
    } else {
      togglePauseMenu();
    }
  }

  gpPrev.jump = jumpBtn;
  gpPrev.attack = attackBtn;
  gpPrev.dash = dashBtn;
  gpPrev.block = blockBtn;
  gpPrev.special = specialBtn;
  gpPrev.lightning = lightningBtn;
  gpPrev.pause = pauseBtn;
}

function resolvePlatforms(previousBottom) {
  player.grounded = false;

  const feetLeft = player.x + 5;
  const feetRight = player.x + player.width - 5;

  for (const platform of getScenePlatforms()) {
    if (platform.type === "forest-ramp") {
      const withinX = feetRight > platform.x && feetLeft < platform.x + platform.width;
      if (!withinX) continue;
      const rampY2 = platform.y2 !== undefined
        ? platform.y2
        : platform.y - platform.width * Math.tan((platform.degrees || 0) * Math.PI / 180);
      const centerX = clamp((feetLeft + feetRight) / 2, platform.x, platform.x + platform.width);
      const t = (centerX - platform.x) / platform.width;
      const surfaceY = platform.y + t * (rampY2 - platform.y);
      // Landing on top of ramp (snap tolerance of 12px so walking from adjacent platforms works)
      if (player.vy >= 0 && previousBottom <= surfaceY + 12 && player.y + player.height >= surfaceY - 12) {
        player.y = surfaceY - player.height;
        player.vy = 0;
        player.grounded = true;
        return platform;
      }
      // Hitting ramp from below — push player down
      const rampThickness = 12;
      const rampBottom = surfaceY + rampThickness;
      if (player.vy < 0 && player.y <= rampBottom && player.y + player.height > rampBottom) {
        player.y = rampBottom;
        player.vy = 0;
      }
      continue;
    }

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
    const forestFloorY = getForestFloorY();
    player.y = forestFloorY - player.height;
    player.vy = 0;
    player.grounded = true;
    return getScenePlatforms().find((platform) => platform.type === "forest-floor") || null;
  }

  if (isTowerScene() && player.y + player.height >= WORLD_HEIGHT) {
    player.y = FLOOR_Y - player.height;
    player.vy = 0;
    player.grounded = true;
  }

  return null;
}

function resolveWalls(previousX) {
  const previousRight = previousX + player.width;
  const currentRight = player.x + player.width;
  const playerTop = player.y + 4;
  const playerBottom = player.y + player.height - 4;

  for (const wall of getSceneWalls()) {
    const overlapsY = playerBottom > wall.y && playerTop < wall.y + wall.height;
    if (!overlapsY) {
      continue;
    }

    const crossedFromLeft = previousRight <= wall.x && currentRight > wall.x;
    const crossedFromRight = previousX >= wall.x + wall.width && player.x < wall.x + wall.width;

    if (crossedFromLeft) {
      player.x = wall.x - player.width;
      if (player.vx > 0) {
        player.vx = 0;
      }
      continue;
    }

    if (crossedFromRight) {
      player.x = wall.x + wall.width;
      if (player.vx < 0) {
        player.vx = 0;
      }
      continue;
    }

    const overlapLeft = currentRight - wall.x;
    const overlapRight = wall.x + wall.width - player.x;
    if (overlapLeft <= 0 || overlapRight <= 0) {
      continue;
    }

    if (overlapLeft < overlapRight) {
      player.x -= overlapLeft;
      if (player.vx > 0) {
        player.vx = 0;
      }
    } else {
      player.x += overlapRight;
      if (player.vx < 0) {
        player.vx = 0;
      }
    }
  }

  // Ramp horizontal collision — block walking through ramps
  for (const platform of getScenePlatforms()) {
    if (platform.type !== "forest-ramp") continue;
    const rampY2 = platform.y2 !== undefined
      ? platform.y2
      : platform.y - platform.width * Math.tan((platform.degrees || 0) * Math.PI / 180);
    const rampTop = Math.min(platform.y, rampY2);
    const rampBottom = Math.max(platform.y, rampY2) + 12;
    const overlapsY = playerBottom > rampTop && playerTop < rampBottom;
    if (!overlapsY) continue;

    // Get surface Y at player's position
    const centerX = clamp((player.x + player.width / 2), platform.x, platform.x + platform.width);
    const t = (centerX - platform.x) / platform.width;
    const surfaceY = platform.y + t * (rampY2 - platform.y);

    // If player feet are below the ramp surface, block horizontal movement
    if (player.y + player.height > surfaceY && player.y < surfaceY + 12) {
      continue; // Player is on the ramp surface, don't block
    }
    if (player.y + player.height > surfaceY + 12) {
      // Player is below the ramp — block from sides
      const crossedFromLeft = previousRight <= platform.x && currentRight > platform.x;
      const crossedFromRight = previousX >= platform.x + platform.width && player.x < platform.x + platform.width;
      if (crossedFromLeft) {
        player.x = platform.x - player.width;
        if (player.vx > 0) player.vx = 0;
      } else if (crossedFromRight) {
        player.x = platform.x + platform.width;
        if (player.vx < 0) player.vx = 0;
      } else if (currentRight > platform.x && player.x < platform.x + platform.width) {
        const overlapLeft = currentRight - platform.x;
        const overlapRight = platform.x + platform.width - player.x;
        if (overlapLeft < overlapRight) {
          player.x -= overlapLeft;
          if (player.vx > 0) player.vx = 0;
        } else {
          player.x += overlapRight;
          if (player.vx < 0) player.vx = 0;
        }
      }
    }
  }
}

function playerOverlapsRect(rect) {
  return (
    player.x + player.width > rect.x &&
    player.x < rect.x + rect.width &&
    player.y + player.height > rect.y &&
    player.y < rect.y + rect.height
  );
}

function movePlayerToForestRouteZone(zoneIndex, spawnX, spawnY) {
  setForestRoute(zoneIndex);
  const floorY = getForestFloorY();
  const { minX, maxX } = getSceneHorizontalBounds();
  player.x = clamp(spawnX, minX, maxX);
  player.y = typeof spawnY === "number" ? spawnY : floorY - player.height;
  player.vx = 0;
  player.vy = 0;
  player.grounded = true;
  player.coyoteTimer = COYOTE_TIME;
  player.jumpBufferTimer = 0;
  player.jumpHeld = false;
  player.airDashAvailable = true;
  player.attackTime = 0;
  player.attackHitDone = false;
  player.specialTime = 0;
  player.specialHitDone = false;
  player.jumpAttackTime = 0;
  player.jumpAttackHitDone = false;
  player.jumpAttackQueued = false;
  player.blocking = false;
  player.wallContact = 0;
  player.wallJumpLockTime = 0;
}

function tryAdvanceForestRoute() {
  if (!isForestScene()) {
    return false;
  }

  const transitions = getForestRouteTransitions();
  for (const transition of transitions) {
    const overlaps = playerOverlapsRect(transition);
    if (!overlaps) {
      continue;
    }

    // Block exit if Nightborne must be defeated first
    if (transition.requireNightborneDead && !nightborne.dead) {
      continue;
    }

    movePlayerToForestRouteZone(transition.targetZone, transition.spawnX, transition.spawnY);
    return true;
  }

  return false;
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
  const distanceToPlayer = playerCenter - boss.x;
  const absDistanceToPlayer = Math.abs(distanceToPlayer);
  const bossNearPlayer = absDistanceToPlayer < BOSS_ATTACK_RANGE && player.y < ARENA_FLOOR_Y + 40;

  if (boss.state === "attack") {
    if (boss.stateTime >= 0.16 && boss.stateTime <= 0.36) {
      const lungeDirection = distanceToPlayer < 0 ? -1 : 1;
      boss.direction = lungeDirection;
      boss.x += lungeDirection * BOSS_LUNGE_SPEED * deltaTime;
    }

    if (!boss.attackHitDone && boss.stateTime >= 0.24 && bossNearPlayer) {
      if (isPlayerDashing()) {
        boss.attackHitDone = true;
      } else {
        damagePlayer(BOSS_ATTACK_DAMAGE);
        boss.attackHitDone = true;
      }
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
  if (absDistanceToPlayer > BOSS_PERSONAL_SPACE) {
    boss.direction = distanceToPlayer < 0 ? -1 : 1;
  } else if (boss.attackCooldown > 0.2) {
    boss.direction = distanceToPlayer < 0 ? 1 : -1;
  }

  const runSpeed =
    absDistanceToPlayer > BOSS_PURSUIT_DISTANCE
      ? BOSS_BASE_SPEED * 1.18
      : absDistanceToPlayer > BOSS_PERSONAL_SPACE
        ? BOSS_BASE_SPEED
        : BOSS_BASE_SPEED * 0.66;
  boss.x += boss.direction * runSpeed * deltaTime;

  if (boss.x <= boss.minX) {
    boss.x = boss.minX;
    boss.direction = 1;
  } else if (boss.x >= boss.maxX) {
    boss.x = boss.maxX;
    boss.direction = -1;
  }
}

function update(deltaTime) {
  if (pauseMenuOpen || fsMenuOpen) {
    return;
  }

  animationClock += deltaTime;
  updateBoss(deltaTime);
  // Activate & update Nightborne in zone 4
  if (isNightborneZone() && !nightborne.active && !nightborne.dead) {
    activateNightborne();
  }
  updateNightborne(deltaTime);
  updateMobs(deltaTime);
  updateTeleporters(deltaTime);
  updateSpecialProjectiles(deltaTime);
  updateLightningBolts(deltaTime);

  if (player.attackCooldown > 0) {
    player.attackCooldown = Math.max(0, player.attackCooldown - deltaTime);
  }

  if (player.attackTime > 0) {
    player.attackTime = Math.max(0, player.attackTime - deltaTime);
  }

  if (player.specialTime > 0) {
    player.specialTime = Math.max(0, player.specialTime - deltaTime);
  }

  // Lightning stab update — hold to channel
  if (player.lightningStabTime > 0) {
    player.lightningStabTime = Math.max(0, player.lightningStabTime - deltaTime);
    const elapsed = LIGHTNING_STAB_DURATION - player.lightningStabTime;
    if (!player.lightningBoltSpawned && elapsed >= LIGHTNING_STAB_BOLT_DELAY) {
      player.lightningBoltSpawned = true;
      spawnLightningBolt();
    }
  }
  // Channel logic: only active after stab animation ends and bolt exists
  if (player.lightningChanneling && player.lightningStabTime <= 0) {
    const shouldChannel = input.lightningHeld && !player.dead && player.hurtTime <= 0 && lightningBolts.length > 0;
    if (shouldChannel) {
      // Sustain beam
      for (const bolt of lightningBolts) { bolt.releasing = false; }
      player.vx = 0;
    } else {
      // End channel — fade bolts
      player.lightningChanneling = false;
      player.lightningStabCooldown = LIGHTNING_STAB_COOLDOWN;
      for (const bolt of lightningBolts) {
        if (!bolt.releasing) { bolt.releasing = true; bolt.fadeTime = 0; }
      }
    }
  }

  if (player.lightningStabCooldown > 0) {
    player.lightningStabCooldown = Math.max(0, player.lightningStabCooldown - deltaTime);
  }

  if (player.specialCooldown > 0) {
    player.specialCooldown = Math.max(0, player.specialCooldown - deltaTime);
  }

  if (player.jumpAttackTime > 0) {
    player.jumpAttackTime = Math.max(0, player.jumpAttackTime - deltaTime);
  }

  if (player.jumpAttackCooldown > 0) {
    player.jumpAttackCooldown = Math.max(0, player.jumpAttackCooldown - deltaTime);
  }

  if (player.dashTime > 0) {
    player.dashTime = Math.max(0, player.dashTime - deltaTime);
  }

  if (player.dashCooldown > 0) {
    player.dashCooldown = Math.max(0, player.dashCooldown - deltaTime);
  }

  if (player.jumpBufferTimer > 0) {
    player.jumpBufferTimer = Math.max(0, player.jumpBufferTimer - deltaTime);
  }

  if (player.wallJumpLockTime > 0) {
    player.wallJumpLockTime = Math.max(0, player.wallJumpLockTime - deltaTime);
  }

  if (player.grounded) {
    player.coyoteTimer = COYOTE_TIME;
  } else if (player.coyoteTimer > 0) {
    player.coyoteTimer = Math.max(0, player.coyoteTimer - deltaTime);
  }

  if (player.hurtTime > 0) {
    player.hurtTime = Math.max(0, player.hurtTime - deltaTime);
  }

  if (player.invulnerableTime > 0) {
    player.invulnerableTime = Math.max(0, player.invulnerableTime - deltaTime);
  }

  if (!input.attackHeld || getActiveCharacter().id !== "samurai" || !canPlayerFight()) {
    player.jumpAttackQueued = false;
  } else if (!player.grounded) {
    player.jumpAttackQueued = true;
  }

  if (player.dead) {
    player.deathTimer = Math.max(0, player.deathTimer - deltaTime);
    if (player.deathTimer <= 0) {
      respawnPlayerAfterDeath();
    }
    return;
  }

  if (isTeleporting()) {
    cameraLookAhead = moveToward(cameraLookAhead, 0, CAMERA_LOOKAHEAD_LERP * deltaTime);
    const targetCamera = getTargetCameraY();
    cameraY += (targetCamera - cameraY) * blendFactor(CAMERA_LERP, deltaTime);
    return;
  }

  if (!player.won) {
    const wasGrounded = player.grounded;
    const previousX = player.x;
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

    // Nightborne dash hit
    if (
      isPlayerDashing() &&
      !player.dashHitDone &&
      isNightborneZone() &&
      nightborne.active && !nightborne.dead &&
      Math.abs(nightborne.x - getPlayerCenterX()) <= PLAYER_ATTACK_RANGE * 0.82 &&
      ((player.facing === 1 && nightborne.x >= getPlayerCenterX()) ||
        (player.facing === -1 && nightborne.x <= getPlayerCenterX())) &&
      Math.abs(player.y - (NB_FLOOR_Y - player.height)) < 90
    ) {
      damageNightborne(PLAYER_DASH_DAMAGE);
      player.dashHitDone = true;
    }

    // Zone mob dash hit
    if (isPlayerDashing() && !player.dashHitDone) {
      if (checkMobHit(getPlayerCenterX(), player.facing, PLAYER_ATTACK_RANGE * 0.82, 90, PLAYER_DASH_DAMAGE)) {
        player.dashHitDone = true;
      }
    }

    if (isPlayerAttacking()) {
      if (
        !player.attackHitDone &&
        isBossEncounterActive() &&
        !boss.dead &&
        getAttackProgress() >= 0.42 &&
        Math.abs(getBossCenterX() - getPlayerCenterX()) <= PLAYER_ATTACK_RANGE &&
        ((player.facing === 1 && getBossCenterX() >= getPlayerCenterX()) ||
          (player.facing === -1 && getBossCenterX() <= getPlayerCenterX())) &&
        Math.abs(player.y - (ARENA_FLOOR_Y - player.height)) < PLAYER_AIR_ATTACK_VERTICAL_RANGE
      ) {
        damageBoss(PLAYER_ATTACK_DAMAGE);
        player.attackHitDone = true;
      }

      // Nightborne normal attack hit
      if (
        !player.attackHitDone &&
        isNightborneZone() &&
        nightborne.active && !nightborne.dead &&
        getAttackProgress() >= 0.42 &&
        Math.abs(nightborne.x - getPlayerCenterX()) <= PLAYER_ATTACK_RANGE &&
        ((player.facing === 1 && nightborne.x >= getPlayerCenterX()) ||
          (player.facing === -1 && nightborne.x <= getPlayerCenterX())) &&
        Math.abs(player.y - (NB_FLOOR_Y - player.height)) < PLAYER_AIR_ATTACK_VERTICAL_RANGE
      ) {
        damageNightborne(PLAYER_ATTACK_DAMAGE);
        player.attackHitDone = true;
      }

      // Zone mob normal attack hit
      if (!player.attackHitDone && getAttackProgress() >= 0.42) {
        if (checkMobHit(getPlayerCenterX(), player.facing, PLAYER_ATTACK_RANGE, PLAYER_AIR_ATTACK_VERTICAL_RANGE, PLAYER_ATTACK_DAMAGE)) {
          player.attackHitDone = true;
        }
      }
    }

    if (isPlayerJumpAttacking()) {
      const jumpAttackProgress = getJumpAttackProgress();
      if (
        !player.jumpAttackHitDone &&
        isBossEncounterActive() &&
        !boss.dead &&
        jumpAttackProgress >= PLAYER_JUMP_ATTACK_HIT_START &&
        jumpAttackProgress <= PLAYER_JUMP_ATTACK_HIT_END &&
        Math.abs(getBossCenterX() - getPlayerCenterX()) <= PLAYER_JUMP_ATTACK_RANGE &&
        ((player.facing === 1 && getBossCenterX() >= getPlayerCenterX()) ||
          (player.facing === -1 && getBossCenterX() <= getPlayerCenterX())) &&
        Math.abs(player.y - (ARENA_FLOOR_Y - player.height)) < PLAYER_JUMP_ATTACK_VERTICAL_RANGE
      ) {
        damageBoss(PLAYER_JUMP_ATTACK_DAMAGE);
        player.jumpAttackHitDone = true;
      }

      // Nightborne jump attack hit
      if (
        !player.jumpAttackHitDone &&
        isNightborneZone() &&
        nightborne.active && !nightborne.dead &&
        jumpAttackProgress >= PLAYER_JUMP_ATTACK_HIT_START &&
        jumpAttackProgress <= PLAYER_JUMP_ATTACK_HIT_END &&
        Math.abs(nightborne.x - getPlayerCenterX()) <= PLAYER_JUMP_ATTACK_RANGE &&
        ((player.facing === 1 && nightborne.x >= getPlayerCenterX()) ||
          (player.facing === -1 && nightborne.x <= getPlayerCenterX())) &&
        Math.abs(player.y - (NB_FLOOR_Y - player.height)) < PLAYER_JUMP_ATTACK_VERTICAL_RANGE
      ) {
        damageNightborne(PLAYER_JUMP_ATTACK_DAMAGE);
        player.jumpAttackHitDone = true;
      }

      // Zone mob jump attack hit
      if (!player.jumpAttackHitDone &&
          jumpAttackProgress >= PLAYER_JUMP_ATTACK_HIT_START &&
          jumpAttackProgress <= PLAYER_JUMP_ATTACK_HIT_END) {
        if (checkMobHit(getPlayerCenterX(), player.facing, PLAYER_JUMP_ATTACK_RANGE, PLAYER_JUMP_ATTACK_VERTICAL_RANGE, PLAYER_JUMP_ATTACK_DAMAGE)) {
          player.jumpAttackHitDone = true;
        }
      }
    }

    refreshWallContact();
    tryConsumeBufferedJump();

    const aim = currentAim();
    const wallJumpSteeringLocked = !player.grounded && player.wallJumpLockTime > 0;
    if (aim !== 0 && !wallJumpSteeringLocked) {
      player.facing = aim;
    }

    if (isPlayerDashing()) {
      player.vx = player.facing * PLAYER_DASH_SPEED;
    } else if (
      isPlayerSpecialAttacking() ||
      isPlayerJumpAttacking() ||
      isPlayerAttacking() ||
      isPlayerBlocking() ||
      player.hurtTime > 0
    ) {
      if (player.grounded) {
        player.vx = 0;
      }
    } else if (!wallJumpSteeringLocked) {
      const targetSpeed = aim * MOVE_SPEED;
      const accel = player.grounded ? GROUND_ACCEL : AIR_ACCEL;
      player.vx = moveToward(player.vx, targetSpeed, accel * deltaTime);

      if (aim === 0 && player.grounded) {
        player.vx = moveToward(player.vx, 0, GROUND_FRICTION * deltaTime);
      }
    }

    player.vy += GRAVITY * deltaTime;
    player.vy = Math.min(player.vy, MAX_FALL_SPEED);
    player.x += player.vx * deltaTime;
    player.y += player.vy * deltaTime;

    const { minX, maxX } = getSceneHorizontalBounds();
    player.x = clamp(player.x, minX, maxX);
    resolveWalls(previousX);

    resolvePlatforms(previousBottom);
    if (player.grounded && !wasGrounded) {
      player.airDashAvailable = true;
      if (player.jumpAttackQueued && input.attackHeld) {
        triggerSamuraiJumpAttack();
      }
      player.jumpAttackQueued = false;
    }

    if (player.grounded) {
      player.wallContact = 0;
      player.wallJumpLockTime = 0;
    } else {
      refreshWallContact();
    }

    if (isForestScene()) {
      tryAdvanceForestRoute();
    }

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
        player.jumpBufferTimer = 0;
        player.specialTime = 0;
        player.jumpAttackTime = 0;
        player.jumpAttackQueued = false;
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
      movePlayerToScene("forest", FOREST_ENTRY_X, getForestFloorY() - player.height, 0);
      player.facing = 1;
    }

    updateForestBonfire(deltaTime);
    updateAmbientParticles(deltaTime);
  }

  if (isTowerScene()) {
    const vyNormalized = clamp(player.vy / MAX_FALL_SPEED, -1, 1);
    const lookTarget = vyNormalized < 0 ? vyNormalized * -CAMERA_LOOKAHEAD_UP : vyNormalized * CAMERA_LOOKAHEAD_DOWN;
    cameraLookAhead = moveToward(cameraLookAhead, lookTarget, CAMERA_LOOKAHEAD_LERP * deltaTime);
  } else {
    cameraLookAhead = moveToward(cameraLookAhead, 0, CAMERA_LOOKAHEAD_LERP * deltaTime);
  }

  const targetCamera = getTargetCameraY();
  cameraY += (targetCamera - cameraY) * blendFactor(CAMERA_LERP, deltaTime);
}

function fillPattern(asset, x, y, width, height, fallback, alpha = 1) {
  if (asset && asset.pattern) {
    try {
      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = asset.pattern;
      context.fillRect(x, y, width, height);
      context.restore();
      return;
    } catch {}
  }

  context.fillStyle = fallback;
  context.fillRect(x, y, width, height);
}

function drawBackdropTiled(asset, y, drawHeight, alpha = 1, driftSpeed = 0, blendMode = "source-over") {
  if (!asset || !asset.loaded) {
    return;
  }

  const sourceWidth = asset.image.naturalWidth;
  const sourceHeight = asset.image.naturalHeight;
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    return;
  }

  const aspectRatio = sourceWidth / sourceHeight;
  const drawWidth = Math.max(1, drawHeight * aspectRatio);
  const drift = driftSpeed === 0 ? 0 : ((animationClock * driftSpeed) % drawWidth) - drawWidth;

  context.save();
  context.globalAlpha = alpha;
  context.globalCompositeOperation = blendMode;

  for (let x = drift; x < VIEW_WIDTH + drawWidth; x += drawWidth) {
    context.drawImage(asset.image, x, y, drawWidth, drawHeight);
  }

  context.restore();
}

// ── Ambient Particle System ──
const ambientParticles = [];
const MAX_PARTICLES = 40;

// Torch positions per zone (canvas coords) — matched to background images
const ZONE_TORCHES = {
  1: [ // Crimson Cavern — 2 blue torches on right stone pillars
    { x: 600, y: 280, color: "blue" },
    { x: 738, y: 280, color: "blue" },
  ],
  2: [ // Dark Temple — blue torches on arch arms + pillar
    { x: 130, y: 230, color: "blue" },   // far-left arm
    { x: 206, y: 305, color: "blue" },   // left inner arch
    { x: 514, y: 305, color: "blue" },   // right inner arch
    { x: 588, y: 228, color: "blue" },   // right arm
    { x: 924, y: 191, color: "blue" },   // far-right pillar
  ],
  3: [ // Boss Leadup — 3 blue torches + red gate glow
    { x: 288, y: 250, color: "blue" },
    { x: 413, y: 270, color: "blue" },
    { x: 538, y: 250, color: "blue" },
    { x: 701, y: 340, color: "red" },
  ],
  4: [ // Boss Room — purple torches flanking the arena
    { x: 200, y: 230, color: "red" },
    { x: 400, y: 200, color: "red" },
    { x: 560, y: 200, color: "red" },
    { x: 760, y: 230, color: "red" },
  ],
  5: [ // Shattered Spire — faint blue lights on broken pillars
    { x: 120, y: 300, color: "blue" },
    { x: 500, y: 260, color: "blue" },
    { x: 760, y: 220, color: "blue" },
  ],
  6: [ // Windswept Heights — cold blue scattered lights
    { x: 180, y: 340, color: "blue" },
    { x: 400, y: 200, color: "blue" },
    { x: 650, y: 250, color: "blue" },
    { x: 820, y: 180, color: "blue" },
  ],
  7: [ // The Pinnacle — eerie purple-red lights
    { x: 150, y: 300, color: "red" },
    { x: 420, y: 200, color: "red" },
    { x: 700, y: 150, color: "red" },
    { x: 500, y: 100, color: "blue" },
  ]
};

function spawnZoneParticles(zoneIndex) {
  if (!isForestScene()) return;
  if (zoneIndex < 1 || zoneIndex > 7) return;

  // Falling ash/dust from the sky — subtle, slow, drifting down
  if (ambientParticles.length < MAX_PARTICLES && Math.random() < 0.04) {
    const colors = { 1: "ash-red", 2: "ash-blue", 3: "ash-dark", 4: "ash-red", 5: "ash-blue", 6: "ash-blue", 7: "ash-dark" };
    ambientParticles.push({
      x: Math.random() * VIEW_WIDTH,
      y: -5,
      vx: (Math.random() - 0.5) * 6,
      vy: 8 + Math.random() * 14,
      size: 0.8 + Math.random() * 1.2,
      life: 6 + Math.random() * 6,
      maxLife: 6 + Math.random() * 6,
      color: colors[zoneIndex],
      zone: zoneIndex,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.8 + Math.random() * 1.2
    });
  }

  // Torch fire particles — sparks and flames rising from each torch
  const torches = ZONE_TORCHES[zoneIndex] || [];
  for (const torch of torches) {
    if (ambientParticles.length >= MAX_PARTICLES) break;
    // Spawn sparse torch particles — just a few wisps
    if (Math.random() < 0.15) {
      const colorKey = torch.color === "red" ? "torch-red" : "torch-blue";
      ambientParticles.push({
        x: torch.x + (Math.random() - 0.5) * 6,
        y: torch.y + (Math.random() - 0.5) * 3,
        vx: (Math.random() - 0.5) * 6,
        vy: -(8 + Math.random() * 12),
        size: 0.6 + Math.random() * 1.2,
        life: 0.4 + Math.random() * 1.0,
        maxLife: 0.4 + Math.random() * 1.0,
        color: colorKey,
        zone: zoneIndex
      });
    }
  }
}

function updateAmbientParticles(deltaTime) {
  const zoneIndex = getForestRouteIndex();
  spawnZoneParticles(zoneIndex);

  for (let i = ambientParticles.length - 1; i >= 0; i--) {
    const p = ambientParticles[i];
    p.life -= deltaTime;
    if (p.life <= 0 || p.zone !== zoneIndex) {
      ambientParticles.splice(i, 1);
      continue;
    }
    if (p.wobbleOffset !== undefined) {
      p.x += Math.sin(p.wobbleOffset + (p.maxLife - p.life) * p.wobbleSpeed) * 0.3;
    }
    p.x += p.vx * deltaTime;
    p.y += p.vy * deltaTime;
  }
}

function drawAmbientParticles() {
  if (!isForestScene()) return;
  const zoneIndex = getForestRouteIndex();
  if (zoneIndex < 1 || zoneIndex > 7) return;

  // Draw torch glow halos — big pulsing light auras
  const torches = ZONE_TORCHES[zoneIndex] || [];
  context.save();
  context.globalCompositeOperation = "screen";
  for (const torch of torches) {
    const glowColor = torch.color === "red" ? "rgba(200,40,20," : "rgba(60,140,255,";
    // Strong pulse: oscillates between 0.5 and 1.0
    const t = Date.now() * 0.003 + torch.x * 0.7;
    const pulse = 0.65 + Math.sin(t) * 0.25 + Math.sin(t * 2.3) * 0.1;
    // Outer glow — radius 70px
    const outerGrad = context.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, 70);
    outerGrad.addColorStop(0, glowColor + (0.30 * pulse) + ")");
    outerGrad.addColorStop(0.35, glowColor + (0.14 * pulse) + ")");
    outerGrad.addColorStop(0.7, glowColor + (0.04 * pulse) + ")");
    outerGrad.addColorStop(1, glowColor + "0)");
    context.fillStyle = outerGrad;
    context.beginPath();
    context.arc(torch.x, torch.y, 70, 0, Math.PI * 2);
    context.fill();
    // Bright inner core — radius 22px
    const innerGrad = context.createRadialGradient(torch.x, torch.y, 0, torch.x, torch.y, 22);
    innerGrad.addColorStop(0, glowColor + (0.50 * pulse) + ")");
    innerGrad.addColorStop(0.5, glowColor + (0.18 * pulse) + ")");
    innerGrad.addColorStop(1, glowColor + "0)");
    context.fillStyle = innerGrad;
    context.beginPath();
    context.arc(torch.x, torch.y, 22, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();

  // Draw particles
  context.save();
  for (const p of ambientParticles) {
    const fadeIn = Math.min(1, (p.maxLife - p.life) * 4);
    const fadeOut = Math.min(1, p.life / p.maxLife * 3);
    const alpha = fadeIn * fadeOut;

    if (p.color === "ash-red") {
      context.globalAlpha = alpha * 0.2;
      context.fillStyle = "#aa4433";
    } else if (p.color === "ash-blue") {
      context.globalAlpha = alpha * 0.15;
      context.fillStyle = "#556688";
    } else if (p.color === "ash-dark") {
      context.globalAlpha = alpha * 0.18;
      context.fillStyle = "#663333";
    } else if (p.color === "torch-blue") {
      context.globalAlpha = alpha * 0.7;
      context.shadowColor = "#4488ff";
      context.shadowBlur = 3;
      context.fillStyle = "#88ccff";
    } else if (p.color === "torch-orange") {
      context.globalAlpha = alpha * 0.7;
      context.shadowColor = "#ff8800";
      context.shadowBlur = 3;
      context.fillStyle = "#ffcc66";
    } else if (p.color === "torch-red") {
      context.globalAlpha = alpha * 0.7;
      context.shadowColor = "#ff2200";
      context.shadowBlur = 3;
      context.fillStyle = "#ff6644";
    }

    context.beginPath();
    context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;
  }
  context.restore();
}

function drawForestThemeBackdrop() {
  if (!isForestScene()) {
    return;
  }

  const themeId = getForestThemeId();
  const themes = assets.forestThemes || {};
  const stageVariant = getForestRouteIndex() % 3;
  const variantDepth = [0.92, 1, 1.12][stageVariant];

  if (themeId === "art-forest") {
    drawBackdropTiled(themes.artForest?.depth, 0, VIEW_HEIGHT, 0.32 + stageVariant * 0.04, 0.25 + stageVariant * 0.25);
    drawBackdropTiled(themes.artForest?.far, VIEW_HEIGHT - 250, 266 * variantDepth, 0.34 + stageVariant * 0.04, 0.9 + stageVariant * 0.3);
    drawBackdropTiled(themes.artForest?.mid, VIEW_HEIGHT - 276, 294 * variantDepth, 0.3 + stageVariant * 0.03, 1.35 + stageVariant * 0.35);
    drawBackdropTiled(themes.artForest?.near, VIEW_HEIGHT - 292, 312 * variantDepth, 0.25 + stageVariant * 0.03, 1.9 + stageVariant * 0.4);
    drawBackdropTiled(themes.artForest?.canopy, -78, 188 * variantDepth, 0.24 + stageVariant * 0.03, 2 + stageVariant * 0.4, "multiply");
    drawBackdropTiled(themes.artForest?.lights, VIEW_HEIGHT - 292, 312 * variantDepth, 0.14 + stageVariant * 0.03, 1.55 + stageVariant * 0.35, "screen");
    return;
  }

  if (themeId === "first-cp") {
    if (themes.firstCp?.bg?.loaded) {
      const img = themes.firstCp.bg.image;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = VIEW_WIDTH / VIEW_HEIGHT;
      let drawW;
      let drawH;

      if (imgRatio > canvasRatio) {
        drawH = VIEW_HEIGHT;
        drawW = VIEW_HEIGHT * imgRatio;
      } else {
        drawW = VIEW_WIDTH;
        drawH = VIEW_WIDTH / imgRatio;
      }

      drawW *= 1.04;
      drawH *= 1.04;

      const drawX = (VIEW_WIDTH - drawW) / 2;
      const drawY = (VIEW_HEIGHT - drawH) / 2 + 20;
      context.drawImage(img, drawX, drawY, drawW, drawH);
    }
    return;
  }

  if (themeId === "dark-temple") {
    if (themes.darkTemple?.bg?.loaded) {
      context.drawImage(themes.darkTemple.bg.image, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    }
    return;
  }

  if (themeId === "crimson-cavern") {
    if (themes.crimsonCavern?.bg?.loaded) {
      context.drawImage(themes.crimsonCavern.bg.image, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    }
    return;
  }

  if (themeId === "ruined-citadel") {
    if (themes.ruinedCitadel?.bg?.loaded) {
      const img = themes.ruinedCitadel.bg.image;
      // Cover-fit: fill canvas without distortion, crop overflow
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = VIEW_WIDTH / VIEW_HEIGHT;
      let drawW, drawH;
      if (imgRatio > canvasRatio) {
        drawH = VIEW_HEIGHT;
        drawW = VIEW_HEIGHT * imgRatio;
      } else {
        drawW = VIEW_WIDTH;
        drawH = VIEW_WIDTH / imgRatio;
      }
      // Scale up slightly to crop more off sides, reducing stretched feel
      const extraScale = 1.07;
      drawW *= extraScale;
      drawH *= extraScale;
      const drawX = (VIEW_WIDTH - drawW) / 2;
      const drawY = (VIEW_HEIGHT - drawH) / 2;
      context.drawImage(img, drawX, drawY, drawW, drawH);
    }
    return;
  }

  if (themeId === "boss-room") {
    if (themes.bossRoom?.bg?.loaded) {
      context.drawImage(themes.bossRoom.bg.image, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    }
    return;
  }

  // Procedural backdrop for zones without art assets (post-boss ascending zones)
  const zone = getForestZone();
  const pal = zone?.palette || FOREST_ZONE_DEFAULT_PALETTE;
  const skyColors = pal.sky || ["#080810", "#101020", "#080810"];

  // Gradient sky
  const skyGrad = context.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  skyGrad.addColorStop(0, skyColors[0]);
  skyGrad.addColorStop(0.5, skyColors[1]);
  skyGrad.addColorStop(1, skyColors[2]);
  context.fillStyle = skyGrad;
  context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  // Far ridge silhouette
  context.fillStyle = pal.ridgeFar;
  context.beginPath();
  context.moveTo(0, VIEW_HEIGHT * 0.55);
  for (let x = 0; x <= VIEW_WIDTH; x += 40) {
    const h = Math.sin(x * 0.008 + 1.2) * 30 + Math.sin(x * 0.015) * 18;
    context.lineTo(x, VIEW_HEIGHT * 0.55 + h);
  }
  context.lineTo(VIEW_WIDTH, VIEW_HEIGHT);
  context.lineTo(0, VIEW_HEIGHT);
  context.closePath();
  context.fill();

  // Near ridge silhouette
  context.fillStyle = pal.ridgeNear;
  context.beginPath();
  context.moveTo(0, VIEW_HEIGHT * 0.65);
  for (let x = 0; x <= VIEW_WIDTH; x += 30) {
    const h = Math.sin(x * 0.012 + 2.5) * 22 + Math.sin(x * 0.02 + 0.8) * 14;
    context.lineTo(x, VIEW_HEIGHT * 0.65 + h);
  }
  context.lineTo(VIEW_WIDTH, VIEW_HEIGHT);
  context.lineTo(0, VIEW_HEIGHT);
  context.closePath();
  context.fill();

  // Haze overlay
  if (pal.haze) {
    context.fillStyle = pal.haze;
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  }
}


function drawForestDecorations() {
  if (!isForestScene()) {
    return;
  }

  const zone = getForestZone();
  const themeId = getForestThemeId();
  const zoneIndex = getForestRouteIndex();
  const floorY = getForestFloorY();
  const leftBound = FOREST_LEFT + 54;
  const rightBound = FOREST_RIGHT - 54;

  const staticDecor = Array.isArray(zone?.decorations) ? [...zone.decorations] : [];

  for (const decoration of staticDecor) {
    const asset = getForestDecorationAsset(decoration.asset);
    if (!asset || !asset.loaded) {
      continue;
    }

    const scale = decoration.scale || 1;
    const alpha = typeof decoration.alpha === "number" ? decoration.alpha : 1;
    const yOffset = typeof decoration.yOffset === "number" ? decoration.yOffset : 4;
    const groundY = floorY - cameraY;
    const drawWidth = asset.image.naturalWidth * scale;
    const drawHeight = asset.image.naturalHeight * scale;
    const drawX = Math.round(decoration.x - drawWidth / 2);
    const drawY = Math.round(groundY - yOffset - drawHeight);

    if (drawX > VIEW_WIDTH + 80 || drawX + drawWidth < -80 || drawY > VIEW_HEIGHT + 80 || drawY + drawHeight < -80) {
      continue;
    }

    context.save();
    context.globalAlpha = alpha;
    context.drawImage(asset.image, drawX, drawY, drawWidth, drawHeight);
    context.restore();
  }
}

function getForestDecorationGroundY(x) {
  if (!isForestScene()) {
    return getForestFloorY();
  }

  let groundY = getForestFloorY();
  for (const platform of getScenePlatforms()) {
    if (platform.type !== "forest-floor" && platform.type !== "forest-step" && platform.type !== "forest-path") {
      continue;
    }

    if (x < platform.x || x > platform.x + platform.width) {
      continue;
    }

    groundY = Math.min(groundY, platform.y);
  }

  return groundY;
}

function drawSky() {
  if (isForestScene()) {
    context.fillStyle = "#07090b";
    context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    drawForestThemeBackdrop();
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
  const forestPalette = isForestScene() ? getForestZonePalette() : FOREST_ZONE_DEFAULT_PALETTE;
  const forestThemePatterns = isForestScene() ? getForestThemePatternAssets() : null;
  const forestThemeId = isForestScene() ? getForestThemeId() : "default";

  for (const platform of getScenePlatforms()) {
    if (platform.invisible) continue;
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
      context.fillStyle = forestPalette.floorBase;
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      const floorPatternAlpha = getForestPatternAlpha(forestThemeId, "floor");
      if (floorPatternAlpha > 0) {
        fillPattern(
          forestThemePatterns?.floor || null,
          platform.x,
          platform.y,
          platform.width,
          platform.height,
          forestPalette.floorBase,
          floorPatternAlpha
        );
      }
      context.save();
      context.globalAlpha = 0.18;
      context.fillStyle = forestPalette.floorTop;
      context.fillRect(platform.x, platform.y, platform.width, 8);
      context.restore();
      continue;
    }

    if (platform.type === "forest-ramp") {
      const thick = 18;
      const rampY2 = platform.y2 !== undefined
        ? platform.y2
        : platform.y - platform.width * Math.tan((platform.degrees || 0) * Math.PI / 180);
      context.beginPath();
      context.moveTo(platform.x, platform.y);
      context.lineTo(platform.x + platform.width, rampY2);
      context.lineTo(platform.x + platform.width, rampY2 + thick);
      context.lineTo(platform.x, platform.y + thick);
      context.closePath();
      context.fillStyle = "#4a3c2e";
      context.fill();
      // underside shadow
      context.beginPath();
      context.moveTo(platform.x, platform.y + thick);
      context.lineTo(platform.x + platform.width, rampY2 + thick);
      context.lineTo(platform.x + platform.width, rampY2 + thick + 6);
      context.lineTo(platform.x, platform.y + thick + 6);
      context.closePath();
      context.fillStyle = "rgba(0,0,0,0.35)";
      context.fill();
      // top edge highlight
      context.beginPath();
      context.moveTo(platform.x, platform.y);
      context.lineTo(platform.x + platform.width, rampY2);
      context.strokeStyle = "#9a8060";
      context.lineWidth = 3;
      context.stroke();
      continue;
    }

    if (platform.type === "forest-step") {
      context.fillStyle = forestPalette.stepBase;
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      const stepPatternAlpha = getForestPatternAlpha(forestThemeId, "step");
      if (stepPatternAlpha > 0) {
        fillPattern(
          forestThemePatterns?.step || null,
          platform.x,
          platform.y,
          platform.width,
          platform.height,
          forestPalette.stepBase,
          stepPatternAlpha
        );
      }
      // Top edge highlight
      context.fillStyle = forestPalette.stepTop;
      context.fillRect(platform.x, platform.y, platform.width, 3);
      // Bottom shadow
      context.fillStyle = "rgba(0,0,0,0.25)";
      context.fillRect(platform.x, platform.y + platform.height - 2, platform.width, 2);
      continue;
    }

    if (platform.type === "forest-path") {
      context.fillStyle = forestPalette.pathBase;
      context.fillRect(platform.x, platform.y, platform.width, platform.height);
      const pathPatternAlpha = getForestPatternAlpha(forestThemeId, "path");
      if (pathPatternAlpha > 0) {
        fillPattern(
          forestThemePatterns?.path || null,
          platform.x,
          platform.y,
          platform.width,
          platform.height,
          forestPalette.pathBase,
          pathPatternAlpha
        );
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

function drawSceneWalls() {
  const walls = getSceneWalls();
  if (walls.length === 0) {
    return;
  }

  const forestPalette = getForestZonePalette();
  const forestThemePatterns = getForestThemePatternAssets();
  const forestThemeId = getForestThemeId();
  context.save();
  context.translate(0, -cameraY);

  for (const wall of walls) {
    if (wall.invisible) continue;
    if (wall.y > cameraY + VIEW_HEIGHT + 60 || wall.y + wall.height < cameraY - 60) {
      continue;
    }

    context.fillStyle = forestPalette.wallBase;
    context.fillRect(wall.x, wall.y, wall.width, wall.height);
    const wallPatternAlpha = getForestPatternAlpha(forestThemeId, "wall");
    if (wallPatternAlpha > 0) {
      fillPattern(
        forestThemePatterns?.wall || null,
        wall.x,
        wall.y,
        wall.width,
        wall.height,
        forestPalette.wallBase,
        wallPatternAlpha
      );
    }
  }

  context.restore();
}

function drawSpecialProjectileCrescent(alpha, scale = 1, xOffset = 0) {
  const outerRadius = 50 * scale;
  const innerRadius = 31 * scale;
  const innerOffset = 16 * scale;
  const sweep = Math.PI * 0.82;

  context.save();
  context.translate(xOffset, 0);
  context.globalAlpha = alpha;
  context.shadowBlur = 30 * scale;
  context.shadowColor = "rgba(96, 210, 255, 1)";

  const bloom = context.createRadialGradient(0, 0, 0, 0, 0, outerRadius * 1.9);
  bloom.addColorStop(0, "rgba(116, 219, 255, 0.36)");
  bloom.addColorStop(0.55, "rgba(58, 161, 255, 0.2)");
  bloom.addColorStop(1, "rgba(18, 90, 220, 0)");
  context.fillStyle = bloom;
  context.beginPath();
  context.arc(0, 0, outerRadius * 1.9, 0, Math.PI * 2);
  context.fill();

  const gradient = context.createLinearGradient(-outerRadius, 0, outerRadius, 0);
  gradient.addColorStop(0, "rgba(15, 90, 230, 0)");
  gradient.addColorStop(0.35, "rgba(54, 176, 255, 0.9)");
  gradient.addColorStop(0.72, "rgba(178, 238, 255, 1)");
  gradient.addColorStop(1, "rgba(242, 255, 255, 1)");
  context.fillStyle = gradient;

  context.beginPath();
  context.arc(0, 0, outerRadius, -sweep, sweep, false);
  context.arc(-innerOffset, 0, innerRadius, sweep, -sweep, true);
  context.closePath();
  context.fill();

  context.shadowBlur = 14 * scale;
  context.strokeStyle = "rgba(233, 253, 255, 0.95)";
  context.lineWidth = 2.2 * scale;
  context.beginPath();
  context.arc(0, 0, outerRadius, -sweep, sweep, false);
  context.stroke();

  context.restore();
}

function drawSpecialProjectiles() {
  if (specialProjectiles.length === 0) {
    return;
  }

  for (const projectile of specialProjectiles) {
    if (projectile.scene !== currentScene) {
      continue;
    }

    const life = clamp(1 - projectile.age / projectile.lifetime, 0, 1);
    if (life <= 0) {
      continue;
    }

    const drawY = projectile.y - cameraY;
    context.save();
    context.translate(projectile.x, drawY);
    context.scale(projectile.direction < 0 ? -1 : 1, 1);

    for (let trail = 6; trail >= 1; trail -= 1) {
      const fade = (1 - trail / 7) * life * 0.5;
      drawSpecialProjectileCrescent(fade, 0.9, -trail * 30);
    }

    drawSpecialProjectileCrescent(Math.min(1, life * 1.08), 1.18, 0);
    context.restore();
  }
}

// ── Lightning Stab System ──
const lightningBolts = [];

function drawLightningSegment(x1, y1, x2, y2, width, alpha, color, segments) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return;
  const nx = -dy / len;
  const ny = dx / len;

  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowBlur = width * 4;
  context.shadowColor = color;

  context.beginPath();
  context.moveTo(x1, y1);
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const px = x1 + dx * t;
    const py = y1 + dy * t;
    const jitter = (Math.random() - 0.5) * width * 6;
    context.lineTo(px + nx * jitter, py + ny * jitter);
  }
  context.lineTo(x2, y2);
  context.stroke();
  context.restore();
}

function getSwordTipX() {
  // Attack_3 stab: sword tip moves forward as animation progresses
  // Frame 0: wind up (tip near body), Frame 1: mid stab, Frame 2: full extension
  const stabProgress = clamp(1 - player.lightningStabTime / LIGHTNING_STAB_DURATION, 0, 1);
  const tipOffset = 20 + stabProgress * 42; // 20px at start, 62px fully extended
  return getPlayerCenterX() + player.facing * tipOffset;
}

function getSwordTipY() {
  return player.y + player.height * 0.42;
}

function spawnLightningBolt() {
  lightningBolts.push({
    scene: currentScene,
    age: 0,
    releasing: false,
    fadeTime: 0,
    damageTick: 0
  });
}

function updateLightningBolts(deltaTime) {
  for (let i = lightningBolts.length - 1; i >= 0; i--) {
    const bolt = lightningBolts[i];

    if (bolt.scene !== currentScene) {
      lightningBolts.splice(i, 1);
      continue;
    }

    bolt.age += deltaTime;

    // If releasing, count fade time
    if (bolt.releasing) {
      bolt.fadeTime += deltaTime;
      if (bolt.fadeTime >= LIGHTNING_STAB_BOLT_FADE) {
        lightningBolts.splice(i, 1);
        continue;
      }
    }

    // Beam extends from sword tip outward
    const tipX = getSwordTipX();
    const extend = clamp(bolt.age * 6, 0, 1);
    const beamLen = LIGHTNING_STAB_RANGE * extend;
    const beamEndX = tipX + player.facing * beamLen;
    const beamMinX = Math.min(tipX, beamEndX);
    const beamMaxX = Math.max(tipX, beamEndX);

    // Continuous damage ticks while channeling
    bolt.damageTick -= deltaTime;
    if (bolt.damageTick <= 0 && !bolt.releasing) {
      bolt.damageTick = LIGHTNING_STAB_DAMAGE_TICK;

      let hit = false;
      if (
        isBossEncounterActive() && !boss.dead &&
        getBossCenterX() >= beamMinX && getBossCenterX() <= beamMaxX
      ) {
        damageBoss(LIGHTNING_STAB_DAMAGE);
        hit = true;
      }

      if (
        !hit &&
        isNightborneZone() && nightborne.active && !nightborne.dead &&
        nightborne.x >= beamMinX && nightborne.x <= beamMaxX
      ) {
        damageNightborne(LIGHTNING_STAB_DAMAGE);
        hit = true;
      }

      if (!hit) {
        checkMobProjectileHit(tipX + player.facing * beamLen * 0.5, LIGHTNING_STAB_DAMAGE);
      }
    }
  }
}

function drawLightningBeamBranch(x1, y1, x2, y2, width, alpha, color, segments, depth, maxDepth, dir) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 3) return;
  const nx = -dy / len;
  const ny = dx / len;

  // Build jagged path — more chaotic at higher depth
  const jitterScale = width * (5 + depth * 3);
  const points = [[x1, y1]];
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const jitter = (Math.random() - 0.5) * jitterScale;
    points.push([x1 + dx * t + nx * jitter, y1 + dy * t + ny * jitter]);
  }
  points.push([x2, y2]);

  context.save();
  context.globalAlpha = alpha;
  context.strokeStyle = color;
  context.lineWidth = width;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowBlur = width * 6;
  context.shadowColor = color;

  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i][0], points[i][1]);
  }
  context.stroke();
  context.restore();

  // Recursive branching
  if (depth < maxDepth) {
    const branchChance = depth === 0 ? 0.35 : 0.25;
    for (let i = 2; i < points.length - 1; i += 2) {
      if (Math.random() < branchChance) {
        const branchLen = len * (0.3 + Math.random() * 0.25) / (depth + 1);
        const angle = (Math.random() - 0.5) * Math.PI * 1.1;
        const bx2 = points[i][0] + Math.cos(angle) * branchLen * dir;
        const by2 = points[i][1] + Math.sin(angle) * branchLen;
        drawLightningBeamBranch(
          points[i][0], points[i][1], bx2, by2,
          width * 0.5, alpha * 0.6,
          depth === 0 ? "rgba(140, 190, 255, 0.9)" : "rgba(100, 150, 255, 0.7)",
          Math.max(3, segments - 2), depth + 1, maxDepth, dir
        );
      }
    }
  }
}

function drawLightningBoltJagged(originX, originY, endX, endY, width, alpha, segments) {
  const dx = endX - originX;
  const dy = endY - originY;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 2) return;
  const nx = -dy / len;
  const ny = dx / len;

  context.globalAlpha = alpha;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(originX, originY);
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const jitter = (Math.random() - 0.5) * width * 5;
    context.lineTo(originX + dx * t + nx * jitter, originY + dy * t + ny * jitter);
  }
  context.lineTo(endX, endY);
  context.stroke();
}

function drawLightningBolts() {
  if (lightningBolts.length === 0) return;

  context.save();

  for (const bolt of lightningBolts) {
    if (bolt.scene !== currentScene) continue;

    const life = bolt.releasing ? clamp(1 - bolt.fadeTime / LIGHTNING_STAB_BOLT_FADE, 0, 1) : 1;
    if (life <= 0) continue;

    const dir = player.facing;
    const originX = getSwordTipX();
    const originY = getSwordTipY() - cameraY;
    const t = animationClock;

    const extend = clamp(bolt.age * 6, 0, 1);
    const beamLen = Math.max(4, LIGHTNING_STAB_RANGE * extend);
    const endX = originX + dir * beamLen;
    const midX = originX + dir * beamLen * 0.5;
    const pulse = 0.85 + Math.sin(t * 35) * 0.15;
    const intensity = life * pulse;

    context.globalCompositeOperation = "lighter";
    context.lineCap = "round";
    context.lineJoin = "round";

    // --- Ambient glow ---
    context.globalAlpha = intensity * 0.2;
    context.fillStyle = "rgba(80, 120, 255, 0.15)";
    context.fillRect(Math.min(originX, endX) - 20, originY - 40, Math.abs(endX - originX) + 40, 80);

    // --- Beam core glow ellipse ---
    context.globalAlpha = intensity * 0.4;
    context.fillStyle = "rgba(120, 160, 255, 0.3)";
    context.beginPath();
    context.ellipse(midX, originY, Math.max(2, beamLen * 0.5), Math.max(2, 16 * intensity), 0, 0, Math.PI * 2);
    context.fill();

    // --- Main lightning bolts (5 jagged lines) ---
    context.shadowColor = "rgba(100, 160, 255, 0.8)";
    context.shadowBlur = 8;

    // Outer glow bolts
    context.strokeStyle = "rgba(80, 130, 255, 0.7)";
    drawLightningBoltJagged(originX, originY - 6, endX, originY - 2, 4 * intensity, intensity * 0.4, 8);
    drawLightningBoltJagged(originX, originY + 7, endX, originY + 3, 3.5 * intensity, intensity * 0.35, 7);

    // Main bright bolts
    context.strokeStyle = "rgba(160, 200, 255, 0.9)";
    drawLightningBoltJagged(originX, originY - 3, endX, originY + 1, 3 * intensity, intensity * 0.7, 10);
    drawLightningBoltJagged(originX, originY + 3, endX, originY - 1, 2.5 * intensity, intensity * 0.6, 9);

    // White-hot core
    context.strokeStyle = "rgba(230, 240, 255, 1)";
    context.shadowColor = "rgba(180, 220, 255, 1)";
    context.shadowBlur = 10;
    drawLightningBoltJagged(originX, originY, endX, originY, 2 * intensity, intensity * 0.9, 12);

    context.shadowBlur = 0;
    context.shadowColor = "transparent";

    // --- Branches from main beam ---
    context.strokeStyle = "rgba(130, 180, 255, 0.7)";
    for (let b = 0; b < 4; b++) {
      const bPhase = Math.sin(t * 30 + b * 7);
      if (bPhase < 0.1) continue;
      const bPos = 0.2 + b * 0.2;
      const bx = originX + dir * beamLen * bPos;
      const by = originY + Math.sin(t * 20 + b * 5) * 3;
      const bDir = (b % 2 === 0) ? -1 : 1;
      const bLen = 15 + Math.sin(t * 25 + b * 3) * 8;
      context.globalAlpha = intensity * bPhase * 0.5;
      context.lineWidth = 1.2 * intensity;
      context.beginPath();
      context.moveTo(bx, by);
      context.lineTo(bx + dir * 8, by + bDir * bLen);
      context.lineTo(bx + dir * 14, by + bDir * (bLen * 0.5));
      context.stroke();
    }

    // --- Sword tip flash ---
    context.globalAlpha = intensity * 0.7;
    context.fillStyle = "rgba(220, 240, 255, 0.8)";
    context.beginPath();
    context.arc(originX, originY, Math.max(2, 20 * intensity), 0, Math.PI * 2);
    context.fill();

    // --- Impact flash ---
    if (extend > 0.7) {
      context.globalAlpha = intensity * 0.5;
      context.fillStyle = "rgba(180, 210, 255, 0.6)";
      context.beginPath();
      context.arc(endX, originY, Math.max(2, 22 * intensity), 0, Math.PI * 2);
      context.fill();
    }

    // --- Sparks ---
    context.fillStyle = "rgba(220, 240, 255, 0.9)";
    for (let p = 0; p < 6; p++) {
      const sparkT = (t * 8 + p * 0.73) % 1;
      const px = originX + dir * beamLen * sparkT;
      const py = originY + Math.sin(t * 40 + p * 5.7) * 12;
      const sz = 1.5 + Math.sin(t * 55 + p * 3) * 1;
      if (sz <= 0) continue;
      context.globalAlpha = intensity * (0.4 + Math.sin(t * 50 + p * 7) * 0.3);
      context.beginPath();
      context.arc(px, py, sz, 0, Math.PI * 2);
      context.fill();
    }

    // --- Ground glow ---
    const groundY = player.y + player.height - cameraY + 2;
    context.globalAlpha = intensity * 0.12;
    context.fillStyle = "rgba(80, 120, 255, 0.3)";
    context.fillRect(Math.min(originX, endX), groundY - 2, Math.abs(endX - originX), 6);
  }

  context.restore();
}

function isLightningStabActive() {
  // Safety: if no timer, not channeling, and no bolts, definitely not active
  if (player.lightningStabTime <= 0 && !player.lightningChanneling && lightningBolts.length === 0) return false;
  if (player.dead) return false;
  // Hard safety: if bolts have been alive too long (5s), force cleanup
  if (lightningBolts.length > 0 && lightningBolts[0].age > 5) {
    lightningBolts.length = 0;
    player.lightningChanneling = false;
    return false;
  }
  return true;
}

function triggerLightningStab() {
  if (!canPlayerFight() || player.hurtTime > 0 || !player.grounded) return;
  if (player.lightningStabCooldown > 0 || isLightningStabActive() || isPlayerSpecialAttacking() || isPlayerDashing()) return;

  player.lightningStabTime = LIGHTNING_STAB_DURATION;
  player.lightningBoltSpawned = false;
  player.lightningDamageTick = 0;
  player.lightningChanneling = true;
  player.attackTime = 0;
  player.attackHitDone = true;
  player.blocking = false;
  player.vx = 0;
}

function drawSamuraiGroundSpears(progress) {
  const erupt = clamp(progress * 4.4, 0, 1);
  const hold = clamp((1 - progress) * 1.18, 0, 1);
  const alpha = erupt * (0.44 + hold * 0.92);

  if (alpha <= 0.02) {
    return;
  }

  const baseY = player.height + 2;
  const offsets = [-84, -68, -54, -40, -28, -16, -6, 0, 6, 16, 28, 40, 54, 68, 84];
  const pulse = 0.96 + Math.sin(animationClock * 26) * 0.11;

  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = Math.min(1, alpha * 1.36);

  const floorBloom = context.createRadialGradient(0, baseY + 2, 8, 0, baseY + 2, 104);
  floorBloom.addColorStop(0, "rgba(212, 246, 255, 0.78)");
  floorBloom.addColorStop(0.28, "rgba(102, 204, 255, 0.58)");
  floorBloom.addColorStop(0.72, "rgba(32, 124, 255, 0.26)");
  floorBloom.addColorStop(1, "rgba(16, 78, 220, 0)");
  context.fillStyle = floorBloom;
  context.beginPath();
  context.ellipse(0, baseY + 2, 94, 16, 0, 0, Math.PI * 2);
  context.fill();

  const ringWidth = 78 + erupt * 58;
  const ringHeight = 11 + erupt * 4;
  context.strokeStyle = `rgba(178, 238, 255, ${0.5 + hold * 0.4})`;
  context.lineWidth = 2.2;
  context.beginPath();
  context.ellipse(0, baseY + 1, ringWidth, ringHeight, 0, 0, Math.PI * 2);
  context.stroke();

  for (let index = 0; index < offsets.length; index += 1) {
    const offsetX = offsets[index];
    const distance = Math.abs(offsetX) / 84;
    const coreHeight = 72 + (1 - distance) * 95;
    const wave = Math.sin(animationClock * 19 + index * 0.82) * 7;
    const spearHeight = (coreHeight + wave) * (0.35 + erupt * 0.74) * pulse;
    const halfWidth = 5 + (1 - distance) * 7;
    const tipY = baseY - spearHeight;

    const auraGradient = context.createLinearGradient(0, baseY + 2, 0, tipY - 14);
    auraGradient.addColorStop(0, "rgba(8, 32, 148, 0)");
    auraGradient.addColorStop(0.2, "rgba(18, 74, 224, 0.78)");
    auraGradient.addColorStop(0.58, "rgba(42, 136, 255, 0.62)");
    auraGradient.addColorStop(1, "rgba(184, 234, 255, 0.36)");

    const outerGradient = context.createLinearGradient(0, baseY, 0, tipY);
    outerGradient.addColorStop(0, "rgba(14, 70, 230, 0)");
    outerGradient.addColorStop(0.18, "rgba(18, 82, 244, 0.9)");
    outerGradient.addColorStop(0.56, "rgba(58, 165, 255, 0.96)");
    outerGradient.addColorStop(0.86, "rgba(168, 231, 255, 0.99)");
    outerGradient.addColorStop(1, "rgba(244, 255, 255, 1)");

    context.save();
    context.translate(offsetX, 0);
    context.shadowBlur = 30;
    context.shadowColor = "rgba(34, 122, 255, 0.98)";

    context.fillStyle = auraGradient;
    context.beginPath();
    context.moveTo(0, tipY - 14);
    context.lineTo(-(halfWidth + 5), baseY + 2);
    context.lineTo(halfWidth + 5, baseY + 2);
    context.closePath();
    context.fill();

    context.fillStyle = outerGradient;
    context.beginPath();
    context.moveTo(0, tipY);
    context.lineTo(-halfWidth, baseY);
    context.lineTo(halfWidth, baseY);
    context.closePath();
    context.fill();

    const coreGradient = context.createLinearGradient(0, baseY, 0, tipY);
    coreGradient.addColorStop(0, "rgba(58, 168, 255, 0)");
    coreGradient.addColorStop(0.45, "rgba(192, 242, 255, 0.9)");
    coreGradient.addColorStop(1, "rgba(255, 255, 255, 1)");
    context.fillStyle = coreGradient;
    context.beginPath();
    context.moveTo(0, tipY + 2);
    context.lineTo(-(halfWidth * 0.34), baseY);
    context.lineTo(halfWidth * 0.34, baseY);
    context.closePath();
    context.fill();

    context.shadowBlur = 0;
    context.strokeStyle = "rgba(236, 254, 255, 0.98)";
    context.lineWidth = 1.45;
    context.beginPath();
    context.moveTo(0, tipY + 0.5);
    context.lineTo(0, baseY - 1);
    context.stroke();

    context.fillStyle = "rgba(222, 250, 255, 0.9)";
    context.beginPath();
    context.arc(0, tipY - 2, 1.8, 0, Math.PI * 2);
    context.fill();
    context.restore();
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
  if (!isForestScene() || !isBonfireZone()) {
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
  const crouchOffset = 0;
  const direction = currentAim() || player.facing;
  const activeCharacter = getActiveCharacter();
  const spriteState = getPlayerSpriteState();
  const activeSprite = getActiveCharacterAsset(spriteState);
  const flashing = player.invulnerableTime > 0 && Math.floor(player.invulnerableTime * 18) % 2 === 0;

  context.save();
  if (flashing) {
    context.globalAlpha = 0.58;
  }
  context.translate(drawX + player.width / 2, drawY);
  context.scale(direction < 0 ? -1 : 1, 1);

  if (activeSprite && activeSprite.loaded) {
    if (spriteState === "dash") {
      const baseAlpha = context.globalAlpha;
      const dashProgress = clamp(1 - player.dashTime / PLAYER_DASH_DURATION, 0, 1);
      const trailStrength = 1 - dashProgress * 0.3;
      const t = animationClock;
      const cx = 0;
      const cy = player.height * 0.42;

      context.save();

      // --- Electric aura glow around character silhouette ---
      context.globalCompositeOperation = "lighter";
      const auraFlicker = 0.7 + Math.sin(t * 35) * 0.3;
      context.globalAlpha = baseAlpha * 0.25 * auraFlicker * trailStrength;
      const auraGrad = context.createRadialGradient(cx, cy, 2, cx, cy, 48);
      auraGrad.addColorStop(0, "rgba(160, 200, 255, 1)");
      auraGrad.addColorStop(0.3, "rgba(100, 160, 255, 0.6)");
      auraGrad.addColorStop(0.6, "rgba(60, 120, 255, 0.2)");
      auraGrad.addColorStop(1, "rgba(40, 80, 220, 0)");
      context.fillStyle = auraGrad;
      context.fillRect(-50, cy - 50, 100, 100);

      // --- Wind mist trail ---
      context.globalCompositeOperation = "screen";
      context.globalAlpha = baseAlpha * (0.18 + trailStrength * 0.12);
      const mistGradient = context.createLinearGradient(-280, 0, 30, 0);
      mistGradient.addColorStop(0, "rgba(200, 220, 255, 0)");
      mistGradient.addColorStop(0.25, "rgba(170, 200, 250, 0.3)");
      mistGradient.addColorStop(0.6, "rgba(130, 175, 245, 0.18)");
      mistGradient.addColorStop(1, "rgba(200, 230, 255, 0)");
      context.fillStyle = mistGradient;
      context.fillRect(-280, -14, 310, 58);

      // --- Wind streaks ---
      context.lineCap = "round";
      for (let i = 0; i < 10; i += 1) {
        const y = -16 + i * 5.5 + Math.sin(t * 12 + i * 1.3) * 2.5;
        const startX = -300 - i * 10;
        const endX = 28 - i * 2;
        const ctrlX = startX + 100 + i * 6;
        const ctrlY = y + Math.sin(t * 10 + i) * (1.5 + i * 0.06);
        const lineAlpha = (0.15 + (10 - i) * 0.02) * trailStrength;
        const lineGradient = context.createLinearGradient(startX, y, endX, y);
        lineGradient.addColorStop(0, "rgba(200, 225, 255, 0)");
        lineGradient.addColorStop(0.2, `rgba(180, 210, 250, ${lineAlpha})`);
        lineGradient.addColorStop(0.55, `rgba(140, 185, 240, ${lineAlpha * 0.65})`);
        lineGradient.addColorStop(1, "rgba(210, 235, 255, 0)");
        context.strokeStyle = lineGradient;
        context.lineWidth = 1.0 + (10 - i) * 0.12;
        context.beginPath();
        context.moveTo(startX, y);
        context.quadraticCurveTo(ctrlX, ctrlY, endX, y + Math.sin(t * 14 + i) * 0.8);
        context.stroke();
      }

      // --- Main lightning bolts (6 big, bright, jagged) ---
      context.globalCompositeOperation = "lighter";
      context.lineCap = "round";
      context.lineJoin = "round";
      const boltSeed = Math.floor(t * 22);
      for (let b = 0; b < 6; b++) {
        const seed = boltSeed * 3 + b * 53;
        const flickerPhase = Math.sin(t * 40 + b * 3.9);
        if (flickerPhase < -0.25) continue;
        const intensity = (0.65 + flickerPhase * 0.35) * trailStrength;
        const yBase = -14 + b * 7.5 + Math.sin(seed * 0.17) * 8;
        const boltStartX = -260 - (seed % 60);
        const boltEndX = 30 + (seed % 20);
        const segments = 10 + (seed % 6);
        const segLen = (boltEndX - boltStartX) / segments;

        // Store points for reuse
        const pts = [{x: boltStartX, y: yBase}];
        for (let s = 1; s <= segments; s++) {
          pts.push({
            x: boltStartX + s * segLen,
            y: yBase + Math.sin(seed * 0.8 + s * 2.7) * 6 + Math.cos(seed * 0.3 + s * 4.1) * 3
          });
        }

        // Outer glow
        context.globalAlpha = baseAlpha * intensity * 0.4;
        context.strokeStyle = `rgba(80, 140, 255, 1)`;
        context.lineWidth = 5;
        context.shadowColor = "rgba(80, 150, 255, 1)";
        context.shadowBlur = 14;
        context.beginPath();
        context.moveTo(pts[0].x, pts[0].y);
        for (let s = 1; s < pts.length; s++) context.lineTo(pts[s].x, pts[s].y);
        context.stroke();

        // Main bolt
        context.globalAlpha = baseAlpha * intensity * 0.85;
        context.strokeStyle = `rgba(160, 200, 255, 1)`;
        context.lineWidth = 2.5;
        context.shadowColor = "rgba(120, 180, 255, 0.9)";
        context.shadowBlur = 8;
        context.beginPath();
        context.moveTo(pts[0].x, pts[0].y);
        for (let s = 1; s < pts.length; s++) context.lineTo(pts[s].x, pts[s].y);
        context.stroke();

        // White-hot core
        context.globalAlpha = baseAlpha * intensity * 0.9;
        context.strokeStyle = `rgba(230, 240, 255, 1)`;
        context.lineWidth = 1.0;
        context.shadowColor = "rgba(200, 230, 255, 0.6)";
        context.shadowBlur = 4;
        context.beginPath();
        context.moveTo(pts[0].x, pts[0].y);
        for (let s = 1; s < pts.length; s++) context.lineTo(pts[s].x, pts[s].y);
        context.stroke();

        // Branches from random midpoints
        for (let br = 0; br < 2; br++) {
          const brIdx = Math.floor(segments * (0.3 + br * 0.3));
          if (brIdx >= pts.length) continue;
          const brFlicker = Math.sin(t * 50 + b * 7 + br * 11);
          if (brFlicker < 0.1) continue;
          const bp = pts[brIdx];
          const brDir = ((seed + br) % 2 === 0) ? -1 : 1;
          const brLen = 18 + (seed % 14);
          context.globalAlpha = baseAlpha * intensity * 0.55;
          context.strokeStyle = `rgba(140, 190, 255, 1)`;
          context.lineWidth = 1.4;
          context.shadowBlur = 5;
          context.beginPath();
          context.moveTo(bp.x, bp.y);
          const mx = bp.x + brLen * 0.5 + (seed % 6);
          const my = bp.y + brDir * (brLen * 0.6);
          const ex = bp.x + brLen + (seed % 8);
          const ey = bp.y + brDir * (brLen * 0.35);
          context.lineTo(mx, my);
          context.lineTo(ex, ey);
          context.stroke();

          // Sub-branch
          if (brFlicker > 0.5) {
            context.globalAlpha = baseAlpha * intensity * 0.3;
            context.lineWidth = 0.8;
            context.beginPath();
            context.moveTo(mx, my);
            context.lineTo(mx + 10 + (seed % 5), my + brDir * (6 + (seed % 5)));
            context.stroke();
          }
        }

        context.shadowBlur = 0;
        context.shadowColor = "transparent";
      }

      // --- Electric sparks at player position ---
      context.globalCompositeOperation = "lighter";
      for (let sp = 0; sp < 5; sp++) {
        const sparkPhase = Math.sin(t * 55 + sp * 8.3);
        if (sparkPhase < 0.2) continue;
        const sx = cx + Math.sin(t * 30 + sp * 5) * 18;
        const sy = cy + Math.cos(t * 25 + sp * 7) * 22;
        context.globalAlpha = baseAlpha * sparkPhase * 0.7 * trailStrength;
        const sparkGrad = context.createRadialGradient(sx, sy, 0, sx, sy, 4 + sparkPhase * 3);
        sparkGrad.addColorStop(0, "rgba(220, 240, 255, 1)");
        sparkGrad.addColorStop(0.5, "rgba(100, 170, 255, 0.6)");
        sparkGrad.addColorStop(1, "rgba(60, 120, 255, 0)");
        context.fillStyle = sparkGrad;
        context.fillRect(sx - 8, sy - 8, 16, 16);
      }

      // --- Bright core flash where the character is ---
      context.globalCompositeOperation = "screen";
      const flashPulse = 0.6 + Math.sin(t * 30) * 0.4;
      context.globalAlpha = baseAlpha * 0.22 * flashPulse * trailStrength;
      const flashGrad = context.createRadialGradient(cx, cy, 0, cx, cy, 38);
      flashGrad.addColorStop(0, "rgba(200, 225, 255, 1)");
      flashGrad.addColorStop(0.25, "rgba(140, 190, 255, 0.6)");
      flashGrad.addColorStop(0.6, "rgba(80, 140, 255, 0.2)");
      flashGrad.addColorStop(1, "rgba(60, 110, 255, 0)");
      context.fillStyle = flashGrad;
      context.fillRect(-40, cy - 40, 80, 80);

      context.restore();
      context.globalAlpha = baseAlpha;
    } else if (spriteState === "jumpAttack" && activeCharacter.id === "samurai") {
      const jumpAttackProgress = getJumpAttackProgress();
      drawSamuraiGroundSpears(jumpAttackProgress);
      const baseAlpha = context.globalAlpha;
      context.globalCompositeOperation = "screen";
      context.filter = "brightness(1.72) saturate(1.95)";
      context.globalAlpha = baseAlpha;
      drawPlayerSprite(activeSprite, spriteState);
      context.filter = "none";
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = baseAlpha;
    } else if (spriteState === "special" && activeCharacter.id === "samurai") {
      const baseAlpha = context.globalAlpha;
      // Draw character normally first
      drawPlayerSprite(activeSprite, spriteState);
      // Then add a bright glow overlay on top
      context.globalCompositeOperation = "screen";
      context.filter = "brightness(1.6) saturate(1.8)";
      context.globalAlpha = baseAlpha * 0.35;
      drawPlayerSprite(activeSprite, spriteState);
      context.filter = "none";
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = baseAlpha;
    } else if (spriteState === "lightningStab") {
      const baseAlpha = context.globalAlpha;
      // Draw character normally first
      drawPlayerSprite(activeSprite, spriteState);
      // Then add electric glow overlay
      context.globalCompositeOperation = "screen";
      context.filter = "brightness(1.6) saturate(2.0) hue-rotate(20deg)";
      context.globalAlpha = baseAlpha * 0.3;
      drawPlayerSprite(activeSprite, spriteState);
      context.filter = "none";
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = baseAlpha;
    } else {
      drawPlayerSprite(activeSprite, spriteState);
    }
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

  // Player health bar — fixed top-left HUD
  drawHealthBar(16, 58, 120, 10, player.health, player.maxHealth, "#c24646");
}

function getPlayerFrameIndex(spriteState, frameCount) {
  let frameIndex = 0;

  if (spriteState === "dead" && frameCount > 1) {
    frameIndex = frameCount - 1;
  } else if (spriteState === "hurt" && frameCount > 1) {
    frameIndex = Math.min(frameCount - 1, 1);
  } else if (spriteState === "special" && frameCount > 1) {
    const specialProgress = getSpecialProgress();
    frameIndex = Math.min(frameCount - 1, Math.floor(specialProgress * frameCount));
  } else if (spriteState === "jumpAttack" && frameCount > 1) {
    const jumpAttackProgress = getJumpAttackProgress();
    frameIndex = Math.min(frameCount - 1, Math.floor(jumpAttackProgress * frameCount));
  } else if (spriteState === "lightningStab" && frameCount > 1) {
    const stabProgress = clamp(1 - player.lightningStabTime / LIGHTNING_STAB_DURATION, 0, 1);
    frameIndex = Math.min(frameCount - 1, Math.floor(stabProgress * frameCount));
  } else if (spriteState === "attack" && frameCount > 1) {
    const attackProgress = 1 - player.attackTime / PLAYER_ATTACK_DURATION;
    frameIndex = Math.min(frameCount - 1, Math.floor(attackProgress * frameCount));
  } else if (spriteState === "block" && frameCount > 1) {
    frameIndex = Math.min(frameCount - 1, 1);
  } else if (spriteState === "jump" && frameCount > 1) {
    const fallRatio = clamp((player.vy + 320) / 1100, 0, 1);
    frameIndex = Math.round(fallRatio * (frameCount - 1));
  } else if (spriteState === "dash" && frameCount > 1) {
    const dashProgress = clamp(1 - player.dashTime / PLAYER_DASH_DURATION, 0, 1);
    frameIndex = Math.min(frameCount - 1, Math.floor(dashProgress * frameCount));
  } else if (spriteState === "run" && frameCount > 1) {
    frameIndex = Math.floor(animationClock * 12) % frameCount;
  } else if (spriteState === "idle" && frameCount > 1) {
    frameIndex = Math.floor(animationClock * 4) % frameCount;
  }

  return frameIndex;
}

function drawPlayerSprite(asset, spriteState, frameOverride, xOffset = 0, scale = 1, yOffset = 0) {
  const spriteSource = getSpriteRenderSource(asset, spriteState);
  const frameCount = getFrameCount(asset);
  const { width: sourceWidth, height: sourceHeight } = getSpriteRenderableDimensions(spriteSource);
  const frameWidth = sourceWidth / frameCount;
  const cropHeight = asset._frameHeight || sourceHeight;
  const frameIndex = typeof frameOverride === "number" ? frameOverride : getPlayerFrameIndex(spriteState, frameCount);
  const drawWidth = CHARACTER_DRAW_WIDTH * scale;
  const drawHeight = CHARACTER_DRAW_HEIGHT * scale;

  context.drawImage(
    spriteSource,
    frameIndex * frameWidth,
    0,
    frameWidth,
    cropHeight,
    -drawWidth / 2 + xOffset,
    -42 + yOffset,
    drawWidth,
    drawHeight
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
    const forestZone = getForestZone();
    const routeLabel = `${getForestRouteIndex() + 1}/${forestRouteZones.length}`;
    context.fillStyle = "rgba(233, 248, 217, 0.94)";
    context.font = "22px Georgia";
    context.fillText(forestZone.title || "Forest Route", 24, 34);
    context.fillStyle = "rgba(170, 222, 160, 0.9)";
    context.font = "14px Georgia";
    if (isBonfireZone() && forestBonfire.active) {
      context.fillText("Bonfire bound: checkpoint active and healing", 24, 56);
    } else if (isBonfireZone()) {
      context.fillText("Touch the bonfire to bind checkpoint and heal", 24, 56);
    } else {
      context.fillText(`${routeLabel}  ${forestZone.subtitle || "Follow the route onward"}`, 24, 56);
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
  drawSceneWalls();
  drawForestDecorations();
  drawTeleporters();
  drawBoss();
  drawNightborne();
  drawMobs();
  drawSpecialProjectiles();
  drawLightningBolts();
  drawGoal();
  drawForestBonfire();
  drawAmbientParticles();
  drawPlayer();
  drawOverlayText();
  drawVignette();
}

function updateHud() {
  const heightPercent = 1 - clamp((getTowerHeightReferenceY() + player.height - goal.y) / (FLOOR_Y - goal.y), 0, 1);
  const meters = Math.round(heightPercent * 100);
  heightLabel.textContent = `Height ${meters} m`;

  if (pauseMenuOpen) {
    statusLabel.textContent = "Paused";
    statusLabel.style.color = "#9fc4ff";
    return;
  }

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
    const forestZone = getForestZone();
    if (isBonfireZone() && forestBonfire.playerNearby) {
      statusLabel.textContent = "Resting";
      statusLabel.style.color = "#f0c777";
      return;
    }

    if (isBonfireZone() && forestBonfire.active) {
      statusLabel.textContent = "Checkpoint active";
      statusLabel.style.color = "#9fd18d";
      return;
    }

    statusLabel.textContent = forestZone.title || "Forest route";
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

  if (isPlayerSpecialAttacking()) {
    statusLabel.textContent = "Special move";
    statusLabel.style.color = "#6ec8ff";
    return;
  }

  if (isPlayerJumpAttacking()) {
    statusLabel.textContent = "Jump attack";
    statusLabel.style.color = "#7cd2ff";
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

  try {
    pollGamepad();
    update(deltaTime);
    render();
    updateHud();
  } catch (e) {
    console.error("Game loop error:", e);
    // Emergency cleanup of lightning state to prevent permanent freeze
    player.lightningStabTime = 0;
    player.lightningChanneling = false;
    player.lightningBoltSpawned = false;
    player.lightningDamageTick = 0;
    lightningBolts.length = 0;
  }

  requestAnimationFrame(tick);
}

setupCharacterSelect();
setupPauseMenu();
setupFullscreenMenu();
activateGameInput();
resetPlayer();
requestAnimationFrame((now) => {
  lastTime = now;
  tick(now);
});
