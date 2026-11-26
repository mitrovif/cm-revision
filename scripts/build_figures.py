"""Build the census identification decision trees for IRRS, IRIS and IROSS (SVG + PNG).

Usage: python3 scripts/build_figures.py   (needs rsvg-convert for the PNGs)

Every box carries an id (prefixed by framework) so the page can highlight paths
and show explanations. Wording of the explanations lives in assets/data.js.
"""
import html, os, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = "Inter, DejaVu Sans, sans-serif"
C = {'purple': ('#EEEDFE', '#534AB7', '#3C3489', '#534AB7'), 'teal': ('#E1F5EE', '#0F6E56', '#085041', '#0F6E56'),
     'gray': ('#F1EFE8', '#5F5E5A', '#444441', '#5F5E5A'), 'amber': ('#FAEEDA', '#854F0B', '#633806', '#854F0B'),
     'coral': ('#FAECE7', '#993C1D', '#712B13', '#993C1D')}
T1 = '#2C2C2A'; T2 = '#5F5E5A'; LINE = '#73726c'


class Tree:
    def __init__(self, prefix):
        self.p = prefix; self.g = []

    def _open(self, i): return f'<g id="{self.p}-{i}">' if i else '<g>'
    def add(self, s): self.g.append(s)

    @staticmethod
    def rect(x, y, w, h, col=None, rx=8):
        f, s = (C[col][0], C[col][1]) if col else ('#FFFFFF', '#B4B2A9')
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{f}" stroke="{s}" stroke-width="0.8"/>'

    @staticmethod
    def text(x, y, s, size=12, weight=400, fill=T1, anchor='start'):
        return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" '
                f'fill="{fill}" text-anchor="{anchor}" dominant-baseline="central">{html.escape(s)}</text>')

    def start(self, label='Census population'):
        self.add(self._open('start') + self.rect(250, 20, 180, 40, 'gray', 20)
                 + self.text(340, 40, label, 14, 600, C['gray'][2], 'middle') + '</g>')
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

    def heading(self, y, s): self.add(self.text(40, y, s, 14, 600))

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
                f'<rect width="680" height="{H}" fill="#FFFFFF"/>{self.text(40, 28, title, 15, 600)}'
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
    t.heading(672, 'Inclusion errors: wrongly counted')
    t.errbox(40, 684, 135, 104, 'amber', ['None'], 'inc-o1')
    t.errbox(187, 684, 135, 104, 'amber', ['Out-of-scope forced', 'moves (disaster,', 'hardship)', 'Ceased protection,', 'not naturalised'], 'inc-o2')
    t.errbox(334, 684, 135, 104, 'amber', ['None'], 'inc-o3')
    t.errbox(481, 684, 150, 104, 'amber', ['Never held status', 'Citizens by birth,', 'if (iii) not collected'], 'inc-o4')
    t.heading(820, 'Exclusion errors: missed')
    t.errbox(40, 832, 135, 122, 'coral', ["Refugees' children", 'Refugees sur place', 'who never moved', 'Child not living with', 'refugee parent', '(household link only)'], 'exc-o1')
    t.errbox(187, 832, 135, 122, 'coral', ['Stateless refugees', 'if coded as foreign', 'only'], 'exc-o2')
    t.errbox(334, 832, 135, 122, 'coral', ['Not seen as forced', 'Derivative family', 'Secondary movers', 'Later voluntary move', 'Non-disclosure'], 'exc-o3')
    t.errbox(481, 832, 150, 122, 'coral', ['Later voluntary move', 'Reunified family', 'Ceased protection,', 'counted as int.', 'protection'], 'exc-o4')
    t.errbox(40, 972, 591, 50, 'coral', ['Returnees: not reached by any branch. Response (e) picks up some returned', 'asylum seekers, but also deportees who never sought protection.'], 'ret')
    return t.svg('Figure 1. Identifying IRRS populations through census questions', 1030)


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
    t.heading(672, 'Inclusion errors: wrongly counted')
    t.errbox(40, 684, 114, 104, 'amber', ['None'], 'inc-n1')
    t.errbox(161, 684, 114, 104, 'amber', ['None'], 'inc-n2')
    t.errbox(283, 684, 114, 104, 'amber', ['Exit not', 'measurable', 'Out-of-scope', 'reasons, if (x)', 'not asked'], 'inc-d')
    t.errbox(404, 684, 114, 104, 'amber', ['Exit not', 'measurable', 'Displaced within', 'same area', '(coded as return)'], 'inc-r')
    t.errbox(526, 684, 114, 104, 'amber', ['Exit not', 'measurable'], 'inc-o')
    t.heading(820, 'Exclusion errors: missed')
    t.errbox(40, 832, 114, 122, 'coral', ['Away when event', 'occurred', 'Not asked of all', '(often children)', 'Not disclosed'], 'exc-n1')
    t.errbox(161, 832, 114, 122, 'coral', ['Abroad under 12', 'months, then', 'came back'], 'exc-n2')
    t.errbox(283, 832, 114, 122, 'coral', ['Recent arrivals,', 'origin taken as', 'usual residence', '(coded as return)'], 'exc-d')
    t.errbox(404, 832, 114, 122, 'coral', ['None here'], 'exc-r')
    t.errbox(526, 832, 114, 122, 'coral', ['Later origin', 'reported after', 'several moves'], 'exc-o')
    t.errbox(40, 972, 600, 50, 'coral', ['IDP-related: children born after displacement only via a household link; non-displaced', 'family members and those who overcame vulnerabilities are not identified.'], 'rel')
    return t.svg('Figure 2. Identifying IRIS populations through census questions', 1030)


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
    t.heading(672, 'Inclusion errors: wrongly counted')
    t.errbox(40, 684, 114, 86, 'amber', ['None'], 'inc-c1')
    t.errbox(161, 684, 114, 86, 'amber', ['None'], 'inc-c2')
    t.errbox(283, 684, 114, 86, 'amber', ['Nationals who', 'report stateless', '(no documents,', 'misunderstood)'], 'inc-anb')
    t.errbox(404, 684, 114, 86, 'amber', ['Nationals who', 'report stateless', '(no documents,', 'misunderstood)'], 'inc-afb')
    t.errbox(526, 684, 114, 86, 'amber', ['Non-response,', 'if counted as A'], 'inc-pa')
    t.heading(802, 'Exclusion errors: missed')
    t.errbox(40, 814, 114, 122, 'coral', ['Stateless who', 'report citizen', '(fear, proxy,', 'no "stateless"', 'option, mixed', 'with ethnicity)'], 'exc-c1')
    t.errbox(161, 814, 114, 122, 'coral', ['Stateless who', 'report a linked', 'country or their', 'birth country'], 'exc-c2')
    t.errbox(283, 814, 114, 122, 'coral', ['None here'], 'exc-anb')
    t.errbox(404, 814, 114, 122, 'coral', ['None here'], 'exc-afb')
    t.errbox(526, 814, 114, 122, 'coral', ['Stateless coded', '"unknown", if', 'not counted'], 'exc-pa')
    t.errbox(40, 956, 600, 86, 'gray', ['Categories B and C are mixed: recognition needs registers, group recognition or', 'an extra question. Country of birth "unknown" gives category A with no split.',
                                          'Omitted from the census entirely: not reached by any branch.', 'Stateless-related groups and the overlap with IRRS: see explanations.'], 'note')
    return t.svg('Figure 3. Identifying IROSS populations through census questions', 1052)


if __name__ == '__main__':
    outs = [('irrs', irrs(), 'Fig1_census_IRRS_identification_tree.png'),
            ('iris', iris(), 'Fig2_census_IRIS_identification_tree.png'),
            ('iross', iross(), 'Fig3_census_IROSS_identification_tree.png')]
    for key, svg, png in outs:
        p = os.path.join(ROOT, 'assets', f'tree-{key}.svg')
        open(p, 'w').write(svg)
        subprocess.run(['rsvg-convert', p, '-o', os.path.join(ROOT, 'img', png)], check=True)
        print('built', p, 'and img/' + png)
