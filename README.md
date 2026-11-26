# CM revision

Interactive companion to the EGRISS Compilers' Manual revision. It shows how the census questions in P&R Rev. 4, together with the IRRS question on reason for migration, identify IRRS populations, and where inclusion and exclusion errors occur.

Live page: https://mitrovif.github.io/cm-revision/

## What the page does

- **Follow a respondent:** answer the census questions one by one; the decision tree highlights the path and a panel shows the IRRS stock and the inclusion and exclusion errors at that point.
- **Scenario switches:** see what changes when acquisition of citizenship (iii) is not collected, or when the citizenship mapping leaves out stateless and unknown.
- **Explain any box:** hover over a box in the tree to see what it means; click to keep the explanation open (works on touch screens too).

IRIS and IROSS tabs are placeholders for the next analyses.

## Structure

```
index.html              page layout
assets/data.js          all wording: outcomes, errors, box explanations (edit here)
assets/app.js           explorer logic, tree highlighting, hover and click explanations
assets/style.css        styles
assets/tree.svg         decision tree (generated)
img/*.png               PNG version of the tree (generated)
scripts/build_figures.py  generates the tree SVG and PNG
```

## Rebuilding the figures

```
python3 scripts/build_figures.py
```

Requires Python 3 and `rsvg-convert` (librsvg) for the PNGs. To preview locally, run `python3 -m http.server` in the repo folder and open http://localhost:8000 (opening index.html directly works too, with the PNG tree as fallback).
