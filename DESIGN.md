# Subar Sitta design system (v5, Night Pitch)

The approved art direction is the dark football app reference the owner supplied: deep forest greens, glass cards and lime-to-turquoise light.

## Mark
A modern 6 drawn as one stroke. Its bowl holds a match ball's pentagon patch. It is lime to turquoise on a near-black tile (`MARK6()`, `mark.svg`). It works as the app icon, in the masthead, on the membership card and at hero scale on the entry screen. The name is set as Subar Sitta / سوبر ستة, always with Town House 10.

## Colour
- Canvas: #060B08 under a forest glow (#2C6338 to #163A22) at the top of the screen.
- Cards: translucent white at 4.5 to 6% with a 1px light edge, a backdrop blur and a soft drop shadow, 28px radius.
- Light: `--grad` (#C8F55A to #79EA8F to #25D9B4). Used for the hero card, the active navigation pill, primary buttons, exact scores, the member card and the round winner. Text on light uses #07140D.
- Text: #F2F6F1, #B5C1B8 and #8A988E (meta, AA on the canvas).
- Live and errors: #E5383B.

## Type
Manrope for Latin and Alexandria for Arabic, joined into one family ("SS") by unicode range. Weights 500 to 800. Numbers are tabular and bold, like the reference's scores.

## Components
- **Notch tab:** sits at the top centre of a card ("Round 3", "Live").
- **Floating dock:** round buttons. The active one stretches into a gradient pill with its label (spring).
- **Fixture card:** crests at 52px, the date and kick-off time, and two score drums (picker wheels on native scroll snapping, with tap and keyboard input).
- **Golden Goal:** a 90-minute rail under a glowing cursor.
- **Pick split:** after the lock, the group's split appears as 1 / X / 2 pills, in the place of the reference's odds.
- **Who's in:** a row of avatars with progress rings that fill as each member predicts.
- **Round winner:** a gradient card with a crown. The table opens with a podium.
- **Save bar:** a glass pill that floats only when it has something to say, and turns gradient when all six are saved.

## Motion
- Spring easing through CSS `linear()`.
- Sections slide in from the side they sit on (View Transitions; mirrored in Arabic). Onboarding slides spring between steps.
- Reduced motion switches every animation off.
