// Content for the IRRS census identification explorer.
// Edit here to change wording; the page and table read from this file.
window.CM_DATA = {
  outcomes: {
    o1: {
      title: "Not identified",
      stock: "Native-born",
      tone: "neutral",
      summary: "Born in the census country, so there is no international move for the reason question to apply to.",
      inclusion: [],
      exclusion: [
        { text: "Children born in the country to refugee parents, with or without host citizenship. They can only be identified by linking them to an identified parent in the same household.", ref: "IRRS paras 90 and 94.2" },
        { text: "Refugees sur place who never moved.", ref: "IRRS para 90" }
      ]
    },
    o2: {
      title: "Persons in need of international protection",
      stock: "IRRS stock",
      tone: "identified",
      summary: "Foreign-born, without citizenship of the census country, and reported forced displacement as the main reason for the most recent move.",
      inclusion: [
        { text: "People who report forced displacement for reasons outside the IRRS scope, such as disasters or economic hardship.", ref: "P&R para 5.131" },
        { text: "People whose protection has ceased but who remain without citizenship. They belong to persons with a refugee background.", ref: "IRRS para 94.4" }
      ],
      exclusion: []
    },
    o3: {
      title: "Not identified",
      stock: "Other migrants and citizens",
      tone: "neutral",
      summary: "Either reported a main reason other than forced displacement, or is a citizen by birth.",
      inclusion: [],
      exclusion: [
        { text: "Family members admitted with derivative status who report family reunification.", ref: "IRRS para 92" },
        { text: "Refugees sur place who moved for work, study or other reasons before circumstances changed.", ref: "IRRS para 92" },
        { text: "Secondary movers from a first country of asylum, and refugees whose latest move was voluntary.", ref: "P&R para 5.128" },
        { text: "Naturalised former refugees whose most recent move was not forced.", ref: "IRRS para 94.1" },
        { text: "Reunified family members from abroad who are not refugees themselves.", ref: "IRRS para 94.3" },
        { text: "People who do not disclose a forced move out of fear, or whose reason is not known to a proxy respondent.", ref: "" }
      ]
    },
    o4: {
      title: "Persons with a refugee background",
      stock: "IRRS stock",
      tone: "identified",
      summary: "Foreign-born, citizen of the census country (not by birth, where asked), and reported forced displacement as the main reason for the most recent move.",
      inclusion: [
        { text: "Naturalised people who reported a forced move but never held protection status.", ref: "" },
        { text: "Citizens by birth born abroad who fled to their country of citizenship. Only happens where acquisition of citizenship (iii) is not collected or not used.", ref: "P&R para 5.120", needsNoIII: true }
      ],
      exclusion: [
        { text: "People whose protection has ceased but who have not naturalised are counted as persons in need of international protection instead.", ref: "IRRS para 94.4" }
      ]
    },
    stateless_missed: {
      title: "Not identified",
      stock: "Stateless, coded out",
      tone: "neutral",
      summary: "Citizenship is coded as foreign country only, so stateless and unknown citizenship fall through the mapping.",
      inclusion: [],
      exclusion: [
        { text: "Stateless refugees. Mainly a statelessness (IROSS) issue, but stateless refugees are part of the IRRS stock.", ref: "P&R para 5.116" }
      ]
    }
  },
  returnees: "Persons returned from abroad after seeking international protection are not reached by any branch. Response (e), deportation or involuntary return, picks up some returned asylum seekers, including rejected ones, but also deportees who never sought protection, and misses voluntary repatriation (IRRS paras 95 to 97).",
  subgroups: [
    { stock: "protection", name: "Prospective asylum seekers, asylum seekers", identified: "Yes, not separately", inclusion: "", exclusion: "" },
    { stock: "protection", name: "Persons with determined protection status", identified: "Yes, if reason (d)", inclusion: "", exclusion: "Another main reason given: derivative family, sur place who moved, secondary movers, later voluntary move" },
    { stock: "protection", name: "Others in refugee-like situations", identified: "Yes, if reason (d)", inclusion: "", exclusion: "As above" },
    { stock: "protection", name: "Children born in the country, no host citizenship", identified: "No", inclusion: "", exclusion: "Native-born; only via household link to a parent" },
    { stock: "protection", name: "Refugees sur place who never moved", identified: "No", inclusion: "", exclusion: "No international move" },
    { stock: "protection", name: "Stateless refugees", identified: "Only if (ii) includes stateless", inclusion: "", exclusion: "Missed if (ii) coded foreign only" },
    { stock: "protection", name: "Not in this stock", identified: "", inclusion: "Out-of-scope forced moves (disaster, hardship); ceased protection, not naturalised", exclusion: "" },
    { stock: "background", name: "Naturalised former refugees", identified: "Yes, if reason (d)", inclusion: "Never held protection status", exclusion: "Later voluntary move" },
    { stock: "background", name: "Children and descendants with citizenship", identified: "Household link only", inclusion: "", exclusion: "Not living with, or parent not identified" },
    { stock: "background", name: "Reunified family members", identified: "No", inclusion: "", exclusion: "Report family reunification" },
    { stock: "background", name: "Others, incl. ceased protection", identified: "Wrong stock", inclusion: "", exclusion: "Counted as in need of international protection" },
    { stock: "background", name: "Not in this stock", identified: "", inclusion: "Citizens by birth born abroad who fled, if (iii) not collected", exclusion: "" },
    { stock: "returned", name: "Repatriating refugees; other returnees", identified: "No", inclusion: "", exclusion: "Not covered by Box A.2" },
    { stock: "returned", name: "Repatriating asylum seekers, incl. rejected", identified: "Partly, via reason (e)", inclusion: "Deportees who never sought protection", exclusion: "Voluntary returns" }
  ],
  stocks: {
    protection: "Persons in need of international protection (IRRS paras 90 to 92)",
    background: "Persons with a refugee background (IRRS paras 93 to 94)",
    returned: "Persons returned after seeking protection (IRRS paras 95 to 97)"
  }
};
