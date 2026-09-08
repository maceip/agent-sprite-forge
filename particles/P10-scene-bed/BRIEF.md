# P10 — Bedroom runtime — behind-bed backflip

- **Status:** open
- **Claimed by:** —
- **Kind:** runtime
- **Write only:** `examples/cloud-visor-web/src/scene-player.tsx` (and `src/kit-assets.ts` if new frame paths are required)
- **Do not:** regenerate body sheets (those are P01–P09)

## Job

Patch `examples/cloud-visor-web/src/scene-player.tsx` only.

Beats: sleep (lying frames from P03) → alarm (prop) → crouch → **backflip BEHIND the bed** (P04 frames) → land → dizzy coffee walk (P08) off to the far-side corner.

The flip is a cubic bezier that peaks OVER and BEHIND the bed (far side, not the open floor in front). While phase is launch/flip, draw the mascot FIRST, then the bed, so the bed occludes the arc. Sleep is ON the bed (drawn after the bed).

Accel/decel on the coffee walk. Squash on launch and land. No new props.

Acceptance: screenshot the flip mid-arc; the mascot must be visually behind/occluded by the bed, landing on the far side, not in front.

## Physics bar

Walk/dash: accel in, decel out. Jumps/flips: gravity or a bezier, not a linear tween. Squash on launch and land. Frame changes happen at phase boundaries, not randomly.

## After accept

Keep the four scene tabs working. Do not break another scene's phase machine.
