# Subar Sitta design system (v4, Porcelain)

Concept: **a beautifully engineered object.** It is light, quiet and exact, made for six friends. The interface uses no cards, gradients or glass. Hairlines, type and one physical gesture carry it.

## The mark: six pips
A die face of six (`mark.svg`, `PIPS(n)` in app.js). Six pips are six fixtures. The mark is also the progress of your round. In the header, the save bar and the "Who's in" list, a pip lights when a fixture is predicted. When all six scores and the Golden Goal are saved, the die turns green. It works as an app icon, an embossed card, a chest print and a motion sequence (pips lighting 0 to 6).

## Inks
| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | #F4F5F3 | #0B0C0E | Canvas |
| `--surface` | #FFFFFF | #17191C | Drum window, inputs, panels |
| `--ink` | #0B0C0E | #F2F3F1 | Text, die, save bar |
| `--ink-2` / `--ink-3` | #464B52 / #5F656C | #B6BBC1 / #8D939A | Secondary and meta (AA) |
| `--green` | #00703C | #3BC47E | Saved, exact score, focus, active |
| `--red` | #C8102E | #FF5D6C | Live, errors, under three hours to lock |

These are the four inks of Kuwait's flag, used with restraint. Club colours appear only in the prediction split.

## Type
Alexandria (OFL), one family drawn for Arabic and Latin together, served from the site.
- Words: 700, tight tracking in Latin, natural spacing in Arabic.
- Numbers: 200 to 300, tabular. Scores, countdown, ranks and minutes read like instruments.
- Text: 400 to 500 at 15px.
- Western digits are used for scores and times in both languages.

## Interaction
- **Score drums.** Each score is a picker wheel built on native scroll snapping. You flick it, or tap a number above or below the centre. On a keyboard, digits, the arrow keys and Backspace work, and it is exposed as `role=spinbutton`. A value saves automatically about a second after it settles.
- **Minute rail.** The Golden Goal is a 90-minute ruler you slide under a fixed cursor (`role=slider`; arrow keys, Shift for 5, Home and End).
- **Save bar.** An ink object that shows the pips and the state, turns green when all six are saved and offers a retry if a save fails.
- **Spatial navigation.** Sections slide in from the side they sit on, using the View Transitions API. The masthead and tab bar stay still, and the slide reverses in Arabic.
- **Realtime.** Refreshes wait while a finger is on a drum.
- **Languages.** English (LTR) and Arabic (RTL) switch from the masthead; the choice is remembered on the device. Light and dark follow the system setting. Reduced motion turns every animation off.
