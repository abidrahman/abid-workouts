import json, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, "plan-export.json"), encoding="utf-8"))
OUT = os.path.join(ROOT, "Abid — Fall 2026 Training Block.xlsx")
rows = D["rows"]

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
for i, d in enumerate(["2026-09-21", "2026-11-09", "2026-12-28"]):
    r = 6 + i
    sw.cell(row=r, column=1, value=d).font = BLUE
    for c in (2, 3, 6):
        sw.cell(row=r, column=c).font = BLUE
        sw.cell(row=r, column=c).fill = PatternFill("solid", start_color="FFFF00")
    sw.cell(row=r, column=2).number_format = "mm:ss"
    sw.cell(row=r, column=3).number_format = "mm:ss"
    sw.cell(row=r, column=4, value=f'=IF(OR(B{r}="",C{r}=""),"",ROUND((B{r}-C{r})*86400/2,1))').font = BLACK
    sw.cell(row=r, column=4).number_format = "0.0"
    sw.cell(row=r, column=5, value=f'=IF(D{r}="","",INT(D{r}/60)&":"&TEXT(MOD(D{r},60),"00"))').font = BLACK
    for c in range(1, 7):
        sw.cell(row=r, column=c).border = BORDER
sw["A10"] = "Enter times as m:ss (e.g. 7:40). CSS = (T400 − T200) ÷ 2, in seconds per 100 yd."
sw["A10"].font = Font(name=FONT, size=9, italic=True, color="5A6B60")

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

r = table(sw, 12, "Pace zones (recalculate off your measured CSS)",
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
set_widths(sw, [22, 16, 40, 46, 14, 30])

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
set_widths(rf, [22, 26, 86, 20, 20])

for s in wb.worksheets:
    s.sheet_view.showGridLines = False

# openpyxl writes formulas without cached results; force a recalc on open so the
# file is correct in Excel, Google Sheets, and any previewer.
wb.calculation.fullCalcOnLoad = True

wb.save(OUT)
print(f"wrote {OUT}\n  {LAST-HROW} sessions, log rows {HROW+1}..{LAST}")
