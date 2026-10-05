import json, os, re
from datetime import time as _time
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, "plan-export.json"), encoding="utf-8"))
OUT = os.path.join(ROOT, "Abid — Fall 2026 Training Block.xlsx")
rows = D["rows"]


def num(s):
    """First number in a string like '196 W' or '2.56 W/kg'."""
    m = re.search(r"-?\d+(?:\.\d+)?", str(s or ""))
    return float(m.group()) if m else None


def pct_nums(s):
    return [float(x) for x in re.findall(r"\d+(?:\.\d+)?", str(s or ""))]


def mmss(s):
    """'7:06' -> a real Excel time, so the CSS formula can subtract it."""
    parts = str(s or "").split(":")
    if len(parts) != 2:
        return None
    try:
        return _time(0, int(parts[0]), int(parts[1]))
    except ValueError:
        return None


FONT = "Arial"
INK = "1F3A2E"
ACCENT = "2F6B4F"
HEAD_FILL = PatternFill("solid", start_color=ACCENT)
SUB_FILL = PatternFill("solid", start_color="E4EDE7")
INPUT_FILL = PatternFill("solid", start_color="FFFDF0")
BLUE = Font(name=FONT, size=10, color="0000FF")
BLACK = Font(name=FONT, size=10, color="000000")
GREEN = Font(name=FONT, size=10, color="008000")
HEAD_FONT = Font(name=FONT, size=10, bold=True, color="FFFFFF")
TITLE_FONT = Font(name=FONT, size=14, bold=True, color=INK)
SUB_FONT = Font(name=FONT, size=10, bold=True, color=INK)
WRAP = Alignment(wrap_text=True, vertical="top")
TOP = Alignment(vertical="top")
thin = Side(style="thin", color="C9D6CD")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

CAT_COLORS = {
    "swim": "DCEBF7", "run": "F7DEDC", "bike": "E6E0F2",
    "strength": "FBEBD6", "recovery": "E3EFE6", "hike": "EDE6DA",
}

wb = Workbook()

def style_header(ws, row, ncols):
    for c in range(1, ncols + 1):
        cell = ws.cell(row=row, column=c)
        cell.font = HEAD_FONT
        cell.fill = HEAD_FILL
        cell.alignment = Alignment(wrap_text=True, vertical="center")
        cell.border = BORDER

def set_widths(ws, widths):
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

def title_block(ws, title, subtitle, span):
    ws["A1"] = title
    ws["A1"].font = TITLE_FONT
    ws["A2"] = subtitle
    ws["A2"].font = Font(name=FONT, size=9, italic=True, color="5A6B60")
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=span)
    ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=span)

# ----------------------------------------------------------------- Log
ws = wb.active
ws.title = "Log"
title_block(ws, "Fall 2026 base block — daily log",
            "Blue = type here. Black = formula. Only edit the Done / Actual / RPE / How it felt columns.", 16)

HEAD = ["Date", "Day", "Wk", "Phase", "Category", "Session", "Planned", "Plan yd", "Plan km",
        "Done", "Act yd", "Act km", "Act min", "RPE", "How it felt", "What the session is"]
HROW = 4
for i, h in enumerate(HEAD, start=1):
    ws.cell(row=HROW, column=i, value=h)
style_header(ws, HROW, len(HEAD))
ws.freeze_panes = "C5"

r = HROW + 1
for row in rows:
    ws.cell(row=r, column=1, value=row["date"]).number_format = "yyyy-mm-dd"
    ws.cell(row=r, column=2, value=row["day"])
    ws.cell(row=r, column=3, value=row["week"])
    ws.cell(row=r, column=4, value=row["phase"])
    ws.cell(row=r, column=5, value=row["category"])
    ws.cell(row=r, column=6, value=row["title"])
    ws.cell(row=r, column=7, value=row["duration"])
    ws.cell(row=r, column=8, value=row["yards"] or None)
    ws.cell(row=r, column=9, value=row["km"] or None)
    ws.cell(row=r, column=16, value=row["note"])

    for c in range(1, 17):
        cell = ws.cell(row=r, column=c)
        cell.border = BORDER
        cell.font = BLACK
        cell.alignment = WRAP if c in (6, 15, 16) else TOP
    fill = CAT_COLORS.get(row["category"])
    if fill:
        ws.cell(row=r, column=5).fill = PatternFill("solid", start_color=fill)
    for c in (10, 11, 12, 13, 14, 15):
        ws.cell(row=r, column=c).font = BLUE
        ws.cell(row=r, column=c).fill = INPUT_FILL
    ws.cell(row=r, column=8).number_format = "#,##0;-;-"
    ws.cell(row=r, column=9).number_format = "0.0;-;-"
    ws.cell(row=r, column=11).number_format = "#,##0;-;-"
    ws.cell(row=r, column=12).number_format = "0.0;-;-"
    r += 1

LAST = r - 1
set_widths(ws, [11, 5, 4, 10, 10, 34, 20, 8, 7, 7, 8, 7, 7, 5, 30, 62])
ws.row_dimensions[HROW].height = 28

dv_done = DataValidation(type="list", formula1='"Y,N,skipped,moved"', allow_blank=True)
ws.add_data_validation(dv_done)
dv_done.add(f"J{HROW+1}:J{LAST}")
dv_rpe = DataValidation(type="whole", operator="between", formula1=1, formula2=10, allow_blank=True)
ws.add_data_validation(dv_rpe)
dv_rpe.add(f"N{HROW+1}:N{LAST}")

ws.conditional_formatting.add(
    f"A{HROW+1}:P{LAST}",
    FormulaRule(formula=[f'$J{HROW+1}="Y"'], fill=PatternFill("solid", start_color="EAF5EC")),
)
ws.auto_filter.ref = f"A{HROW}:P{LAST}"

# ------------------------------------------------------------- Week Summary
wk = wb.create_sheet("Week Summary")
title_block(wk, "Weekly rollup", "Every number here is a live formula over the Log sheet. Nothing to type.", 13)
WH = ["Wk", "Starts", "Theme", "Swim plan (yd)", "Swim actual", "Swim Δ", "6,000 floor",
      "Run plan (km)", "Run actual", "Run Δ", "Sessions", "Done", "% done"]
HR = 4
for i, h in enumerate(WH, start=1):
    wk.cell(row=HR, column=i, value=h)
style_header(wk, HR, len(WH))
wk.freeze_panes = "B5"

weeks = D["weeklySwimYards"]
r = HR + 1
for w in weeks:
    n = w["week"]
    wk.cell(row=r, column=1, value=n).font = BLACK
    wk.cell(row=r, column=2, value=w["start"]).font = BLACK
    wk.cell(row=r, column=3, value=w["theme"]).font = BLACK
    wk.cell(row=r, column=4, value=f"=SUMIFS(Log!$H$5:$H$400,Log!$C$5:$C$400,$A{r})").font = GREEN
    wk.cell(row=r, column=5, value=f"=SUMIFS(Log!$K$5:$K$400,Log!$C$5:$C$400,$A{r})").font = GREEN
    wk.cell(row=r, column=6, value=f"=IF(E{r}=0,\"\",E{r}-D{r})").font = BLACK
    wk.cell(row=r, column=7, value=f'=IF(E{r}=0,"–",IF(E{r}>=6000,"OK","UNDER"))').font = BLACK
    wk.cell(row=r, column=8, value=f"=SUMIFS(Log!$I$5:$I$400,Log!$C$5:$C$400,$A{r})").font = GREEN
    wk.cell(row=r, column=9, value=f"=SUMIFS(Log!$L$5:$L$400,Log!$C$5:$C$400,$A{r})").font = GREEN
    wk.cell(row=r, column=10, value=f"=IF(I{r}=0,\"\",I{r}-H{r})").font = BLACK
    wk.cell(row=r, column=11, value=f"=COUNTIFS(Log!$C$5:$C$400,$A{r})").font = GREEN
    wk.cell(row=r, column=12, value=f'=COUNTIFS(Log!$C$5:$C$400,$A{r},Log!$J$5:$J$400,"Y")').font = GREEN
    wk.cell(row=r, column=13, value=f"=IFERROR(L{r}/K{r},0)").font = BLACK
    for c in range(1, 14):
        wk.cell(row=r, column=c).border = BORDER
        wk.cell(row=r, column=c).alignment = WRAP if c == 3 else TOP
        if wk.cell(row=r, column=c).font is None:
            wk.cell(row=r, column=c).font = BLACK
    for c in (4, 5, 6):
        wk.cell(row=r, column=c).number_format = "#,##0;(#,##0);-"
    for c in (8, 9, 10):
        wk.cell(row=r, column=c).number_format = "0.0;(0.0);-"
    wk.cell(row=r, column=13).number_format = "0.0%"
    r += 1

TOTR = r
wk.cell(row=TOTR, column=1, value="All").font = SUB_FONT
wk.cell(row=TOTR, column=3, value="Block total").font = SUB_FONT
for col in (4, 5, 8, 9, 11, 12):
    L = get_column_letter(col)
    wk.cell(row=TOTR, column=col, value=f"=SUM({L}{HR+1}:{L}{TOTR-1})").font = SUB_FONT
wk.cell(row=TOTR, column=13, value=f"=IFERROR(L{TOTR}/K{TOTR},0)").font = SUB_FONT
for c in range(1, 14):
    wk.cell(row=TOTR, column=c).fill = SUB_FILL
    wk.cell(row=TOTR, column=c).border = BORDER
for c in (4, 5):
    wk.cell(row=TOTR, column=c).number_format = "#,##0;(#,##0);-"
for c in (8, 9):
    wk.cell(row=TOTR, column=c).number_format = "0.0;(0.0);-"
wk.cell(row=TOTR, column=13).number_format = "0.0%"

set_widths(wk, [5, 11, 26, 13, 12, 9, 11, 13, 12, 9, 10, 8, 9])
wk.row_dimensions[HR].height = 30
wk.conditional_formatting.add(
    f"G{HR+1}:G{TOTR-1}",
    CellIsRule(operator="equal", formula=['"UNDER"'], fill=PatternFill("solid", start_color="F7D6D3")),
)
wk.conditional_formatting.add(
    f"G{HR+1}:G{TOTR-1}",
    CellIsRule(operator="equal", formula=['"OK"'], fill=PatternFill("solid", start_color="D6EDDB")),
)

# ------------------------------------------------------------------ Swim
sw = wb.create_sheet("Swim")
title_block(sw, "Swim — the engine of this block",
            "CSS drives every send-off. Retest Sep 21, Nov 9, Dec 28 and update the yellow cells.", 6)

sw["A4"] = "CSS test log"
sw["A4"].font = SUB_FONT
for i, h in enumerate(["Date", "400 yd time", "200 yd time", "CSS /100 yd (sec)", "CSS as m:ss", "Notes"], start=1):
    sw.cell(row=5, column=i, value=h)
style_header(sw, 5, 6)
tests_by_date = {t["date"]: t for t in D.get("swimTests", [])}
css_dates = sorted(set(list(tests_by_date) + ["2026-09-21", "2026-11-09", "2026-12-28"]))
r = 6
for d in css_dates:
    t = tests_by_date.get(d)
    sw.cell(row=r, column=1, value=d).font = BLUE
    for c in (2, 3, 6):
        cell = sw.cell(row=r, column=c)
        cell.font = BLUE
        # Cream once the test is in the book; yellow while it still needs doing.
        cell.fill = INPUT_FILL if t else PatternFill("solid", start_color="FFFF00")
    if t:
        sw.cell(row=r, column=2, value=mmss(t.get("t400")))
        sw.cell(row=r, column=3, value=mmss(t.get("t200")))
        sw.cell(row=r, column=6, value=t.get("note", ""))
        sw.cell(row=r, column=6).alignment = WRAP
    sw.cell(row=r, column=2).number_format = "mm:ss"
    sw.cell(row=r, column=3).number_format = "mm:ss"
    sw.cell(row=r, column=4, value=f'=IF(OR(B{r}="",C{r}=""),"",ROUND((B{r}-C{r})*86400/2,1))').font = BLACK
    sw.cell(row=r, column=4).number_format = "0.0"
    sw.cell(row=r, column=5, value=f'=IF(D{r}="","",INT(D{r}/60)&":"&TEXT(MOD(D{r},60),"00"))').font = BLACK
    for c in range(1, 7):
        sw.cell(row=r, column=c).border = BORDER
    r += 1

sw.cell(row=r, column=1, value="Enter times as m:ss (e.g. 7:40). CSS = (T400 − T200) ÷ 2, in seconds per 100 yd. "
                               "Yellow rows are retests still to come — fill the two times and CSS computes itself.")
sw.cell(row=r, column=1).font = Font(name=FONT, size=9, italic=True, color="5A6B60")
CSS_NEXT = r + 2

def table(ws, start_row, heading, headers, data, widths=None, wrap_cols=()):
    ws.cell(row=start_row, column=1, value=heading).font = SUB_FONT
    hr = start_row + 1
    for i, h in enumerate(headers, start=1):
        ws.cell(row=hr, column=i, value=h)
    style_header(ws, hr, len(headers))
    r = hr + 1
    for rec in data:
        for i, v in enumerate(rec, start=1):
            cell = ws.cell(row=r, column=i, value=v)
            cell.font = BLACK
            cell.border = BORDER
            cell.alignment = WRAP if i in wrap_cols else TOP
        r += 1
    return r + 1

def caption(ws, row, text, span):
    """Full-width italic note under a table."""
    if not text:
        return row + 1
    ws.cell(row=row, column=1, value=text).font = Font(name=FONT, size=9, italic=True, color="5A6B60")
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=span)
    ws.cell(row=row, column=1).alignment = WRAP
    ws.row_dimensions[row].height = 30
    return row + 2


swim_target = D.get("swimTestTarget") or {}
r = CSS_NEXT
if swim_target.get("rows"):
    r = table(sw, r, f"Week {swim_target.get('week', '')} retest target — {swim_target.get('date', '')}",
              ["Scenario", "400 yd", "200 yd", "CSS /100 yd"],
              [[x.get("label", ""), x.get("t400", ""), x.get("t200", ""), x.get("css", "")]
               for x in swim_target["rows"]],
              wrap_cols=(1,))
    r = caption(sw, r - 1, swim_target.get("caveat", ""), 6)

r = table(sw, r, "Pace zones (recalculate off your measured CSS)",
          ["Zone", "Target", "Cue"],
          [[z.get("zone", ""), z.get("pace", ""), z.get("cue", "")] for z in D["swimPaceZones"]],
          wrap_cols=(3,))
r = table(sw, r, "Send-offs", ["Set", "Send-off", "Rest"],
          [[s.get("set", ""), s.get("sendOff", ""), s.get("rest", "")] for s in D["swimSendOffs"]],
          wrap_cols=(1,))
r = table(sw, r, "Drill progression", ["Phase", "Title", "Focus", "Drills"],
          [[p.get("phase", ""), p.get("title", ""), p.get("focus", ""), " · ".join(p.get("drills", []))]
           for p in D["swimDrillProgression"]],
          wrap_cols=(3, 4))
r = table(sw, r, "Before every swim", ["Checklist"], [[c] for c in D["swimReadinessChecklist"]], wrap_cols=(1,))
set_widths(sw, [24, 16, 40, 44, 14, 52])

# ----------------------------------------------------------------- Drills
dr = wb.create_sheet("Drills", 3)
title_block(dr, "Swim drill library",
            "Every drill the sessions refer to by name. Gear is not decoration: a center-mount snorkel sits on the "
            "centreline of your face, so it floods the moment you rotate onto your side — side-lying drills, and "
            "anything whose point is getting air, are fins-only.", 6)
table(dr, 4, "Drills", ["Drill", "Gear", "What you do", "Feel for", "Watch for", "Why it is in the plan"],
      [[d.get("name", ""), d.get("gear", ""), d.get("what", ""), d.get("feel", ""), d.get("mistake", ""),
        d.get("why", "")] for d in D.get("swimDrills", [])],
      wrap_cols=(1, 2, 3, 4, 5, 6))
set_widths(dr, [24, 20, 50, 50, 50, 54])

# ------------------------------------------------------------------- Bike
bk = wb.create_sheet("Bike", 4)
title_block(bk, "Bike — FTP and the winter power block",
            "FTP is the bike's CSS: the highest power you could hold for about an hour, taken as 95% of a 20 min "
            "all-out average. Every interval in the plan is a percentage of it, so the zone table is formula-driven "
            "— update the test log and the zones re-cut themselves.", 5)

ftp_tests = D.get("ftpTests", [])
ftp_target = D.get("ftpTarget") or {}

# W/kg needs a body weight. Take it from the plan so the sheet and the site agree,
# and expose it as the single assumption cell everything below references.
weight_kg = (D.get("blockMeta") or {}).get("bodyWeightKg") or 72.6

bk.cell(row=4, column=1, value="Body weight (kg)").font = SUB_FONT
wc = bk.cell(row=4, column=2, value=weight_kg)
wc.font = BLUE
wc.fill = PatternFill("solid", start_color="FFFF00")
wc.number_format = "0.0"
wc.border = BORDER
bk.cell(row=4, column=3, value="Key assumption — every W/kg below divides by this cell. "
                               "Source: plan.js blockMeta.bodyWeightKg (COROS profile). Update it if your weight moves.") \
    .font = Font(name=FONT, size=9, italic=True, color="5A6B60")
WEIGHT = "$B$4"

bk.cell(row=6, column=1, value="FTP test log").font = SUB_FONT
for i, h in enumerate(["Date", "20 min avg (W)", "FTP (W)", "W/kg", "Notes"], start=1):
    bk.cell(row=7, column=i, value=h)
style_header(bk, 7, 5)

ftp_by_date = {t["date"]: t for t in ftp_tests}
ftp_dates = sorted(set(list(ftp_by_date) + [d for d in [ftp_target.get("date")] if d]))
r = 8
FTP_FIRST = r
for d in ftp_dates:
    t = ftp_by_date.get(d)
    bk.cell(row=r, column=1, value=d).font = BLUE
    cell = bk.cell(row=r, column=2, value=num(t.get("avg20")) if t else None)
    cell.font = BLUE
    cell.fill = INPUT_FILL if t else PatternFill("solid", start_color="FFFF00")
    cell.number_format = "0"
    bk.cell(row=r, column=3, value=f'=IF(B{r}="","",ROUND(B{r}*0.95,0))').font = BLACK
    bk.cell(row=r, column=3).number_format = '0" W"'
    bk.cell(row=r, column=4, value=f'=IF(C{r}="","",ROUND(C{r}/{WEIGHT},2))').font = BLACK
    bk.cell(row=r, column=4).number_format = '0.00" W/kg"'
    bk.cell(row=r, column=5, value=(t or {}).get("note", "")).alignment = WRAP
    for c in range(1, 6):
        bk.cell(row=r, column=c).border = BORDER
    r += 1
FTP_LAST = r - 1

r = caption(bk, r, "Type the 20 min average into the blue column; FTP and W/kg are formulas. These are Keiser console "
                   "watts — estimated from resistance and cadence, not measured by a strain gauge. Consistent against "
                   "themselves, but not transferable to another bike or a real power meter. Retest on the same "
                   "equipment or not at all.", 5)

bk.cell(row=r, column=1, value="Current FTP (W)").font = SUB_FONT
cur = bk.cell(row=r, column=2,
              value=f'=IFERROR(LOOKUP(2,1/($C${FTP_FIRST}:$C${FTP_LAST}<>""),$C${FTP_FIRST}:$C${FTP_LAST}),0)')
cur.font = BLACK
cur.number_format = '0" W"'
cur.fill = SUB_FILL
cur.border = BORDER
bk.cell(row=r, column=3, value="Last completed test. The zone table below cuts off this cell.") \
    .font = Font(name=FONT, size=9, italic=True, color="5A6B60")
FTPC = f"$B${r}"
r += 2

bk.cell(row=r, column=1, value="Power zones (live — cut from current FTP)").font = SUB_FONT
for i, h in enumerate(["Zone", "% of FTP", "Watts", "Cue"], start=1):
    bk.cell(row=r + 1, column=i, value=h)
style_header(bk, r + 1, 4)
rr = r + 2
for z in D.get("bikePowerZones", []):
    pcts = pct_nums(z.get("percent"))
    if len(pcts) >= 2:
        val = (f'=TEXT(ROUND({FTPC}*{pcts[0] / 100},0),"0")&"–"'
               f'&TEXT(ROUND({FTPC}*{pcts[1] / 100},0),"0")&" W"')
    elif len(pcts) == 1:
        prefix = "< " if "<" in str(z.get("percent", "")) else ""
        val = f'="{prefix}"&TEXT(ROUND({FTPC}*{pcts[0] / 100},0),"0")&" W"'
    else:
        val = z.get("watts", "")
    bk.cell(row=rr, column=1, value=z.get("zone", "")).font = BLACK
    bk.cell(row=rr, column=2, value=z.get("percent", "")).font = BLACK
    bk.cell(row=rr, column=3, value=val).font = BLACK
    bk.cell(row=rr, column=4, value=z.get("cue", "")).font = BLACK
    for c in range(1, 5):
        bk.cell(row=rr, column=c).border = BORDER
        bk.cell(row=rr, column=c).alignment = WRAP if c == 4 else TOP
    rr += 1
r = rr + 1

if ftp_target.get("rows"):
    r = table(bk, r, f"Week {ftp_target.get('week', '')} retest target — {ftp_target.get('date', '')}",
              ["Scenario", "20 min avg", "FTP", "W/kg"],
              [[x.get("label", ""), x.get("avg20", ""), x.get("ftp", ""), x.get("wkg", "")]
               for x in ftp_target["rows"]],
              wrap_cols=(1,))
    r = caption(bk, r - 1, ftp_target.get("caveat", ""), 5)

goal = D.get("ftpGoal") or {}
if goal:
    r = table(bk, r, "Why the winter bike block exists", ["Metric", "Value"],
              [["Current", goal.get("current", "")],
               ["Target", goal.get("target", "")],
               ["Target W/kg", goal.get("targetWkg", "")],
               ["Deadline", goal.get("deadline", "")]],
              wrap_cols=(1,))
    r = caption(bk, r - 1, goal.get("note", ""), 5)
set_widths(bk, [26, 16, 18, 62, 60])

# ------------------------------------------------------------------- Run
rn = wb.create_sheet("Run")
title_block(rn, "Run ramp + lower-leg guardrails",
            "The ramp is the plan; the protocol is what keeps you in it. Actual km is pulled from the Log.", 7)
rn.cell(row=4, column=1, value="Weekly ramp").font = SUB_FONT
for i, h in enumerate(["Week", "Dates", "Runs", "Planned volume", "Actual (from Log)", "Long run", "Note"], start=1):
    rn.cell(row=5, column=i, value=h)
style_header(rn, 5, 7)
r = 6
for rec in D["runRamp"]:
    wknum = "".join(ch for ch in str(rec["week"]) if ch.isdigit())
    rn.cell(row=r, column=1, value=rec["week"]).font = BLACK
    rn.cell(row=r, column=2, value=rec["dates"]).font = BLACK
    rn.cell(row=r, column=3, value=rec["runs"]).font = BLACK
    rn.cell(row=r, column=4, value=rec["volume"]).font = BLACK
    rn.cell(row=r, column=5, value=f'=IFERROR(SUMIFS(Log!$L$5:$L$400,Log!$C$5:$C$400,{wknum}),0)').font = GREEN
    rn.cell(row=r, column=5).number_format = '0.0" km";-;-'
    rn.cell(row=r, column=6, value=rec["longRun"]).font = BLACK
    rn.cell(row=r, column=7, value=rec["note"]).font = BLACK
    for c in range(1, 8):
        rn.cell(row=r, column=c).border = BORDER
        rn.cell(row=r, column=c).alignment = WRAP if c == 7 else TOP
    r += 1
r = table(rn, r + 1, "Lower-leg protocol — the non-negotiables", ["Rule"],
          [[x] for x in D["lowerLegProtocol"]], wrap_cols=(1,))
set_widths(rn, [10, 14, 7, 15, 16, 11, 68])

# -------------------------------------------------------------- Strength
st = wb.create_sheet("Strength")
title_block(st, "Strength templates + load log", "Log the weight you actually used so progression is visible.", 8)
r = 4
for t in D["strengthTemplates"]:
    st.cell(row=r, column=1, value=t["title"]).font = SUB_FONT
    st.cell(row=r + 1, column=1, value=t.get("focus", "")).font = Font(name=FONT, size=9, italic=True, color="5A6B60")
    hr = r + 2
    heads = ["Exercise"] + [f"W{i}" for i in range(1, 16)]
    for i, h in enumerate(heads, start=1):
        st.cell(row=hr, column=i, value=h)
    style_header(st, hr, len(heads))
    rr = hr + 1
    for ex in t["exercises"]:
        st.cell(row=rr, column=1, value=ex).font = BLACK
        st.cell(row=rr, column=1).alignment = WRAP
        st.cell(row=rr, column=1).border = BORDER
        for c in range(2, 17):
            cell = st.cell(row=rr, column=c)
            cell.font = BLUE
            cell.fill = INPUT_FILL
            cell.border = BORDER
        rr += 1
    r = rr + 2
set_widths(st, [46] + [7] * 15)

# ------------------------------------------------------------- Reference
rf = wb.create_sheet("Reference")
title_block(rf, "Reference", "Phases, heart-rate zones, and what the block is for.", 5)
r = table(rf, 4, "Phases", ["Dates", "Phase", "What it is for"],
          [[p["date"], p["title"], p["detail"]] for p in D["phases"]], wrap_cols=(3,))
r = table(rf, r, "Heart-rate zones", ["Zone", "Range", "Use"],
          [[z.get("zone", ""), z.get("range", z.get("bpm", "")), z.get("use", z.get("cue", ""))]
           for z in D["heartRateZones"]], wrap_cols=(3,))
r = table(rf, r, "Block at a glance", ["Metric", "Value"],
          [[c.get("label", ""), c.get("value", "")] for c in D["summaryCards"]], wrap_cols=(1,))
r = table(rf, r, "Where things live", ["Sheet", "What is on it"],
          [["Log", "Every session in the block. Tick Done, enter actuals, leave a note."],
           ["Week Summary", "Rolls the log up by week — swim yards, run km, bike hours, sessions done."],
           ["Swim", "CSS test log and retest target, pace zones, send-offs, drill phases, pre-swim checklist."],
           ["Drills", "The drill library — gear, what you do, what to feel, what to watch for, and why."],
           ["Bike", "FTP test log, live power zones, retest target, and the 70.3 power gap."],
           ["Run", "The run ramp and its rules."],
           ["Strength", "The lifting sessions, set by set."]], wrap_cols=(2,))
set_widths(rf, [22, 26, 86, 20, 20])

for s in wb.worksheets:
    s.sheet_view.showGridLines = False

# openpyxl writes formulas without cached results; force a recalc on open so the
# file is correct in Excel, Google Sheets, and any previewer.
wb.calculation.fullCalcOnLoad = True

wb.save(OUT)
print(f"wrote {OUT}\n  {LAST-HROW} sessions, log rows {HROW+1}..{LAST}")
