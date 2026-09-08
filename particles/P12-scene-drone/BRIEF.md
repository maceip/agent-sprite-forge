# P12 — Drone runtime — turn, dash, hit

- **Status:** done
- **Claimed by:** grok-build
- **Kind:** runtime
- **Write only:** `examples/cloud-visor-web/src/scene-player.tsx` (and `src/kit-assets.ts` if new frame paths are required)
- **Do not:** regenerate body sheets (those are P01–P09)

## Job

Patch the drone branch of `scene-player.tsx` only.

Idle (P01) → 4-view turn using `_identity` front/left/back/right → dash (P05) with acceleration into the megaphone drone prop → hit squash → recover idle.

Drone prop from sticker sheet / existing `public/sprites/kit/drone-meg.png`. Do not draw a second mascot.

Acceptance: turn uses the glossy 4-view, not the sticker character; dash has accel; hit reads.

## Physics bar

Walk/dash: accel in, decel out. Jumps/flips: gravity or a bezier, not a linear tween. Squash on launch and land. Frame changes happen at phase boundaries, not randomly.

## After accept

Keep the four scene tabs working. Do not break another scene's phase machine.
