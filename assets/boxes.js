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
      { id: "vii", cells: [{ id: "vii-t", draft: "(vii) Reason for migration; (viii) reason for change of residence" }, { id: "vii-s", span: 3, draft: "Use (a) – (e) responses above.", ours: "Forced displacement, as a check only; not needed when (ix) to (xiii) are asked, since it covers only the most recent move" }] },
      { id: "ix", cells: [{ id: "ix-t", draft: "(ix) Has (NAME) ever been forced or obliged to flee?" }, { id: "ix-1", draft: "Yes" }, { id: "ix-2", draft: "Yes" }, { id: "ix-3", draft: "Yes" }] },
      { id: "x", cells: [{ id: "x-t", draft: "(x) (If yes, reason)" }, { id: "x-s", span: 3, draft: "i) armed conflict; ii) generalised violence; iii) violations of human rights; iv) natural or human-made disasters; or v) other forced evictions or displacements" }] },
      { id: "xi", cells: [{ id: "xi-t", draft: "(xi) If yes, when was this?" }, { id: "xi-1", draft: "Answer falls within time period in (iv)", ours: "Any" }, { id: "xi-2", draft: "Answer falls within time period in (iv)", ours: "Any" }, { id: "xi-3", draft: "Answer does not fall within time period in (iv)", ours: "Any" }] },
      { id: "xii", cells: [{ id: "xii-t", draft: "(xii) If yes, where did you move from?" }, { id: "xii-1", draft: "Location", ours: "Location, different from (i)" }, { id: "xii-2", draft: "Location matches (i)" }, { id: "xii-3", draft: "Location, different from (i)" }] },
      { id: "xiii", cells: [{ id: "xiii-t", draft: "(xiii) If yes, where did you move to? (within country borders/abroad)" }, { id: "xiii-1", draft: "Location matches (i)" }, { id: "xiii-2", draft: "Location within country." }, { id: "xiii-3", draft: "Location within country, different from (i)" }] },
    ],
    filter: { draft: "Filter: Those answering ‘yes’ and that they moved within the country are identified as IDPs. The following table further categorizes such respondents into the three sub-categories.", ours: "Filter: Those answering ‘yes’ to (ix), and whose (xii) and (xiii) are both within the country, are identified as IDPs. The following table further categorizes such respondents into the three sub-categories.", why: "Says which question the ‘yes’ refers to, and that both the origin and the destination of the displacement must be within the country." }
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

// Why each suggested cell change is made, keyed by framework and cell id.
window.CM_BOX_WHY = {
  irrs: {
    "ii-1": "Stateless refugees are missed if citizenship is only tabulated as foreign country; P&R provides separate codes for stateless and unknown (para 5.116).",
    "iii-t": "Acquisition of citizenship is core in the IRRS but an additional topic in P&R Rev. 4 (para 5.120).",
    "iii-2": "With acquisition asked and used, citizens by birth who fled to their country of citizenship drop out instead of being counted as having a refugee background.",
    "iv-t": "Year of arrival is a core topic but does not decide who is identified.",
    "v-t": "Reason for international migration is recommended in the IRRS; in P&R Rev. 4 it is an additional topic (paras 5.128 to 5.131).",
    "kids-t": "The IRRS counts children born in the country to refugee parents as persons in need of international protection (para 90), but they have no international move.",
    "kids-s": "They can only be identified through a refugee parent in the same household."
  },
  iris: {
    "ii-1": "Being at home on census night is not related to displacement; as written, IDPs who are away would be missed.",
    "ii-2": "Being at home on census night is not related to displacement; as written, IDPs who are away would be missed.",
    "iv-1": "The sub-categories rest on locations, not timing.",
    "iv-2": "A returnee's duration of residence starts when they came back, after the displacement, so as written returnees would not fit any column.",
    "iv-3": "Timing does not separate return from other settlement: in both, the person moved after being displaced.",
    "v-3": "(xi) is a date, not a place; previous residence is not needed for identification.",
    "vii-s": "The reason list in the box is not lettered, and it covers only the most recent move.",
    "xi-1": "The sub-categories rest on locations, not timing.",
    "xi-2": "A returnee came back after being displaced, so the date of displacement falls before their duration of residence; as written they would not fit any column.",
    "xi-3": "Timing does not separate return from other settlement: in both, the person moved after being displaced.",
    "xii-1": "Without “different from (i)”, returnees and people displaced within the same area would be counted here."
  },
  iross: {
    "i-1": "Splits category A into native-born and foreign-born, which the IROSS uses for analysis.",
    "ii-1": "Stateless persons are identified by the stateless code for citizenship (IROSS para 165, P&R para 5.116).",
    "ii-3": "Unknown citizenship mixes non-response with stateless persons, so it is best reported separately rather than counted or dropped.",
    "rec-s": "Recognition is formal and recorded in registers or documents (IROSS paras 65 and 156), which a census does not ask about."
  }
};
