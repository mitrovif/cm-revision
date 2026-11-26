(function () {
  const D = window.CM_DATA;
  const state = { q1: null, q2: null, q3: null, q5: null, collectIII: true, statelessCoded: true };

  const QUESTIONS = [
    { key: "q1", title: "(i) Country of birth", meta: "Core topic", opts: [["census", "Census country"], ["abroad", "Abroad"]] },
    { key: "q2", title: "(ii) Country of citizenship", meta: "Core topic", opts: [["foreign", "Foreign country"], ["stateless", "Stateless or unknown"], ["census", "Census country"]] },
    { key: "q3", title: "(iii) Acquisition of citizenship", meta: "Core in IRRS, additional in P&R Rev. 4", opts: [["birth", "By birth"], ["nat", "Naturalisation, marriage, declaration, option"]] },
    { key: "q5", title: "(v) Main reason for most recent move", meta: "IRRS recommended", opts: [["d", "(d) Forced displacement"], ["other", "Other (work, study, family, deportation, other)"]] }
  ];
  const ORDER = ["q1", "q2", "q3", "q5"];

  function visible(key) {
    const s = state;
    if (key === "q1") return true;
    if (key === "q2") return s.q1 === "abroad";
    if (key === "q3") return s.q1 === "abroad" && s.q2 === "census" && s.collectIII;
    if (key === "q5") {
      if (s.q1 !== "abroad" || !s.q2) return false;
      if (s.q2 === "foreign") return true;
      if (s.q2 === "stateless") return s.statelessCoded;
      if (s.q2 === "census") return s.collectIII ? s.q3 === "nat" : true;
    }
    return false;
  }

  function resolve() {
    const s = state;
    if (s.q1 === "census") return { out: "o1", path: ["q-i"], lit: "out-o1" };
    if (s.q1 !== "abroad" || !s.q2) return null;
    if (s.q2 === "stateless" && !s.statelessCoded) return { out: "stateless_missed", path: ["q-i", "q-ii"], lit: null };
    if (s.q2 === "foreign" || s.q2 === "stateless") {
      if (!s.q5) return null;
      return { out: s.q5 === "d" ? "o2" : "o3", path: ["q-i", "q-ii", "q-va"], lit: s.q5 === "d" ? "out-o2" : "out-o3" };
    }
    if (s.q2 === "census") {
      if (s.collectIII) {
        if (!s.q3) return null;
        if (s.q3 === "birth") return { out: "o3", path: ["q-i", "q-ii", "q-iii"], lit: "out-o3", byBirth: true };
        if (!s.q5) return null;
        return { out: s.q5 === "d" ? "o4" : "o3", path: ["q-i", "q-ii", "q-iii", "q-vb"], lit: s.q5 === "d" ? "out-o4" : "out-o3" };
      }
      if (!s.q5) return null;
      return { out: s.q5 === "d" ? "o4" : "o3", path: ["q-i", "q-ii", "q-vb"], lit: s.q5 === "d" ? "out-o4" : "out-o3" };
    }
    return null;
  }

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") n.className = v; else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
    });
    (children || []).forEach(c => n.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  }

  function renderQuestions() {
    const box = document.getElementById("questions");
    box.innerHTML = "";
    QUESTIONS.forEach(q => {
      const card = el("div", { class: "q" + (visible(q.key) ? "" : " hidden") });
      card.appendChild(el("div", {}, [el("span", { class: "q-title", text: q.title }), el("span", { class: "q-meta", text: q.meta })]));
      const opts = el("div", { class: "opts", role: "group", "aria-label": q.title });
      q.opts.forEach(([val, label]) => {
        opts.appendChild(el("button", {
          class: state[q.key] === val ? "on" : "", "aria-pressed": state[q.key] === val ? "true" : "false", text: label,
          onclick: () => { state[q.key] = val; ORDER.slice(ORDER.indexOf(q.key) + 1).forEach(k => state[k] = null); update(); }
        }));
      });
      card.appendChild(opts);
      box.appendChild(card);
    });
  }

  function errList(cls, heading, items) {
    if (!items.length) return null;
    const ul = el("ul");
    items.forEach(it => {
      const li = el("li", { class: it.flag ? "flag" : "" }, [it.text + " "]);
      if (it.ref) li.appendChild(el("span", { class: "ref", text: "(" + it.ref + ")" }));
      ul.appendChild(li);
    });
    return el("div", { class: "err " + cls }, [el("h3", { text: heading }), ul]);
  }

  function renderResult(r) {
    const box = document.getElementById("result");
    box.innerHTML = "";
    if (!r) {
      box.appendChild(el("div", { class: "empty", text: "Answer the questions to see where a respondent ends up, and who could be wrongly counted or missed at that point." }));
      return;
    }
    const o = D.outcomes[r.out];
    const summary = r.byBirth ? "Citizen by birth, so correctly not counted as a person with a refugee background." : o.summary;
    box.appendChild(el("div", { class: "result " + o.tone }, [
      el("div", { class: "r-title", text: o.title }),
      el("div", { class: "q-meta", text: o.stock }),
      el("p", { text: summary })
    ]));
    let inc = o.inclusion.filter(i => !i.needsNoIII || !state.collectIII).map(i => Object.assign({}, i, { flag: i.needsNoIII }));
    const avoided = o.inclusion.filter(i => i.needsNoIII && state.collectIII);
    const errs = el("div", { class: "errs" });
    const a = errList("inc", "Inclusion errors: wrongly counted here", inc);
    const b = errList("exc", r.lit === "out-o2" || r.lit === "out-o4" ? "Exclusion errors linked to this stock" : "Exclusion errors: should be counted but end up here", o.exclusion);
    if (a) errs.appendChild(a);
    if (b) errs.appendChild(b);
    if (!a && !b) errs.appendChild(el("div", { class: "empty", text: "No inclusion or exclusion errors at this point." }));
    if (avoided.length) errs.appendChild(el("div", { class: "empty", text: "Avoided because (iii) is collected: citizens by birth born abroad who fled are kept out of refugee background." }));
    box.appendChild(errs);
  }

  function highlightTree(r) {
    const svg = document.querySelector("#tree svg");
    if (!svg) return;
    svg.querySelectorAll("g.lit").forEach(g => g.classList.remove("lit"));
    const tree = document.getElementById("tree");
    tree.classList.toggle("has-path", !!(r && r.lit));
    if (!r) return;
    r.path.concat(r.lit ? [r.lit] : []).forEach(id => { const g = svg.getElementById ? svg.getElementById(id) : svg.querySelector("#" + id); if (g) g.classList.add("lit"); });
  }

  function update() {
    renderQuestions();
    const r = resolve();
    renderResult(r);
    highlightTree(r);
  }

  // Scenario toggles
  document.getElementById("t-iii").addEventListener("change", e => { state.collectIII = e.target.checked; state.q3 = null; state.q5 = null; update(); });
  document.getElementById("t-stateless").addEventListener("change", e => { state.statelessCoded = e.target.checked; state.q5 = null; update(); });
  document.getElementById("reset").addEventListener("click", () => { ORDER.forEach(k => state[k] = null); update(); });

  // Tree: inline SVG so the path can be highlighted; fall back to the PNG offline
  fetch("assets/tree.svg").then(r => r.ok ? r.text() : Promise.reject()).then(txt => {
    const holder = document.getElementById("tree");
    holder.innerHTML = txt;
    const svg = holder.querySelector("svg");
    svg.removeAttribute("width"); svg.removeAttribute("height");
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Decision tree from census questions to IRRS stocks");
    update();
  }).catch(() => {
    document.getElementById("tree").innerHTML = '<img src="img/Fig1_census_IRRS_identification_tree.png" alt="Decision tree from census questions to IRRS stocks" style="width:100%">';
  });

  // Sub-group table with filters
  const tState = { stock: "all", err: "all", q: "" };
  function renderTable() {
    const tb = document.querySelector("#subgroups tbody");
    tb.innerHTML = "";
    const q = tState.q.toLowerCase();
    Object.keys(D.stocks).forEach(stock => {
      if (tState.stock !== "all" && tState.stock !== stock) return;
      const rows = D.subgroups.filter(r => r.stock === stock)
        .filter(r => tState.err === "all" || (tState.err === "inc" ? r.inclusion : r.exclusion))
        .filter(r => !q || [r.name, r.identified, r.inclusion, r.exclusion].join(" ").toLowerCase().includes(q));
      if (!rows.length) return;
      tb.appendChild(el("tr", { class: "group" }, [el("td", { colspan: "4", text: D.stocks[stock] })]));
      rows.forEach(r => tb.appendChild(el("tr", {}, [
        el("td", { text: r.name }), el("td", { text: r.identified }),
        el("td", { class: "inc", text: r.inclusion }), el("td", { class: "exc", text: r.exclusion })
      ])));
    });
    if (!tb.children.length) tb.appendChild(el("tr", {}, [el("td", { colspan: "4", class: "empty", text: "No sub-groups match these filters." })]));
  }
  function chips(id, key) {
    document.querySelectorAll("#" + id + " .chip").forEach(c => c.addEventListener("click", () => {
      tState[key] = c.dataset.v;
      document.querySelectorAll("#" + id + " .chip").forEach(x => { x.classList.toggle("on", x === c); x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      renderTable();
    }));
  }
  chips("f-stock", "stock"); chips("f-err", "err");
  document.getElementById("f-search").addEventListener("input", e => { tState.q = e.target.value; renderTable(); });

  // Framework tabs
  document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", () => {
    if (b.disabled) return;
    document.querySelectorAll("nav.tabs button").forEach(x => x.classList.toggle("active", x === b));
    document.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== b.dataset.tab);
  }));

  document.getElementById("returnees").textContent = D.returnees;
  update();
  renderTable();
})();
