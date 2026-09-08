# P11 — Window runtime — walk, smoke, phone

- **Status:** open
- **Claimed by:** —
- **Kind:** runtime
- **Write only:** `examples/cloud-visor-web/src/scene-player.tsx` (and `src/kit-assets.ts` if new frame paths are required)
- **Do not:** regenerate body sheets (those are P01–P09)

## Job

Patch the window branch of `examples/cloud-visor-web/src/scene-player.tsx` only.

Walk in (P02) with accel to window center → smoke loop (P06) → phone pull (P07 frames 1–3) → hold with headphones (P07 frame 4). Then walk off.

Acceptance: cigarette and phone stay on the body; walk faces travel direction; transitions are not pops.

## Physics bar

Walk/dash: accel in, decel out. Jumps/flips: gravity or a bezier, not a linear tween. Squash on launch and land. Frame changes happen at phase boundaries, not randomly.

## After accept

Keep the four scene tabs working. Do not break another scene's phase machine.
