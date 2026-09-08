# P05 — Dash (right)

- **Status:** open
- **Claimed by:** —
- **Kind:** body
- **Grid:** 2x3 (6 frames)
- **Identity refs:** `particles/_identity/` → right-crop.png + 2x3 layout guide
- **Write only:** `particles/P05-dash/out/`

## Action

Right-facing dash: crouch, launch, stretch, peak lean, recover, plant.
Tiny attached motion marks OK if they stay inside the cell. No detached streaks.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P05-dash/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 3 \
  --label-prefix dash \
  --output-dir particles/P05-dash/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- Profile identity lock
- Acceleration readable in silhouette
- No extra arms

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/dash/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
