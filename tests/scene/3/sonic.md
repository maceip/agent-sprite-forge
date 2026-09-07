# Scene 3 — Sonic (drone megaphone wakeup)

## Purpose
Loud comedy wakeup / announcement beat: a drone hauls an oversized megaphone, tilts down, and blasts concentric sonic rings. Failed render clips show drone + megaphone + angry-remote + headphones mascot stacked as sticker chaos — recreate that **interactivity and staging**, not the desktop.

## Style contract
- Rich isometric props with thick outlines and high-sat reds/cyans.
- Megaphone is comically oversized vs the drone (joking aesthetic).
- Sonic blast = bold concentric rings / rays; readable as a single bonded sticker when spun/scaled in CapCut.
- Mascot can remain a separate layer (headphones / startled) so FX plates stay mascot-free.

## Cast & props
1. **Quadcopter drone** — dark grey/black, props spinning, carries megaphone payload.
2. **Megaphone** — classic red/white/silver bell; hatch shading OK; points downward for the blast.
3. **Sonic rings / rays** — white/cyan concentric blasts + optional radial rays from the bell.
4. **Angry remote** (optional TR) — black brick remote, huge red button pressed by a cartoon hand.
5. **Mascot reaction** — headphones mascot startled / covered ears / `> _` focus inside a cyan “active orb” (separate layer).

## Beat timeline
| Beat | Action | Needed sprite coverage |
|------|--------|------------------------|
| A. Fly-in | Drone+megaphone enter frame | fly-in one-shot |
| B. Roundabout | Circular hover / orbit settle | short loop |
| C. Aim | Megaphone tilts down toward subject | aim pose |
| D. Sonic blast | Giant rings/rays pulse from bell | blast loop (bonded to megaphone) |
| E. Remote punch | Optional hand smashes red button | one-shot FX |
| F. Mascot react | Separate startled / orb-active hold | reaction loop |

## Sprite list (minimum)
- `prop_drone_megaphone_flyin`
- `prop_drone_megaphone_hover`
- `prop_drone_megaphone_blast` (bonded FX)
- `fx_sonic_rings` (if split from body)
- `prop_angry_remote_press` (optional)
- `mascot_headphones_startled` (optional separate)

## Evaluation metrics
- Drone and megaphone stay locked as one bonded unit during spin/scale (no sliding FX).
- Blast reads instantly at small sticker size.
- No mascot baked into primary FX plate unless explicitly labeled.
- Isometric yaw matches Scene 1/2 props.
