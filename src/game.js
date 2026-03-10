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
const PLAYER_JUMP_ATTACK_DAMAGE = 36;
const PLAYER_JUMP_ATTACK_RANGE = 156;
const PLAYER_JUMP_ATTACK_VERTICAL_RANGE = 220;
const PLAYER_JUMP_ATTACK_DURATION = 0.62;
const PLAYER_JUMP_ATTACK_COOLDOWN = 1.08;
const PLAYER_JUMP_ATTACK_HIT_START = 0.14;
const PLAYER_JUMP_ATTACK_HIT_END = 0.62;
const PLAYER_DASH_SPEED = 700;
const PLAYER_DASH_DURATION = 0.34;
const PLAYER_DASH_COOLDOWN = 0.62;
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
const CAMERA_LOOKAHEAD_UP = -84;
const CAMERA_LOOKAHEAD_DOWN = 66;
const CAMERA_LOOKAHEAD_LERP = 420;

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
    subtitle: "Bonfire clearing and first route split",
    theme: "art-forest",
    decorations: [
      { asset: "oak-sign", x: 148, yOffset: 0, scale: 3.2, alpha: 0.95 },
      { asset: "oak-grass-1", x: 222, yOffset: 0, scale: 2.9, alpha: 0.86 },
      { asset: "oak-lamp", x: 318, yOffset: 0, scale: 2.8, alpha: 0.88 },
      { asset: "oak-rock-1", x: 540, yOffset: 0, scale: 3.8, alpha: 0.74 },
      { asset: "oak-grass-2", x: 666, yOffset: 0, scale: 2.8, alpha: 0.82 }
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
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 166, y: FOREST_FLOOR_Y - 86, width: 136, height: 18, type: "forest-step" },
      { x: 372, y: FOREST_FLOOR_Y - 138, width: 146, height: 18, type: "forest-step" },
      { x: 610, y: FOREST_FLOOR_Y - 92, width: 124, height: 18, type: "forest-step" }
    ],
    walls: [],
    transitions: [
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 126,
        width: 20,
        height: 128,
        targetZone: 1,
        spawnX: FOREST_LEFT + 20,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "moss-climb",
    title: "Moss Climb",
    subtitle: "Wall-jump up the shaft to move on",
    theme: "mossy",
    decorations: [
      { asset: "moss-vines", x: 170, yOffset: 252, scale: 0.25, alpha: 0.72 },
      { asset: "moss-vines", x: 420, yOffset: 308, scale: 0.28, alpha: 0.78 },
      { asset: "moss-vines", x: 602, yOffset: 334, scale: 0.31, alpha: 0.7 },
      { asset: "oak-rock-2", x: 286, yOffset: 0, scale: 3.3, alpha: 0.7 },
      { asset: "oak-grass-3", x: 736, yOffset: 0, scale: 2.8, alpha: 0.82 }
    ],
    palette: {
      sky: ["#13271f", "#1e3a30", "#101f19"],
      haze: "rgba(120, 189, 146, 0.1)",
      ridgeFar: "#1f3328",
      ridgeNear: "#17281f",
      floorBase: "#26382a",
      floorTop: "#4d744b",
      stepBase: "#3a5240",
      stepTop: "#79a06f",
      pathBase: "#3f3527",
      pathTop: "#7c684d",
      wallBase: "#2d3f32",
      wallEdge: "#8ec081"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 114, y: FOREST_FLOOR_Y - 82, width: 154, height: 18, type: "forest-step" },
      { x: 258, y: FOREST_FLOOR_Y - 136, width: 118, height: 16, type: "forest-step" },
      { x: 512, y: FOREST_FLOOR_Y - 282, width: 232, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 376, y: FOREST_FLOOR_Y - 258, width: 26, height: 258, type: "forest-wall" },
      { x: 560, y: FOREST_FLOOR_Y - 338, width: 26, height: 338, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 126,
        width: 20,
        height: 128,
        targetZone: 0,
        spawnX: FOREST_RIGHT - 90,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 42,
        y: FOREST_FLOOR_Y - 294,
        width: 38,
        height: 118,
        targetZone: 2,
        spawnX: FOREST_LEFT + 56,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "ashen-hollow",
    title: "Ashen Hollow",
    subtitle: "Darker fantasy route prototype",
    theme: "stringstar",
    decorations: [
      { asset: "oak-fence-1", x: 172, yOffset: 0, scale: 2.8, alpha: 0.78 },
      { asset: "oak-rock-3", x: 304, yOffset: 0, scale: 3.6, alpha: 0.76 },
      { asset: "oak-sign", x: 558, yOffset: 0, scale: 3, alpha: 0.86 },
      { asset: "oak-grass-2", x: 690, yOffset: 0, scale: 2.6, alpha: 0.76 }
    ],
    palette: {
      sky: ["#161018", "#2a1f2d", "#160d13"],
      haze: "rgba(178, 126, 162, 0.08)",
      ridgeFar: "#2d2031",
      ridgeNear: "#1f1524",
      floorBase: "#3a2f35",
      floorTop: "#7c5d6d",
      stepBase: "#55434c",
      stepTop: "#9b7a89",
      pathBase: "#3d312c",
      pathTop: "#7c6258",
      wallBase: "#47383f",
      wallEdge: "#b78fa4"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 206, y: FOREST_FLOOR_Y - 96, width: 136, height: 18, type: "forest-step" },
      { x: 430, y: FOREST_FLOOR_Y - 152, width: 166, height: 18, type: "forest-step" },
      { x: 664, y: FOREST_FLOOR_Y - 94, width: 124, height: 18, type: "forest-step" }
    ],
    walls: [],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 126,
        width: 20,
        height: 128,
        targetZone: 1,
        spawnX: FOREST_RIGHT - 106,
        spawnY: FOREST_FLOOR_Y - 210
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 126,
        width: 20,
        height: 128,
        targetZone: 3,
        spawnX: FOREST_LEFT + 24,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "verdant-bridge",
    title: "Verdant Bridge",
    subtitle: "Route endpoint for now",
    theme: "oak-woods",
    decorations: [
      { asset: "oak-fence-2", x: 188, yOffset: 0, scale: 2.8, alpha: 0.86 },
      { asset: "oak-lamp", x: 426, yOffset: 0, scale: 3, alpha: 0.96 },
      { asset: "oak-grass-1", x: 506, yOffset: 0, scale: 2.8, alpha: 0.84 },
      { asset: "oak-rock-1", x: 760, yOffset: 0, scale: 3.6, alpha: 0.72 }
    ],
    palette: {
      sky: ["#122019", "#1f3329", "#101813"],
      haze: "rgba(122, 197, 153, 0.08)",
      ridgeFar: "#1e3127",
      ridgeNear: "#15261e",
      floorBase: "#2b3b33",
      floorTop: "#5e8c76",
      stepBase: "#3d554a",
      stepTop: "#88b99d",
      pathBase: "#334036",
      pathTop: "#6f8f7d",
      wallBase: "#32483c",
      wallEdge: "#8bc7a7"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 176, y: FOREST_FLOOR_Y - 72, width: 150, height: 18, type: "forest-step" },
      { x: 404, y: FOREST_FLOOR_Y - 126, width: 154, height: 18, type: "forest-step" },
      { x: 652, y: FOREST_FLOOR_Y - 84, width: 144, height: 18, type: "forest-step" }
    ],
    walls: [],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 126,
        width: 20,
        height: 128,
        targetZone: 2,
        spawnX: FOREST_RIGHT - 88,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 4,
        spawnX: FOREST_LEFT + 34,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "art-canopy-gauntlet",
    title: "Canopy Gauntlet",
    subtitle: "Dual combat lanes with overhead flank route",
    theme: "art-forest",
    decorations: [
      { asset: "oak-lamp", x: 126, yOffset: 4, scale: 2.9, alpha: 0.86 },
      { asset: "oak-sign", x: 298, yOffset: 4, scale: 2.9, alpha: 0.9 },
      { asset: "oak-rock-2", x: 472, yOffset: 3, scale: 3.4, alpha: 0.74 },
      { asset: "oak-grass-2", x: 642, yOffset: 2, scale: 2.8, alpha: 0.82 },
      { asset: "oak-fence-1", x: 812, yOffset: 4, scale: 2.8, alpha: 0.8 }
    ],
    palette: {
      sky: ["#163020", "#2a4f36", "#16291f"],
      haze: "rgba(154, 221, 173, 0.12)",
      ridgeFar: "#223a2c",
      ridgeNear: "#1a3024",
      floorBase: "#2c4131",
      floorTop: "#5f9165",
      stepBase: "#3f5c48",
      stepTop: "#86be84",
      pathBase: "#504130",
      pathTop: "#977f5d",
      wallBase: "#314738",
      wallEdge: "#81ba8c"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 96, y: FOREST_FLOOR_Y - 60, width: 126, height: 18, type: "forest-step" },
      { x: 262, y: FOREST_FLOOR_Y - 114, width: 118, height: 18, type: "forest-step" },
      { x: 414, y: FOREST_FLOOR_Y - 80, width: 128, height: 18, type: "forest-step" },
      { x: 578, y: FOREST_FLOOR_Y - 142, width: 132, height: 18, type: "forest-step" },
      { x: 742, y: FOREST_FLOOR_Y - 94, width: 124, height: 18, type: "forest-step" },
      { x: 188, y: FOREST_FLOOR_Y - 208, width: 150, height: 16, type: "forest-step" },
      { x: 386, y: FOREST_FLOOR_Y - 246, width: 162, height: 16, type: "forest-step" },
      { x: 624, y: FOREST_FLOOR_Y - 216, width: 156, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 236, y: FOREST_FLOOR_Y - 176, width: 24, height: 176, type: "forest-wall" },
      { x: 552, y: FOREST_FLOOR_Y - 226, width: 24, height: 226, type: "forest-wall" },
      { x: 706, y: FOREST_FLOOR_Y - 184, width: 22, height: 184, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 3,
        spawnX: FOREST_RIGHT - 96,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 5,
        spawnX: FOREST_LEFT + 34,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "art-roots-bastion",
    title: "Roots Bastion",
    subtitle: "Stacked hold points for controlled skirmishes",
    theme: "art-forest",
    decorations: [
      { asset: "oak-fence-2", x: 140, yOffset: 4, scale: 2.8, alpha: 0.86 },
      { asset: "oak-rock-3", x: 318, yOffset: 3, scale: 3.2, alpha: 0.74 },
      { asset: "oak-lamp", x: 488, yOffset: 4, scale: 2.9, alpha: 0.88 },
      { asset: "oak-sign", x: 656, yOffset: 4, scale: 2.8, alpha: 0.84 },
      { asset: "oak-grass-1", x: 814, yOffset: 2, scale: 2.7, alpha: 0.8 }
    ],
    palette: {
      sky: ["#163224", "#2c533c", "#162a21"],
      haze: "rgba(162, 226, 186, 0.11)",
      ridgeFar: "#243d2f",
      ridgeNear: "#1b3226",
      floorBase: "#2d4434",
      floorTop: "#669a70",
      stepBase: "#40604d",
      stepTop: "#8cc48f",
      pathBase: "#524332",
      pathTop: "#9a8260",
      wallBase: "#334b3d",
      wallEdge: "#88c194"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 86, y: FOREST_FLOOR_Y - 68, width: 154, height: 18, type: "forest-step" },
      { x: 278, y: FOREST_FLOOR_Y - 122, width: 122, height: 18, type: "forest-step" },
      { x: 430, y: FOREST_FLOOR_Y - 86, width: 130, height: 18, type: "forest-step" },
      { x: 592, y: FOREST_FLOOR_Y - 144, width: 136, height: 18, type: "forest-step" },
      { x: 756, y: FOREST_FLOOR_Y - 96, width: 108, height: 18, type: "forest-step" },
      { x: 176, y: FOREST_FLOOR_Y - 206, width: 160, height: 16, type: "forest-step" },
      { x: 394, y: FOREST_FLOOR_Y - 246, width: 172, height: 16, type: "forest-step" },
      { x: 634, y: FOREST_FLOOR_Y - 224, width: 150, height: 16, type: "forest-step" },
      { x: 332, y: FOREST_FLOOR_Y - 292, width: 186, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 250, y: FOREST_FLOOR_Y - 182, width: 22, height: 182, type: "forest-wall" },
      { x: 570, y: FOREST_FLOOR_Y - 230, width: 24, height: 230, type: "forest-wall" },
      { x: 732, y: FOREST_FLOOR_Y - 188, width: 22, height: 188, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 4,
        spawnX: FOREST_RIGHT - 96,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 6,
        spawnX: FOREST_LEFT + 34,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "moss-catacomb-entry",
    title: "Moss Catacombs",
    subtitle: "Cavern lanes with staggered retreat ledges",
    theme: "mossy",
    decorations: [
      { asset: "moss-vines", x: 78, yOffset: 242, scale: 0.2, alpha: 0.66 },
      { asset: "moss-vines", x: 444, yOffset: 256, scale: 0.24, alpha: 0.7 },
      { asset: "moss-vines", x: 856, yOffset: 238, scale: 0.2, alpha: 0.66 },
      { asset: "oak-rock-2", x: 298, yOffset: 3, scale: 3.5, alpha: 0.72 },
      { asset: "oak-grass-3", x: 696, yOffset: 2, scale: 2.7, alpha: 0.78 }
    ],
    palette: {
      sky: ["#10393e", "#18626e", "#103037"],
      haze: "rgba(118, 215, 220, 0.13)",
      ridgeFar: "#17464e",
      ridgeNear: "#133c43",
      floorBase: "#205057",
      floorTop: "#58adb5",
      stepBase: "#2d666f",
      stepTop: "#7ecbd0",
      pathBase: "#315257",
      pathTop: "#74b9bd",
      wallBase: "#22565d",
      wallEdge: "#79cdd1"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 104, y: FOREST_FLOOR_Y - 86, width: 126, height: 18, type: "forest-step" },
      { x: 268, y: FOREST_FLOOR_Y - 142, width: 124, height: 18, type: "forest-step" },
      { x: 428, y: FOREST_FLOOR_Y - 96, width: 120, height: 18, type: "forest-step" },
      { x: 586, y: FOREST_FLOOR_Y - 154, width: 132, height: 18, type: "forest-step" },
      { x: 748, y: FOREST_FLOOR_Y - 104, width: 118, height: 18, type: "forest-step" },
      { x: 196, y: FOREST_FLOOR_Y - 220, width: 152, height: 16, type: "forest-step" },
      { x: 398, y: FOREST_FLOOR_Y - 248, width: 160, height: 16, type: "forest-step" },
      { x: 634, y: FOREST_FLOOR_Y - 228, width: 142, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 356, y: FOREST_FLOOR_Y - 214, width: 24, height: 214, type: "forest-wall" },
      { x: 566, y: FOREST_FLOOR_Y - 246, width: 24, height: 246, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 5,
        spawnX: FOREST_RIGHT - 96,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 7,
        spawnX: FOREST_LEFT + 34,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "moss-cavern-crucible",
    title: "Cavern Crucible",
    subtitle: "Layered kill-zones with wall-jump disengage routes",
    theme: "mossy",
    decorations: [
      { asset: "moss-vines", x: 92, yOffset: 252, scale: 0.22, alpha: 0.68 },
      { asset: "moss-vines", x: 474, yOffset: 262, scale: 0.24, alpha: 0.72 },
      { asset: "moss-vines", x: 840, yOffset: 248, scale: 0.22, alpha: 0.68 },
      { asset: "oak-rock-1", x: 250, yOffset: 3, scale: 3.8, alpha: 0.74 },
      { asset: "oak-rock-3", x: 724, yOffset: 3, scale: 3.1, alpha: 0.74 }
    ],
    palette: {
      sky: ["#0f3f45", "#1c6d78", "#12343d"],
      haze: "rgba(128, 223, 230, 0.13)",
      ridgeFar: "#184850",
      ridgeNear: "#133e45",
      floorBase: "#21535a",
      floorTop: "#5fb7c1",
      stepBase: "#2f6a73",
      stepTop: "#84d4d7",
      pathBase: "#32545a",
      pathTop: "#7cc1c5",
      wallBase: "#225860",
      wallEdge: "#84d5d8"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 96, y: FOREST_FLOOR_Y - 72, width: 118, height: 18, type: "forest-step" },
      { x: 242, y: FOREST_FLOOR_Y - 132, width: 132, height: 18, type: "forest-step" },
      { x: 408, y: FOREST_FLOOR_Y - 92, width: 126, height: 18, type: "forest-step" },
      { x: 566, y: FOREST_FLOOR_Y - 146, width: 116, height: 18, type: "forest-step" },
      { x: 716, y: FOREST_FLOOR_Y - 86, width: 126, height: 18, type: "forest-step" },
      { x: 292, y: FOREST_FLOOR_Y - 214, width: 166, height: 16, type: "forest-step" },
      { x: 520, y: FOREST_FLOOR_Y - 242, width: 186, height: 16, type: "forest-step" },
      { x: 140, y: FOREST_FLOOR_Y - 260, width: 96, height: 16, type: "forest-step" },
      { x: 724, y: FOREST_FLOOR_Y - 268, width: 96, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 226, y: FOREST_FLOOR_Y - 208, width: 22, height: 208, type: "forest-wall" },
      { x: 486, y: FOREST_FLOOR_Y - 238, width: 24, height: 238, type: "forest-wall" },
      { x: 686, y: FOREST_FLOOR_Y - 268, width: 24, height: 268, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 6,
        spawnX: FOREST_RIGHT - 96,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 8,
        spawnX: FOREST_LEFT + 34,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "stringstar-aqueduct",
    title: "Twilight Aqueduct",
    subtitle: "Quick pressure lanes under fractured star halls",
    theme: "stringstar",
    decorations: [
      { asset: "oak-fence-1", x: 132, yOffset: 4, scale: 2.7, alpha: 0.74 },
      { asset: "oak-sign", x: 316, yOffset: 4, scale: 2.8, alpha: 0.78 },
      { asset: "oak-rock-1", x: 506, yOffset: 3, scale: 3.5, alpha: 0.74 },
      { asset: "oak-grass-2", x: 712, yOffset: 2, scale: 2.6, alpha: 0.7 }
    ],
    palette: {
      sky: ["#171637", "#2d305e", "#171733"],
      haze: "rgba(154, 171, 255, 0.08)",
      ridgeFar: "#252651",
      ridgeNear: "#1b1d42",
      floorBase: "#2e325a",
      floorTop: "#6671aa",
      stepBase: "#43497a",
      stepTop: "#949dd0",
      pathBase: "#3d4065",
      pathTop: "#8e97c4",
      wallBase: "#3a3d69",
      wallEdge: "#a0a9da"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 102, y: FOREST_FLOOR_Y - 78, width: 126, height: 18, type: "forest-step" },
      { x: 260, y: FOREST_FLOOR_Y - 132, width: 116, height: 18, type: "forest-step" },
      { x: 414, y: FOREST_FLOOR_Y - 94, width: 122, height: 18, type: "forest-step" },
      { x: 576, y: FOREST_FLOOR_Y - 152, width: 130, height: 18, type: "forest-step" },
      { x: 742, y: FOREST_FLOOR_Y - 100, width: 120, height: 18, type: "forest-step" },
      { x: 176, y: FOREST_FLOOR_Y - 218, width: 150, height: 16, type: "forest-step" },
      { x: 390, y: FOREST_FLOOR_Y - 246, width: 162, height: 16, type: "forest-step" },
      { x: 628, y: FOREST_FLOOR_Y - 226, width: 148, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 234, y: FOREST_FLOOR_Y - 196, width: 24, height: 196, type: "forest-wall" },
      { x: 548, y: FOREST_FLOOR_Y - 236, width: 24, height: 236, type: "forest-wall" },
      { x: 702, y: FOREST_FLOOR_Y - 188, width: 22, height: 188, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 7,
        spawnX: FOREST_RIGHT - 96,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 9,
        spawnX: FOREST_LEFT + 34,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "stringstar-ward",
    title: "Echoing Wards",
    subtitle: "Vertical suppression arena with crossfire perches",
    theme: "stringstar",
    decorations: [
      { asset: "oak-fence-2", x: 164, yOffset: 4, scale: 2.8, alpha: 0.74 },
      { asset: "oak-rock-2", x: 338, yOffset: 3, scale: 3.3, alpha: 0.74 },
      { asset: "oak-sign", x: 566, yOffset: 4, scale: 2.7, alpha: 0.78 },
      { asset: "oak-grass-3", x: 784, yOffset: 2, scale: 2.5, alpha: 0.7 }
    ],
    palette: {
      sky: ["#19173c", "#343369", "#1a1938"],
      haze: "rgba(170, 178, 255, 0.08)",
      ridgeFar: "#2a2759",
      ridgeNear: "#201f48",
      floorBase: "#323560",
      floorTop: "#7077b9",
      stepBase: "#4a4f84",
      stepTop: "#9ea4d7",
      pathBase: "#43476e",
      pathTop: "#949bcb",
      wallBase: "#3f4271",
      wallEdge: "#aab1e1"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 86, y: FOREST_FLOOR_Y - 66, width: 144, height: 18, type: "forest-step" },
      { x: 258, y: FOREST_FLOOR_Y - 118, width: 122, height: 18, type: "forest-step" },
      { x: 412, y: FOREST_FLOOR_Y - 178, width: 128, height: 18, type: "forest-step" },
      { x: 582, y: FOREST_FLOOR_Y - 128, width: 124, height: 18, type: "forest-step" },
      { x: 748, y: FOREST_FLOOR_Y - 82, width: 118, height: 18, type: "forest-step" },
      { x: 210, y: FOREST_FLOOR_Y - 224, width: 134, height: 16, type: "forest-step" },
      { x: 430, y: FOREST_FLOOR_Y - 260, width: 152, height: 16, type: "forest-step" },
      { x: 662, y: FOREST_FLOOR_Y - 242, width: 126, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 384, y: FOREST_FLOOR_Y - 226, width: 24, height: 226, type: "forest-wall" },
      { x: 610, y: FOREST_FLOOR_Y - 252, width: 26, height: 252, type: "forest-wall" },
      { x: 154, y: FOREST_FLOOR_Y - 182, width: 20, height: 182, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 8,
        spawnX: FOREST_RIGHT - 96,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 10,
        spawnX: FOREST_LEFT + 34,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "oak-watchroad",
    title: "Oak Watchroad",
    subtitle: "Open duel lane with staggered ranged perches",
    theme: "oak-woods",
    decorations: [
      { asset: "oak-fence-2", x: 160, yOffset: 4, scale: 2.8, alpha: 0.84 },
      { asset: "oak-lamp", x: 336, yOffset: 4, scale: 3, alpha: 0.94 },
      { asset: "oak-sign", x: 534, yOffset: 4, scale: 2.8, alpha: 0.86 },
      { asset: "oak-rock-1", x: 752, yOffset: 3, scale: 3.6, alpha: 0.74 }
    ],
    palette: {
      sky: ["#142720", "#244436", "#11211b"],
      haze: "rgba(138, 203, 170, 0.08)",
      ridgeFar: "#1d352a",
      ridgeNear: "#162920",
      floorBase: "#2a4234",
      floorTop: "#5f9870",
      stepBase: "#3f5c4a",
      stepTop: "#8ec79a",
      pathBase: "#3f4938",
      pathTop: "#7ca98a",
      wallBase: "#304b3c",
      wallEdge: "#8dc8a0"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 96, y: FOREST_FLOOR_Y - 60, width: 150, height: 18, type: "forest-step" },
      { x: 278, y: FOREST_FLOOR_Y - 112, width: 126, height: 18, type: "forest-step" },
      { x: 444, y: FOREST_FLOOR_Y - 74, width: 116, height: 18, type: "forest-step" },
      { x: 596, y: FOREST_FLOOR_Y - 126, width: 132, height: 18, type: "forest-step" },
      { x: 760, y: FOREST_FLOOR_Y - 78, width: 116, height: 18, type: "forest-step" },
      { x: 214, y: FOREST_FLOOR_Y - 188, width: 156, height: 16, type: "forest-step" },
      { x: 418, y: FOREST_FLOOR_Y - 214, width: 164, height: 16, type: "forest-step" },
      { x: 640, y: FOREST_FLOOR_Y - 198, width: 146, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 250, y: FOREST_FLOOR_Y - 170, width: 22, height: 170, type: "forest-wall" },
      { x: 560, y: FOREST_FLOOR_Y - 220, width: 24, height: 220, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 9,
        spawnX: FOREST_RIGHT - 96,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      },
      {
        x: FOREST_RIGHT - 20,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 11,
        spawnX: FOREST_LEFT + 34,
        spawnY: FOREST_FLOOR_Y - PLAYER_HEIGHT
      }
    ]
  },
  {
    id: "oak-bastion-gate",
    title: "Bastion Gate",
    subtitle: "Final layered holdout with fallback towers",
    theme: "oak-woods",
    decorations: [
      { asset: "oak-fence-1", x: 136, yOffset: 4, scale: 2.8, alpha: 0.82 },
      { asset: "oak-lamp", x: 304, yOffset: 4, scale: 3.1, alpha: 0.95 },
      { asset: "oak-rock-3", x: 486, yOffset: 3, scale: 3.1, alpha: 0.74 },
      { asset: "oak-sign", x: 664, yOffset: 4, scale: 2.8, alpha: 0.86 },
      { asset: "oak-grass-1", x: 806, yOffset: 2, scale: 2.8, alpha: 0.8 }
    ],
    palette: {
      sky: ["#112219", "#1f3c2d", "#0f1e17"],
      haze: "rgba(126, 188, 154, 0.08)",
      ridgeFar: "#1b3024",
      ridgeNear: "#14261d",
      floorBase: "#263b2f",
      floorTop: "#578765",
      stepBase: "#395443",
      stepTop: "#83b58d",
      pathBase: "#394437",
      pathTop: "#719c7d",
      wallBase: "#2d4437",
      wallEdge: "#81b791"
    },
    floorY: FOREST_FLOOR_Y,
    platforms: [
      { x: FOREST_LEFT - 32, y: FOREST_FLOOR_Y, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" },
      { x: 104, y: FOREST_FLOOR_Y - 72, width: 142, height: 18, type: "forest-step" },
      { x: 274, y: FOREST_FLOOR_Y - 126, width: 128, height: 18, type: "forest-step" },
      { x: 438, y: FOREST_FLOOR_Y - 86, width: 132, height: 18, type: "forest-step" },
      { x: 612, y: FOREST_FLOOR_Y - 142, width: 140, height: 18, type: "forest-step" },
      { x: 778, y: FOREST_FLOOR_Y - 90, width: 96, height: 18, type: "forest-step" },
      { x: 208, y: FOREST_FLOOR_Y - 202, width: 164, height: 16, type: "forest-step" },
      { x: 432, y: FOREST_FLOOR_Y - 236, width: 170, height: 16, type: "forest-step" },
      { x: 676, y: FOREST_FLOOR_Y - 214, width: 152, height: 16, type: "forest-step" },
      { x: 342, y: FOREST_FLOOR_Y - 292, width: 188, height: 16, type: "forest-step" }
    ],
    walls: [
      { x: 252, y: FOREST_FLOOR_Y - 192, width: 24, height: 192, type: "forest-wall" },
      { x: 584, y: FOREST_FLOOR_Y - 244, width: 24, height: 244, type: "forest-wall" },
      { x: 742, y: FOREST_FLOOR_Y - 182, width: 22, height: 182, type: "forest-wall" }
    ],
    transitions: [
      {
        x: FOREST_LEFT,
        y: FOREST_FLOOR_Y - 132,
        width: 20,
        height: 132,
        targetZone: 10,
        spawnX: FOREST_RIGHT - 96,
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
  jumpHeld: false
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
    artForest: {
      depth: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0010_1.png"),
      far: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0009_2.png"),
      mid: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0008_3.png"),
      near: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0006_4.png"),
      canopy: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0005_5.png"),
      lights: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0007_Lights.png"),
      tiles: createExactAsset("assets/textures/Art Forest/Free Pixel Art Forest/PNG/Background layers/Layer_0003_6.png", true)
    },
    mossy: {
      hills: createExactAsset("assets/textures/MossyAssets/Mossy Tileset/Mossy - MossyHills.png"),
      backdrop: createExactAsset("assets/textures/MossyAssets/Mossy Tileset/Mossy - BackgroundDecoration.png"),
      vines: createExactAsset("assets/textures/MossyAssets/Mossy Tileset/Mossy - Hanging Plants.png"),
      details: createExactAsset("assets/textures/MossyAssets/Mossy Tileset/Mossy - Decorations&Hazards.png"),
      tiles: createExactAsset("assets/textures/MossyAssets/Mossy Tileset/Mossy - FloatingPlatforms.png", true)
    },
    oakWoods: {
      layer1: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/background/background_layer_1.png"),
      layer2: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/background/background_layer_2.png"),
      layer3: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/background/background_layer_3.png"),
      tiles: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/oak_woods_tileset.png", true),
      lamp: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/lamp.png"),
      sign: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/sign.png"),
      fence1: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/fence_1.png"),
      fence2: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/fence_2.png"),
      grass1: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/grass_1.png"),
      grass2: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/grass_2.png"),
      grass3: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/grass_3.png"),
      rock1: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/rock_1.png"),
      rock2: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/rock_2.png"),
      rock3: createExactAsset("assets/textures/oak_woods/oak_woods_v1.0/decorations/rock_3.png")
    },
    stringstar: {
      bg0: createExactAsset("assets/textures/stringstar fields/background_0.png"),
      bg1: createExactAsset("assets/textures/stringstar fields/background_1.png"),
      bg2: createExactAsset("assets/textures/stringstar fields/background_2.png"),
      tiles: createExactAsset("assets/textures/stringstar fields/tileset.png", true)
    }
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
  forestUnlocked: false
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

function getForestZonePalette() {
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

  if (themeId === "mossy") {
    return {
      ...FOREST_ZONE_DEFAULT_PALETTE,
      floorBase: "#143941",
      floorTop: "#4d9aa3",
      stepBase: "#1b4951",
      stepTop: "#67b8be",
      pathBase: "#1d4a50",
      pathTop: "#6ebbc1",
      wallBase: "#17424a",
      wallEdge: "#74c1c8"
    };
  }

  if (themeId === "oak-woods") {
    return {
      ...FOREST_ZONE_DEFAULT_PALETTE,
      floorBase: "#233a2c",
      floorTop: "#60916c",
      stepBase: "#2e4837",
      stepTop: "#77ab81",
      pathBase: "#334b39",
      pathTop: "#7fb08b",
      wallBase: "#274032",
      wallEdge: "#7faf87"
    };
  }

  if (themeId === "stringstar") {
    return {
      ...FOREST_ZONE_DEFAULT_PALETTE,
      floorBase: "#24263c",
      floorTop: "#636ca8",
      stepBase: "#2d2f4a",
      stepTop: "#7d88c4",
      pathBase: "#313457",
      pathTop: "#8e99d4",
      wallBase: "#272a44",
      wallEdge: "#8892cf"
    };
  }

  return FOREST_ZONE_DEFAULT_PALETTE;
}

function getForestThemeId() {
  const themeBlocks = ["art-forest", "mossy", "oak-woods", "stringstar"];
  const blockIndex = clamp(Math.floor(getForestRouteIndex() / 3), 0, themeBlocks.length - 1);
  return themeBlocks[blockIndex];
}

function getForestThemePatternAssets() {
  const themes = assets.forestThemes || {};
  const themeId = getForestThemeId();

  if (themeId === "art-forest") {
    return {
      floor: themes.oakWoods?.tiles || null,
      step: null,
      wall: null,
      path: null
    };
  }

  if (themeId === "mossy") {
    return {
      floor: themes.mossy?.tiles || null,
      step: null,
      wall: null,
      path: null
    };
  }

  if (themeId === "oak-woods") {
    return {
      floor: themes.oakWoods?.tiles || null,
      step: null,
      wall: null,
      path: null
    };
  }

  if (themeId === "stringstar") {
    return {
      floor: themes.stringstar?.tiles || null,
      step: null,
      wall: null,
      path: null
    };
  }

  return {
    floor: themes.oakWoods?.tiles || themes.mossy?.tiles || themes.stringstar?.tiles || null,
    step: null,
    wall: null,
    path: null
  };
}

function getForestPatternAlpha(themeId, surfaceType) {
  if (surfaceType !== "floor") {
    return 0;
  }

  if (themeId === "mossy") {
    return 0.44;
  }

  if (themeId === "oak-woods") {
    return 0.4;
  }

  if (themeId === "stringstar") {
    return 0.36;
  }

  return 0.34;
}

function drawForestPlatformThemeDetails(platform, platformType, themeId) {
  return;
}

function drawForestWallThemeDetails(wall, themeId) {
  return;
}

function getForestDecorationAsset(assetId) {
  const themeAssets = assets.forestThemes || {};
  const oak = themeAssets.oakWoods || {};
  const mossy = themeAssets.mossy || {};

  switch (assetId) {
    case "oak-lamp":
      return oak.lamp || null;
    case "oak-sign":
      return oak.sign || null;
    case "oak-fence-1":
      return oak.fence1 || null;
    case "oak-fence-2":
      return oak.fence2 || null;
    case "oak-grass-1":
      return oak.grass1 || null;
    case "oak-grass-2":
      return oak.grass2 || null;
    case "oak-grass-3":
      return oak.grass3 || null;
    case "oak-rock-1":
      return oak.rock1 || null;
    case "oak-rock-2":
      return oak.rock2 || null;
    case "oak-rock-3":
      return oak.rock3 || null;
    case "moss-vines":
      return mossy.vines || null;
    default:
      return null;
  }
}

function getForestFloorY() {
  const zone = getForestZone();
  return typeof zone.floorY === "number" ? zone.floorY : FOREST_FLOOR_Y;
}

function setForestRoute(index) {
  forestRouteIndex = clamp(index, 0, forestRouteZones.length - 1);
  forestBonfire.floorY = getForestFloorY();
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
  const floorY = getForestFloorY();
  return [{ x: FOREST_LEFT - 32, y: floorY, width: FOREST_RIGHT - FOREST_LEFT + 64, height: 110, type: "forest-floor" }];
}

function getForestRouteTransitions() {
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

  return [];
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
    checkpoint.y = getForestFloorY() - player.height;
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

  if (!isForestScene() || player.dead || getForestRouteIndex() !== 0) {
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

function triggerSamuraiSpecial() {
  if (
    !canPlayerFight() ||
    getActiveCharacter().id !== "samurai" ||
    !isSamuraiSpecialInputActive() ||
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
    if (!playerOverlapsRect(transition)) {
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
  animationClock += deltaTime;
  updateBoss(deltaTime);
  updateTeleporters(deltaTime);
  updateSpecialProjectiles(deltaTime);

  if (player.attackCooldown > 0) {
    player.attackCooldown = Math.max(0, player.attackCooldown - deltaTime);
  }

  if (player.attackTime > 0) {
    player.attackTime = Math.max(0, player.attackTime - deltaTime);
  }

  if (player.specialTime > 0) {
    player.specialTime = Math.max(0, player.specialTime - deltaTime);
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

  if (themeId === "mossy") {
    drawBackdropTiled(themes.mossy?.backdrop, 0, VIEW_HEIGHT, 0.48 + stageVariant * 0.05, 0.2 + stageVariant * 0.15);
    drawBackdropTiled(themes.mossy?.hills, VIEW_HEIGHT - 296, 312 * variantDepth, 0.38 + stageVariant * 0.05, 0.85 + stageVariant * 0.25);
    drawBackdropTiled(themes.mossy?.details, VIEW_HEIGHT - 278, 286 * variantDepth, 0.26 + stageVariant * 0.04, 1.2 + stageVariant * 0.35);
    drawBackdropTiled(themes.mossy?.vines, -96, 196 * variantDepth, 0.24 + stageVariant * 0.04, 1.4 + stageVariant * 0.35, "multiply");
    return;
  }

  if (themeId === "oak-woods") {
    drawBackdropTiled(themes.oakWoods?.layer1, 0, VIEW_HEIGHT, 0.42 + stageVariant * 0.04, 0.35 + stageVariant * 0.2);
    drawBackdropTiled(themes.oakWoods?.layer2, VIEW_HEIGHT - 242, 244 * variantDepth, 0.34 + stageVariant * 0.04, 1 + stageVariant * 0.3);
    drawBackdropTiled(themes.oakWoods?.layer3, VIEW_HEIGHT - 258, 260 * variantDepth, 0.3 + stageVariant * 0.03, 1.55 + stageVariant * 0.35);
    drawBackdropTiled(themes.oakWoods?.layer3, -68, 170 * variantDepth, 0.2 + stageVariant * 0.03, 1.9 + stageVariant * 0.35, "multiply");
    return;
  }

  if (themeId === "stringstar") {
    drawBackdropTiled(themes.stringstar?.bg0, 0, VIEW_HEIGHT, 0.4 + stageVariant * 0.04, 0.35 + stageVariant * 0.2);
    drawBackdropTiled(themes.stringstar?.bg1, VIEW_HEIGHT - 236, 236 * variantDepth, 0.32 + stageVariant * 0.04, 1 + stageVariant * 0.3);
    drawBackdropTiled(themes.stringstar?.bg2, VIEW_HEIGHT - 248, 248 * variantDepth, 0.28 + stageVariant * 0.03, 1.5 + stageVariant * 0.35);
    drawBackdropTiled(themes.stringstar?.bg2, -58, 156 * variantDepth, 0.16 + stageVariant * 0.03, 1.9 + stageVariant * 0.35, "multiply");
    return;
  }
}

function drawStringstarSkyFragments() {
  if (!isForestScene() || getForestThemeId() !== "stringstar") {
    return;
  }

  const tilesAsset = assets.forestThemes?.stringstar?.tiles;
  if (!tilesAsset || !tilesAsset.loaded) {
    return;
  }

  const image = tilesAsset.image;
  const tileSize = 16;
  const cols = Math.floor(image.naturalWidth / tileSize);
  const rows = Math.floor(image.naturalHeight / tileSize);
  if (cols < 2 || rows < 2) {
    return;
  }

  const zoneIndex = getForestRouteIndex();
  const stageVariant = zoneIndex % 3;
  const floorScreenY = getForestFloorY() - cameraY;
  const yLimit = Math.max(72, Math.min(VIEW_HEIGHT - 120, floorScreenY - 90));
  const pieceCount = 6 + stageVariant;

  context.save();
  context.globalCompositeOperation = "screen";

  for (let i = 0; i < pieceCount; i += 1) {
    const seed = zoneIndex * 131 + i * 73;
    const srcX = ((seed % (cols - 1)) + 1) * tileSize;
    const srcY = (((seed >> 3) % Math.min(rows, 6)) + 1) * tileSize;
    const srcW = tileSize;
    const srcH = tileSize;
    const drawScale = 1.5 + ((seed >> 1) % 3) * 0.35;
    const drawW = srcW * drawScale;
    const drawH = srcH * drawScale;
    const drawX = 26 + ((seed * 37) % Math.max(1, VIEW_WIDTH - 64));
    const drawY = 20 + ((seed * 17) % Math.max(1, yLimit - 24));
    const alpha = 0.1 + (i % 3) * 0.04;

    context.globalAlpha = alpha;
    context.drawImage(image, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drawH);

    context.globalAlpha = alpha * 0.5;
    context.fillStyle = "#8ca4ff";
    context.beginPath();
    context.arc(drawX + drawW / 2, drawY + drawH / 2, drawW * 0.32, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawForestDecorations() {
  if (!isForestScene()) {
    return;
  }

  const themeId = getForestThemeId();
  const zoneIndex = getForestRouteIndex();
  const floorY = getForestFloorY();
  const leftBound = FOREST_LEFT + 54;
  const rightBound = FOREST_RIGHT - 54;

  const staticDecor = [];
  const rockOptions = ["oak-rock-1", "oak-rock-2", "oak-rock-3"];
  const grassOptions = ["oak-grass-1", "oak-grass-2", "oak-grass-3"];
  const vineCount = themeId === "mossy" ? 2 : 0;
  const rockCount = themeId === "stringstar" ? 0 : themeId === "mossy" ? 1 : 2;
  const grassCount = themeId === "stringstar" ? 1 : themeId === "mossy" ? 3 : 2;

  for (let i = 0; i < rockCount; i += 1) {
    const seed = zoneIndex * 41 + i * 67;
    const x = leftBound + (seed % Math.max(1, rightBound - leftBound));
    staticDecor.push({
      asset: rockOptions[seed % rockOptions.length],
      x,
      yOffset: 0,
      scale: 2.3 + ((seed >> 2) % 3) * 0.18,
      alpha: 0.34
    });
  }

  for (let i = 0; i < grassCount; i += 1) {
    const seed = zoneIndex * 59 + i * 71;
    const x = leftBound + (seed % Math.max(1, rightBound - leftBound));
    staticDecor.push({
      asset: grassOptions[seed % grassOptions.length],
      x,
      yOffset: 0,
      scale: 2.1 + ((seed >> 1) % 3) * 0.16,
      alpha: 0.32
    });
  }

  for (let i = 0; i < vineCount; i += 1) {
    const seed = zoneIndex * 83 + i * 139;
    const x = leftBound + (seed % Math.max(1, rightBound - leftBound));
    staticDecor.push({
      asset: "moss-vines",
      x,
      yOffset: 180 + i * 28,
      scale: 0.2 + i * 0.04,
      alpha: 0.18 + i * 0.04
    });
  }

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
    drawStringstarSkyFragments();
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
  if (!isForestScene() || getForestRouteIndex() !== 0) {
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
      const frameCount = getFrameCount(activeSprite);
      const dashFrame = getPlayerFrameIndex(spriteState, frameCount);
      const baseAlpha = context.globalAlpha;
      const dashProgress = clamp(1 - player.dashTime / PLAYER_DASH_DURATION, 0, 1);
      const trailStrength = 1 - dashProgress * 0.35;

      context.save();
      context.globalCompositeOperation = "screen";
      context.globalAlpha = baseAlpha * (0.1 + trailStrength * 0.08);
      const mistGradient = context.createLinearGradient(-200, 0, 24, 0);
      mistGradient.addColorStop(0, "rgba(230, 240, 250, 0)");
      mistGradient.addColorStop(0.38, "rgba(212, 226, 242, 0.2)");
      mistGradient.addColorStop(0.75, "rgba(146, 186, 228, 0.12)");
      mistGradient.addColorStop(1, "rgba(238, 248, 255, 0)");
      context.fillStyle = mistGradient;
      context.fillRect(-200, -4, 224, 34);

      context.lineCap = "round";
      for (let i = 0; i < 6; i += 1) {
        const y = -9 + i * 4.8 + Math.sin(animationClock * 9 + i * 0.8) * 1;
        const startX = -210 - i * 5;
        const endX = 18 - i * 2;
        const ctrlX = startX + 78 + i * 4;
        const ctrlY = y + Math.sin(animationClock * 8.5 + i) * (0.8 + i * 0.03);
        const lineAlpha = (0.09 + (6 - i) * 0.02) * trailStrength;
        const lineGradient = context.createLinearGradient(startX, y, endX, y);
        lineGradient.addColorStop(0, "rgba(234, 244, 255, 0)");
        lineGradient.addColorStop(0.28, `rgba(224, 236, 249, ${lineAlpha})`);
        lineGradient.addColorStop(0.64, `rgba(178, 205, 235, ${lineAlpha * 0.58})`);
        lineGradient.addColorStop(1, "rgba(232, 246, 255, 0)");
        context.strokeStyle = lineGradient;
        context.lineWidth = 0.8 + (6 - i) * 0.14;
        context.beginPath();
        context.moveTo(startX, y);
        context.quadraticCurveTo(ctrlX, ctrlY, endX, y + Math.sin(animationClock * 11 + i) * 0.45);
        context.stroke();
      }
      context.restore();

      for (let i = 5; i >= 1; i -= 1) {
        const trailAlpha = baseAlpha * (0.02 + (6 - i) * 0.022) * trailStrength;
        const trailScale = 1 + i * 0.025;
        context.globalAlpha = trailAlpha;
        drawPlayerSprite(activeSprite, spriteState, dashFrame, -i * 14, trailScale, -i * 0.2);
      }

      context.globalAlpha = baseAlpha;
      drawPlayerSprite(activeSprite, spriteState, dashFrame, 0);
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
      context.globalCompositeOperation = "screen";
      context.filter = "brightness(1.38) saturate(1.55)";
      context.globalAlpha = baseAlpha * 0.98;
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

  drawHealthBar(drawX - 8, drawY - 22, 46, 5, player.health, player.maxHealth, "#c24646");
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
  const frameIndex = typeof frameOverride === "number" ? frameOverride : getPlayerFrameIndex(spriteState, frameCount);
  const drawWidth = CHARACTER_DRAW_WIDTH * scale;
  const drawHeight = CHARACTER_DRAW_HEIGHT * scale;

  context.drawImage(
    spriteSource,
    frameIndex * frameWidth,
    0,
    frameWidth,
    sourceHeight,
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
    if (getForestRouteIndex() === 0 && forestBonfire.active) {
      context.fillText("Bonfire bound: checkpoint active and healing", 24, 56);
    } else if (getForestRouteIndex() === 0) {
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
  drawSpecialProjectiles();
  drawGoal();
  drawForestBonfire();
  drawPlayer();
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
    const forestZone = getForestZone();
    if (getForestRouteIndex() === 0 && forestBonfire.playerNearby) {
      statusLabel.textContent = "Resting";
      statusLabel.style.color = "#f0c777";
      return;
    }

    if (getForestRouteIndex() === 0 && forestBonfire.active) {
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
