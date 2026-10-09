# SUBAR 6 — design system (v6)

Private football predictions for Town House 10. English only. No stars, no green, no red, no trophies.

## Colour (blues, whites, neutrals only)
| Token | Hex | Use |
|---|---|---|
| royal | #0B3D91 | Primary brand, hero surfaces, selected states, points |
| royal-2 | #0A3380 | Primary hover |
| cobalt | #2563EB | Links, focus ring, live, "right result" outline, attention |
| powder | #93C5FD | Motif lines on royal, secondary podium, saved ring |
| pale | #DEEFF7 | Door background, your row, saved ticket stub |
| ice | #EEF5FB | Page background, drum wells |
| ivory | #FBF6EE | Text on royal, ticket stubs, label tabs on royal |
| white | #FFFFFF | Cards |
| navy / ink | #061A40 | Body text, failed-save bar, toasts |
| ink-2 / ink-3 | #2D4167 / #536583 | Secondary and tertiary text (AA on white and ice) |
Status never relies on colour alone: saved = royal + check + "Saved"; failed = navy bar + "Not saved" + Try again; live = cobalt label + pulsing dot + "Live".

## Type (all SIL OFL, self-hosted)
- Display: Anton 400, uppercase, no added tracking. Titles, names, clocks, scores, points.
- Labels: Barlow Condensed 700, uppercase, +0.02–0.06em. Section heads, tabs, stubs, field labels.
- UI/body: Barlow 400–700.

## Shape, depth, motion
- Radii 8 / 14 / 22 / 32 / pill. Buttons and nav are pill; cards 22; hero 32; labels 8.
- Shadows are blue-tinted: sh1 (rest), sh2 (raised), sh3 (floating).
- Spacing on a 4px base; gutters 16 / 32 / 44 at <600 / 600–1023 / ≥1024.
- Motion: spring `linear()` curve; durations 140 / 240 / 420ms. View transitions slide by nav direction. `prefers-reduced-motion` turns all of it off.

## Motifs
- Label tab (`.notch`): royal or ivory strip hanging from a card's top edge.
- Match ticket (`.fx`): perforation notches + dashed tear line + ivory stub carrying the save state.
- Pitch markings: hero card, podium leader, door background.
- Globe grid: winner pennant, member pass.
- Pennant: round winner banner and leader marker in the table.

## Components
Mast (wordmark + club label, pill nav), floating dock (mobile/tablet), hero countdown, match ticket with score drums, Golden Goal minute rail, save bar (clean/pending/saving/saved/all/half/failed), rail cards, standings rows, podium, results boards with 1/X/2 split, member pass, door (onboarding, sign in, join, recovery), admin panels, toast.

## Dark theme
Follows the device setting until a member taps the half-circle button in the header; the choice is remembered on that device.
Roles: bg #050E24, well #0A1A3D, card #0C2050, raised #163170, tint #13306B, stub #081738; text #EEF5FB / #BCCDE8 / #93A8CB; brand text #C7DDFF; selected fills cobalt #2563EB; heroes royal #0E46A8 with pitch lines; accent links #8CBBFF; failed-save bar inverts to light #DCE8F8 with navy text. Ivory label tabs stay ivory on royal in both themes.

## Master logo (approved 9 Oct 2026)
The owner's logo: a royal rounded label with a white keyline, the SUBAR lettering on an arched baseline, the round 6 and the globe dome tucked beneath. Traced to vector from the approved artwork and split into components (brand/):
- logo-primary-royal / logo-primary-inverse: the full label (sign-in, print).
- lockup-mask: lettering + 6 + globe without the frame; the header draws it as a mask in currentColor, so it follows the theme.
- six-mask: the 6 alone (loader, member pass); app-icon / favicon: the 6 on a royal tile with keyline.
- globe-powder: the dome as a motif (winner pennant, member pass).
- logo-badge, pennant: applications.
