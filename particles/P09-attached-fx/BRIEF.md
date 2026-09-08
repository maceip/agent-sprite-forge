# P09 — Attached FX pack (no body)

- **Status:** open
- **Claimed by:** —
- **Kind:** fx
- **Grid:** 2x2 (4 frames)
- **Identity refs:** `particles/_identity/` → PROPS-ONLY-sticker-sheet.png (fx language only)
- **Write only:** `particles/P09-attached-fx/out/`

## Action

Four compact FX cells on magenta, NOT a character:
1 Zzz cluster, 2 yellow star orbit, 3 cigarette smoke puff, 4 tiny hearts.
Each FX is a single connected blob near cell center. These get layered in the player, never baked into a rejected body sheet.

## Generate

Use `imagine_reference_to_image` (max 3 refs). Magenta `#FF00FF`. No labels. Body in the central 60–70%.

Then:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/P09-attached-fx/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows 2 --cols 2 \
  --label-prefix fx \
  --output-dir particles/P09-attached-fx/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

## Acceptance (reject and regenerate if any fail)

- No mascot body in any cell
- Each FX is one connected component (use component_mode=all only if pieces are meant to be separate)
- Tight, usable at ~64–96px

## After accept

Copy frames into `examples/cloud-visor-web/public/sprites/mascot/fx/` in a follow-up commit, or leave them in `out/` for the runtime particle to wire.
