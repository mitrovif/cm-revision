(function () {
  const D = window.CM_DATA, BX = window.CM_BOXES || {};
  const VERD = { keep: "Keep", expand: "Expand", change: "Change", add: "Add" };
  const VCOL = { keep: "#2E9E7B", expand: "#E0A93B", change: "#F06667", add: "#3B71B9" };
  const VDESC = { keep: ["draft point we agree with", "draft points we agree with"], expand: ["draft point to expand", "draft points to expand"], change: ["draft point to change", "draft points to change"], add: ["point missing from the draft", "points missing from the draft"] };

  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") n.className = v; else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
    });
    (children || []).forEach(c => n.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return n;
  }
  const tip = () => document.getElementById("tooltip");

  function buildPanel(key, ERR) {
    const F = D.frameworks[key], items = ERR[key] || [], B = BX[key];
    const byId = {}; items.forEach(it => byId[it.id] = it);
    const panel = el("div", { "data-panel": key, hidden: "" });
    const card = el("section", { class: "card" });
    card.appendChild(el("h2", { text: F.heading }));
    card.appendChild(el("div", { class: "accent-rule" }));
    card.appendChild(el("p", { class: "lead small", text: "Each inclusion and exclusion error sits under the outcome where it happens, with a dot for how it compares with the draft. Hover over an error to read what the draft says, what we suggest and why; click to keep it open." }));
    const counts = {}; items.forEach(r => counts[r.verdict] = (counts[r.verdict] || 0) + 1);
    const legend = el("div", { class: "vlegend" });
    Object.keys(VERD).forEach(v => legend.appendChild(el("span", { class: "vl" }, [el("span", { class: "dot", style: "background:" + VCOL[v] }), el("strong", { text: String(counts[v] || 0) + " " }), VDESC[v][counts[v] === 1 ? 0 : 1]])));
    card.appendChild(legend);

    const grid = el("div", { class: "grid2" });
    const tree = el("figure", { class: "tree" });
    const left = el("div", {}, [tree]);
    const details = el("div", { class: "details", "aria-live": "polite" }, [el("p", { class: "empty", text: "Hover over an error or a box in the tree. Click to keep its explanation here." })]);
    const right = el("div", { class: "sticky" }, [details]);
    grid.appendChild(left); grid.appendChild(right);
    card.appendChild(grid);

    // second view: the Box table with suggested changes
    const WHY = (window.CM_BOX_WHY || {})[key] || {};
    const tview = el("div", { class: "tview", hidden: "" });
    const isNew = B && !B.rows.some(r => !r.added);
    tview.appendChild(el("p", { class: "lead small", text: isNew
      ? "The draft has no mapping table for stateless persons. This is a suggested one. Hover over a cell for the reason."
      : "The draft table with suggested changes: struck-through text is the draft, bold text is the suggestion. Hover over a changed cell for the reason." }));
    function cellNode(c, tag) {
      const td = el(tag);
      if (c.span) td.setAttribute("colspan", String(c.span));
      if (c.ours != null) {
        td.classList.add("chg");
        if (c.draft) td.appendChild(el("del", { text: c.draft }));
        td.appendChild(el("ins", { text: c.ours }));
        const w = WHY[c.id];
        if (w) { td.dataset.why = w; td.tabIndex = 0; }
      } else td.appendChild(document.createTextNode(c.draft || ""));
      return td;
    }
    if (B) {
      if (B.filter) {
        const f = el("p", { class: "filter chg" }, [el("del", { text: B.filter.draft }), el("ins", { text: B.filter.ours })]);
        f.dataset.why = B.filter.why; f.tabIndex = 0; tview.appendChild(f);
      }
      const tbl = el("table", { class: "boxtbl" });
      const hr = el("tr", {}, [el("th", { text: "Question topic" })]); B.cols.forEach(c => hr.appendChild(el("th", { text: c })));
      tbl.appendChild(el("thead", {}, [hr]));
      const tb = el("tbody");
      B.rows.forEach(r => {
        const tr = el("tr", { class: r.added && !isNew ? "added" : "" });
        r.cells.forEach((c, i) => tr.appendChild(cellNode(c, i === 0 ? "th" : "td")));
        tb.appendChild(tr);
      });
      tbl.appendChild(tb);
      tview.appendChild(el("div", { class: "table-wrap" }, [tbl]));
      tview.addEventListener("mousemove", e => {
        const c = e.target.closest("[data-why]"); const T = tip();
        if (!c) { T.hidden = true; return; }
        T.innerHTML = ""; T.appendChild(el("div", { class: "tip-body" }, [el("div", { class: "tip-title", text: "Why" }), el("p", { text: c.dataset.why })]));
        T.hidden = false;
        const w = T.offsetWidth, h = T.offsetHeight; let x = e.clientX + 14, y = e.clientY + 14;
        if (x + w > window.innerWidth - 8) x = e.clientX - w - 14;
        if (y + h > window.innerHeight - 8) y = Math.max(8, window.innerHeight - h - 8);
        T.style.left = x + "px"; T.style.top = y + "px";
      });
      tview.addEventListener("mouseleave", () => tip().hidden = true);
    }
    const views = el("div", { class: "subtabs", role: "tablist" });
    const b1 = el("button", { class: "active", text: "Inclusion and exclusion", role: "tab" });
    const b2 = el("button", { text: isNew ? "Suggested table" : "Table with suggested changes", role: "tab" });
    function view(n) { grid.hidden = n !== 1; tview.hidden = n !== 2; b1.classList.toggle("active", n === 1); b2.classList.toggle("active", n === 2); tip().hidden = true; }
    b1.addEventListener("click", () => view(1)); b2.addEventListener("click", () => view(2));
    views.appendChild(b1); views.appendChild(b2);
    card.insertBefore(views, grid);
    card.appendChild(tview);
    panel.appendChild(card);

    // explanations
    function boxTip(id) {
      if (F.tips[id]) return F.tips[id];
      const m = id.match(/^(out|inc|exc)-(.+)$/);
      if (m && F.outcomes[m[2]]) {
        const o = F.outcomes[m[2]];
        if (m[1] === "out") return { title: o.title + (o.stock ? ": " + o.stock.toLowerCase() : ""), body: o.summary };
        return { title: m[1] === "inc" ? "Inclusion errors: wrongly counted here" : "Exclusion errors: missed, ending up here", body: "Hover over each line for details." };
      }
      if (id === F.extra.id) return { title: F.extra.title, body: "Hover over each line for details." };
      return null;
    }
    function itemNode(it, cls) {
      const n = el("div", { class: cls });
      n.appendChild(el("div", { class: "tip-title" }, [el("span", { class: "verdict v-" + it.verdict, text: VERD[it.verdict] }), " ", it.label]));
      const rows = el("div", { class: "pt" });
      rows.appendChild(el("div", { class: "pt-row" }, [el("span", { class: "pt-lab", text: "Draft" }), el("span", { class: it.draft ? "" : "muted", text: it.draft || "Not in the draft." })]));
      rows.appendChild(el("div", { class: "pt-row" }, [el("span", { class: "pt-lab", text: it.verdict === "keep" ? "View" : "Suggest" }), el("span", { class: it.verdict === "keep" ? "" : "pt-ours", text: it.suggested || "Agree as written." })]));
      rows.appendChild(el("div", { class: "pt-row" }, [el("span", { class: "pt-lab", text: "Why" }), el("span", { class: "pt-why2", text: it.why })]));
      if (it.boxes.length > 1) rows.appendChild(el("div", { class: "pt-also", text: "Appears in " + it.boxes.length + " places in the tree, highlighted." }));
      n.appendChild(rows);
      return n;
    }
    function boxNode(t, cls) {
      const n = el("div", { class: cls }, [el("div", { class: "tip-title", text: t.title })]);
      if (t.body) n.appendChild(el("p", { text: t.body }));
      return n;
    }
    function targetOf(t) {
      const g = t.closest && t.closest("g[id]"); if (!g || !g.id.startsWith(key + "-")) return null;
      const id = g.id.slice(key.length + 1);
      const m = id.match(/^it-(.+)--(.+)$/);
      if (m && byId[m[1]]) return { kind: "item", id: m[1], g };
      return boxTip(id) ? { kind: "box", id, g } : null;
    }
    function nodeFor(t, cls) { return t.kind === "item" ? itemNode(byId[t.id], cls) : boxNode(boxTip(t.id), cls); }
    function highlight(t) {
      panel.querySelectorAll(".hl").forEach(x => x.classList.remove("hl"));
      if (!t) return;
      if (t.kind === "item") tree.querySelectorAll('g[id^="' + key + "-it-" + t.id + '--"]').forEach(g => g.classList.add("hl"));
      else t.g.classList.add("hl");
    }
    let pinned = null;
    function wire(svg) {
      svg.querySelectorAll("g[id]").forEach(g => { if (targetOf(g)) { g.classList.add("tip-target"); g.setAttribute("tabindex", "0"); } });
      svg.addEventListener("mousemove", e => {
        const t = targetOf(e.target); const T = tip();
        if (!t) { T.hidden = true; highlight(pinned); return; }
        T.innerHTML = ""; T.appendChild(nodeFor(t, "tip-body")); T.hidden = false;
        const pad = 14, w = T.offsetWidth, h = T.offsetHeight;
        let x = e.clientX + pad, y = e.clientY + pad;
        if (x + w > window.innerWidth - 8) x = e.clientX - w - pad;
        if (y + h > window.innerHeight - 8) y = Math.max(8, window.innerHeight - h - 8);
        T.style.left = Math.max(8, x) + "px"; T.style.top = Math.max(8, y) + "px";
        highlight(t);
      });
      svg.addEventListener("mouseleave", () => { tip().hidden = true; highlight(pinned); });
      const pin = t => { pinned = t; details.innerHTML = ""; details.appendChild(nodeFor(t, "pinned")); tip().hidden = true; highlight(t); };
      svg.addEventListener("click", e => { const t = targetOf(e.target); if (t) pin(t); });
      svg.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { const t = targetOf(e.target); if (t) { e.preventDefault(); pin(t); } } });
    }
    const fig = { irrs: "Fig1_census_IRRS_identification_tree.png", iris: "Fig2_census_IRIS_identification_tree.png", iross: "Fig3_census_IROSS_identification_tree.png" }[key];
    left.appendChild(el("p", { class: "dl" }, [el("a", { href: "img/" + fig, download: "", text: "Download the tree as an image" })]));
    fetch("assets/tree-" + key + ".svg").then(r => r.ok ? r.text() : Promise.reject()).then(txt => {
      tree.innerHTML = txt;
      const svg = tree.querySelector("svg"); svg.removeAttribute("width"); svg.removeAttribute("height");
      svg.setAttribute("aria-label", "Decision tree: census questions to " + F.label + " populations, with inclusion and exclusion errors");
      wire(svg);
    }).catch(() => { tree.innerHTML = '<img src="img/' + fig + '" alt="Decision tree: census questions to ' + F.label + ' populations" style="width:100%">'; });
    return panel;
  }

  const main = document.getElementById("panels"), nav = document.getElementById("tabs");
  const keys = Object.keys(D.frameworks);
  function start(ERR) {
    keys.forEach(k => main.appendChild(buildPanel(k, ERR)));
    function show(k) {
      nav.querySelectorAll("button").forEach(b => { const on = b.dataset.tab === k; b.classList.toggle("active", on); b.setAttribute("aria-selected", String(on)); });
      main.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== k);
      tip().hidden = true;
      if (location.hash !== "#" + k) history.replaceState(null, "", "#" + k);
    }
    keys.forEach(k => nav.appendChild(el("button", { "data-tab": k, role: "tab", text: D.frameworks[k].label, onclick: () => show(k) })));
    const fromHash = () => show(keys.includes(location.hash.slice(1)) ? location.hash.slice(1) : "irrs");
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }
  fetch("assets/errors.json").then(r => r.json()).then(start).catch(() => start({}));
})();
