# Particles

A **particle** is one independent unit of work another agent can claim, finish, and merge without touching any other particle’s files.

This folder is the dispatch board for the glossy cloud-robot mascot. Identity is locked. Do not invent a second character.

## Claim

1. Pick a particle whose `BRIEF.md` status is `open`.
2. Set status to `claimed` and write your agent name + date at the top.
3. Work only in that particle’s `out/` directory (and the listed runtime file if it is a code particle).
4. When it passes the acceptance block, set status to `done` and open a PR that touches **only** that particle’s paths.

Do not edit `_identity/`. Do not mix the sticker-sheet character into a body sheet.

## Identity (read this once)

Canonical body lives in [`_identity/`](./_identity/):

| File | View |
| --- | --- |
| `front.png` / `front-crop.png` | front, visor `>_` |
| `right.png` / `right-crop.png` | right profile |
| `left.png` / `left-crop.png` | left profile |
| `back.png` / `back-crop.png` | back, no visor |
| `contact-4view.png` | 2×2 turnaround |

**This is a 3D glossy plastic cloud-robot.** Puffy cloud head, dark visor with cyan prompt, **stubby rounded arm nubs — no fingers, no paws**, short legs, pale chest `>-`, navy outline.

`PROPS-ONLY-sticker-sheet.png` is **props and pose language only** (bed, alarm, mug, drone, sleep mask). Never use it as the body.

## Shared generate rules

- Solid `#FF00FF` background. No checkerboard. No labels. No grid lines.
- One action per sheet. Multi-row grid only (`2x2`, `2x3`, `2x4`).
- Full body inside the central 60–70%. Nothing touches a cell edge.
- Same scale and feet baseline across cells.
- Props that belong on the body (mask, mug, cigarette, phone, headphones) stay **attached**. No floating objects.
- Extra arms is an automatic reject. Regenerate.

Postprocess:

```bash
python3 skills/generate2dsprite/scripts/generate2dsprite.py process \
  --input particles/PXX-name/out/raw-sheet.png \
  --target player \
  --mode idle \
  --rows R --cols C \
  --label-prefix PREFIX \
  --output-dir particles/PXX-name/out \
  --shared-scale \
  --align feet \
  --fit-scale 0.72
```

Ship: `raw-sheet.png`, `sheet-transparent.png`, `PREFIX-1.png` … `PREFIX-N.png`.

## Board

| ID | Particle | Kind | Grid | Status |
| --- | --- | --- | --- | --- |
| P01 | idle-front | body | 2×2 | open |
| P02 | walk-side | body | 2×3 | open |
| P03 | sleep-lie | body | 2×2 | open |
| P04 | flip | body | 2×4 | open |
| P05 | dash | body | 2×3 | open |
| P06 | smoke | body | 2×2 | open |
| P07 | phone-headphones | body | 2×2 | open |
| P08 | dizzy-coffee | body | 2×2 | open |
| P09 | attached-fx (alarm / stars / zzz / o-rings) | fx | mixed | **done** |
| P10 | scene-bed | runtime | — | open |
| P11 | scene-window | runtime | — | open |
| P12 | scene-drone (speaker then drone, shield) | runtime | — | **done** |
| P13 | scene-phone | runtime | — | open |

Demo player (already on this branch): `examples/cloud-visor-web`. Runtime particles patch that player. Body particles drop frames into `examples/cloud-visor-web/public/sprites/mascot/<action>/` **only after** the particle `out/` is accepted.

## Merge rule

One particle per PR. If two agents need the same runtime file, the second agent rebases; do not rewrite another particle’s frames.
