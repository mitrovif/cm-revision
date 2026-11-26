"""Build the IRRS census identification figure and table (SVG + PNG).

Usage: python3 scripts/build_figures.py   (needs rsvg-convert for the PNGs)
"""
import textwrap, html, os, subprocess
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT="Inter, DejaVu Sans, sans-serif"
C={'purple':('#EEEDFE','#534AB7','#3C3489','#534AB7'),'teal':('#E1F5EE','#0F6E56','#085041','#0F6E56'),
   'gray':('#F1EFE8','#5F5E5A','#444441','#5F5E5A'),'amber':('#FAEEDA','#854F0B','#633806','#854F0B'),
   'coral':('#FAECE7','#993C1D','#712B13','#993C1D')}
T1='#2C2C2A'; T2='#5F5E5A'; LINE='#73726c'
def esc(s): return html.escape(s)
def rect(x,y,w,h,col=None,rx=8):
    if col: f,s,_,_=C[col]
    else: f,s='#FFFFFF','#B4B2A9'
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{f}" stroke="{s}" stroke-width="0.8"/>'
def text(x,y,s,size=12,weight=400,fill=T1,anchor='start'):
    return f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" dominant-baseline="central">{esc(s)}</text>'
def node(x,y,w,h,title,sub,col,nid=''):
    _,_,tc,sc=C[col] if col else (0,0,T1,T2)
    return (f'<g id="{nid}">' if nid else '<g>')+rect(x,y,w,h,col)+text(x+w/2,y+h/2-10,title,14,600,tc,'middle')+text(x+w/2,y+h/2+10,sub,12,400,sc,'middle')+'</g>'
def pill(cx,y,w,label):
    return rect(cx-w/2,y,w,24,None,12)+text(cx,y+12,label,12,400,T1,'middle')
def ln(x1,y1,x2,y2,arrow=False):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{LINE}" stroke-width="1.2" {"marker-end=\"url(#a)\"" if arrow else ""}/>'
def path(d,arrow=True):
    return f'<path d="{d}" fill="none" stroke="{LINE}" stroke-width="1.2" {"marker-end=\"url(#a)\"" if arrow else ""}/>'
def errbox(x,y,w,h,col,lines):
    _,_,tc,_=C[col]; out=rect(x,y,w,h,col)
    for i,l in enumerate(lines): out+=text(x+10,y+20+i*18,l,12,400,tc)
    return out
g=[]
g.append(rect(250,20,180,40,'gray',20)+text(340,40,'Census population',14,600,C['gray'][2],'middle'))
g.append(ln(340,60,340,86,True))
g.append(node(230,90,220,56,'(i) Country of birth','Core topic','purple','q-i'))
g.append(path('M230 118 L100 118 L100 300',False)); g.append(pill(100,300,104,'Census country')); g.append(ln(100,324,100,576,True))
g.append(ln(340,146,340,160)); g.append(pill(340,160,70,'Abroad')); g.append(ln(340,184,340,198,True))
g.append(node(230,202,220,56,'(ii) Citizenship','Core topic','purple','q-ii'))
g.append(ln(290,258,290,276)); g.append(pill(290,276,188,'Foreign, stateless, unknown')); g.append(ln(290,300,290,326,True))
g.append(path('M450 230 L520 230 L520 266',False)); g.append(pill(520,266,110,'Census country')); g.append(ln(520,290,520,326,True))
g.append(node(160,330,200,56,'(v) Main reason','IRRS, most recent move','purple','q-va'))
g.append(node(420,330,200,56,'(iii) Acquisition','Core IRRS, additional P&R','purple','q-iii'))
g.append(ln(240,386,240,410)); g.append(pill(240,410,160,'(d) Forced displacement')); g.append(ln(240,434,240,576,True))
g.append(ln(330,386,330,470)); g.append(pill(330,470,96,'Other reasons')); g.append(path('M330 494 L330 520 L370 520 L370 576'))
g.append(ln(520,386,520,404)); g.append(pill(520,404,144,'Naturalisation, other')); g.append(ln(520,428,520,446,True))
g.append(path('M420 358 L395 358 L395 380',False)); g.append(pill(395,380,66,'By birth')); g.append(ln(395,404,395,576,True))
g.append(node(420,450,200,56,'(v) Main reason','IRRS, most recent move','purple','q-vb'))
g.append(ln(556,506,556,526)); g.append(pill(556,526,76,'(d) Forced')); g.append(ln(556,550,556,576,True))
g.append(ln(440,506,440,510)); g.append(pill(440,510,52,'Other')); g.append(path('M440 534 L440 548 L415 548 L415 576'))
g.append(node(40,580,135,56,'Not identified','Native-born','gray','out-o1'))
g.append(node(187,580,135,56,'Int. protection','Persons in need','teal','out-o2'))
g.append(node(334,580,135,56,'Not identified','Migrants, citizens','gray','out-o3'))
g.append(node(481,580,150,56,'Refugee background','Naturalised refugees','teal','out-o4'))
g.append(text(40,672,'Inclusion errors: wrongly counted',14,600))
g.append(errbox(40,684,135,104,'amber',['None']))
g.append(errbox(187,684,135,104,'amber',['Out-of-scope forced','moves (disaster,','hardship)','Ceased protection,','not naturalised']))
g.append(errbox(334,684,135,104,'amber',['None']))
g.append(errbox(481,684,150,104,'amber',['Never held status','Citizens by birth,','if (iii) not collected']))
g.append(text(40,820,'Exclusion errors: missed',14,600))
g.append(errbox(40,832,135,122,'coral',["Refugees' children",'Refugees sur place','who never moved','Child not living with','refugee parent','(household link only)']))
g.append(errbox(187,832,135,122,'coral',['Stateless refugees','if coded as foreign','only']))
g.append(errbox(334,832,135,122,'coral',['Derivative family','Sur place movers','Secondary movers','Later voluntary move','Non-disclosure']))
g.append(errbox(481,832,150,122,'coral',['Later voluntary move','Reunified family','Ceased protection,','counted as int.','protection']))
g.append(errbox(40,972,591,50,'coral',['Returnees: not reached by any branch. Response (e) picks up some returned','asylum seekers, but also deportees who never sought protection.']))
H=1030+50
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1360" height="{H*2}" viewBox="0 0 680 {H}">
<defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="{LINE}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
<rect width="680" height="{H}" fill="#FFFFFF"/>
{text(40,28,'Figure 1. Identifying IRRS populations through census questions',15,600)}
<g transform="translate(0,46)">{''.join(g)}</g></svg>'''
open(os.path.join(ROOT,'assets','tree.svg'),'w').write(svg)

# Table
rows=[('Persons in need of international protection (IRRS paras 90 to 92)',None,None,None),
('Prospective asylum seekers, asylum seekers','Yes, not separately','',''),
('Persons with determined protection status','Yes, if reason (d)','','Another main reason given: derivative family, sur place who moved, secondary movers, later voluntary move'),
('Others in refugee-like situations','Yes, if reason (d)','','As above'),
('Children born in the country, no host citizenship','No','','Native-born; only via household link to a parent'),
('Refugees sur place who never moved','No','','No international move'),
('Stateless refugees','Only if (ii) includes stateless','','Missed if (ii) coded foreign only'),
('Not in this stock','','Out-of-scope forced moves (disaster, hardship); ceased protection, not naturalised',''),
('Persons with a refugee background (IRRS paras 93 to 94)',None,None,None),
('Naturalised former refugees','Yes, if reason (d)','Never held protection status','Later voluntary move'),
('Children and descendants with citizenship','Household link only','','Not living with, or parent not identified'),
('Reunified family members','No','','Report family reunification'),
('Others, incl. ceased protection','Wrong stock','','Counted as in need of international protection'),
('Not in this stock','','Citizens by birth born abroad who fled, if (iii) not collected',''),
('Persons returned after seeking protection (IRRS paras 95 to 97)',None,None,None),
('Repatriating refugees; other returnees','No','','Not covered by Box A.2'),
('Repatriating asylum seekers, incl. rejected','Partly, via reason (e)','Deportees who never sought protection','Voluntary returns'),
]
cols=[(20,230,'IRRS sub-group'),(250,150,'Identified?'),(400,215,'Inclusion errors'),(615,245,'Exclusion errors')]
W=880; out=[]; y=60
out.append(text(20,28,'Table 1. Inclusion and exclusion errors by IRRS sub-group (census, Box A.2 questions)',15,600))
out.append(f'<rect x="20" y="{y}" width="840" height="30" fill="#EEEDFE" stroke="#534AB7" stroke-width="0.8"/>')
for x,w,h in cols: out.append(text(x+8,y+15,h,12,600,C['purple'][2]))
y+=30
cw={0:34,1:22,2:33,3:38}
for r in rows:
    if r[1] is None:
        out.append(f'<rect x="20" y="{y}" width="840" height="26" fill="#E1F5EE" stroke="#0F6E56" stroke-width="0.6"/>'+text(28,y+13,r[0],12,600,C['teal'][2])); y+=26; continue
    wrapped=[textwrap.wrap(c,cw[i]) or [''] for i,c in enumerate(r)]
    n=max(len(w) for w in wrapped); h=n*16+12
    out.append(f'<rect x="20" y="{y}" width="840" height="{h}" fill="#FFFFFF" stroke="#D3D1C7" stroke-width="0.6"/>')
    for i,(x,w,_) in enumerate(cols):
        fill = C['amber'][2] if i==2 else C['coral'][2] if i==3 else T1
        for k,l in enumerate(wrapped[i]): out.append(text(x+8,y+14+k*16,l,12,400,fill))
    y+=h
H2=y+20
svg2=f'<svg xmlns="http://www.w3.org/2000/svg" width="{W*2}" height="{H2*2}" viewBox="0 0 {W} {H2}"><rect width="{W}" height="{H2}" fill="#FFFFFF"/>{"".join(out)}</svg>'
open(os.path.join(ROOT,'assets','table.svg'),'w').write(svg2)
for src,dst in [('tree.svg','Fig1_census_IRRS_identification_tree.png'),('table.svg','Table1_IRRS_subgroup_errors.png')]:
    subprocess.run(['rsvg-convert',os.path.join(ROOT,'assets',src),'-o',os.path.join(ROOT,'img',dst)],check=True)
print('built assets/tree.svg, assets/table.svg and img/*.png')
