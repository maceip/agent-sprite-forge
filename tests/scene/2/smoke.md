# Scene 2 — Smoke (phone + cigarette)

Official clip map: **Clip 2 = this scene.** Core sticker action is **cell / flip phone + smoking a cigarette**. The user may have forgotten a beat — keep phone + smoke as the locked core, and leave one **optional modular slot** for a forgotten beat (do not invent UI).

## Purpose
The “whatever, I’m chilling” beat. Mascot on the phone and lighting up; smoke FX play as comedy. Failed render clips show phone + cigarette / smoke interactivity layered on the desktop — recreate sticker motion only.

## Style contract
- Same cloud-bot identity and rich isometric language as Scene 1.
- Mood: lounging, irreverent, joking — **not** cute-sleep and **not** full Super Saiyan rage (Scenes 1 and 4).
- Lead props are the **phone** and the **cigarette / smoke**, not headphones-first.
- Smoke FX should feel sticker-dramatic (rising plume, O-rings) while leaving space for the mascot on the left.
- Chroma `#FF00FF` for CapCut plates; transparent PNG for overlays.

## Cast & props
1. **Mascot + phone (core)** — cloud-bot looking at / holding a tiny silver **flip / cell phone** (pixel heart or simple screen OK). Face-screen chill (horizontal closed eyes) or `> _` focus. Headphones are optional accessory, not the lead.
2. **Cigarette / joint (core)** — thin stick, glowing ember tip; held at mouth or floating.
3. **Smoke plume** — thick rising cloud from right; secondary left-edge smoke bank.
4. **Smoke O-rings** — cartoon ring(s) drifting L→R along bottom; second ring can shoot ~3× faster past the first.
5. **Optional modular forgotten-beat slot** — one unused hook (claw / portal / tombstone peek, or another small gag) kept modular so a missing clip beat can drop in later. Do not bake it into the phone or smoke plates.

## Beat timeline
| Beat | Action | Needed sprite coverage |
|------|--------|------------------------|
| A. Phone idle | Mascot + flip/cell phone, chill bob | idle loop + phone prop |
| B. Light up | Ember ignites; first smoke wisps | 2–4 frame light |
| C. Smoke show | Plume rises; O-rings travel | smoke FX loop (no mascot baked in) |
| D. Phone + smoke hold | Cigarette + phone together, deadpan | hold pose |
| E. Modular forgotten beat | Optional unused hook if a missing clip beat shows up | modular FX one-shot (empty slot OK) |

## Sprite list (minimum)
- `mascot_phone_idle` (core)
- `mascot_phone_smoke_hold` (core)
- `prop_flip_phone` / `prop_cell_phone` (core, not optional)
- `prop_cigarette_ember` (core)
- `fx_smoke_plume` (loop)
- `fx_smoke_oring_slow` + `fx_smoke_oring_fast`
- `fx_modular_forgotten_beat` (optional empty slot)

## Evaluation metrics
- Phone + cigarette read first in a side-by-side; they are the scene, not cameos.
- Left third stays clear for mascot when using smoke plates.
- Ember readable; smoke rings read as motion at sticker scale.
- No bed/alarm/Saiyan props leaking into this scene.
- Chill emotional read vs Scene 1 sleep and Scene 4 Super Saiyan is obvious.
