# Scene 2 — Smoke (chill / ignore)

## Purpose
The “whatever, I’m chilling” beat. Mascot settles into a deadpan/headphones vibe while smoke FX and optional intrusion props play as comedy. Failed render clips show headphones mascot + smoke / chill interactivity layered on the desktop — recreate sticker motion only.

## Style contract
- Same cloud-bot identity and rich isometric language as Scene 1.
- Mood: lounging, irreverent, joking — **not** cute-sleep and **not** full rage (Scenes 1 and 4).
- Smoke FX should feel sticker-dramatic (rising plume, O-rings) while leaving space for the mascot on the left.
- Chroma `#FF00FF` for CapCut plates; transparent PNG for overlays.

## Cast & props
1. **Mascot headphones** — bulky orange/white over-ears + boom mic; face-screen chill (horizontal closed eyes) or `> _` focus.
2. **Joint / cigarette prop** — thin stick, glowing ember tip; held at mouth or floating.
3. **Smoke plume** — thick rising cloud from right; secondary left-edge smoke bank.
4. **Smoke O-rings** — cartoon ring(s) drifting L→R along bottom; second ring can shoot ~3× faster past the first.
5. **Optional intrusion** — claw / portal / tombstone gag peeking TR (secondary; keep modular).
6. **Optional flip phone** — tiny silver flip phone with pixel heart on screen (cameo prop).

## Beat timeline
| Beat | Action | Needed sprite coverage |
|------|--------|------------------------|
| A. Idle chill | Headphones mascot bob, closed-eye screen | idle loop |
| B. Light up | Ember ignites; first smoke wisps | 2–4 frame light |
| C. Smoke show | Plume rises; O-rings travel | smoke FX loop (no mascot baked in) |
| D. Ignore chaos | Optional claw/tombstone flash while mascot stays chill | modular FX one-shots |
| E. Phone glance | Optional flip-phone look-down | hold pose + phone prop |

## Sprite list (minimum)
- `mascot_headphones_idle`
- `mascot_headphones_smoke_hold`
- `prop_joint_ember`
- `fx_smoke_plume` (loop)
- `fx_smoke_oring_slow` + `fx_smoke_oring_fast`
- `prop_flip_phone_heart` (optional)
- `fx_claw_intrusion` (optional modular)

## Evaluation metrics
- Left third stays clear for mascot when using smoke plates.
- Ember readable; smoke rings read as motion at sticker scale.
- Headphones silhouette consistent; no bed/alarm props leaking into this scene.
- Chill emotional read vs Scene 1 sleep and Scene 4 rage is obvious in a side-by-side.
