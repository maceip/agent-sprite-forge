# P03 — Sleep lying (mask attached)

- **Status:** open
- **Claimed by:** —
- **Kind:** body
- **Grid:** 2x2 (4 frames)
- **Identity refs:** `particles/_identity/` → front-crop.png + right-crop.png + 2x2 layout guide
- **Write only:** `particles/P03-sleep-lie/out/`

## Action

Character is LYING ON ITS SIDE (horizontal), not standing. Pink sleep mask attached over the visor. Tiny Zzz attached near the head, still inside the cell.
Breathe: still, inhale, peak, exhale. Body only — no bed, no pillow. The bed is a separate prop.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P03-sleep-lie/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 2 \
  --label-prefix sleep \
  --output-dir particles/P03-sleep-lie/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- Silhouette is horizontal / reclined, not an upright body rotated in code
- Mask and Zzz stay attached
- No bed in the sheet

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/sleep-lie/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
