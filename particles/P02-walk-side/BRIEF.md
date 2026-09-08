# P02 — Walk (right profile, bake left)

- **Status:** open
- **Claimed by:** —
- **Kind:** body
- **Grid:** 2x3 (6 frames)
- **Identity refs:** `particles/_identity/` → right-crop.png + front-crop.png + 2x3 layout guide
- **Write only:** `particles/P02-walk-side/out/`

## Action

True right-facing walk cycle. Contact, down, pass, up, contact, pass.
Arms nubs swing opposite the legs. No smear, no motion lines outside the body.
After process: bake walk-left by flipping each frame horizontally. Do not generate a second identity.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P02-walk-side/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 3 \
  --label-prefix walk \
  --output-dir particles/P02-walk-side/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- Profile visor matches right.png
- 6 frames, shared feet line, no moonwalk (body faces the travel direction)
- walk-left is a literal flip of walk-right, same scale

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/walk-right/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
