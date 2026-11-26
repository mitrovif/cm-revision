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
    svg.setAttribute("aria-label", "Decision tree from census questions to IRRS stocks");
    wireTips();
    update();
  }).catch(() => {
    document.getElementById("tree").innerHTML = '<img src="img/Fig1_census_IRRS_identification_tree.png" alt="Decision tree from census questions to IRRS stocks" style="width:100%">';
  });

  // Explanations on every tree box: hover for a tooltip, click to pin in the panel
  function tipFor(id) {
    if (D.tips[id]) return D.tips[id];
    const m = id.match(/^(out|inc|exc)-(o\d)$/);
    if (m) {
      const o = D.outcomes[m[2]];
      if (m[1] === "out") return { title: o.title, body: o.summary };
      const items = m[1] === "inc" ? o.inclusion : o.exclusion;
      const label = m[1] === "inc" ? "Wrongly counted here (inclusion errors)" : (m[2] === "o2" || m[2] === "o4" ? "Missed from this stock (exclusion errors)" : "Missed, ending up here (exclusion errors)");
      return { title: label + ": " + o.title.toLowerCase(), list: items.length ? items : [{ text: "None at this point." }] };
    }
    if (id === "ret") return { title: "Persons returned after seeking protection", body: D.returnees };
    return null;
  }
  function tipNode(t, cls) {
    const n = el("div", { class: cls });
    n.appendChild(el("div", { class: "tip-title", text: t.title }));
    if (t.body) n.appendChild(el("p", { text: t.body }));
    if (t.list) {
      const ul = el("ul");
      t.list.forEach(it => { const li = el("li", {}, [it.text + " "]); if (it.ref) li.appendChild(el("span", { class: "ref", text: "(" + it.ref + ")" })); ul.appendChild(li); });
      n.appendChild(ul);
    }
    return n;
  }
  const tip = document.getElementById("tooltip");
  function boxId(target) {
    const g = target.closest && target.closest("g[id]");
    return g && tipFor(g.id) ? g.id : null;
  }
  function wireTips() {
    const svg = document.querySelector("#tree svg");
    if (!svg) return;
    svg.querySelectorAll("g[id]").forEach(g => { if (tipFor(g.id)) { g.classList.add("tip-target"); g.setAttribute("tabindex", "0"); } });
    svg.addEventListener("mousemove", e => {
      const id = boxId(e.target);
      if (!id) { tip.hidden = true; return; }
      tip.innerHTML = ""; tip.appendChild(tipNode(tipFor(id), "tip-body"));
      tip.hidden = false;
      const pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
      let x = e.clientX + pad, y = e.clientY + pad;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - pad;
      if (y + h > window.innerHeight - 8) y = e.clientY - h - pad;
      tip.style.left = Math.max(8, x) + "px"; tip.style.top = Math.max(8, y) + "px";
    });
    svg.addEventListener("mouseleave", () => { tip.hidden = true; });
    const pin = id => {
      const panel = document.getElementById("details");
      panel.innerHTML = ""; panel.appendChild(tipNode(tipFor(id), "pinned"));
      svg.querySelectorAll("g.pinned-box").forEach(g => g.classList.remove("pinned-box"));
      const g = svg.getElementById ? svg.getElementById(id) : svg.querySelector("#" + id);
      if (g) g.classList.add("pinned-box");
    };
    svg.addEventListener("click", e => { const id = boxId(e.target); if (id) { pin(id); tip.hidden = true; } });
    svg.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { const id = boxId(e.target); if (id) { e.preventDefault(); pin(id); } } });
  }

  // Framework tabs
  document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", () => {
    if (b.disabled) return;
    document.querySelectorAll("nav.tabs button").forEach(x => x.classList.toggle("active", x === b));
    document.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== b.dataset.tab);
  }));

  document.getElementById("returnees").textContent = D.returnees;
  document.getElementById("hint").textContent = D.hint;
  update();
})();
