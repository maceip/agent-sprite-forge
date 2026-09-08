import { useEffect, useRef, useState } from "react";
import {
  ALL_KIT_IMAGES,
  DASH,
  DIZZY,
  FLIP,
  IDLE,
  PHONE,
  SCENES_META,
  SLEEP,
  SMOKE,
  STICK,
  TURN,
  WALK,
  WALK_LEFT,
  FX_ALARM,
  FX_STARS,
  FX_ZZZ,
  FX_RINGS,
  FX_SPEAKER,
  FX_DRONE,
  FX_SHIELD,
  FX_SONIC,
  type SceneId,
} from "./kit-assets";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}


const W = 960;
const H = 500;
const FLOOR = 418;
const BED_X = 390;
const LAND_X = 760;
const SPRITE = 148;
const MAX_WALK = 280;
const WALK_ACCEL = 720;
const WALK_DECEL = 900;
const STRIDE = 22;
const FLIP_AIR = 1.22;

type Phase =
  | "sleep"
  | "alarm"
  | "launch"
  | "flip"
  | "land"
  | "coffee"
  | "enter"
  | "smoke"
  | "pull"
  | "talk"
  | "idle"
  | "turn"
  | "blast1"
  | "flinch"
  | "droneIn"
  | "blast2"
  | "shield"
  | "dash"
  | "hit"
  | "hold"
  | "leave";

type Actor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  squash: number;
  phase: Phase;
  t: number;
  stride: number;
  bed: number;
  alarm: number;
  drone: number;
  shield: number;
  beat: string;
  airTime: number;
  trauma: number;
};

function makeActor(scene: SceneId): Actor {
  const base: Actor = {
    x: 120,
    y: FLOOR,
    vx: 0,
    vy: 0,
    facing: 1,
    squash: 1,
    phase: "idle",
    t: 0,
    stride: 0,
    bed: 1,
    alarm: 0,
    drone: 1,
    shield: 0,
    beat: "Idle",
    airTime: FLIP_AIR,
    trauma: 0,
  };
  if (scene === "bed") {
    return { ...base, x: BED_X, y: FLOOR - 52, phase: "sleep", beat: "Sleep", bed: 1 };
  }
  if (scene === "window") {
    return { ...base, x: -80, phase: "enter", beat: "Walk in", facing: 1 };
  }
  if (scene === "drone") {
    return { ...base, x: 260, phase: "idle", beat: "Idle", drone: 0, shield: 0 };
  }
  return { ...base, x: 480, phase: "idle", beat: "Idle" };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const u = clamp(t, 0, 1);
  return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2;
}

function spring(current: number, target: number, k: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-k * dt));
}

function bezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

function followBackflip(actor: Actor, u: number) {
  const t = clamp(u, 0, 1);
  const x0 = BED_X;
  const y0 = FLOOR - 52;
  actor.x = bezier(t, x0, x0 + 50, x0 + 280, LAND_X);
  actor.y = bezier(t, y0, 18, 28, FLOOR);
  actor.facing = 1;
}

function moveToward(actor: Actor, target: number, dt: number, max = MAX_WALK) {
  const dist = target - actor.x;
  if (Math.abs(dist) > 2) actor.facing = dist > 0 ? 1 : -1;
  const stop = (actor.vx * actor.vx) / (2 * WALK_DECEL);
  if (Math.abs(dist) <= stop + 3) {
    const sign = Math.sign(actor.vx);
    actor.vx -= sign * WALK_DECEL * dt;
    if (sign !== 0 && Math.sign(actor.vx) !== sign) actor.vx = 0;
  } else {
    actor.vx += actor.facing * WALK_ACCEL * dt;
    actor.vx = clamp(actor.vx, -max, max);
  }
  actor.x += actor.vx * dt;
  actor.stride += Math.abs(actor.vx) * dt;
  actor.y = FLOOR;
  if (Math.abs(target - actor.x) < 2.5 && Math.abs(actor.vx) < 14) {
    actor.x = target;
    actor.vx = 0;
    return true;
  }
  return false;
}

function loadImages(paths: string[]) {
  return Promise.all(
    paths.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(img);
          img.src = src;
        }),
    ),
  );
}

function cycle(frames: string[], t: number, fps: number) {
  if (!frames.length) return frames[0];
  return frames[Math.floor(t * fps) % frames.length];
}

function pick(actor: Actor, scene: SceneId): { src: string; flipX: number } {
  const flipX = 1;
  if (scene === "bed") {
    if (actor.phase === "sleep") return { src: cycle(SLEEP, actor.t, 4), flipX };
    if (actor.phase === "alarm") return { src: SLEEP[Math.min(3, Math.floor(actor.t * 2))], flipX };
    if (actor.phase === "launch") return { src: FLIP[0], flipX };
    if (actor.phase === "flip") {
      const i = clamp(Math.floor((actor.t / Math.max(0.2, actor.airTime)) * 7.99), 0, 7);
      return { src: FLIP[i], flipX };
    }
    if (actor.phase === "land") return { src: FLIP[7], flipX };
    if (actor.phase === "coffee" || actor.phase === "leave") {
      const moving = Math.abs(actor.vx) > 12;
      const idx = moving ? Math.floor(actor.stride / STRIDE) % DIZZY.length : 0;
      return { src: DIZZY[idx], flipX: actor.facing === 1 ? 1 : -1 };
    }
  }
  if (scene === "window") {
    if (actor.phase === "enter" || actor.phase === "leave") {
      const set = actor.facing === 1 ? WALK : WALK_LEFT;
      const idx = Math.floor(actor.stride / STRIDE) % set.length;
      return { src: set[idx], flipX: 1 };
    }
    if (actor.phase === "smoke") return { src: cycle(SMOKE, actor.t, 5), flipX };
    if (actor.phase === "pull") return { src: PHONE[clamp(Math.floor(actor.t * 6), 0, 3)], flipX };
    if (actor.phase === "talk") return { src: PHONE[3], flipX };
  }
  if (scene === "drone") {
    if (actor.phase === "idle") return { src: cycle(IDLE, actor.t, 5), flipX };
    if (actor.phase === "turn") {
      const seq = [TURN.front, TURN.left, TURN.back, TURN.right];
      return { src: seq[clamp(Math.floor(actor.t * 3.6), 0, 3)], flipX };
    }
    if (actor.phase === "blast1" || actor.phase === "flinch") {
      return { src: DASH[0], flipX };
    }
    if (actor.phase === "droneIn") return { src: cycle(IDLE, actor.t, 5), flipX };
    if (actor.phase === "blast2") return { src: DASH[clamp(Math.floor(actor.t * 8), 0, 2)], flipX };
    if (actor.phase === "shield" || actor.phase === "hold") return { src: cycle(IDLE, actor.t, 4), flipX };
  }
  if (scene === "phone") {
    if (actor.phase === "idle") return { src: cycle(IDLE, actor.t, 5), flipX };
    if (actor.phase === "pull") return { src: PHONE[clamp(Math.floor(actor.t * 6), 0, 3)], flipX };
    if (actor.phase === "talk" || actor.phase === "hold") return { src: PHONE[3], flipX };
  }
  return { src: IDLE[0], flipX };
}

function stepBed(actor: Actor, dt: number) {
  switch (actor.phase) {
    case "sleep":
      actor.beat = "Sleep";
      actor.x = BED_X;
      actor.y = FLOOR - 52;
      actor.vx = 0;
      if (actor.t > 2.4) {
        actor.phase = "alarm";
        actor.t = 0;
        actor.beat = "Alarm";
      }
      break;
    case "alarm":
      actor.alarm = Math.min(1, actor.alarm + dt * 1.6);
      actor.x = BED_X;
      actor.y = FLOOR - 52;
      actor.trauma = 0.35 + 0.45 * Math.abs(Math.sin(actor.t * 18));
      if (actor.t > 1.35) {
        actor.phase = "launch";
        actor.t = 0;
        actor.beat = "Flip out";
        actor.squash = 0.68;
        actor.trauma = 0.9;
        actor.bed = 0.35;
      }
      break;
    case "launch":
      actor.squash = 0.66;
      actor.x = BED_X;
      actor.y = FLOOR - 52;
      if (actor.t > 0.16) {
        actor.phase = "flip";
        actor.t = 0;
        actor.facing = 1;
        actor.airTime = FLIP_AIR;
        followBackflip(actor, 0);
      }
      break;
    case "flip": {
      const u = actor.t / actor.airTime;
      followBackflip(actor, u);
      actor.squash = 1 + Math.sin(u * Math.PI) * 0.12;
      if (u >= 1) {
        actor.x = LAND_X;
        actor.y = FLOOR;
        actor.vy = 0;
        actor.vx = 0;
        actor.phase = "land";
        actor.t = 0;
        actor.beat = "Land";
        actor.squash = 0.6;
        actor.trauma = 0.4;
      }
      break;
    }
    case "land":
      actor.y = FLOOR;
      actor.x = LAND_X;
      if (actor.t > 0.34) {
        actor.phase = "coffee";
        actor.t = 0;
        actor.beat = "Coffee walk";
        actor.facing = 1;
      }
      break;
    case "coffee": {
      const done = moveToward(actor, 900, dt, 210);
      if (done && actor.t > 1.0) {
        actor.phase = "leave";
        actor.t = 0;
      }
      break;
    }
    case "leave":
      moveToward(actor, 1100, dt, 260);
      if (actor.x > 1040) {
        Object.assign(actor, makeActor("bed"));
      }
      break;
    default:
      break;
  }
}

function stepWindow(actor: Actor, dt: number) {
  switch (actor.phase) {
    case "enter": {
      const done = moveToward(actor, 430, dt, 300);
      if (done) {
        actor.phase = "smoke";
        actor.t = 0;
        actor.beat = "Smoke";
      }
      break;
    }
    case "smoke":
      actor.vx = 0;
      if (actor.t > 2.6) {
        actor.phase = "pull";
        actor.t = 0;
        actor.beat = "Phone";
      }
      break;
    case "pull":
      if (actor.t > 0.72) {
        actor.phase = "talk";
        actor.t = 0;
        actor.beat = "Hold";
      }
      break;
    case "talk":
      if (actor.t > 2.2) {
        actor.phase = "leave";
        actor.t = 0;
        actor.facing = 1;
      }
      break;
    case "leave":
      moveToward(actor, 1080, dt, 300);
      if (actor.x > 1020) Object.assign(actor, makeActor("window"));
      break;
    default:
      break;
  }
}

function stepDrone(actor: Actor, dt: number) {
  switch (actor.phase) {
    case "idle":
      actor.beat = "Idle";
      if (actor.t > 0.85) {
        actor.phase = "turn";
        actor.t = 0;
        actor.beat = "Turn";
      }
      break;
    case "turn":
      if (actor.t > 1.05) {
        actor.phase = "blast1";
        actor.t = 0;
        actor.beat = "Speaker";
        actor.facing = 1;
      }
      break;
    case "blast1":
      actor.trauma = 0.5 + 0.35 * Math.abs(Math.sin(actor.t * 24));
      actor.squash = 0.8 + 0.08 * Math.sin(actor.t * 28);
      actor.x = 260 - Math.sin(clamp(actor.t / 1.4, 0, 1) * Math.PI) * 18;
      if (actor.t > 1.55) {
        actor.phase = "flinch";
        actor.t = 0;
        actor.beat = "Flinch";
        actor.squash = 0.7;
        actor.trauma = 0.35;
      }
      break;
    case "flinch":
      actor.squash = spring(actor.squash, 1, 9, dt);
      actor.trauma = spring(actor.trauma, 0.08, 5, dt);
      if (actor.t > 0.65) {
        actor.phase = "droneIn";
        actor.t = 0;
        actor.beat = "Drone";
        actor.drone = 0;
      }
      break;
    case "droneIn":
      actor.drone = clamp(actor.t / 0.7, 0, 1);
      actor.squash = spring(actor.squash, 1, 8, dt);
      if (actor.t > 1.05) {
        actor.phase = "blast2";
        actor.t = 0;
        actor.beat = "Blast";
        actor.trauma = 1;
        actor.squash = 0.68;
      }
      break;
    case "blast2":
      actor.drone = 1;
      actor.trauma = 0.95;
      actor.x = 248 - Math.min(36, actor.t * 70);
      actor.squash = 0.68 + actor.t * 0.08;
      actor.shield = clamp((actor.t - 0.35) / 0.25, 0, 1);
      if (actor.t > 0.7) {
        actor.phase = "shield";
        actor.t = 0;
        actor.beat = "Shield";
        actor.shield = 1;
        actor.squash = 0.9;
      }
      break;
    case "shield":
      actor.shield = 1;
      actor.drone = 1;
      actor.trauma = spring(actor.trauma, 0.12, 3.5, dt);
      actor.squash = spring(actor.squash, 1, 7, dt);
      actor.x = spring(actor.x, 250, 6, dt);
      if (actor.t > 1.9) {
        actor.phase = "hold";
        actor.t = 0;
        actor.beat = "Hold";
      }
      break;
    case "hold":
      actor.shield = 1;
      if (actor.t > 1.35) Object.assign(actor, makeActor("drone"));
      break;
    default:
      break;
  }
}

function stepPhone(actor: Actor) {
  switch (actor.phase) {
    case "idle":
      if (actor.t > 1.6) {
        actor.phase = "pull";
        actor.t = 0;
        actor.beat = "Pull";
      }
      break;
    case "pull":
      if (actor.t > 0.7) {
        actor.phase = "talk";
        actor.t = 0;
        actor.beat = "Talk";
      }
      break;
    case "talk":
      if (actor.t > 2.8) {
        actor.phase = "idle";
        actor.t = 0;
        actor.beat = "Idle";
      }
      break;
    default:
      break;
  }
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | undefined,
  x: number,
  y: number,
  w: number,
  h: number,
  flipX: number,
) {
  if (!img || !img.naturalWidth) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX, 1);
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
}

export function ScenePlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const actorRef = useRef<Actor>(makeActor("bed"));
  const playingRef = useRef(true);
  const sceneRef = useRef<SceneId>("bed");
  const beatRef = useRef("Sleep");
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [scene, setScene] = useState<SceneId>("bed");
  const [beat, setBeat] = useState("Sleep");
  const [key, setKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadImages(ALL_KIT_IMAGES).then((imgs) => {
      if (cancelled) return;
      const map = new Map<string, HTMLImageElement>();
      ALL_KIT_IMAGES.forEach((src, i) => map.set(src, imgs[i]));
      imagesRef.current = map;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    sceneRef.current = scene;
    actorRef.current = makeActor(scene);
    beatRef.current = actorRef.current.beat;
    setBeat(actorRef.current.beat);
  }, [scene, key]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const actor = actorRef.current;
      const sc = sceneRef.current;
      if (playingRef.current) {
        actor.t += dt;
        actor.trauma = Math.max(0, actor.trauma - dt * 2.4);
        if (actor.phase !== "launch" && actor.phase !== "dash") {
          actor.squash = spring(actor.squash, 1, 11, dt);
        }
        if (sc === "bed") stepBed(actor, dt);
        else if (sc === "window") stepWindow(actor, dt);
        else if (sc === "drone") stepDrone(actor, dt);
        else stepPhone(actor);
        if (actor.beat !== beatRef.current) {
          beatRef.current = actor.beat;
          setBeat(actor.beat);
        }
      }

      const shake = actor.trauma * 7;
      const ox = (Math.random() - 0.5) * shake;
      const oy = (Math.random() - 0.5) * shake;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(ox, oy);

      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#12141c");
      g.addColorStop(0.7, "#0e1016");
      g.addColorStop(1, "#0a0b10");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      if (sc === "window") {
        ctx.fillStyle = "#1a2233";
        ctx.fillRect(380, 70, 220, 180);
        ctx.strokeStyle = "#2c3a52";
        ctx.lineWidth = 8;
        ctx.strokeRect(380, 70, 220, 180);
        ctx.beginPath();
        ctx.moveTo(490, 70);
        ctx.lineTo(490, 250);
        ctx.moveTo(380, 160);
        ctx.lineTo(600, 160);
        ctx.stroke();
      }

      ctx.fillStyle = "#1c1e26";
      ctx.fillRect(0, FLOOR + 18, W, H - FLOOR);
      ctx.strokeStyle = "#2a2d38";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, FLOOR + 18);
      ctx.lineTo(W, FLOOR + 18);
      ctx.stroke();

      const imgs = imagesRef.current;
      const pose = pick(actor, sc);
      const img = imgs.get(pose.src);
      const sy = actor.squash;
      const sw = SPRITE / sy;
      const sh = SPRITE * sy;

      const drawActor = () => {
        if (sc === "bed" && (actor.phase === "sleep" || actor.phase === "alarm") && img) {
          ctx.save();
          ctx.translate(actor.x + 6, actor.y - 18);
          ctx.rotate(-1.05);
          const rw = sw * 0.82;
          const rh = sh * 0.82;
          ctx.drawImage(img, -rw / 2, -rh, rw, rh);
          ctx.restore();
        } else {
          drawSprite(ctx, img, actor.x, actor.y + 10, sw, sh, pose.flipX);
        }
      };

      const drawBedLayer = () => {
        if (sc !== "bed") return;
        const bedSrc = actor.phase === "sleep" || actor.phase === "alarm" ? STICK.bedMade : STICK.bedMessy;
        const bed = imgs.get(bedSrc);
        const pop = 0.2 + 0.8 * easeOutBack(clamp(actor.bed + 0.7, 0, 1));
        const bw = 268 * pop;
        const bh = 176 * pop;
        drawSprite(ctx, bed, BED_X, FLOOR + 8, bw, bh, 1);
        if (actor.alarm > 0.05) {
          const j = Math.sin(actor.t * 52) * 8 * actor.alarm;
          const hop = Math.abs(Math.sin(actor.t * 28)) * 10 * actor.alarm;
          const s = 128 * (0.85 + actor.alarm * 0.35);
          drawSprite(ctx, imgs.get(cycle(FX_ALARM, actor.t, 12)), 148 + j, FLOOR + 4 - hop, s, s, 1);
        }
      };

      if (sc === "drone") {
        const bob = Math.sin(now / 280) * 10;
        const speakerOn = actor.phase === "blast1" || actor.phase === "flinch" || actor.phase === "turn";
        const speakerLinger = actor.phase === "droneIn" || actor.phase === "blast2" || actor.phase === "shield" || actor.phase === "hold";
        if (speakerOn || speakerLinger) {
          const spFrame =
            actor.phase === "blast1"
              ? FX_SPEAKER[clamp(1 + Math.floor(actor.t * 3.2), 1, 4)]
              : actor.phase === "flinch"
                ? FX_SPEAKER[4]
                : speakerLinger
                  ? FX_SPEAKER[5]
                  : FX_SPEAKER[0];
          const slump = speakerLinger ? 18 : 0;
          drawSprite(ctx, imgs.get(spFrame), 760, FLOOR + 8 - slump, 168, 168, 1);
        }
        if (actor.drone > 0.04 || actor.phase === "droneIn" || actor.phase === "blast2" || actor.phase === "shield" || actor.phase === "hold") {
          const enter = easeOutBack(clamp(actor.drone, 0, 1));
          const dx = 1100 - enter * 340 + (actor.phase === "shield" || actor.phase === "hold" ? 40 : 0);
          const dy = 70 + (1 - enter) * 80 + bob;
          const dFrame =
            actor.phase === "blast2"
              ? FX_DRONE[clamp(2 + Math.floor(actor.t * 4), 2, 4)]
              : actor.phase === "shield"
                ? FX_DRONE[4]
                : actor.phase === "hold"
                  ? FX_DRONE[5]
                  : FX_DRONE[clamp(Math.floor(actor.t * 4), 0, 1)];
          drawSprite(ctx, imgs.get(dFrame), dx, dy + 150, 210, 170, 1);
        }
      }

      const behindBed = sc === "bed" && (actor.phase === "launch" || actor.phase === "flip");
      if (behindBed) {
        drawActor();
        drawBedLayer();
      } else {
        drawBedLayer();
        drawActor();
      }

      if (sc === "bed" && actor.phase === "sleep") {
        const bob = Math.sin(actor.t * 2.8) * 10;
        drawSprite(ctx, imgs.get(cycle(FX_ZZZ, actor.t, 5)), actor.x + 58, actor.y - 96 + bob, 92, 92, 1);
      }
      if (sc === "bed" && (actor.phase === "launch" || actor.phase === "flip" || actor.phase === "land" || actor.phase === "coffee")) {
        const ang = actor.t * 5.5;
        drawSprite(
          ctx,
          imgs.get(cycle(FX_STARS, actor.t, 8)),
          actor.x + Math.cos(ang) * 10,
          actor.y - 108 + Math.sin(ang * 1.4) * 6,
          118,
          118,
          1,
        );
      }
      if (sc === "window" && actor.phase === "smoke") {
        drawSprite(ctx, imgs.get(cycle(FX_RINGS, actor.t, 6)), actor.x + 62, actor.y - 78, 140, 140, 1);
      }
      if (sc === "drone") {
        if (actor.phase === "blast1") {
          const i = clamp(Math.floor(actor.t * 4), 0, 3);
          drawSprite(ctx, imgs.get(FX_SONIC[i]), 560, FLOOR - 10, 260 + actor.t * 40, 150, 1);
        }
        if (actor.phase === "blast2") {
          const i = clamp(2 + Math.floor(actor.t * 5), 2, 4);
          drawSprite(ctx, imgs.get(FX_SONIC[i]), 540, FLOOR - 20, 320, 180, 1);
        }
        if (actor.phase === "shield") {
          const i = actor.t < 0.45 ? 4 : 5;
          drawSprite(ctx, imgs.get(FX_SONIC[i]), 430, FLOOR - 8, 200, 150, 1);
        }
        if (actor.shield > 0.05) {
          const pop = 0.35 + 0.65 * easeOutBack(actor.shield);
          const spark = actor.phase === "shield" && actor.t < 0.7;
          const src = spark ? FX_SHIELD[2] : actor.phase === "hold" ? FX_SHIELD[3] : FX_SHIELD[clamp(Math.floor(actor.shield * 2), 0, 1)];
          drawSprite(ctx, imgs.get(src), actor.x + 78, actor.y + 6, 132 * pop, 148 * pop, 1);
        }
      }

      ctx.restore();

      const debug = {
        scene: sc,
        phase: actor.phase,
        beat: actor.beat,
        x: Math.round(actor.x),
        y: Math.round(actor.y),
        vx: Math.round(actor.vx),
        vy: Math.round(actor.vy),
      };
      (window as unknown as { __scene: typeof debug }).__scene = debug;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready, key, scene]);

  const meta = SCENES_META.find((item) => item.id === scene) ?? SCENES_META[0];

  return (
    <section className="player">
      <div className="toolbar">
        {SCENES_META.map((item) => {
          const active = item.id === scene;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setScene(item.id);
                setKey((n) => n + 1);
              }}
              className={cn("tab", active && "tab-active")}
              aria-label={`Scene ${item.number} ${item.title}`}
              aria-pressed={active}
            >
              <span className="num">{item.number}</span> {item.title}
            </button>
          );
        })}
        <div className="spacer">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="icon-btn"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={() => setKey((n) => n + 1)} className="icon-btn">
            Replay
          </button>
        </div>
      </div>
      <div className="stage">
        <canvas ref={canvasRef} width={W} height={H} />
        {!ready && <p className="loading">Loading sheets…</p>}
      </div>
      <div className="meta">
        <p>{meta.brief}</p>
        <p className="beat">{beat}</p>
      </div>
      <ol className="beats">
        {meta.beats.map((label) => (
          <li key={label} className={cn("chip", label === beat && "chip-on")}>
            {label}
          </li>
        ))}
      </ol>
    </section>
  );
}
