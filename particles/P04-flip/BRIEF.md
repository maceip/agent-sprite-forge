# P04 — Backflip / somersault (body only)

- **Status:** open
- **Claimed by:** —
- **Kind:** body
- **Grid:** 2x4 (8 frames)
- **Identity refs:** `particles/_identity/` → front-crop.png + contact-4view.png + 2x4 layout guide
- **Write only:** `particles/P04-flip/out/`

## Action

One continuous backward somersault. Crouch, takeoff, inverted, tuck, upside-down, open, feet reach, land squash.
Body only. No bed, no floor, no dust. The runtime draws this arc BEHIND the bed.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P04-flip/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 4 \
  --label-prefix flip \
  --output-dir particles/P04-flip/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- 8 frames read as one flip, not 8 unrelated poses
- Same body scale (tuck may be tighter, not a different character)
- No extra limbs, no bed

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/flip/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
