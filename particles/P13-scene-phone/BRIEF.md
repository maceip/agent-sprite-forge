# P13 — Phone idle runtime

- **Status:** open
- **Claimed by:** —
- **Kind:** runtime
- **Write only:** `examples/cloud-visor-web/src/scene-player.tsx` (and `src/kit-assets.ts` if new frame paths are required)
- **Do not:** regenerate body sheets (those are P01–P09)

## Job

Patch the phone-idle branch of `scene-player.tsx` only.

Mostly idle (P01). One pull (P07). Hold/talk with headphones. Loop.

Acceptance: majority of the loop is idle; pull is one beat, not a constant phone pose.

## Physics bar

Walk/dash: accel in, decel out. Jumps/flips: gravity or a bezier, not a linear tween. Squash on launch and land. Frame changes happen at phase boundaries, not randomly.

## After accept

Keep the four scene tabs working. Do not break another scene's phase machine.
