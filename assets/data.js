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
  hint: "Hover over any box to see what it means. Click it to keep the explanation open.",
  tips: {
    "start": { title: "Census population", body: "Everyone counted in the census. Follow the answers down the tree to see where each person is classified." },
    "q-i": { title: "(i) Country of birth", body: "Core P&R topic, asked of everyone. Only people born abroad have the international move that the reason question asks about." },
    "p-born-here": { title: "Born in the census country", body: "Not counted in any IRRS stock, even if they are refugees' children or refugees sur place." },
    "p-abroad": { title: "Born abroad", body: "Next: citizenship." },
    "q-ii": { title: "(ii) Country of citizenship", body: "Core P&R topic. Separates foreign citizens and stateless people from citizens of the census country. P&R has separate codes for stateless and unknown (para 5.116)." },
    "p-foreign": { title: "Foreign, stateless or unknown citizenship", body: "May be in need of international protection; the reason question decides. If the mapping says \"foreign country\" only, stateless refugees drop out here." },
    "p-cit-census": { title: "Citizen of the census country", body: "May have a refugee background if they became a citizen after birth." },
    "q-iii": { title: "(iii) Acquisition of citizenship", body: "Core in the IRRS, additional in P&R Rev. 4. Separates citizens by birth from naturalised citizens. If it is not asked, citizens by birth born abroad can be wrongly counted as having a refugee background." },
    "p-bybirth": { title: "Citizen by birth", body: "Correctly not counted: a citizen by birth was never a refugee in their own country." },
    "p-natur": { title: "Citizen after birth", body: "Became a citizen through naturalisation, marriage, declaration or option. Next: reason for moving." },
    "q-va": { title: "(v) Main reason for the most recent move", body: "Recommended by the IRRS (additional topic in P&R Rev. 4). Records one main reason, for the most recent move only, as the person reports it." },
    "q-vb": { title: "(v) Main reason for the most recent move", body: "Recommended by the IRRS (additional topic in P&R Rev. 4). Records one main reason, for the most recent move only, as the person reports it." },
    "p-d-a": { title: "(d) Forced displacement", body: "Refugees, asylum seekers, temporary protection, others. Counted as a person in need of international protection." },
    "p-d-b": { title: "(d) Forced displacement", body: "Counted as a person with a refugee background." },
    "p-other-a": { title: "Any other reason", body: "Work, study, family, deportation or other. Not counted, even if the person holds refugee status." },
    "p-other-b": { title: "Any other reason", body: "Work, study, family, deportation or other. Not counted, even if the person is a former refugee." }
  }
};
