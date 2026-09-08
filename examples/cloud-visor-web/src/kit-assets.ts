const n = (dir: string, prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/sprites/mascot/${dir}/${prefix}-${i + 1}.png`);

const fx = (dir: string, prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/sprites/fx/${dir}/${prefix}-${i + 1}.png`);

export const IDLE = n("idle-front", "idle", 4);
export const WALK = n("walk-right", "walk", 4);
export const WALK_LEFT = n("walk-left", "walk", 4);
export const SLEEP = n("sleep", "sleep", 4);
export const FLIP = n("flip", "flip", 8);
export const PHONE = n("phone", "phone", 4);
export const DASH = n("dash", "dash", 6);
export const SMOKE = n("smoke", "smoke", 4);
export const DIZZY = n("dizzy", "dizzy", 4);

export const FX_ALARM = fx("alarm", "alarm", 16);
export const FX_STARS = fx("stars", "star", 16);
export const FX_ZZZ = fx("zzz", "zzz", 16);
export const FX_RINGS = fx("rings", "ring", 16);
export const FX_SPEAKER = fx("speaker", "speaker", 6);
export const FX_DRONE = fx("drone", "drone", 6);
export const FX_SHIELD = fx("shield", "shield", 4);
export const FX_SONIC = fx("sonic", "sonic", 6);

export const TURN = {
  front: "/sprites/mascot/turn/front.png",
  right: "/sprites/mascot/turn/right.png",
  left: "/sprites/mascot/turn/left.png",
  back: "/sprites/mascot/turn/back.png",
} as const;

export const STICK = {
  drone: "/sprites/kit/drone-meg.png",
  bedMade: "/sprites/kit/bed-made.png",
  bedMessy: "/sprites/kit/bed-messy.png",
  mug: "/sprites/kit/mug.png",
} as const;

export const ALL_KIT_IMAGES = [
  ...IDLE,
  ...WALK,
  ...WALK_LEFT,
  ...SLEEP,
  ...FLIP,
  ...PHONE,
  ...DASH,
  ...SMOKE,
  ...DIZZY,
  ...FX_ALARM,
  ...FX_STARS,
  ...FX_ZZZ,
  ...FX_RINGS,
  ...FX_SPEAKER,
  ...FX_DRONE,
  ...FX_SHIELD,
  ...FX_SONIC,
  ...Object.values(TURN),
  ...Object.values(STICK),
];

export const SCENES_META = [
  {
    id: "bed",
    number: "01",
    title: "Bedroom",
    brief: "Snore Zzz. Alarm chaos. Backflip behind the bed with dizzy stars. Coffee walk.",
    beats: ["Sleep", "Alarm", "Flip out", "Land", "Coffee walk"],
  },
  {
    id: "window",
    number: "02",
    title: "Window",
    brief: "Walk in. Joint. Blow O-rings. Phone out. Hold.",
    beats: ["Walk in", "Smoke", "Phone", "Hold"],
  },
  {
    id: "drone",
    number: "03",
    title: "Drone",
    brief: "First loudspeaker blast. Drone flies in with the speaker. Shield holds.",
    beats: ["Idle", "Turn", "Speaker", "Drone", "Blast", "Shield"],
  },
  {
    id: "phone",
    number: "04",
    title: "Phone idle",
    brief: "Phone pull, then idle the rest of the time.",
    beats: ["Idle", "Pull", "Talk"],
  },
] as const;

export type SceneId = (typeof SCENES_META)[number]["id"];
