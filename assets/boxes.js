// Box mapping tables from the CM draft (Use Case A), cell by cell, with suggested changes.
// draft: text in the draft (null = new row or cell); ours: suggested text (omit if unchanged).
// Cell ids: "<row>-t" topic cell, "<row>-<n>" answer column n, "<row>-s" a cell spanning all columns.
window.CM_BOXES = {
  irrs: {
    title: "Box A.2: mapping census answers to IRRS populations",
    cols: ["Persons in need of international protection", "Persons with a refugee background, excluding children born of refugee parents"],
    rows: [
      { id: "i", cells: [{ id: "i-t", draft: "i. Country of birth (core)" }, { id: "i-1", draft: "Foreign country" }, { id: "i-2", draft: "Foreign country" }] },
      { id: "ii", cells: [{ id: "ii-t", draft: "ii. Country of citizenship (core)" }, { id: "ii-1", draft: "Foreign country", ours: "Foreign country, stateless or unknown" }, { id: "ii-2", draft: "Country of census" }] },
      { id: "iii", cells: [{ id: "iii-t", draft: "iii. Acquisition of citizenship (core)", ours: "iii. Acquisition of citizenship (core in IRRS, additional in P&R Rev. 4)" }, { id: "iii-1", draft: "Any" }, { id: "iii-2", draft: "Any", ours: "Other than by birth" }] },
      { id: "iv", cells: [{ id: "iv-t", draft: "iv. Year or period of arrival in the country", ours: "iv. Year or period of arrival in the country (core; not used for identification)" }, { id: "iv-1", draft: "Any" }, { id: "iv-2", draft: "Any" }] },
      { id: "v", cells: [{ id: "v-t", draft: "v. Reason for international migration", ours: "v. Reason for international migration (core in IRRS, additional in P&R Rev. 4)" }, { id: "v-1", draft: "Answer response (d)" }, { id: "v-2", draft: "Answer response (d)" }] },
      { id: "kids", added: true, cells: [{ id: "kids-t", draft: null, ours: "Children born in the country to refugee parents" }, { id: "kids-s", span: 2, draft: null, ours: "Identified only by linking them, through relationship to the reference person, to a parent identified above" }] }
    ]
  },
  iris: {
    title: "Box A.3: mapping census answers to IRIS populations",
    cols: ["IDPs in locations of displacement", "IDPs in locations of return", "IDPs in other settlement locations"],
    rows: [
      { id: "i", cells: [{ id: "i-t", draft: "(i) Place of usual residence" }, { id: "i-1", draft: "Location" }, { id: "i-2", draft: "Location" }, { id: "i-3", draft: "Location" }] },
      { id: "ii", cells: [{ id: "ii-t", draft: "(ii) Place where present at time of census" }, { id: "ii-1", draft: "Location matches (i)", ours: "Any" }, { id: "ii-2", draft: "Location matches (i)", ours: "Any" }, { id: "ii-3", draft: "Any location" }] },
      { id: "iii", cells: [{ id: "iii-t", draft: "(iii) Place of birth" }, { id: "iii-1", draft: "Any" }, { id: "iii-2", draft: "Any" }, { id: "iii-3", draft: "Any" }] },
      { id: "iv", cells: [{ id: "iv-t", draft: "(iv) Duration of residence" }, { id: "iv-1", draft: "Time period", ours: "Any" }, { id: "iv-2", draft: "Time period", ours: "Any" }, { id: "iv-3", draft: "Time period", ours: "Any" }] },
      { id: "v", cells: [{ id: "v-t", draft: "(v) Place of previous residence" }, { id: "v-1", draft: "Any" }, { id: "v-2", draft: "Any" }, { id: "v-3", draft: "May match (xi)", ours: "Any" }] },
      { id: "vi", cells: [{ id: "vi-t", draft: "(vi) Place of residence at a specified date in the past" }, { id: "vi-s", span: 3, draft: "Use this question to identify likely IDPs if there has been a significant displacement event." }] },
      { id: "vii", cells: [{ id: "vii-t", draft: "(vii) Reason for migration; (viii) reason for change of residence" }, { id: "vii-s", span: 3, draft: "Use (a) – (e) responses above.", ours: "Any (not needed when (ix) to (xiii) are asked)" }] },
      { id: "ix", cells: [{ id: "ix-t", draft: "(ix) Has (NAME) ever been forced or obliged to flee?", ours: "(ix) Has (NAME) ever been forced or obliged to flee? (asked of all persons)" }, { id: "ix-1", draft: "Yes" }, { id: "ix-2", draft: "Yes" }, { id: "ix-3", draft: "Yes" }] },
      { id: "x", cells: [{ id: "x-t", draft: "(x) (If yes, reason)" }, { id: "x-s", span: 3, draft: "i) armed conflict; ii) generalised violence; iii) violations of human rights; iv) natural or human-made disasters; or v) other forced evictions or displacements" }] },
      { id: "xi", cells: [{ id: "xi-t", draft: "(xi) If yes, when was this?", ours: "(xi) If yes, when was this? (first displacement)" }, { id: "xi-1", draft: "Answer falls within time period in (iv)", ours: "Any" }, { id: "xi-2", draft: "Answer falls within time period in (iv)", ours: "Any" }, { id: "xi-3", draft: "Answer does not fall within time period in (iv)", ours: "Any" }] },
      { id: "xii", cells: [{ id: "xii-t", draft: "(xii) If yes, where did you move from?" }, { id: "xii-1", draft: "Location", ours: "Location, different from (i)" }, { id: "xii-2", draft: "Location matches (i)" }, { id: "xii-3", draft: "Location, different from (i)" }] },
      { id: "xiii", cells: [{ id: "xiii-t", draft: "(xiii) If yes, where did you move to? (within country borders/abroad)" }, { id: "xiii-1", draft: "Location matches (i)" }, { id: "xiii-2", draft: "Location within country.", ours: "Location within country, different from (i)" }, { id: "xiii-3", draft: "Location within country, different from (i)" }] },
      { id: "kids", added: true, cells: [{ id: "kids-t", draft: null, ours: "Children born after displacement" }, { id: "kids-s", span: 3, draft: null, ours: "Born after the date in (xi) and linked, through relationship to the reference person, to an IDP parent identified above" }] }
    ]
  },
  iross: {
    title: "Box A.4: mapping census answers to IROSS populations (new table)",
    cols: ["Category A, native-born", "Category A, foreign-born", "Report separately as possible category A"],
    rows: [
      { id: "i", added: true, cells: [{ id: "i-t", draft: null, ours: "(i) Country of birth (core)" }, { id: "i-1", draft: null, ours: "Census country" }, { id: "i-2", draft: null, ours: "Foreign country" }, { id: "i-3", draft: null, ours: "Any" }] },
      { id: "ii", added: true, cells: [{ id: "ii-t", draft: null, ours: "(ii) Country of citizenship (core)" }, { id: "ii-1", draft: null, ours: "Stateless or no citizenship/nationality status" }, { id: "ii-2", draft: null, ours: "Stateless or no citizenship/nationality status" }, { id: "ii-3", draft: null, ours: "Unknown citizenship/nationality status" }] },
      { id: "rec", added: true, cells: [{ id: "rec-t", draft: null, ours: "Categories B and C" }, { id: "rec-s", span: 3, draft: null, ours: "Only through register linkage, group recognition or an added question on recognition; otherwise report category A only. Country of birth unknown: category A without the split" }] }
    ],
    intro: { draft: "Listed six internal migration topics (place of usual residence, place present, place of birth, duration of residence, previous residence, residence at a specified date) as the core topics", ours: "Country of citizenship and country of birth identify the population; other topics support analysis" }
  }
};
