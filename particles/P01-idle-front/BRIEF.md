# P01 — Idle (front)

- **Status:** open
- **Claimed by:** —
- **Kind:** body
- **Grid:** 2x2 (4 frames)
- **Identity refs:** `particles/_identity/` → front-crop.png + contact-4view.png + 2x2 layout guide
- **Write only:** `particles/P01-idle-front/out/`

## Action

Front idle breathe. Cell 1 rest. Cell 2 slight squash. Cell 3 peak inhale (head up ~4%). Cell 4 exhale.
Empty hands. No props. Feet planted, shared baseline.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P01-idle-front/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 2 \
  --label-prefix idle \
  --output-dir particles/P01-idle-front/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- Recognizably the glossy identity (visor `>_`, nubs, chest mark)
- 4 frames, no extra arms, nothing on cell edges
- Loop reads as breathe, not a different pose each cell

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/idle-front/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
