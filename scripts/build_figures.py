"""Build the census identification decision trees for IRRS, IRIS and IROSS (SVG + PNG).

Usage: python3 scripts/build_figures.py   (needs rsvg-convert for the PNGs)

Every box carries an id (prefixed by framework). Inclusion and exclusion errors are drawn from
assets/errors.json, one line per error with a dot for its verdict, so the page and images match.
"""
import html, json, os, subprocess, textwrap

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = "IBM Plex Sans, DejaVu Sans, sans-serif"
HEAD = "Figtree, IBM Plex Sans, DejaVu Sans, sans-serif"
# EGRISS design system palette (tokens: navy #14234C, blue #3B71B9, teal #4CC3C9,
# coral #F06667, gold #E0A93B, ink #1D2940, muted #5A6884, line #D9E2EF, tint #EEF3FA)
# role: (fill, stroke, title text, subtitle text)
C = {'purple': ('#EEF3FA', '#3B71B9', '#14234C', '#3B71B9'),   # questions
     'teal':   ('#E4F6F7', '#2A9DA3', '#14234C', '#1F6F74'),   # identified populations
     'gray':   ('#F1F4F8', '#B9C7DC', '#1D2940', '#5A6884'),   # not counted / structural
     'amber':  ('#FBF3E1', '#E0A93B', '#6B4A0E', '#6B4A0E'),   # inclusion errors
     'coral':  ('#FDEDED', '#F06667', '#8A2B2C', '#8A2B2C')}   # exclusion errors
T1 = '#1D2940'; T2 = '#5A6884'; LINE = '#5A6884'


class Tree:
    def __init__(self, prefix):
        self.p = prefix; self.g = []

    def _open(self, i): return f'<g id="{self.p}-{i}">' if i else '<g>'
    def add(self, s): self.g.append(s)

    @staticmethod
    def rect(x, y, w, h, col=None, rx=8):
        f, s = (C[col][0], C[col][1]) if col else ('#FFFFFF', '#B9C7DC')
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{f}" stroke="{s}" stroke-width="0.8"/>'

    @staticmethod
    def text(x, y, s, size=12, weight=400, fill=T1, anchor='start', font=None):
        return (f'<text x="{x}" y="{y}" font-family="{font or FONT}" font-size="{size}" font-weight="{weight}" '
                f'fill="{fill}" text-anchor="{anchor}" dominant-baseline="central">{html.escape(s)}</text>')

    def start(self, label='Census population'):
        self.add(self._open('start') + '<rect x="250" y="20" width="180" height="40" rx="10" fill="#14234C"/>'
                 + self.text(340, 40, label, 14, 600, '#FFFFFF', 'middle') + '</g>')
        self.ln(340, 60, 340, 86, True)

    def node(self, x, y, w, h, title, sub, col, i=''):
        tc, sc = (C[col][2], C[col][3])
        self.add(self._open(i) + self.rect(x, y, w, h, col) + self.text(x + w / 2, y + h / 2 - 10, title, 14, 600, tc, 'middle')
                 + self.text(x + w / 2, y + h / 2 + 10, sub, 12, 400, sc, 'middle') + '</g>')

    def pill(self, cx, y, w, label, i=''):
        self.add(self._open(i) + self.rect(cx - w / 2, y, w, 24, None, 12) + self.text(cx, y + 12, label, 12, 400, T1, 'middle') + '</g>')

    def ln(self, x1, y1, x2, y2, arrow=False):
        m = f' marker-end="url(#{self.p}-a)"' if arrow else ''
        self.add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{LINE}" stroke-width="1.2"{m}/>')

    def path(self, d, arrow=True):
        m = f' marker-end="url(#{self.p}-a)"' if arrow else ''
        self.add(f'<path d="{d}" fill="none" stroke="{LINE}" stroke-width="1.2"{m}/>')

    def heading(self, y, s): self.add(self.text(40, y, s, 14, 600, '#14234C', font=HEAD))

    def errbox(self, x, y, w, h, col, lines, i=''):
        tc = C[col][2]
        out = self._open(i) + self.rect(x, y, w, h, col)
        for k, l in enumerate(lines): out += self.text(x + 10, y + 20 + k * 18, l, 12, 400, tc)
        self.add(out + '</g>')

    def svg(self, title, height):
        H = height + 50
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1360" height="{H * 2}" viewBox="0 0 680 {H}">'
                f'<defs><marker id="{self.p}-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
                f'<path d="M2 1L8 5L2 9" fill="none" stroke="{LINE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>'
                f'<rect width="680" height="{H}" fill="#FFFFFF"/><rect x="40" y="38" width="72" height="3" fill="#4CC3C9"/>{self.text(40, 22, title, 15, 600, "#14234C", font=HEAD)}'
                f'<g transform="translate(0,46)">{"".join(self.g)}</g></svg>')


def irrs():
    t = Tree('irrs'); t.start()
    t.node(230, 90, 220, 56, '(i) Country of birth', 'Core topic', 'purple', 'q-i')
    t.path('M230 118 L100 118 L100 300', False); t.pill(100, 300, 104, 'Census country', 'p-born-here'); t.ln(100, 324, 100, 576, True)
    t.ln(340, 146, 340, 160); t.pill(340, 160, 70, 'Abroad', 'p-abroad'); t.ln(340, 184, 340, 198, True)
    t.node(230, 202, 220, 56, '(ii) Citizenship', 'Core topic', 'purple', 'q-ii')
    t.ln(290, 258, 290, 276); t.pill(290, 276, 188, 'Foreign, stateless, unknown', 'p-foreign'); t.ln(290, 300, 290, 326, True)
    t.path('M450 230 L520 230 L520 266', False); t.pill(520, 266, 110, 'Census country', 'p-cit-census'); t.ln(520, 290, 520, 326, True)
    t.node(160, 330, 200, 56, '(v) Main reason', 'IRRS, most recent move', 'purple', 'q-va')
    t.node(420, 330, 200, 56, '(iii) Acquisition', 'Core IRRS, additional P&R', 'purple', 'q-iii')
    t.ln(240, 386, 240, 410); t.pill(240, 410, 160, '(d) Forced displacement', 'p-d-a'); t.ln(240, 434, 240, 576, True)
    t.ln(330, 386, 330, 470); t.pill(330, 470, 96, 'Other reasons', 'p-other-a'); t.path('M330 494 L330 520 L370 520 L370 576')
    t.ln(520, 386, 520, 404); t.pill(520, 404, 144, 'Naturalisation, other', 'p-natur'); t.ln(520, 428, 520, 446, True)
    t.path('M420 358 L395 358 L395 380', False); t.pill(395, 380, 66, 'By birth', 'p-bybirth'); t.ln(395, 404, 395, 576, True)
    t.node(420, 450, 200, 56, '(v) Main reason', 'IRRS, most recent move', 'purple', 'q-vb')
    t.ln(556, 506, 556, 526); t.pill(556, 526, 76, '(d) Forced', 'p-d-b'); t.ln(556, 550, 556, 576, True)
    t.ln(440, 506, 440, 510); t.pill(440, 510, 52, 'Other', 'p-other-b'); t.path('M440 534 L440 548 L415 548 L415 576')
    t.node(40, 580, 135, 56, 'Not identified', 'Native-born', 'gray', 'out-o1')
    t.node(187, 580, 135, 56, 'Int. protection', 'Persons in need', 'teal', 'out-o2')
    t.node(334, 580, 135, 56, 'Not identified', 'Migrants, citizens', 'gray', 'out-o3')
    t.node(481, 580, 150, 56, 'Refugee background', 'Naturalised refugees', 'teal', 'out-o4')
    return t, 'Figure 1. Identifying IRRS populations through census questions'


def iris():
    t = Tree('iris'); t.start()
    t.node(250, 90, 180, 56, '(ix) Forced to flee?', 'Asked of all persons', 'purple', 'q-ix')
    t.path('M250 118 L97 118 L97 300', False); t.pill(97, 300, 40, 'No', 'p-no'); t.ln(97, 324, 97, 576, True)
    t.ln(340, 146, 340, 156); t.pill(340, 156, 44, 'Yes', 'p-yes'); t.ln(340, 180, 340, 196, True)
    t.node(250, 200, 180, 56, '(xiii) Fled to where?', 'First place fled to', 'purple', 'q-xiii')
    t.path('M250 228 L218 228 L218 300', False); t.pill(218, 300, 64, 'Abroad', 'p-abroad'); t.ln(218, 324, 218, 576, True)
    t.ln(340, 256, 340, 266); t.pill(340, 266, 100, 'Within country', 'p-within'); t.ln(340, 290, 340, 306, True)
    t.node(250, 310, 180, 56, 'Compare locations', '(i) now vs (xii), (xiii)', 'purple', 'q-cmp')
    t.ln(340, 366, 340, 400); t.pill(340, 400, 88, '(i) = (xiii)', 'p-eq-xiii'); t.ln(340, 424, 340, 576, True)
    t.path('M410 366 L410 390 L461 390 L461 440', False); t.pill(461, 440, 84, '(i) = (xii)', 'p-eq-xii'); t.ln(461, 464, 461, 576, True)
    t.path('M430 338 L583 338 L583 400', False); t.pill(583, 400, 64, 'Neither', 'p-neither'); t.ln(583, 424, 583, 576, True)
    t.node(40, 580, 114, 56, 'Not counted', 'No forced move', 'gray', 'out-n1')
    t.node(161, 580, 114, 56, 'Not counted', 'Fled abroad', 'gray', 'out-n2')
    t.node(283, 580, 114, 56, 'Displacement', 'IDP location', 'teal', 'out-d')
    t.node(404, 580, 114, 56, 'Return', 'IDP location', 'teal', 'out-r')
    t.node(526, 580, 114, 56, 'Elsewhere', 'Other settlement', 'teal', 'out-o')
    return t, 'Figure 2. Identifying IRIS populations through census questions'


def iross():
    t = Tree('iross'); t.start()
    t.node(230, 90, 220, 56, '(ii) Citizenship', 'Core topic, 4 response codes', 'purple', 'q-cit')
    t.path('M230 118 L97 118 L97 260', False); t.pill(97, 260, 104, 'Census country', 'p-census'); t.ln(97, 284, 97, 576, True)
    t.path('M265 146 L265 170 L218 170 L218 330', False); t.pill(218, 330, 108, 'Foreign country', 'p-foreign'); t.ln(218, 354, 218, 576, True)
    t.ln(340, 146, 340, 166); t.pill(340, 166, 80, 'Stateless', 'p-stateless'); t.ln(340, 190, 340, 216, True)
    t.path('M450 118 L583 118 L583 260', False); t.pill(583, 260, 70, 'Unknown', 'p-unknown'); t.ln(583, 284, 583, 576, True)
    t.node(250, 220, 180, 56, '(i) Country of birth', 'Core, adds "Unknown"', 'purple', 'q-birth')
    t.ln(340, 276, 340, 330); t.pill(340, 330, 104, 'Census country', 'p-b-census'); t.ln(340, 354, 340, 576, True)
    t.path('M430 248 L461 248 L461 400', False); t.pill(461, 400, 108, 'Foreign country', 'p-b-foreign'); t.ln(461, 424, 461, 576, True)
    t.node(40, 580, 114, 56, 'Not counted', 'Citizens', 'gray', 'out-c1')
    t.node(161, 580, 114, 56, 'Not counted', 'Foreign citizens', 'gray', 'out-c2')
    t.node(283, 580, 114, 56, 'Category A', 'Native-born', 'teal', 'out-anb')
    t.node(404, 580, 114, 56, 'Category A', 'Foreign-born', 'teal', 'out-afb')
    t.node(526, 580, 114, 56, 'Possible A', 'Report separately', 'gray', 'out-pa')
    return t, 'Figure 3. Identifying IROSS populations through census questions'


VCOL = {'keep': '#2E9E7B', 'expand': '#E0A93B', 'change': '#F06667', 'add': '#3B71B9'}
VLAB = [('keep', 'Keep: agree with draft'), ('expand', 'Expand draft point'),
        ('change', 'Change draft point'), ('add', 'Add: not in draft')]
COLS = {'irrs': ([40, 187, 334, 481], [135, 135, 135, 150], ['o1', 'o2', 'o3', 'o4'], 'ret', 'Returnees'),
        'iris': ([40, 161, 283, 404, 526], [114] * 5, ['n1', 'n2', 'd', 'r', 'o'], 'rel', 'IDP-related populations'),
        'iross': ([40, 161, 283, 404, 526], [114] * 5, ['c1', 'c2', 'anb', 'afb', 'pa'], 'note', 'Not shown by the branches')}


def items_block(t, x, w, items, box, y0):
    """Draw one item per error: verdict dot + wrapped label. Returns height used."""
    chars = max(10, int((w - 30) / 6.2))
    y = y0 + 16; out = []
    if not items:
        out.append(t.text(x + 10, y, 'None', 12, 400, T2)); y += 16
    for it in items:
        lines = textwrap.wrap(it.get('labels', {}).get(box, it['label']), chars, break_long_words=False)
        h = 16 * len(lines)
        g = f'<g id="{t.p}-it-{it["id"]}--{box}" class="item"><rect x="{x + 4}" y="{y - 10}" width="{w - 8}" height="{h + 4}" fill="transparent"/>'
        g += f'<circle cx="{x + 13}" cy="{y}" r="4.5" fill="{VCOL[it["verdict"]]}"/>'
        for k, l in enumerate(lines): g += t.text(x + 23, y + 16 * k, l, 12, 400, T1)
        out.append(g + '</g>'); y += h + 6
    return y - y0, out


def finish(fw, t, title, items):
    xs, ws, keys, strip_id, strip_title = COLS[fw]
    by_box = {}
    for it in items:
        for b in it['boxes']: by_box.setdefault(b, []).append(it)
    y = 662
    for kind, col, head in [('inc', 'amber', 'Inclusion errors: wrongly counted'), ('exc', 'coral', 'Exclusion errors: missed')]:
        t.heading(y, head); y += 12
        blocks = [items_block(t, x, w, by_box.get(f'{kind}-{k}', []), f'{kind}-{k}', y) for x, w, k in zip(xs, ws, keys)]
        H = max(b[0] for b in blocks) + 6
        for (x, w, k), (_, parts) in zip(zip(xs, ws, keys), blocks):
            t.add(t._open(f'{kind}-{k}') + t.rect(x, y, w, H, col) + '</g>' + ''.join(parts))
        y += H + 30
    # strip for populations not on any branch
    W = 600 if fw != 'irrs' else 591
    hh, parts = items_block(t, 40, W, by_box.get(strip_id, []), strip_id, y + 16)
    t.add(t._open(strip_id) + t.rect(40, y, W, hh + 18, 'gray') + t.text(50, y + 14, strip_title, 13, 600, '#14234C', font=HEAD) + '</g>' + ''.join(parts))
    y += hh + 18 + 24
    # legend
    lx = 40
    for v, lab in VLAB:
        t.add(f'<circle cx="{lx + 5}" cy="{y}" r="4.5" fill="{VCOL[v]}"/>' + t.text(lx + 14, y, lab, 11, 400, T2))
        lx += 150
    return t.svg(title, y + 14)


if __name__ == '__main__':
    ERR = json.load(open(os.path.join(ROOT, 'assets', 'errors.json')))
    outs = [('irrs', finish('irrs', *irrs(), ERR['irrs']), 'Fig1_census_IRRS_identification_tree.png'),
            ('iris', finish('iris', *iris(), ERR['iris']), 'Fig2_census_IRIS_identification_tree.png'),
            ('iross', finish('iross', *iross(), ERR['iross']), 'Fig3_census_IROSS_identification_tree.png')]
    for key, svg, png in outs:
        p = os.path.join(ROOT, 'assets', f'tree-{key}.svg')
        open(p, 'w').write(svg)
        subprocess.run(['rsvg-convert', p, '-o', os.path.join(ROOT, 'img', png)], check=True)
        print('built', p, 'and img/' + png)
