# CM revision

Interactive companion to the EGRISS Compilers' Manual revision (Use Case A, censuses). For each of the three EGRISS recommendations, IRRS (refugees), IRIS (IDPs) and IROSS (stateless persons), it shows how the census questions in the draft identify the populations in scope, and where inclusion and exclusion errors occur. Each error is marked as already in the draft or as a suggested addition, with the paragraph of the recommendation it rests on.

Live page: https://mitrovif.github.io/cm-revision/

## What the page does

One tab per recommendation (IRRS, IRIS, IROSS). Each shows the decision tree from census questions to the populations in scope, next to the draft's Box mapping table with suggested changes (struck draft text, bold suggested text).

- **Hover** over a box in the tree or a cell in the table to see what it means and, for every point linked to it, what the draft says, what we suggest and why. Linked boxes and cells light up.
- **Click** to keep the explanation open.
- **Coloured markers** on boxes and cells show where points sit: keep (draft point we agree with), expand, change, and add (missing from the draft).
- Links can open a tab directly, for example `#iross`.

## Structure

```
index.html              page layout
assets/data.js          all wording per framework: questions, outcomes, errors with source and reference, box explanations (edit here)
assets/review.js        paper vs suggestions: verdicts, reasons, scores and tree links (edit here)
assets/boxes.js         Box A.2, A.3, A.4 tables cell by cell with suggested changes (edit here)
assets/app.js           explorer logic per framework, tree highlighting, hover and click explanations
assets/style.css        styles
assets/tree-*.svg       decision trees for IRRS, IRIS, IROSS (generated)
img/*.png               PNG versions of the trees (generated)
scripts/build_figures.py  generates the tree SVGs and PNGs
```

## Rebuilding the figures

```
python3 scripts/build_figures.py
```

Requires Python 3 and `rsvg-convert` (librsvg) for the PNGs. To preview locally, run `python3 -m http.server` in the repo folder and open http://localhost:8000 (opening index.html directly works too, with the PNG tree as fallback).

## Design

Styled with the EGRISS design system tokens (colours, type, spacing, radii, shadows). Headings use Figtree, the design system's free fallback for the licensed Obvia font, which is not published here.
