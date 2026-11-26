# CM revision

Interactive companion to the EGRISS Compilers' Manual revision (Use Case A, censuses). For each of the three EGRISS recommendations, IRRS (refugees), IRIS (IDPs) and IROSS (stateless persons), it shows how the census questions in the draft identify the populations in scope, and where inclusion and exclusion errors occur. Each error is marked as already in the draft or as a suggested addition, with the paragraph of the recommendation it rests on.

Live page: https://mitrovif.github.io/cm-revision/

## What the page does

- **Follow a respondent:** answer the census questions one by one; the decision tree highlights the path and a panel shows the IRRS stock and the inclusion and exclusion errors at that point.
- **Scenario switches:** for example, acquisition of citizenship not collected (IRRS), reason for displacement not asked (IRIS), or counting unknown citizenship and having register linkage for categories B and C (IROSS).
- **Explain any box:** hover over a box in the tree to see what it means; click to keep the explanation open (works on touch screens too).

- **Three tabs:** IRRS, IRIS and IROSS, each with its own questions, switches and tree. Links can open a tab directly, for example `#iross`.

## Structure

```
index.html              page layout
assets/data.js          all wording per framework: questions, outcomes, errors with source and reference, box explanations (edit here)
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
