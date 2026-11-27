(function () {
  const D = window.CM_DATA, R = window.CM_REVIEW || {}, BX = window.CM_BOXES || {};
  const VERD = { keep: "Keep", expand: "Expand", change: "Change", add: "Add" };
  const VCOL = { keep: "#2e9e7b", expand: "#a8771a", change: "#c94a4b", add: "#3b71b9" };
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

  function buildPanel(key) {
    const F = D.frameworks[key], items = R[key] || [], B = BX[key];
    const panel = el("div", { "data-panel": key, hidden: "" });
    const card = el("section", { class: "card" });
    card.appendChild(el("h2", { text: F.heading }));
    card.appendChild(el("div", { class: "accent-rule" }));

    // legend with counts
    const counts = {}; items.forEach(r => counts[r.verdict] = (counts[r.verdict] || 0) + 1);
    const legend = el("div", { class: "vlegend" });
    Object.keys(VERD).forEach(v => legend.appendChild(el("span", { class: "vl" }, [el("span", { class: "dot", style: "background:" + VCOL[v] }), el("strong", { text: String(counts[v] || 0) + " " }), VERD[v] + ": " + VDESC[v][counts[v] === 1 ? 0 : 1]])));
    card.appendChild(el("p", { class: "lead small", text: "Hover over a box in the tree or a cell in the table to see what it means and how the draft's points compare with our suggestions. Click to keep the explanation open. Coloured markers show where the points sit." }));
    card.appendChild(legend);

    const grid = el("div", { class: "grid2" });
    const left = el("div"); const right = el("div", { class: "sticky" });
    const tree = el("figure", { class: "tree" });
    left.appendChild(tree);
    const details = el("div", { class: "details", "aria-live": "polite" }, [el("p", { class: "empty", text: "Click a box or a cell to keep its explanation here." })]);
    right.appendChild(details);
    const boxWrap = el("div");
    right.appendChild(boxWrap);
    grid.appendChild(left); grid.appendChild(right);
    card.appendChild(grid);
    panel.appendChild(card);

    // ---------- content for a tree box or a table cell
    function baseTip(id) {
      if (F.tips[id]) return F.tips[id];
      const m = id.match(/^(out|inc|exc)-(.+)$/);
      if (m && F.outcomes[m[2]]) {
        const o = F.outcomes[m[2]];
        if (m[1] === "out") return { title: o.title + (o.stock ? ": " + o.stock.toLowerCase() : ""), body: o.summary };
        return { title: m[1] === "inc" ? "Inclusion errors: wrongly counted here" : "Exclusion errors: missed here", body: (m[1] === "inc" ? o.inclusion : o.exclusion).length ? "" : "None at this point." };
      }
      if (id === F.extra.id) return { title: F.extra.title, body: "" };
      return null;
    }
    const itemsForBox = id => items.filter(r => r.where.includes(id));
    const itemsForCell = id => items.filter(r => (r.cells || []).includes(id));
    function pointNode(r) {
      const li = el("li", { class: "pt" });
      li.appendChild(el("span", { class: "verdict v-" + r.verdict, text: VERD[r.verdict] }));
      if (r.paper) li.appendChild(el("div", { class: "pt-row" }, [el("span", { class: "pt-lab", text: "Draft" }), el("span", { text: r.paper })]));
      li.appendChild(el("div", { class: "pt-row" }, [el("span", { class: "pt-lab", text: r.verdict === "keep" ? "We" : "Suggest" }), el("span", { class: r.verdict === "keep" ? "" : "pt-ours", text: r.verdict === "keep" ? "Agree as written." : r.ours })]));
      li.appendChild(el("div", { class: "pt-why", text: r.why }));
      return li;
    }
    function content(kind, id, cls) {
      const n = el("div", { class: cls });
      let pts;
      if (kind === "box") {
        const t = baseTip(id);
        if (t) { n.appendChild(el("div", { class: "tip-title", text: t.title })); if (t.body) n.appendChild(el("p", { text: t.body })); }
        pts = itemsForBox(id);
      } else {
        const c = findCell(id);
        n.appendChild(el("div", { class: "tip-title", text: c ? c.label : "Table cell" }));
        if (c && c.cell.ours !== undefined) n.appendChild(el("p", {}, c.cell.draft === null ? [el("span", { text: "New: " }), el("strong", { text: c.cell.ours })] : [el("span", { text: "Draft: " }), el("del", { text: c.cell.draft }), el("br"), el("span", { text: "Suggested: " }), el("strong", { text: c.cell.ours })]));
        else if (c) n.appendChild(el("p", { text: "Unchanged: " + c.cell.draft }));
        pts = itemsForCell(id);
      }
      if (pts.length) { const ul = el("ul", { class: "pts" }); pts.forEach(r => ul.appendChild(pointNode(r))); n.appendChild(ul); }
      return n;
    }

    // ---------- Box table
    const cellIndex = {};
    function findCell(id) { return cellIndex[id]; }
    function renderBox() {
      if (!B) return;
      const tbl = el("table", { class: "boxtbl" });
      tbl.appendChild(el("caption", { text: B.title }));
      const hr = el("tr"); hr.appendChild(el("th", { text: "Question topic" }));
      B.cols.forEach((c, i) => { const id = "h-" + (i + 1); cellIndex[id] = { label: "Column: " + c, cell: { draft: c } }; hr.appendChild(el("th", { "data-cell": id, text: c })); });
      tbl.appendChild(el("thead", {}, [hr]));
      const tb = el("tbody");
      const cellNode = (c, tag, label) => {
        cellIndex[c.id] = { label, cell: c };
        const td = el(tag, { "data-cell": c.id, class: c.ours !== undefined ? "changed" : "" });
        if (c.span) td.setAttribute("colspan", String(c.span));
        if (c.ours === undefined) td.textContent = c.draft;
        else if (c.draft === null) td.appendChild(el("ins", { text: c.ours }));
        else { td.appendChild(el("del", { text: c.draft })); td.appendChild(document.createTextNode(" ")); td.appendChild(el("ins", { text: c.ours })); }
        return td;
      };
      if (B.intro) tb.appendChild(el("tr", {}, [cellNode({ id: "intro", draft: B.intro.draft, ours: B.intro.ours, span: B.cols.length + 1 }, "td", "Topics used for identification")]));
      B.rows.forEach(r => {
        const topic = r.cells[0].ours || r.cells[0].draft;
        const tr = el("tr", { class: r.added ? "added" : "" });
        r.cells.forEach((c, i) => tr.appendChild(cellNode(c, i === 0 ? "th" : "td", i === 0 ? topic : topic + " · " + (c.span ? "all columns" : B.cols[i - 1]))));
        tb.appendChild(tr);
      });
      tbl.appendChild(tb);
      boxWrap.appendChild(el("div", { class: "table-wrap" }, [tbl]));
      boxWrap.appendChild(el("p", { class: "hint" }, [el("del", { text: "struck" }), " draft text, ", el("ins", { text: "bold" }), " suggested text, shaded rows are new."]));
      // markers on cells
      tbl.querySelectorAll("[data-cell]").forEach(td => {
        const pts = itemsForCell(td.dataset.cell); if (!pts.length) return;
        td.classList.add("has-pts");
        const vs = [...new Set(pts.map(p => p.verdict))];
        const m = el("span", { class: "cmarks" }); vs.forEach(v => m.appendChild(el("span", { class: "dot", style: "background:" + VCOL[v] }))); td.appendChild(m);
      });
    }
    renderBox();

    // ---------- tree markers and interaction
    function addMarks(svg) {
      svg.querySelectorAll("g[id]").forEach(g => {
        const id = g.id.slice(key.length + 1);
        if (!baseTip(id) && !itemsForBox(id).length) return;
        g.classList.add("tip-target"); g.setAttribute("tabindex", "0");
        const pts = itemsForBox(id); if (!pts.length) return;
        const rect = g.querySelector("rect"); if (!rect) return;
        const x = +rect.getAttribute("x") + +rect.getAttribute("width"), y = +rect.getAttribute("y");
        const vs = Object.keys(VERD).filter(v => pts.some(p => p.verdict === v));
        vs.forEach((v, i) => {
          const n = pts.filter(p => p.verdict === v).length;
          const cx = x - 8 - i * 17, cy = y;
          g.insertAdjacentHTML("beforeend", `<g class="mark"><circle cx="${cx}" cy="${cy}" r="7.5" fill="${VCOL[v]}" stroke="#fff" stroke-width="1.5"/><text x="${cx}" y="${cy}" font-family="IBM Plex Mono, monospace" font-size="9.5" font-weight="600" fill="#fff" text-anchor="middle" dominant-baseline="central">${n}</text></g>`);
        });
      });
    }
    function clearHL() {
      panel.querySelectorAll(".hl").forEach(x => x.classList.remove("hl"));
    }
    function highlight(kind, id) {
      clearHL();
      const svg = tree.querySelector("svg");
      const pts = kind === "box" ? itemsForBox(id) : itemsForCell(id);
      if (kind === "box") { const g = svg && svg.querySelector("#" + key + "-" + id); if (g) g.classList.add("hl"); }
      else { const td = boxWrap.querySelector('[data-cell="' + id + '"]'); if (td) td.classList.add("hl"); }
      pts.forEach(r => {
        (r.cells || []).forEach(c => { const td = boxWrap.querySelector('[data-cell="' + c + '"]'); if (td) td.classList.add("hl"); });
        r.where.forEach(w => { const g = svg && svg.querySelector("#" + key + "-" + w); if (g) g.classList.add("hl"); });
      });
    }
    let pinned = null;
    function show(kind, id, e) {
      const t = tip(); t.innerHTML = ""; t.appendChild(content(kind, id, "tip-body")); t.hidden = false;
      const pad = 14, w = t.offsetWidth, h = t.offsetHeight;
      let x = e.clientX + pad, y = e.clientY + pad;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - pad;
      if (y + h > window.innerHeight - 8) y = Math.max(8, window.innerHeight - h - 8);
      t.style.left = Math.max(8, x) + "px"; t.style.top = Math.max(8, y) + "px";
      highlight(kind, id);
    }
    function hide() { tip().hidden = true; clearHL(); if (pinned) highlight(pinned[0], pinned[1]); }
    function pin(kind, id) {
      pinned = [kind, id];
      details.innerHTML = ""; details.appendChild(content(kind, id, "pinned"));
      panel.querySelectorAll(".pinned-el").forEach(x => x.classList.remove("pinned-el"));
      const target = kind === "box" ? tree.querySelector("#" + key + "-" + id) : boxWrap.querySelector('[data-cell="' + id + '"]');
      if (target) target.classList.add("pinned-el");
      highlight(kind, id); tip().hidden = true;
    }
    const boxIdOf = t => { const g = t.closest && t.closest("g.tip-target"); return g ? g.id.slice(key.length + 1) : null; };
    const cellIdOf = t => { const td = t.closest && t.closest("[data-cell]"); return td ? td.dataset.cell : null; };
    boxWrap.addEventListener("mousemove", e => { const id = cellIdOf(e.target); id ? show("cell", id, e) : hide(); });
    boxWrap.addEventListener("mouseleave", hide);
    boxWrap.addEventListener("click", e => { const id = cellIdOf(e.target); if (id) pin("cell", id); });

    const fig = { irrs: "Fig1_census_IRRS_identification_tree.png", iris: "Fig2_census_IRIS_identification_tree.png", iross: "Fig3_census_IROSS_identification_tree.png" }[key];
    left.appendChild(el("p", { class: "dl" }, [el("a", { href: "img/" + fig, download: "", text: "Download the tree as an image" })]));
    fetch("assets/tree-" + key + ".svg").then(r => r.ok ? r.text() : Promise.reject()).then(txt => {
      tree.innerHTML = txt;
      const svg = tree.querySelector("svg"); svg.removeAttribute("width"); svg.removeAttribute("height");
      svg.setAttribute("aria-label", "Decision tree: census questions to " + F.label + " populations");
      addMarks(svg);
      svg.addEventListener("mousemove", e => { const id = boxIdOf(e.target); id ? show("box", id, e) : hide(); });
      svg.addEventListener("mouseleave", hide);
      svg.addEventListener("click", e => { const id = boxIdOf(e.target); if (id) pin("box", id); });
      svg.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { const id = boxIdOf(e.target); if (id) { e.preventDefault(); pin("box", id); } } });
    }).catch(() => { tree.innerHTML = '<img src="img/' + fig + '" alt="Decision tree: census questions to ' + F.label + ' populations" style="width:100%">'; });
    return panel;
  }

  // ---------- tabs
  const main = document.getElementById("panels"), nav = document.getElementById("tabs");
  const keys = Object.keys(D.frameworks);
  keys.forEach(k => main.appendChild(buildPanel(k)));
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
})();
