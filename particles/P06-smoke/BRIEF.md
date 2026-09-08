# P06 — Smoke (cigarette attached)

- **Status:** open
- **Claimed by:** —
- **Kind:** body
- **Grid:** 2x2 (4 frames)
- **Identity refs:** `particles/_identity/` → right-crop.png + front-crop.png + 2x2 layout guide
- **Write only:** `particles/P06-smoke/out/`

## Action

3/4 or right profile. Cigarette with orange tip ATTACHED to the nub / visor edge — never floating.
Cell 1 cig up. Cell 2 inhale. Cell 3 hold. Cell 4 small attached puff still inside the cell.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P06-smoke/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 2 \
  --label-prefix smoke \
  --output-dir particles/P06-smoke/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- Cigarette is parented to the body in every frame
- Smoke puff does not leave the cell
- Same identity

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/smoke/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
