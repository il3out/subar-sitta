# Subar Sitta design system (v2)

Concept: **the chronograph and the scoreboard.** Broadcast score bugs for the fixtures and watch instrumentation for time (countdown, the Golden Goal bezel). There is one luxury object, the member pass. Everything else is quiet, precise and readable at a glance.

## Type

| Role | Face | Setting |
|---|---|---|
| Display: page titles, matchweek, member name | Sofia Sans Extra Condensed | 820 weight, uppercase, line-height .86, tracking -0.01em |
| Score and rank numerals | Sofia Sans Extra Condensed | 250 weight (thin, dial-like), tabular figures |
| Points, countdown, emphasis numerals | Sofia Sans Extra Condensed | 700 weight, tabular figures |
| Interface, body, labels | Basic Regular | 15/22 body, 13/18 labels, sentence case, no added tracking |
| Micro meta (kick-off day, units) | Basic Regular | 12px, colour `--fg-3` |

Rules:
- Uppercase is only for condensed display type, never for labels.
- Numbers always use the condensed face with `tabular-nums`.
- No middle-dot chains, em dashes or en dashes in visible text. Scores in running text are written `2-1`.
- Tosh A was requested but no file was supplied (the supplied archive contains Basic). The display slot is a single token (`--display`), so a licensed Tosh A can replace Sofia Sans Extra Condensed in one line.

## Colour

| Token | Hex | Use |
|---|---|---|
| `--bg` | #070E1D | Canvas (midnight) |
| `--plane` | #0B1930 | The few raised planes: keypad, member pass, admin forms |
| `--rule` | #1A2C46 | Hairlines |
| `--seam` | #38516C | Stitch at rest, control borders |
| `--fg` | #DCE4EC | Primary text (platinum) |
| `--fg-hi` | #F8FAFD | Scores and key numerals |
| `--fg-2` | #A7B6C8 | Secondary text |
| `--fg-3` | #8494AA | Meta (at least 4.5:1 on `--bg`) |
| `--ice` | #A9D9F2 | The one accent: selection, focus, active, the open round |
| `--mint` | #9CDEC2 | Saved and correct states only |
| `--amber` | #FFD18C | Deadline under 3 hours, incomplete |
| `--coral` | #F39C9B | Errors and failed saves |

Club colours (`--club`) appear only as a 3px kit bar beside a club in fixture rows and in the match-centre prediction split. They never fill large areas.

## Shape
- Structure is square: rows, sections and rules have no radius.
- Controls (score cells, keypad keys, buttons, inputs) use a 6px radius.
- The member pass is the only rounded plate (14px).
- Avatars are 6px-radius squares with initials, not circles.

## Stitch (functional only)
1. **Progress ribbon:** six stitched segments under the matchweek title, one per fixture. A segment turns solid ice when that fixture has both scores.
2. **Saved seam:** the bottom edge of a fixture row. Mint stitching draws left to right once when the row saves. Rows that aren't saved keep a plain hairline.
3. **Active tab:** a stitched bar marks the current section in the tab bar and masthead.
4. **Member pass:** a stitched inner edge.

## Motion (engineered, never decorative)
- Score digit change: the old digit leaves upward and the new one enters, 160ms.
- Saved seam draw: 260ms.
- Countdown: the seconds tick once a second. Under 3 hours the countdown turns amber.
- Rank movement: rows that moved slide from their previous position once per visit, 420ms.
- Page change: a 140ms fade.
- Easing `cubic-bezier(.2,.8,.2,1)`. Everything is off under `prefers-reduced-motion`.

## Layout
- Mobile first (390). The first prediction must be visible without scrolling.
- 1024px and up: a masthead with inline navigation and an asymmetric two-column layout (fixtures ledger plus a 380px rail).
- Touch targets are at least 44px. Score cells are 56px.
