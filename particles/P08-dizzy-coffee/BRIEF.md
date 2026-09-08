# P08 — Dizzy coffee walk

- **Status:** open
- **Claimed by:** —
- **Kind:** body
- **Grid:** 2x2 (4 frames)
- **Identity refs:** `particles/_identity/` → front-crop.png + 2x2 layout guide
- **Write only:** `particles/P08-dizzy-coffee/out/`

## Action

Wobbly in-place walk. White mug with a cyan prompt mark pressed between the nubs — attached, never floating. 2–3 tiny yellow stars attached around the head.
Left foot, pass, right foot, pass.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P08-dizzy-coffee/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 2 \
  --label-prefix dizzy \
  --output-dir particles/P08-dizzy-coffee/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- Mug glued to the nubs in all 4 frames
- Stars stay inside the cell
- Walk is readable, identity locked

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/dizzy-coffee/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
