# Subar Sitta design system (v3)

Concept: **the floodlit pitch at night.** A Town House 10 members' league, played under the lights. Night turf, chalk lines and one floodlight gold.

## Mark
A centre circle with its centre spot, drawn as one continuous 6 (`mark.svg`, `MARK()` in app.js). The ring and stem are chalk white, and the spot is floodlight gold. At stadium scale the same geometry becomes the matchday hero art (`PITCH`), drawn in chalk hairlines with a breathing gold spot. Town House 10 always sits with the wordmark.

## Type
| Role | Face |
|---|---|
| Headlines, wordmark | Archivo Wide (Archivo pinned at width 125), 800 to 850, uppercase, tracking -0.02em |
| Every number: scores, countdown, ranks, points, times | Archivo Cond (Archivo pinned at width 62), 250 to 800 |
| Interface and body | Instrument Sans 400 to 600, sentence case |

The one family covers both ends of the width axis. Wide type carries the voice, and condensed numerals read like a stadium scoreboard. All fonts are OFL and self-hosted in `fonts/`.

## Colour
| Token | Hex | Use |
|---|---|---|
| `--bg` | #08120D | Night turf canvas, with faint mowing stripes and a floodlight glow |
| `--plane` / `--plane-2` | #0E1C15 / #13261C | Keypad, pass, panels |
| `--rule` / `--seam` / `--ctl` | #1B2E23 / #2F4739 / #55715F | Hairlines and control borders |
| `--fg` / `--fg-hi` | #E4EBE3 / #F7FAF5 | Chalk text |
| `--fg-2` / `--fg-3` | #A9BAAE / #8A9E90 | Secondary and meta text |
| `--ice` (floodlight gold) | #FFC53D | The one accent: active, focus, progress, exact score, primary buttons |
| `--mint` | #71E3A2 | Saved and right-result states |
| `--amber` | #FF9D5C | Deadline close, incomplete |
| `--coral` | #FF7B6E | Errors, live matches |

Text on gold uses `--gold-ink` #1B1403. Club colours appear only as kit bars and in the prediction split.

## Shape and motion
- Controls use a 10px radius, and the member pass uses 18px. Structure (rows, rules) stays square.
- Motion: the mark draws itself on sign in, the score digits roll, a saved row gets a mint seam, ranks slide, the banner rotates, the save bar pops when all six are saved and the hero spot breathes slowly. Everything respects reduced motion.
