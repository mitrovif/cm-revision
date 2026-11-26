// Content for the census identification explorer: IRRS, IRIS and IROSS.
// Edit wording here. Each error carries src: "draft" (already in the CM draft, Use Case A section 2)
// or "added" (suggested addition), and a reference to the recommendation it rests on.
window.CM_DATA = {
  hint: "Hover over any box to see what it means. Click it to keep the explanation open.",
  frameworks: {

    irrs: {
      label: "IRRS",
      heading: "Refugees and related populations",
      lead: "Answer the P&R census topics and the IRRS reason question, or explore the tree. You will see which IRRS stock a person ends up in, and who could be wrongly counted or missed along the way.",
      toggles: [
        { key: "collectIII", label: "Census collects acquisition of citizenship (iii)", def: true },
        { key: "statelessCoded", label: "Citizenship (ii) mapping includes stateless and unknown", def: true }
      ],
      questions: [
        { key: "q1", title: "(i) Country of birth", meta: "Core topic", opts: [["census", "Census country"], ["abroad", "Abroad"]] },
        { key: "q2", title: "(ii) Country of citizenship", meta: "Core topic", opts: [["foreign", "Foreign country"], ["stateless", "Stateless or unknown"], ["census", "Census country"]] },
        { key: "q3", title: "(iii) Acquisition of citizenship", meta: "Core in IRRS, additional in P&R Rev. 4", opts: [["birth", "By birth"], ["nat", "Naturalisation, marriage, declaration, option"]] },
        { key: "q5", title: "(v) Main reason for most recent move", meta: "IRRS recommended", opts: [["d", "(d) Forced displacement"], ["other", "Other (work, study, family, deportation, other)"]] }
      ],
      outcomes: {
        o1: { title: "Not identified", stock: "Native-born", tone: "neutral",
          summary: "Born in the census country, so there is no international move for the reason question to apply to.",
          inclusion: [],
          exclusion: [
            { text: "Refugees sur place who were born in the country of asylum.", ref: "", src: "draft" },
            { text: "Children born in the country to refugee parents who do not hold its citizenship. The IRRS counts them as persons in need of international protection; they can only be found by linking them to an identified parent in the same household.", ref: "IRRS para 90", src: "added" },
            { text: "Children of refugees with host citizenship who do not live in the same household as their refugee parent.", ref: "IRRS para 94.2", src: "draft" }
          ] },
        o2: { title: "Persons in need of international protection", stock: "IRRS stock", tone: "identified",
          summary: "Foreign-born, without citizenship of the census country, and reported forced displacement as the main reason for the most recent move.",
          inclusion: [
            { text: "People who report forced displacement for reasons outside the IRRS scope, such as disasters or economic hardship. Response (d) is self-declared and includes “others”.", ref: "P&R para 5.131", src: "added" },
            { text: "People whose protection has ceased but who remain in the country without its citizenship. The IRRS places them in persons with a refugee background.", ref: "IRRS para 94.4", src: "added" }
          ],
          exclusion: [] },
        o3: { title: "Not identified", stock: "Other migrants and citizens", tone: "neutral",
          summary: "Either reported a main reason other than forced displacement, or is a citizen by birth.",
          inclusion: [],
          exclusion: [
            { text: "Refugees who do not view their move as forced and report another main reason.", ref: "", src: "draft" },
            { text: "Refugees sur place who moved by choice before circumstances in their country of origin changed.", ref: "", src: "draft" },
            { text: "Refugees who left the country and later returned voluntarily: the question refers to the most recent move only.", ref: "P&R para 5.128", src: "draft" },
            { text: "Family members admitted with derivative refugee status, who are likely to report “family reunification”.", ref: "", src: "added" },
            { text: "Refugees whose most recent move was a secondary movement from a first country of asylum for other reasons.", ref: "P&R para 5.128", src: "added" },
            { text: "Naturalised former refugees whose most recent move was not forced.", ref: "IRRS para 94.1", src: "added" },
            { text: "Reunified family members from abroad who are not refugees themselves (refugee background).", ref: "IRRS para 94.3", src: "added" },
            { text: "People who do not disclose a forced move out of fear, or whose reason is not known to a proxy respondent.", ref: "", src: "added" }
          ] },
        o4: { title: "Persons with a refugee background", stock: "IRRS stock", tone: "identified",
          summary: "Foreign-born, citizen of the census country (not by birth, where asked), and reported forced displacement as the main reason for the most recent move.",
          inclusion: [
            { text: "Naturalised people who reported a forced move but were never granted protection status.", ref: "", src: "draft" },
            { text: "Citizens by birth born abroad who fled to their country of citizenship. This only happens where acquisition of citizenship (iii) is not collected or not used.", ref: "P&R para 5.120", src: "draft", needs: "noIII" }
          ],
          exclusion: [
            { text: "People whose protection has ceased but who have not naturalised are counted as persons in need of international protection instead.", ref: "IRRS para 94.4", src: "added" }
          ] },
        stateless_missed: { title: "Not identified", stock: "Stateless, coded out", tone: "neutral",
          summary: "Citizenship is coded as foreign country only, so stateless and unknown citizenship fall through the mapping.",
          inclusion: [],
          exclusion: [ { text: "Stateless refugees. Mainly a statelessness issue (see the IROSS tab), but stateless refugees are part of this IRRS stock.", ref: "P&R para 5.116", src: "added" } ] }
      },
      extra: { id: "ret", title: "Persons returned after seeking international protection",
        items: [
          { text: "Not identified by the questions in Box A.2.", ref: "IRRS paras 95 to 97", src: "draft" },
          { text: "Response (e), deportation or involuntary return, picks up some returned asylum seekers, including rejected ones, but also deportees who never sought protection, and misses voluntary repatriation.", ref: "IRRS paras 95 to 97", src: "added" }
        ] },
      tips: {
        "start": { title: "Census population", body: "Everyone counted in the census. Follow the answers down the tree to see where each person is classified." },
        "q-i": { title: "(i) Country of birth", body: "Core P&R topic, asked of everyone. Only people born abroad have the international move that the reason question asks about." },
        "p-born-here": { title: "Born in the census country", body: "Not counted in any IRRS stock, even if they are refugees' children or refugees sur place." },
        "p-abroad": { title: "Born abroad", body: "Next: citizenship." },
        "q-ii": { title: "(ii) Country of citizenship", body: "Core P&R topic. Separates foreign citizens and stateless people from citizens of the census country. P&R has separate codes for stateless and unknown (para 5.116)." },
        "p-foreign": { title: "Foreign, stateless or unknown citizenship", body: "May be in need of international protection; the reason question decides. If the mapping says “foreign country” only, stateless refugees drop out here." },
        "p-cit-census": { title: "Citizen of the census country", body: "May have a refugee background if they became a citizen after birth." },
        "q-iii": { title: "(iii) Acquisition of citizenship", body: "Core in the IRRS (paras 131 and 132), additional in P&R Rev. 4 (para 5.120). Separates citizens by birth from naturalised citizens." },
        "p-bybirth": { title: "Citizen by birth", body: "Correctly not counted: a citizen by birth was never a refugee in their own country." },
        "p-natur": { title: "Citizen after birth", body: "Became a citizen through naturalisation, marriage, declaration or option. Next: reason for moving." },
        "q-va": { title: "(v) Main reason for the most recent move", body: "Recommended by the IRRS, additional topic in P&R Rev. 4. One main reason, for the most recent move only, as the person reports it (P&R paras 5.128 and 5.129)." },
        "q-vb": { title: "(v) Main reason for the most recent move", body: "Recommended by the IRRS, additional topic in P&R Rev. 4. One main reason, for the most recent move only, as the person reports it (P&R paras 5.128 and 5.129)." },
        "p-d-a": { title: "(d) Forced displacement", body: "Counted as a person in need of international protection." },
        "p-d-b": { title: "(d) Forced displacement", body: "Counted as a person with a refugee background." },
        "p-other-a": { title: "Any other reason", body: "Work, study, family, deportation or other. Not counted, even if the person holds refugee status." },
        "p-other-b": { title: "Any other reason", body: "Work, study, family, deportation or other. Not counted, even if the person is a former refugee." }
      }
    },

    iris: {
      label: "IRIS",
      heading: "Internally displaced persons",
      lead: "Answer the IRIS forced displacement questions from Box A.3, or explore the tree. People who fled within the country are sorted by comparing where they live now (i) with where they fled from (xii) and where they first fled to (xiii).",
      toggles: [
        { key: "askReason", label: "Census asks the reason for displacement (x)", def: true }
      ],
      questions: [
        { key: "ix", title: "(ix) Has (NAME) ever been forced or obliged to flee?", meta: "Asked of all persons", opts: [["yes", "Yes"], ["no", "No"]] },
        { key: "xiii", title: "(xiii) Where did (NAME) first flee to?", meta: "Within country or abroad", opts: [["within", "Within the country"], ["abroad", "Abroad"]] },
        { key: "loc", title: "Where does (NAME) live now, (i)?", meta: "Compared with (xii) and (xiii)", opts: [["to", "Where they first fled to (xiii)"], ["from", "Where they fled from (xii)"], ["else", "Somewhere else in the country"]] }
      ],
      outcomes: {
        n1: { title: "Not counted", stock: "No forced move reported", tone: "neutral",
          summary: "Answered “no” to (ix), so not identified as an IDP.",
          inclusion: [],
          exclusion: [
            { text: "People who were temporarily away from their place of habitual residence when the displacement event occurred and cannot return. They did not flee, so may answer “no”. The draft refers to them as IDPs ‘in situ’.", ref: "IRIS para 41", src: "draft" },
            { text: "Household members for whom the displacement questions are skipped, most often children.", ref: "IRIS para 216", src: "added" },
            { text: "People who do not disclose a forced move out of fear, or whose history is not known to a proxy respondent.", ref: "", src: "added" }
          ] },
        n2: { title: "Not counted", stock: "Fled abroad", tone: "neutral",
          summary: "First fled abroad, so filtered out of the IDP count; covered by the refugee recommendations while abroad.",
          inclusion: [],
          exclusion: [
            { text: "People who fled abroad for less than 12 months and came back without establishing a new country of residence. They remain IDPs, but answer “abroad” to (xiii) and are filtered out.", ref: "IRIS, Chapter 3", src: "draft" }
          ] },
        d: { title: "IDPs in locations of displacement", stock: "IRIS sub-category", tone: "identified",
          summary: "Lives where they first fled to, so has not returned or moved on.",
          inclusion: [
            { text: "People who have overcome their displacement-related vulnerabilities: question (ix) has no time limit and exit cannot be measured in a census.", ref: "IRIS paras 78 to 81", src: "draft" },
            { text: "People forced to move for reasons outside the Guiding Principles, where the reason (x) is not asked.", ref: "IRIS para 211", src: "added", needs: "noReason" }
          ],
          exclusion: [
            { text: "Recently displaced people whose usual residence is recorded as the place they fled from are classified as IDPs in locations of return instead.", ref: "", src: "draft" }
          ] },
        r: { title: "IDPs in locations of return", stock: "IRIS sub-category", tone: "identified",
          summary: "Lives where they fled from, so has returned to the place of habitual residence.",
          inclusion: [
            { text: "People who have overcome their displacement-related vulnerabilities: exit cannot be measured in a census.", ref: "IRIS paras 78 to 81", src: "draft" },
            { text: "Recently displaced people whose usual residence is recorded as the place they fled from.", ref: "", src: "draft" },
            { text: "People displaced within the same administrative area used to code locations: (xii) and (i) match, so they appear as returns.", ref: "", src: "added" },
            { text: "People forced to move for reasons outside the Guiding Principles, where the reason (x) is not asked.", ref: "IRIS para 211", src: "added", needs: "noReason" }
          ],
          exclusion: [] },
        o: { title: "IDPs in other settlement locations", stock: "IRIS sub-category", tone: "identified",
          summary: "Lives neither where they fled from nor where they first fled to, so has settled elsewhere in the country.",
          inclusion: [
            { text: "People who have overcome their displacement-related vulnerabilities: exit cannot be measured in a census.", ref: "IRIS paras 78 to 81", src: "draft" },
            { text: "People forced to move for reasons outside the Guiding Principles, where the reason (x) is not asked.", ref: "IRIS para 211", src: "added", needs: "noReason" }
          ],
          exclusion: [
            { text: "People displaced more than once may report a later origin, and be placed in the wrong sub-category, unless (xi) and (xii) refer to the first displacement.", ref: "IRIS para 177", src: "draft" }
          ] }
      },
      extra: { id: "rel", title: "IDP-related populations",
        items: [
          { text: "Children born after displacement to at least one IDP parent are identified only through a household link, if they live with an identified parent.", ref: "IRIS paras 78 to 81", src: "draft" },
          { text: "Box A.3 gives no rule for this link, such as a birth date after the date reported in (xi).", ref: "", src: "added" },
          { text: "Non-displaced family members and people who have overcome displacement-related vulnerabilities are not identified.", ref: "IRIS paras 78 to 81", src: "draft" }
        ] },
      tips: {
        "start": { title: "Census population", body: "Everyone counted in the census. The displacement questions should be asked of all household members (IRIS para 216)." },
        "q-ix": { title: "(ix) Ever forced or obliged to flee?", body: "The filter question (IRIS para 211). There is no time limit on when the flight happened." },
        "p-no": { title: "No", body: "Not counted as an IDP." },
        "p-yes": { title: "Yes", body: "Next: where they first fled to." },
        "q-xiii": { title: "(xiii) Where did you first flee to?", body: "Separates internal displacement from flight abroad. Only those who fled within the country are counted as IDPs." },
        "p-abroad": { title: "Abroad", body: "Filtered out of the IDP count. Refugees fall under the IRRS." },
        "p-within": { title: "Within the country", body: "An IDP. Next: compare locations to find the sub-category." },
        "q-cmp": { title: "Compare locations", body: "Where the person lives now (i), compared with where they fled from (xii) and where they first fled to (xiii)." },
        "p-eq-xiii": { title: "Lives where they first fled to", body: "Still in the location of displacement." },
        "p-eq-xii": { title: "Lives where they fled from", body: "Has returned to the place of habitual residence." },
        "p-neither": { title: "Lives somewhere else", body: "Has settled elsewhere in the country." }
      }
    },

    iross: {
      label: "IROSS",
      heading: "Stateless persons and those without a recognised nationality status",
      lead: "Answer the citizenship and birth questions, or explore the tree. Under IROSS the census identifies category A through country of citizenship; country of birth splits it into native-born and foreign-born.",
      toggles: [
        { key: "countUnknown", label: "Count “unknown citizenship” as category A", def: false },
        { key: "recognition", label: "Register linkage or a recognition question is available (B and C)", def: false }
      ],
      questions: [
        { key: "cit", title: "(ii) Country of citizenship", meta: "Core topic, with stateless and unknown codes", opts: [["census", "Census country"], ["foreign", "Foreign country"], ["stateless", "Stateless or no nationality"], ["unknown", "Unknown"]] },
        { key: "birth", title: "(i) Country of birth", meta: "Core topic, with an “unknown” code", opts: [["census", "Census country"], ["foreign", "Foreign country"], ["unknown", "Unknown"]] },
        { key: "rec", title: "Recognised as stateless by the authorities?", meta: "From register linkage or an added question", opts: [["yes", "Yes"], ["no", "No, or in process"]] }
      ],
      outcomes: {
        c1: { title: "Not counted", stock: "Citizens", tone: "neutral",
          summary: "Reported citizenship of the census country.",
          inclusion: [],
          exclusion: [
            { text: "Stateless people who report being citizens out of fear of discrimination. The draft notes the same fear as a cause of omission.", ref: "IROSS para 171", src: "draft" },
            { text: "Stateless household members whose citizenship is reported by a proxy as that of the household head, such as children of a stateless parent.", ref: "", src: "added" },
            { text: "Stateless people recorded as citizens where the question has no “stateless” option, is combined with ethnicity or tribe, or is replaced by country of birth. Native-born stateless people are most at risk.", ref: "IROSS paras 165 and 168", src: "added" }
          ] },
        c2: { title: "Not counted", stock: "Foreign citizens", tone: "neutral",
          summary: "Reported citizenship of another country.",
          inclusion: [],
          exclusion: [
            { text: "Stateless people who report the nationality of a country they are linked to, or perceived to be linked to, or their country of birth.", ref: "IROSS paras 67 and 157", src: "added" }
          ] },
        anb: { title: "Category A", stock: "Native-born", tone: "identified",
          summary: "Reported stateless or no nationality, born in the census country.",
          inclusion: [ { text: "People who hold a nationality but report being stateless, for example because they lack documents or misunderstand the question.", ref: "IROSS para 155", src: "added" } ],
          exclusion: [] },
        afb: { title: "Category A", stock: "Foreign-born", tone: "identified",
          summary: "Reported stateless or no nationality, born abroad.",
          inclusion: [ { text: "People who hold a nationality but report being stateless, for example because they lack documents or misunderstand the question.", ref: "IROSS para 155", src: "added" } ],
          exclusion: [] },
        aunk: { title: "Category A", stock: "Country of birth unknown", tone: "identified",
          summary: "Reported stateless or no nationality, country of birth unknown, for example foundlings. Counted in category A without the native-born or foreign-born split (IROSS para 168).",
          inclusion: [],
          exclusion: [] },
        pa: { title: "Possible category A", stock: "Unknown citizenship, report separately", tone: "neutral",
          summary: "Citizenship recorded as unknown. Telling stateless people apart from those whose citizenship is unclear is hard, so this group is best reported separately.",
          inclusion: [],
          exclusion: [ { text: "Stateless people coded “unknown” are missed if this group is not counted.", ref: "P&R para 5.116", src: "added" } ] }
      },
      extra: { id: "note", title: "What the branches cannot show",
        items: [
          { text: "Stateless people omitted from the census entirely, for example because they avoid contact with authorities.", ref: "IROSS para 171", src: "draft" },
          { text: "Categories B and C are mixed: recognition depends on formal determination recorded in registers or documents, which needs register linkage, group recognition or an added question.", ref: "IROSS paras 65 and 156", src: "added" },
          { text: "Stateless-related population: household members through the roster, children through a household link; previously stateless people only if previous citizenship is asked.", ref: "IROSS paras 74 to 76, P&R para 5.120", src: "added" },
          { text: "Stateless refugees are counted under both IRRS and IROSS: avoid adding the two totals.", ref: "IROSS para 172", src: "added" }
        ] },
      tips: {
        "start": { title: "Census population", body: "Everyone counted in the census, including those present without legal residence status (IROSS para 172)." },
        "q-cit": { title: "(ii) Country of citizenship", body: "The identifying question under IROSS (para 155). Needs two extra codes: “stateless or no citizenship/nationality status” and “unknown” (para 165)." },
        "p-census": { title: "Census country", body: "Counted as a citizen. Stateless people who report this way are missed." },
        "p-foreign": { title: "Foreign country", body: "Counted as a foreign citizen. Stateless people who report a linked country are missed." },
        "p-stateless": { title: "Stateless or no nationality", body: "Category A. Next: country of birth for the native-born and foreign-born split." },
        "p-unknown": { title: "Unknown citizenship", body: "Report separately: counting it as category A adds non-response, leaving it out misses stateless people coded this way." },
        "q-birth": { title: "(i) Country of birth", body: "Splits category A into native-born and foreign-born (IROSS para 158). IROSS adds an “unknown” code (para 168)." },
        "p-b-census": { title: "Born in the census country", body: "Category A, native-born." },
        "p-b-foreign": { title: "Born abroad", body: "Category A, foreign-born. Within category C, being born abroad is itself a link to another country (IROSS para 71)." }
      }
    }
  }
};
