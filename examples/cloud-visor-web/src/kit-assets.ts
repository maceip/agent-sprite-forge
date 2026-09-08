const n = (dir: string, prefix: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/sprites/mascot/${dir}/${prefix}-${i + 1}.png`);

export const IDLE = n("idle-front", "idle", 4);
export const WALK = n("walk-right", "walk", 4);
export const WALK_LEFT = n("walk-left", "walk", 4);
export const SLEEP = n("sleep", "sleep", 4);
export const FLIP = n("flip", "flip", 8);
export const PHONE = n("phone", "phone", 4);
export const DASH = n("dash", "dash", 6);
export const SMOKE = n("smoke", "smoke", 4);
export const DIZZY = n("dizzy", "dizzy", 4);

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
  alarmRing: "/sprites/kit/alarm-ring.png",
  alarmBang: "/sprites/kit/alarm-bang.png",
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
  ...Object.values(TURN),
  ...Object.values(STICK),
];

export const SCENES_META = [
  {
    id: "bed",
    number: "01",
    title: "Bedroom",
    brief: "Asleep. Alarm. Backflip behind the bed. Land. Dizzy coffee walk.",
    beats: ["Sleep", "Alarm", "Flip out", "Land", "Coffee walk"],
  },
  {
    id: "window",
    number: "02",
    title: "Window",
    brief: "Walk in. Smoke. Phone out. Hold.",
    beats: ["Walk in", "Smoke", "Phone", "Hold"],
  },
  {
    id: "drone",
    number: "03",
    title: "Drone",
    brief: "Turn. Dash. Hit the megaphone drone.",
    beats: ["Idle", "Turn", "Dash", "Hit"],
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
