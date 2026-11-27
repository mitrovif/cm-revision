(function () {
  const D = window.CM_DATA;

  // ---------- small helpers
  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") n.className = v; else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
    });
    (children || []).forEach(c => n.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  }
  const SRC = { draft: ["In draft", "src-draft"], added: ["Suggested", "src-added"] };
  function itemLi(it) {
    const li = el("li", { class: it.flag ? "flag" : "" });
    if (it.src) li.appendChild(el("span", { class: "src " + SRC[it.src][1], text: SRC[it.src][0] }));
    li.appendChild(document.createTextNode(" " + it.text + " "));
    if (it.ref) li.appendChild(el("span", { class: "ref", text: "(" + it.ref + ")" }));
    return li;
  }

  // ---------- logic per framework: which questions show, and where answers lead
  const LOGIC = {
    irrs: {
      order: ["q1", "q2", "q3", "q5"],
      visible(key, s) {
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
      },
      resolve(s) {
        if (s.q1 === "census") return { out: "o1", path: ["q-i", "p-born-here"], lit: "out-o1" };
        if (s.q1 !== "abroad" || !s.q2) return null;
        if (s.q2 === "stateless" && !s.statelessCoded) return { out: "stateless_missed", path: ["q-i", "p-abroad", "q-ii"], lit: null };
        if (s.q2 === "foreign" || s.q2 === "stateless") {
          if (!s.q5) return null;
          const d = s.q5 === "d";
          return { out: d ? "o2" : "o3", path: ["q-i", "p-abroad", "q-ii", "p-foreign", "q-va", d ? "p-d-a" : "p-other-a"], lit: d ? "out-o2" : "out-o3" };
        }
        if (s.collectIII) {
          if (!s.q3) return null;
          if (s.q3 === "birth") return { out: "o3", path: ["q-i", "p-abroad", "q-ii", "p-cit-census", "q-iii", "p-bybirth"], lit: "out-o3", note: "Citizen by birth, so correctly not counted as a person with a refugee background." };
          if (!s.q5) return null;
          const d = s.q5 === "d";
          return { out: d ? "o4" : "o3", path: ["q-i", "p-abroad", "q-ii", "p-cit-census", "q-iii", "p-natur", "q-vb", d ? "p-d-b" : "p-other-b"], lit: d ? "out-o4" : "out-o3" };
        }
        if (!s.q5) return null;
        const d = s.q5 === "d";
        return { out: d ? "o4" : "o3", path: ["q-i", "p-abroad", "q-ii", "p-cit-census", "q-vb", d ? "p-d-b" : "p-other-b"], lit: d ? "out-o4" : "out-o3" };
      },
      showItem(it, s) { return it.needs !== "noIII" || !s.collectIII; },
      avoided(s, r) { return r.out === "o4" && s.collectIII ? "Avoided because (iii) is collected: citizens by birth born abroad who fled are kept out of refugee background." : ""; }
    },
    iris: {
      order: ["ix", "xiii", "loc"],
      visible(key, s) {
        if (key === "ix") return true;
        if (key === "xiii") return s.ix === "yes";
        if (key === "loc") return s.ix === "yes" && s.xiii === "within";
        return false;
      },
      resolve(s) {
        if (s.ix === "no") return { out: "n1", path: ["q-ix", "p-no"], lit: "out-n1" };
        if (s.ix !== "yes" || !s.xiii) return null;
        if (s.xiii === "abroad") return { out: "n2", path: ["q-ix", "p-yes", "q-xiii", "p-abroad"], lit: "out-n2" };
        if (!s.loc) return null;
        const map = { to: ["d", "p-eq-xiii", "out-d"], from: ["r", "p-eq-xii", "out-r"], else: ["o", "p-neither", "out-o"] }[s.loc];
        return { out: map[0], path: ["q-ix", "p-yes", "q-xiii", "p-within", "q-cmp", map[1]], lit: map[2] };
      },
      showItem(it, s) { return it.needs !== "noReason" || !s.askReason; },
      avoided(s, r) { return ["d", "r", "o"].includes(r.out) && s.askReason ? "Asking the reason (x) keeps out people forced to move for reasons outside the Guiding Principles." : ""; }
    },
    iross: {
      order: ["cit", "birth", "rec"],
      inA(s) { return s.cit === "stateless" || (s.cit === "unknown" && s.countUnknown); },
      visible(key, s) {
        if (key === "cit") return true;
        if (key === "birth") return this.inA(s);
        if (key === "rec") return s.recognition && this.inA(s) && !!s.birth;
        return false;
      },
      resolve(s) {
        if (s.cit === "census") return { out: "c1", path: ["q-cit", "p-census"], lit: "out-c1" };
        if (s.cit === "foreign") return { out: "c2", path: ["q-cit", "p-foreign"], lit: "out-c2" };
        if (s.cit === "unknown" && !s.countUnknown) return { out: "pa", path: ["q-cit", "p-unknown"], lit: "out-pa" };
        if (!this.inA(s) || !s.birth) return null;
        if (s.recognition && !s.rec) return null;
        const first = s.cit === "unknown" ? ["q-cit", "p-unknown"] : ["q-cit", "p-stateless", "q-birth"];
        const b = { census: ["anb", "p-b-census", "out-anb"], foreign: ["afb", "p-b-foreign", "out-afb"], unknown: ["aunk", null, null] }[s.birth];
        const r = { out: b[0], path: first.concat(b[1] && s.cit !== "unknown" ? [b[1]] : []), lit: b[2] };
        if (s.cit === "unknown") r.extraInclusion = { text: "Recorded as unknown citizenship, possibly because of item non-response, but counted here as category A.", ref: "P&R para 5.116", src: "added", flag: true };
        if (s.recognition) r.sub = s.rec === "yes"
          ? "Category B: persons with a recognised statelessness status (IROSS para 64a)."
          : "Category C: persons without a recognised nationality status, including unrecognised stateless persons (IROSS para 64b)." + (s.birth === "foreign" ? " Being foreign-born is a link to another country, so category Ci." : "");
        return r;
      },
      showItem() { return true; },
      avoided() { return ""; }
    }
  };

  // ---------- build one tab
  function buildPanel(key) {
    const F = D.frameworks[key], L = LOGIC[key];
    const state = {};
    F.toggles.forEach(t => state[t.key] = t.def);
    L.order.forEach(k => state[k] = null);

    const panel = el("div", { "data-panel": key, hidden: "" });
    const card = el("section", { class: "card" });
    card.appendChild(el("h2", { text: F.heading }));
    card.appendChild(el("div", { class: "accent-rule" }));
    card.appendChild(el("p", { class: "lead", text: F.lead }));
    const toggles = el("div", { class: "toggles" });
    F.toggles.forEach(t => {
      const cb = el("input", { type: "checkbox" }); cb.checked = t.def;
      cb.addEventListener("change", () => { state[t.key] = cb.checked; L.order.slice(1).forEach(k => state[k] = null); update(); });
      toggles.appendChild(el("label", {}, [cb, " " + t.label]));
    });
    card.appendChild(toggles);
    const legend = el("p", { class: "legend" }, [el("span", { class: "src src-draft", text: "In draft" }), " already in the CM draft    ", el("span", { class: "src src-added", text: "Suggested" }), " suggested addition"]);
    card.appendChild(legend);

    const grid = el("div", { class: "grid" });
    const left = el("div");
    const qbox = el("div"); const result = el("div", { class: "result-wrap", "aria-live": "polite" });
    const explore = el("div", { class: "mode-explore" });
    explore.appendChild(qbox);
    explore.appendChild(el("button", { class: "reset", type: "button", text: "Start again", onclick: () => { L.order.forEach(k => state[k] = null); update(); } }));
    explore.appendChild(result);
    const compare = el("div", { class: "mode-compare", hidden: "" });
    const ranking = el("div", { class: "mode-rank", hidden: "" });
    const modes = el("div", { class: "modes", role: "tablist", "aria-label": "View" });
    const MODES = [["explore", "Follow a person", explore], ["compare", "Paper vs suggestions", compare], ["rank", "Agreement and ranking", ranking]];
    const modeBtns = {};
    function setMode(m, verdictFilter) {
      MODES.forEach(([k, , box]) => { box.hidden = k !== m; modeBtns[k].classList.toggle("on", k === m); modeBtns[k].setAttribute("aria-selected", String(k === m)); });
      clearLinks();
      const svg = tree.querySelector("svg");
      if (m === "explore") update();
      else if (svg) { svg.querySelectorAll("g.lit").forEach(g => g.classList.remove("lit")); tree.classList.remove("has-path"); }
      if (m === "compare" && verdictFilter) setFilter(verdictFilter);
    }
    MODES.forEach(([k, lab]) => { const b = el("button", { role: "tab", "aria-selected": "false", text: lab }); b.addEventListener("click", () => setMode(k)); modeBtns[k] = b; modes.appendChild(b); });
    modeBtns.explore.classList.add("on"); modeBtns.explore.setAttribute("aria-selected", "true");
    left.appendChild(modes); left.appendChild(explore); left.appendChild(compare); left.appendChild(ranking);
    const right = el("div");
    right.appendChild(el("p", { class: "hint", text: D.hint }));
    const tree = el("figure", { class: "tree" });
    const details = el("div", { class: "details", "aria-live": "polite" }, [el("p", { class: "empty", text: "Click a box in the tree to read its explanation here." })]);
    right.appendChild(tree); right.appendChild(details);
    const fig = { irrs: "Fig1_census_IRRS_identification_tree.png", iris: "Fig2_census_IRIS_identification_tree.png", iross: "Fig3_census_IROSS_identification_tree.png" }[key];
    right.appendChild(el("p", { class: "dl" }, [el("a", { href: "img/" + fig, download: "", text: "Download the tree as an image" })]));
    grid.appendChild(left); grid.appendChild(right);
    right.classList.add("sticky");

    // ---- paper vs suggestions
    const R = (window.CM_REVIEW || {})[key] || [];
    const VERD = { keep: "Keep", change: "Change", expand: "Expand", add: "Add" };
    const VCOL = { keep: "#2e9e7b", change: "#c94a4b", expand: "#a8771a", add: "#3b71b9" };
    compare.appendChild(el("p", { class: "lead small", text: "Each inclusion or exclusion point in the draft, with what we suggest and why. Hover over or click an item to see where it sits in the tree." }));
    const chips = el("div", { class: "filters", role: "group", "aria-label": "Filter by verdict" });
    const list = el("div", { class: "rv-list" });
    let filt = "all";
    const counts = {}; R.forEach(r => counts[r.verdict] = (counts[r.verdict] || 0) + 1);
    [["all", "All (" + R.length + ")"]].concat(Object.keys(VERD).filter(v => counts[v]).map(v => [v, VERD[v] + " (" + counts[v] + ")"])).forEach(([v, lab]) => {
      const b = el("button", { class: "chip" + (v === "all" ? " on" : ""), "aria-pressed": String(v === "all"), "data-v": v, text: lab });
      b.addEventListener("click", () => setFilter(v));
      chips.appendChild(b);
    });
    compare.appendChild(chips); compare.appendChild(list);
    function setFilter(v) { filt = v; chips.querySelectorAll(".chip").forEach(x => { const on = x.dataset.v === v; x.classList.toggle("on", on); x.setAttribute("aria-pressed", String(on)); }); renderReview(); }

    // ---- agreement and ranking
    const S = window.CM_SCALES;
    const KF = [["keep", "Draft points we agree with as written"], ["expand", "Draft points that are right but need expanding"], ["change", "Draft points we disagree with or would move"], ["add", "Points missing from the draft"]];
    const kfigs = el("div", { class: "kfigs" });
    KF.forEach(([v, cap]) => {
      const k = el("div", { class: "kfig " + v, role: "button", tabindex: "0", title: "Show these in Paper vs suggestions" }, [el("div", { class: "num", text: String(counts[v] || 0) }), el("div", { class: "cap", text: cap })]);
      k.style.cursor = "pointer";
      k.addEventListener("click", () => setMode("compare", v));
      k.addEventListener("keydown", e => { if (e.key === "Enter") setMode("compare", v); });
      kfigs.appendChild(k);
    });
    const draftN = (counts.keep || 0) + (counts.expand || 0) + (counts.change || 0);
    ranking.appendChild(el("p", { class: "lead small", text: "Of the " + draftN + " inclusion and exclusion points in the draft, we agree with " + ((counts.keep || 0) + (counts.expand || 0)) + " (" + (counts.expand || 0) + " of them need expanding) and would change " + (counts.change || 0) + ". We suggest " + (counts.add || 0) + " further points. Click a figure to see those items." }));
    ranking.appendChild(kfigs);
    const bar = el("div", { class: "agree-bar", "aria-hidden": "true" });
    KF.forEach(([v]) => { const sp = el("span"); sp.style.width = (100 * (counts[v] || 0) / R.length) + "%"; sp.style.background = VCOL[v]; bar.appendChild(sp); });
    ranking.appendChild(bar);
    ranking.appendChild(el("h3", { text: "Ranking draft and suggested points together", style: "font-size:1.375rem;margin:0 0 4px" }));
    ranking.appendChild(el("p", { class: "lead small", text: "Each point is scored from 1 to 3 on three criteria. Adjust how much each criterion counts; the list reorders. Hover over a point to see it in the tree." }));
    const W = { size: 1, severity: 1, fix: 1 };
    const wbox = el("div", { class: "weights" }, [el("div", { class: "w-title", text: "Weights" })]);
    Object.keys(W).forEach(k => {
      const val = el("span", { class: "w-val", text: "1" });
      const inp = el("input", { type: "range", min: "0", max: "3", step: "1", value: "1", "aria-label": S[k].label + " weight" });
      inp.addEventListener("input", () => { W[k] = +inp.value; val.textContent = inp.value; renderRank(); });
      wbox.appendChild(el("label", {}, [el("span", { text: S[k].label }), inp, val]));
      wbox.appendChild(el("div", { class: "w-help", text: S[k].help + ": 1 " + S[k].levels[0].toLowerCase() + ", 3 " + S[k].levels[2].toLowerCase() + "." }));
    });
    ranking.appendChild(wbox);
    const rlist = el("div", { class: "rank-list" });
    ranking.appendChild(rlist);
    ranking.appendChild(el("details", { class: "method" }, [el("summary", { text: "How the scores were set" }),
      el("p", { text: "Scores are a reviewer's judgement, not measurements. Reach reflects how common the situation is likely to be in census populations; severity reflects whether people are only caveated, missed or over-counted, or put in the wrong stock; fixability reflects whether a change to wording, coding or the Box mapping is enough, or an added question or data link is needed. The overall score is the weighted average, shown on a 0 to 10 scale. High is 7.5 or more, medium 5.5 or more." })]));
    let rpinned = null;
    function renderRank() {
      rlist.innerHTML = ""; rpinned = null; clearLinks();
      const wsum = W.size + W.severity + W.fix || 1;
      const rows = R.map(r => Object.assign({ total: Math.round(100 * (W.size * r.score.size + W.severity * r.score.severity + W.fix * r.score.fix) / (3 * wsum)) / 10 }, r))
        .sort((a, b) => b.total - a.total || b.score.severity - a.score.severity);
      rows.forEach((r, i) => {
        const tier = r.total >= 7.5 ? "high" : r.total >= 5.5 ? "medium" : "low";
        const src = r.verdict === "add" ? "added" : "draft";
        const head = el("div", {}, [el("span", { class: "verdict v-" + r.verdict, text: VERD[r.verdict] }), " ", el("span", { class: "src src-" + src, text: SRC[src][0] }), el("span", { class: "tier " + tier, text: tier + " priority" })]);
        const body = el("div", {}, [head, el("p", { class: "txt", text: r.paper || r.ours })]);
        if (r.paper && r.verdict !== "keep") body.appendChild(el("p", { class: "txt ref", text: "Suggested: " + r.ours }));
        const bars = el("div", { class: "bars" });
        [["size", ""], ["severity", " sev"], ["fix", " fix"]].forEach(([k, c]) => {
          const b = el("div", { class: "bar" + c, title: S[k].label + ": " + S[k].levels[r.score[k] - 1] }); const sp = el("span"); sp.style.width = (100 * r.score[k] / 3) + "%"; b.appendChild(sp); bars.appendChild(b);
        });
        const lab = el("div", { class: "barlab", text: "reach · severity · fix" });
        const row = el("div", { class: "rank", tabindex: "0" }, [el("div", { class: "pos", text: String(i + 1) }), body, el("div", { class: "scorebox" }, [el("div", { class: "score", text: r.total.toFixed(1) }), bars, lab])]);
        const on = () => drawLinks(row, r); const off = () => { if (rpinned !== row) { rpinned ? drawLinks(rpinned, rpinned._r) : clearLinks(); } };
        row._r = r;
        row.addEventListener("mouseenter", on); row.addEventListener("focus", on);
        row.addEventListener("mouseleave", off); row.addEventListener("blur", off);
        row.addEventListener("click", () => { if (rpinned === row) { rpinned = null; row.classList.remove("pinned"); clearLinks(); } else { if (rpinned) rpinned.classList.remove("pinned"); rpinned = row; row.classList.add("pinned"); drawLinks(row, r); } });
        rlist.appendChild(row);
      });
    }
    const targetName = id => {
      const m = id.match(/^(out|inc|exc)-(.+)$/);
      if (m && F.outcomes[m[2]]) {
        const o = F.outcomes[m[2]], name = o.title + (o.stock && o.tone !== "identified" ? " (" + o.stock.toLowerCase() + ")" : "");
        return (m[1] === "inc" ? "Inclusion: " : m[1] === "exc" ? "Exclusion: " : "") + name;
      }
      const t = tipFor(id); return t ? t.title : id;
    };
    let pinned = null;
    function renderReview() {
      list.innerHTML = ""; pinned = null; clearLinks();
      R.filter(r => filt === "all" || r.verdict === filt).forEach(r => {
        const row = el("div", { class: "rv rv-" + r.verdict, tabindex: "0" });
        row.appendChild(el("div", { class: "rv-head" }, [el("span", { class: "verdict v-" + r.verdict, text: VERD[r.verdict] }),
          el("span", { class: "where", text: "Tree: " + r.where.map(targetName).filter((x, i, a) => a.indexOf(x) === i).join("; ") })]));
        row.appendChild(el("div", { class: "rv-cols" }, [
          el("div", {}, [el("div", { class: "rv-label", text: "In the draft" }), el("p", { class: r.paper ? "" : "muted", text: r.paper || "Not in the draft." })]),
          el("div", {}, [el("div", { class: "rv-label", text: "Suggested" }), el("p", { text: r.ours })])
        ]));
        row.appendChild(el("p", { class: "why" }, [el("strong", { text: "Why: " }), r.why]));
        const on = () => drawLinks(row, r); const off = () => { if (pinned !== row) { pinned ? drawLinks(pinned, pinned._r) : clearLinks(); } };
        row._r = r;
        row.addEventListener("mouseenter", on); row.addEventListener("focus", on);
        row.addEventListener("mouseleave", off); row.addEventListener("blur", off);
        row.addEventListener("click", () => { if (pinned === row) { pinned = null; row.classList.remove("pinned"); clearLinks(); } else { if (pinned) pinned.classList.remove("pinned"); pinned = row; row.classList.add("pinned"); drawLinks(row, r); } });
        list.appendChild(row);
      });
    }
    let active = null;
    function clearLinks() {
      active = null;
      const ov = document.getElementById("links"); if (ov) ov.innerHTML = "";
      const svg = tree.querySelector("svg"); if (svg) svg.querySelectorAll("g.linked").forEach(g => { g.classList.remove("linked"); g.style.removeProperty("--lc"); });
    }
    function drawLinks(row, r) {
      clearLinks(); active = [row, r];
      const svg = tree.querySelector("svg"); if (!svg) return;
      const ov = document.getElementById("links");
      const rr = row.getBoundingClientRect();
      const col = VCOL[r.verdict];
      r.where.forEach(id => {
        const g = svg.querySelector("#" + key + "-" + id); if (!g) return;
        g.classList.add("linked"); g.style.setProperty("--lc", col);
        if (window.innerWidth < 860 || panel.hidden) return;
        const br = g.getBoundingClientRect();
        if (br.bottom < 0 || br.top > window.innerHeight) return;
        const x1 = rr.right, y1 = rr.top + Math.min(28, rr.height / 2), x2 = br.left, y2 = br.top + br.height / 2;
        const mx = (x1 + x2) / 2;
        ov.insertAdjacentHTML("beforeend", `<path d="M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2 - 4} ${y2}" fill="none" stroke="${col}" stroke-width="1.6" stroke-dasharray="5 4" opacity=".85"/><circle cx="${x1}" cy="${y1}" r="3.5" fill="${col}"/><circle cx="${x2 - 2}" cy="${y2}" r="3.5" fill="${col}"/>`);
      });
    }
    const redraw = () => { if (active) drawLinks(active[0], active[1]); };
    window.addEventListener("scroll", redraw, { passive: true }); window.addEventListener("resize", redraw);
    card.appendChild(grid);

    const extra = el("div", { class: "note" });
    extra.appendChild(el("div", { class: "tip-title", text: F.extra.title }));
    const ul = el("ul"); F.extra.items.forEach(it => ul.appendChild(itemLi(it))); extra.appendChild(ul);
    card.appendChild(extra);
    panel.appendChild(card);

    function renderQuestions() {
      qbox.innerHTML = "";
      F.questions.forEach(q => {
        if (!L.visible(q.key, state)) return;
        const c = el("div", { class: "q" });
        c.appendChild(el("div", {}, [el("span", { class: "q-title", text: q.title }), el("span", { class: "q-meta", text: q.meta })]));
        const opts = el("div", { class: "opts", role: "group", "aria-label": q.title });
        q.opts.forEach(([v, lab]) => opts.appendChild(el("button", {
          class: state[q.key] === v ? "on" : "", "aria-pressed": String(state[q.key] === v), text: lab,
          onclick: () => { state[q.key] = v; L.order.slice(L.order.indexOf(q.key) + 1).forEach(k => state[k] = null); update(); }
        })));
        c.appendChild(opts); qbox.appendChild(c);
      });
    }
    function errBlock(cls, heading, items) {
      if (!items.length) return null;
      const u = el("ul"); items.forEach(it => u.appendChild(itemLi(it)));
      return el("div", { class: "err " + cls }, [el("h3", { text: heading }), u]);
    }
    function renderResult(r) {
      result.innerHTML = "";
      if (!r) { result.appendChild(el("div", { class: "empty", text: "Answer the questions to see where a person ends up, and who could be wrongly counted or missed at that point." })); return; }
      const o = F.outcomes[r.out];
      const box = el("div", { class: "result " + o.tone }, [el("div", { class: "r-title", text: o.title }), el("div", { class: "q-meta", text: o.stock }), el("p", { text: r.note || o.summary })]);
      if (r.sub) box.appendChild(el("p", { class: "sub", text: r.sub }));
      result.appendChild(box);
      let inc = o.inclusion.filter(it => L.showItem(it, state)).map(it => Object.assign({}, it, { flag: !!it.needs }));
      if (r.extraInclusion) inc = [r.extraInclusion].concat(inc);
      const errs = el("div", { class: "errs" });
      const a = errBlock("inc", "Inclusion errors: wrongly counted here", inc);
      const isStock = o.tone === "identified";
      const b = errBlock("exc", isStock ? "Exclusion errors linked to this outcome" : "Exclusion errors: should be counted but end up here", o.exclusion);
      if (a) errs.appendChild(a); if (b) errs.appendChild(b);
      if (!a && !b) errs.appendChild(el("div", { class: "empty", text: "No inclusion or exclusion errors at this point." }));
      const av = L.avoided(state, r); if (av) errs.appendChild(el("div", { class: "empty", text: av }));
      result.appendChild(errs);
    }
    function highlight(r) {
      const svg = tree.querySelector("svg"); if (!svg) return;
      svg.querySelectorAll("g.lit").forEach(g => g.classList.remove("lit"));
      tree.classList.toggle("has-path", !!(r && r.lit));
      if (!r) return;
      r.path.concat(r.lit ? [r.lit] : []).forEach(id => { const g = svg.querySelector("#" + key + "-" + id); if (g) g.classList.add("lit"); });
    }
    function update() { renderQuestions(); const r = L.resolve(state); renderResult(r); highlight(r); }

    // explanations on tree boxes
    function tipFor(id) {
      if (F.tips[id]) return F.tips[id];
      const m = id.match(/^(out|inc|exc)-(.+)$/);
      if (m && F.outcomes[m[2]]) {
        const o = F.outcomes[m[2]];
        if (m[1] === "out") return { title: o.title + (o.stock ? ": " + o.stock.toLowerCase() : ""), body: o.summary };
        const items = (m[1] === "inc" ? o.inclusion : o.exclusion);
        const label = m[1] === "inc" ? "Wrongly counted here (inclusion errors)" : (o.tone === "identified" ? "Exclusion errors linked to this outcome" : "Missed, ending up here (exclusion errors)");
        return { title: label, list: items.length ? items : [{ text: "None at this point." }] };
      }
      if (id === F.extra.id) return { title: F.extra.title, list: F.extra.items };
      return null;
    }
    function tipNode(t, cls) {
      const n = el("div", { class: cls }, [el("div", { class: "tip-title", text: t.title })]);
      if (t.body) n.appendChild(el("p", { text: t.body }));
      if (t.list) { const u = el("ul"); t.list.forEach(it => u.appendChild(itemLi(it))); n.appendChild(u); }
      return n;
    }
    const tip = document.getElementById("tooltip");
    function boxId(target) {
      const g = target.closest && target.closest("g[id]");
      if (!g || !g.id.startsWith(key + "-")) return null;
      const id = g.id.slice(key.length + 1);
      return tipFor(id) ? id : null;
    }
    function wire() {
      const svg = tree.querySelector("svg");
      svg.querySelectorAll("g[id]").forEach(g => { if (boxId(g)) { g.classList.add("tip-target"); g.setAttribute("tabindex", "0"); } });
      svg.addEventListener("mousemove", e => {
        const id = boxId(e.target); if (!id) { tip.hidden = true; return; }
        tip.innerHTML = ""; tip.appendChild(tipNode(tipFor(id), "tip-body")); tip.hidden = false;
        const pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
        let x = e.clientX + pad, y = e.clientY + pad;
        if (x + w > window.innerWidth - 8) x = e.clientX - w - pad;
        if (y + h > window.innerHeight - 8) y = e.clientY - h - pad;
        tip.style.left = Math.max(8, x) + "px"; tip.style.top = Math.max(8, y) + "px";
      });
      svg.addEventListener("mouseleave", () => tip.hidden = true);
      const pin = id => {
        details.innerHTML = ""; details.appendChild(tipNode(tipFor(id), "pinned"));
        svg.querySelectorAll("g.pinned-box").forEach(g => g.classList.remove("pinned-box"));
        const g = svg.querySelector("#" + key + "-" + id); if (g) g.classList.add("pinned-box");
      };
      svg.addEventListener("click", e => { const id = boxId(e.target); if (id) { pin(id); tip.hidden = true; } });
      svg.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { const id = boxId(e.target); if (id) { e.preventDefault(); pin(id); } } });
    }
    fetch("assets/tree-" + key + ".svg").then(r => r.ok ? r.text() : Promise.reject()).then(txt => {
      tree.innerHTML = txt;
      const svg = tree.querySelector("svg"); svg.removeAttribute("width"); svg.removeAttribute("height");
      svg.setAttribute("aria-label", "Decision tree: census questions to " + F.label + " populations");
      wire(); update(); renderReview(); renderRank();
    }).catch(() => { tree.innerHTML = '<img src="img/' + fig + '" alt="Decision tree: census questions to ' + F.label + ' populations" style="width:100%">'; });
    update(); renderReview(); renderRank();
    return panel;
  }

  // ---------- tabs
  const main = document.getElementById("panels");
  const nav = document.getElementById("tabs");
  const keys = Object.keys(D.frameworks);
  keys.forEach(k => main.appendChild(buildPanel(k)));
  function show(k) {
    nav.querySelectorAll("button").forEach(b => { const on = b.dataset.tab === k; b.classList.toggle("active", on); b.setAttribute("aria-selected", String(on)); });
    main.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== k);
    document.getElementById("tooltip").hidden = true;
    const ov = document.getElementById("links"); if (ov) ov.innerHTML = "";
    if (location.hash !== "#" + k) history.replaceState(null, "", "#" + k);
  }
  keys.forEach(k => nav.appendChild(el("button", { "data-tab": k, role: "tab", text: D.frameworks[k].label, onclick: () => show(k) })));
  const fromHash = () => show(keys.includes(location.hash.slice(1)) ? location.hash.slice(1) : "irrs");
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
