# P07 — Phone pull then headphones

- **Status:** open
- **Claimed by:** —
- **Kind:** body
- **Grid:** 2x2 (4 frames)
- **Identity refs:** `particles/_identity/` → front-crop.png + 2x2 layout guide
- **Write only:** `particles/P07-phone-headphones/out/`

## Action

Cell 1 idle empty nubs. Cell 2 nub reaches hip. Cell 3 black phone coming up, still touching the nub. Cell 4 phone at visor AND small dark headphones sitting on the cloud head (attached). Tiny hearts attached near the head OK if inside the cell.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P07-phone-headphones/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 2 \
  --label-prefix phone \
  --output-dir particles/P07-phone-headphones/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- Phone never floats
- Frame 4 has headphones on the head
- No extra arms, no second character

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/phone/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
