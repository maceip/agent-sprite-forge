# Sprite pipeline (this demo)

This example was produced with Agent Sprite Forge `generate2dsprite` plus a canvas runtime.

## 1. Identity lock

Four stills of the same glossy cloud-robot (front, right, left, back) composited onto `#FF00FF`. Those stills are the only body reference.

Do **not** mix in the flat sticker-sheet character. Stickers are props only (bed, alarm, drone, mug).

## 2. Action sheets

Each action is its own magenta grid, generated with the identity stills as `imagine_reference_to_image` inputs plus a layout guide (`2x2`, `2x3`, `2x4`):

| Action | Grid | Frames |
| --- | --- | --- |
| idle | 2×2 | 4 |
| walk (side) | 2×2 | 4, left = flip of right |
| sleep | 2×2 | 4 |
| flip / somersault | 2×4 | 8 |
| dash | 2×3 | 6 |
| smoke | 2×2 | 4 |
| phone pull | 2×2 | 4 |
| dizzy + mug | 2×2 | 4 |

Prompt rules: solid magenta, body inside the central 60–70%, feet on a shared baseline, no cell-edge contact, stubby arm nubs (no fingers).

## 3. Postprocess

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input raw-sheet.jpg \
  --target player \
  --mode idle \
  --rows 2 --cols 2 \
  --label-prefix sleep \
  --output-dir out/sleep \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

Outputs: transparent frames, `sheet-transparent.png`, QC metadata.

## 4. Runtime

`src/scene-player.tsx` is a `requestAnimationFrame` canvas:

- Walk uses accel / decel, not linear tween
- Bedroom flip is a cubic bezier that peaks **over and behind** the bed, then lands on the far side
- While `launch` / `flip`, the mascot is drawn **before** the bed so the bed occludes the arc
- Props are parented in draw order, not baked into the body sheet
