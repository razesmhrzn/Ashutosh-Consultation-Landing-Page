from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "facility-supplies-audit-toolkit.pdf"
LOGO = ROOT / "public" / "logo.png"

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
MARGIN_TOP = 20 * mm
MARGIN_BOTTOM = 17 * mm

GREEN = colors.HexColor("#23845F")
DEEP_GREEN = colors.HexColor("#103D30")
MINT = colors.HexColor("#EAF6F0")
PALE = colors.HexColor("#F7FAF8")
INK = colors.HexColor("#17231F")
MUTED = colors.HexColor("#5E6B66")
GOLD = colors.HexColor("#D9A441")
RED = colors.HexColor("#B64A45")
LINE = colors.HexColor("#D7E3DD")
WHITE = colors.white


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CoverEyebrow",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=GREEN,
        spaceAfter=5 * mm,
        uppercase=True,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=31,
        leading=34,
        textColor=DEEP_GREEN,
        alignment=TA_LEFT,
        spaceAfter=6 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=14,
        leading=20,
        textColor=INK,
        spaceAfter=8 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=GREEN,
        spaceAfter=2 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="H1Custom",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=27,
        textColor=DEEP_GREEN,
        spaceAfter=5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="H2Custom",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=DEEP_GREEN,
        spaceBefore=3 * mm,
        spaceAfter=2.5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=INK,
        spaceAfter=3 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="SmallCustom",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="ChecklistText",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.1,
        leading=12.5,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        name="CardTitle",
        parent=styles["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=DEEP_GREEN,
        spaceAfter=1.5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="CardBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.2,
        leading=11.5,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        name="CTAHeading",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=25,
        leading=30,
        textColor=WHITE,
        alignment=TA_CENTER,
        spaceAfter=5 * mm,
    )
)
styles.add(
    ParagraphStyle(
        name="CTABody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=12,
        leading=18,
        textColor=colors.HexColor("#DCECE5"),
        alignment=TA_CENTER,
        spaceAfter=5 * mm,
    )
)


class Rule(Flowable):
    def __init__(self, width, color=LINE, thickness=0.8, space_before=1, space_after=6):
        super().__init__()
        self.width = width
        self.height = space_before + thickness + space_after
        self.color = color
        self.thickness = thickness
        self.space_before = space_before

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, self.height - self.space_before, self.width, self.height - self.space_before)


class ScoreCircle(Flowable):
    def __init__(self, number):
        super().__init__()
        self.number = str(number)
        self.width = 9 * mm
        self.height = 9 * mm

    def draw(self):
        c = self.canv
        c.setFillColor(MINT)
        c.circle(self.width / 2, self.height / 2, 3.7 * mm, stroke=0, fill=1)
        c.setFillColor(DEEP_GREEN)
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(self.width / 2, self.height / 2 - 2.5, self.number)


class Checkbox(Flowable):
    def __init__(self, label):
        super().__init__()
        self.label = label
        self.width = 15 * mm
        self.height = 7 * mm

    def draw(self):
        c = self.canv
        c.setStrokeColor(GREEN)
        c.setLineWidth(1)
        c.roundRect(0, 1.5 * mm, 3.2 * mm, 3.2 * mm, 0.8 * mm, stroke=1, fill=0)
        c.setFillColor(MUTED)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(4.4 * mm, 2.1 * mm, self.label)


def page_header_footer(canvas, doc):
    canvas.saveState()
    if doc.page > 1:
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.6)
        canvas.line(MARGIN_X, PAGE_H - 13 * mm, PAGE_W - MARGIN_X, PAGE_H - 13 * mm)
        canvas.setFillColor(DEEP_GREEN)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.drawString(MARGIN_X, PAGE_H - 10 * mm, "ASHUTOSH TRADE")
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 7.5)
        canvas.drawRightString(PAGE_W - MARGIN_X, PAGE_H - 10 * mm, "FACILITY SUPPLIES AUDIT TOOLKIT")

        canvas.setStrokeColor(LINE)
        canvas.line(MARGIN_X, 12 * mm, PAGE_W - MARGIN_X, 12 * mm)
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 7.5)
        canvas.drawString(MARGIN_X, 7.8 * mm, "www.ashutoshtrade.com.np")
        canvas.drawRightString(PAGE_W - MARGIN_X, 7.8 * mm, f"{doc.page - 1}")
    canvas.restoreState()


def cover_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PALE)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(DEEP_GREEN)
    canvas.rect(0, 0, 12 * mm, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(MINT)
    canvas.circle(PAGE_W - 15 * mm, PAGE_H - 18 * mm, 46 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#D6EFE3"))
    canvas.circle(PAGE_W - 7 * mm, 21 * mm, 35 * mm, fill=1, stroke=0)
    canvas.restoreState()
    page_header_footer(canvas, doc)


def later_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.restoreState()
    page_header_footer(canvas, doc)


def checklist_table(items, start_number):
    rows = []
    for offset, item in enumerate(items):
        number = start_number + offset
        rows.append(
            [
                ScoreCircle(number),
                Paragraph(item, styles["ChecklistText"]),
                Checkbox("YES"),
                Checkbox("NO"),
            ]
        )
    table = Table(rows, colWidths=[11 * mm, 111 * mm, 18 * mm, 18 * mm], rowHeights=[15.2 * mm] * len(rows))
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 2),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
            ]
        )
    )
    return table


def field_line(label, width=75 * mm):
    return Table(
        [[Paragraph(f"<b>{label}</b>", styles["SmallCustom"]), ""]],
        colWidths=[32 * mm, width],
        rowHeights=[8 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LINEBELOW", (1, 0), (1, 0), 0.7, MUTED),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]
        ),
    )


def section_intro(label, title, text):
    return [
        Paragraph(label.upper(), styles["SectionLabel"]),
        Paragraph(title, styles["H1Custom"]),
        Paragraph(text, styles["BodyCustom"]),
    ]


def card(title, body, accent=GREEN):
    content = [Paragraph(title, styles["CardTitle"]), Paragraph(body, styles["CardBody"])]
    t = Table([[content]], colWidths=[76 * mm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("LINEBEFORE", (0, 0), (0, 0), 4, accent),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return t


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=MARGIN_TOP,
        bottomMargin=MARGIN_BOTTOM,
        title="30-Point Facility Supplies and Cleaning Operations Audit",
        author="Ashutosh Trade",
        subject="Lead magnet and operational audit toolkit",
    )
    cover_frame = Frame(
        MARGIN_X + 5 * mm,
        MARGIN_BOTTOM,
        PAGE_W - (2 * MARGIN_X) - 5 * mm,
        PAGE_H - MARGIN_TOP - MARGIN_BOTTOM,
        id="cover",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    body_frame = Frame(
        MARGIN_X,
        MARGIN_BOTTOM,
        PAGE_W - 2 * MARGIN_X,
        PAGE_H - MARGIN_TOP - MARGIN_BOTTOM,
        id="body",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates(
        [
            PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_background, autoNextPageTemplate="Body"),
            PageTemplate(id="Body", frames=[body_frame], onPage=later_background),
        ]
    )

    story = []

    story.append(Spacer(1, 7 * mm))
    if LOGO.exists():
        logo = Image(str(LOGO), width=50 * mm, height=41 * mm)
        logo.hAlign = "LEFT"
        story.append(logo)
    story.append(Spacer(1, 13 * mm))
    story.append(Paragraph("FREE OPERATIONAL TOOLKIT", styles["CoverEyebrow"]))
    story.append(Paragraph("The 30-Point Facility Supplies &amp; Cleaning Operations Audit", styles["CoverTitle"]))
    story.append(
        Paragraph(
            "Find cost leakage, stock risks, supply gaps, and machinery downtime before they disrupt your facility.",
            styles["CoverSubtitle"],
        )
    )
    sectors = ["Hospitals", "Schools", "Hotels", "Commercial Buildings", "Offices"]
    pills = Table(
        [[Paragraph(f"<b>{s}</b>", styles["SmallCustom"]) for s in sectors[:3]],
         [Paragraph(f"<b>{s}</b>", styles["SmallCustom"]) for s in sectors[3:]] + [""]],
        colWidths=[47 * mm, 47 * mm, 47 * mm],
        rowHeights=[10 * mm, 10 * mm],
        hAlign="LEFT",
    )
    pills.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.6, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ]
        )
    )
    story.append(pills)
    story.append(Spacer(1, 22 * mm))
    story.append(Paragraph("Prepared by <b>Ashutosh Trade</b>", styles["BodyCustom"]))
    story.append(Paragraph("Housekeeping supplies, facility products, and cleaning machinery", styles["SmallCustom"]))
    story.append(PageBreak())

    story.extend(
        section_intro(
            "Start here",
            "Turn 15 minutes into a clear action list",
            "This toolkit helps you see where money, time, and service quality may be leaking across procurement, stock control, cleaning operations, and machinery management. Complete it with the person who orders supplies and the person who uses them.",
        )
    )
    use_steps = [
        ("1. Audit", "Mark YES only when a process is consistently in place, documented, and followed."),
        ("2. Score", "Give yourself one point for every YES. Your total is out of 30."),
        ("3. Prioritize", "Circle the three NO answers that create the highest cost, safety, or service risk."),
        ("4. Act", "Use the 30-day plan to assign an owner, deadline, and measurable outcome."),
    ]
    story.append(
        Table(
            [[card(title, body)] for title, body in use_steps],
            colWidths=[160 * mm],
            rowHeights=[25 * mm] * 4,
            style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]),
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Facility snapshot", styles["H2Custom"]))
    snapshot = Table(
        [
            [field_line("Organization"), field_line("Facility type")],
            [field_line("Location"), field_line("Audit date")],
            [field_line("Monthly supply spend"), field_line("Active suppliers")],
            [field_line("Rooms / beds / desks"), field_line("Cleaning shifts")],
        ],
        colWidths=[80 * mm, 80 * mm],
        rowHeights=[12 * mm] * 4,
    )
    snapshot.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 0)]))
    story.append(snapshot)
    story.append(PageBreak())

    procurement_items = [
        "We know exactly how many active suppliers are used for housekeeping, facility products, and cleaning machinery.",
        "We maintain one approved master item list with clear specifications, pack sizes, and preferred brands or equivalents.",
        "Supplier quotations are compared using the same unit, pack size, tax, and delivery assumptions.",
        "Every key supplier has agreed delivery windows and a clear process for urgent requirements.",
        "Critical items have an approved alternative product or backup source before a shortage occurs.",
        "Monthly spend is consolidated by category so we can see the real cost of fragmented purchasing.",
        "Duplicate or near-duplicate products are reviewed and removed from the approved list.",
        "Contract prices, discount periods, and quotation expiry dates are tracked before orders are placed.",
        "We compare total delivered cost, not just the lowest listed unit price.",
        "One accountable contact owns supplier issues, substitutions, credits, and delivery follow-up.",
    ]
    story.extend(section_intro("Audit section 1", "Procurement and supplier control", "Mark YES only when the statement is consistently true. Add one point for each YES."))
    story.append(checklist_table(procurement_items, 1))
    story.append(PageBreak())

    inventory_items = [
        "Minimum, maximum, and reorder levels are defined for critical consumables.",
        "Stockouts and emergency purchases are recorded, reviewed, and linked to a corrective action.",
        "Slow-moving, obsolete, damaged, and expired stock is identified at least monthly.",
        "Chemical dilution and dispensing methods are standardized to reduce overuse and inconsistent results.",
        "Chemical labels, usage instructions, and safety information are available where products are stored and used.",
        "Color coding or another clear system prevents tools from moving between incompatible risk areas.",
        "Usage is measured against a relevant unit such as occupied room, bed, student, desk, or square meter.",
        "Reorders are triggered early enough to avoid premium freight, rushed approvals, or substitute products.",
        "Dated products follow first-expiry-first-out rotation and storage conditions are checked.",
        "Storage areas are clean, organized, access-controlled where needed, and separate incompatible products.",
    ]
    story.extend(section_intro("Audit section 2", "Inventory, usage, and product control", "Good inventory control protects service quality while releasing cash tied up in unnecessary stock."))
    story.append(checklist_table(inventory_items, 11))
    story.append(PageBreak())

    machinery_items = [
        "We maintain an asset register for cleaning machines, including model, serial number, location, and purchase date.",
        "Operators complete a simple pre-use check for cables, batteries, tanks, pads, brushes, filters, and visible damage.",
        "Preventive maintenance dates are scheduled and visible before service becomes overdue.",
        "Machine downtime, repair cost, and repeat faults are tracked to guide repair-versus-replace decisions.",
        "Each machine is matched to the floor type, area size, cleaning task, and operator capability.",
        "Operator training and refresher training are recorded for every major machine or chemical system.",
        "Required personal protective equipment is available, correctly sized, and used during relevant tasks.",
        "Frequently needed spare parts, batteries, pads, brushes, filters, and consumables have defined reorder levels.",
        "Purchasing decisions compare lifecycle cost, productivity, service support, and consumables - not price alone.",
        "The team has agreed one measurable cleaning-operations improvement to complete in the next 30 days.",
    ]
    story.extend(section_intro("Audit section 3", "Machinery, training, and continuity", "A machine only creates value when it is available, suitable for the task, and used correctly."))
    story.append(checklist_table(machinery_items, 21))
    story.append(PageBreak())

    story.extend(section_intro("Your result", "What your score means", "Total your YES answers. The score is a conversation starter, not a compliance rating."))
    score_rows = [
        ["24-30", "CONTROLLED", "Your basics are strong. Focus on measurement, supplier consolidation, and continuous improvement.", GREEN],
        ["16-23", "IMPROVEMENT ZONE", "Several processes rely on individual effort. Standardize the highest-risk gaps first.", GOLD],
        ["0-15", "HIGH LEAKAGE RISK", "Cost, stock, or service disruption is likely. Build controls around critical products and machines immediately.", RED],
    ]
    score_cards = []
    for band, label, body, accent in score_rows:
        score_cards.append(
            Table(
                [[Paragraph(f"<font size='17'><b>{band}</b></font><br/><font size='8'>{label}</font>", styles["CardTitle"]), Paragraph(body, styles["CardBody"])]],
                colWidths=[35 * mm, 118 * mm],
                rowHeights=[28 * mm],
                style=TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), PALE),
                        ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                        ("LINEBEFORE", (0, 0), (0, 0), 5, accent),
                        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 8),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ]
                ),
            )
        )
    story.append(
        Table(
            [[x] for x in score_cards],
            colWidths=[160 * mm],
            rowHeights=[33 * mm] * 3,
            style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]),
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("My score", styles["H2Custom"]))
    story.append(
        Table(
            [[Paragraph("YES answers", styles["CardBody"]), "", Paragraph("/ 30", styles["CardTitle"])],
             [Paragraph("Top three NO answers to fix", styles["CardBody"]), "1. ________________________________", ""],
             ["", "2. ________________________________", ""],
             ["", "3. ________________________________", ""]],
            colWidths=[55 * mm, 80 * mm, 25 * mm],
            rowHeights=[12 * mm, 10 * mm, 10 * mm, 10 * mm],
            style=TableStyle(
                [
                    ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                    ("SPAN", (0, 1), (0, 3)),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 7),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ]
            ),
        )
    )
    story.append(PageBreak())

    story.extend(section_intro("Planning tool", "Build a simple reorder system", "Use this worksheet for your ten most important consumables. Start with items that stop service when they run out."))
    formulas = Table(
        [
            [Paragraph("AVERAGE DAILY USE", styles["CardTitle"]), Paragraph("Quantity used during the period / number of operating days", styles["CardBody"])],
            [Paragraph("REORDER POINT", styles["CardTitle"]), Paragraph("Average daily use x supplier lead time + safety stock", styles["CardBody"])],
            [Paragraph("MAXIMUM LEVEL", styles["CardTitle"]), Paragraph("Reorder point + order quantity, adjusted for storage life and space", styles["CardBody"])],
        ],
        colWidths=[48 * mm, 112 * mm],
        rowHeights=[18 * mm] * 3,
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), MINT),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.6, colors.white),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ]
        ),
    )
    story.append(formulas)
    story.append(Spacer(1, 6 * mm))
    headers = ["Item", "Daily use", "Lead time", "Safety stock", "Reorder point", "Owner"]
    data = [headers] + [[str(i), "", "", "", "", ""] for i in range(1, 11)]
    reorder = Table(data, colWidths=[36 * mm, 24 * mm, 24 * mm, 25 * mm, 27 * mm, 24 * mm], rowHeights=[10 * mm] + [12 * mm] * 10)
    reorder.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), DEEP_GREEN),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 7.2),
                ("ALIGN", (1, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("GRID", (0, 0), (-1, -1), 0.6, LINE),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(reorder)
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Tip: do not add arbitrary safety stock. Base it on demand variation, delivery reliability, product shelf life, and the operational cost of a stockout.", styles["SmallCustom"]))
    story.append(PageBreak())

    story.extend(section_intro("Sector lens", "Risk triggers by facility type", "Use the questions below to make your action plan relevant to the way your facility actually operates."))
    sector_cards = [
        ("Hospitals and clinics", "Are product approvals, isolation-area tools, chemical instructions, PPE, and emergency stock levels aligned with your infection-prevention and clinical requirements?", GREEN),
        ("Schools and colleges", "Are chemicals secured from students, high-traffic washroom supplies planned for peak periods, and staff trained for spills and event-day demand?", GOLD),
        ("Hotels and hospitality", "Are par levels linked to occupancy, guest-facing standards consistent, linen and amenity usage measured, and machines available during turnaround windows?", GREEN),
        ("Commercial buildings", "Can usage be compared by tenant, floor, or square meter, and are common-area standards, contractor responsibilities, and after-hours deliveries clearly defined?", GOLD),
        ("Offices", "Are dispensers, paper goods, pantry supplies, and cleaning frequencies standardized across locations and adjusted for hybrid occupancy?", GREEN),
    ]
    rows = []
    for i in range(0, len(sector_cards), 2):
        row = [card(*sector_cards[i])]
        if i + 1 < len(sector_cards):
            row.append(card(*sector_cards[i + 1]))
        else:
            row.append("")
        rows.append(row)
    sector_table = Table(rows, colWidths=[78 * mm, 78 * mm], rowHeights=[49 * mm, 49 * mm, 49 * mm], hAlign="LEFT")
    sector_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 4), ("TOPPADDING", (0, 0), (-1, -1), 0)]))
    story.append(sector_table)
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("My facility's highest-risk operating period", styles["H2Custom"]))
    story.append(field_line("Period / event", 120 * mm))
    story.append(field_line("Likely supply risk", 120 * mm))
    story.append(field_line("Prevention action", 120 * mm))
    story.append(PageBreak())

    story.extend(section_intro("Decision tool", "Compare suppliers on value, not price alone", "Score each supplier from 1 (weak) to 5 (excellent). Multiply the score by the suggested weight, then compare totals."))
    criteria = [
        ["Product fit and quality consistency", "20", "", "", ""],
        ["Delivered cost and transparent pack pricing", "20", "", "", ""],
        ["Delivery reliability and urgent response", "15", "", "", ""],
        ["Range consolidation across categories", "15", "", "", ""],
        ["Training, demonstrations, and technical support", "10", "", "", ""],
        ["Machinery service and spare-parts support", "10", "", "", ""],
        ["Reporting, issue resolution, and accountability", "10", "", "", ""],
        ["TOTAL", "100", "", "", ""],
    ]
    supplier_headers = ["Criteria", "Weight %", "Supplier A", "Supplier B", "Supplier C"]
    supplier_table = Table([supplier_headers] + criteria, colWidths=[66 * mm, 20 * mm, 25 * mm, 25 * mm, 25 * mm], rowHeights=[13 * mm] + [17 * mm] * 8)
    supplier_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), DEEP_GREEN),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
                ("BACKGROUND", (0, -1), (-1, -1), MINT),
                ("GRID", (0, 0), (-1, -1), 0.6, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (1, 0), (-1, -1), "CENTER"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("ROWBACKGROUNDS", (0, 1), (-1, -2), [colors.white, PALE]),
            ]
        )
    )
    story.append(supplier_table)
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("Commercial note", styles["H2Custom"]))
    story.append(Paragraph("Before switching, compare like-for-like specifications, sample critical products, confirm service coverage, and agree how substitutions and credits will be handled.", styles["BodyCustom"]))
    story.append(PageBreak())

    story.extend(section_intro("Action tool", "Your 30-day improvement plan", "Choose three actions only. A short completed plan is more valuable than a long list with no owner."))
    action_headers = ["Priority action", "Why it matters", "Owner", "Due date", "Measure of success"]
    action_rows = [["1", "", "", "", ""], ["2", "", "", "", ""], ["3", "", "", "", ""]]
    action_table = Table([action_headers] + action_rows, colWidths=[43 * mm, 40 * mm, 25 * mm, 22 * mm, 31 * mm], rowHeights=[13 * mm] + [42 * mm] * 3)
    action_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), DEEP_GREEN),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.6, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (0, 1), (0, -1), "CENTER"),
                ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 7.6),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 1), (-1, -1), 8),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE]),
            ]
        )
    )
    story.append(action_table)
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("30-day review questions", styles["H2Custom"]))
    review_questions = [
        "What changed in cost, stock availability, service quality, or machine uptime?",
        "Which control is now documented and repeatable without relying on one person?",
        "What is the next single improvement that will create the greatest operational value?",
    ]
    story.append(
        Table(
            [[ScoreCircle(i + 1), Paragraph(q, styles["ChecklistText"]), ""] for i, q in enumerate(review_questions)],
            colWidths=[12 * mm, 100 * mm, 48 * mm],
            rowHeights=[19 * mm] * 3,
            style=TableStyle([("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE")]),
        )
    )
    story.append(PageBreak())

    story.append(Spacer(1, 17 * mm))
    cta_box = Table(
        [[
            [
                Paragraph("Want help turning your audit into a supply plan?", styles["CTAHeading"]),
                Paragraph("Book a free one-to-one Supplier Consolidation Check with Ashutosh Trade. We will review your categories, current supplier mix, critical stock risks, and machinery needs - then show where consolidation could save time and reduce operational friction.", styles["CTABody"]),
                Spacer(1, 4 * mm),
                Paragraph("<b>Visit:</b> www.ashutoshtrade.com.np", styles["CTABody"]),
                Paragraph("<b>WhatsApp:</b> +977 971-555-6165", styles["CTABody"]),
            ]
        ]],
        colWidths=[154 * mm],
        rowHeights=[119 * mm],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), DEEP_GREEN),
                ("BOX", (0, 0), (-1, -1), 0, DEEP_GREEN),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 13 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 13 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 12 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12 * mm),
            ]
        ),
    )
    story.append(cta_box)
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("About Ashutosh Trade", styles["H2Custom"]))
    story.append(
        Paragraph(
            "Ashutosh Trade supplies housekeeping consumables, facility products, and cleaning machinery for hospitals, schools, hotels, commercial buildings, and offices. Our aim is to make sourcing simpler, comparisons clearer, and supply support more accountable.",
            styles["BodyCustom"],
        )
    )
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("Important note", styles["H2Custom"]))
    story.append(
        Paragraph(
            "This toolkit supports operational planning only. It does not replace facility-specific risk assessments, manufacturer instructions, infection-prevention protocols, occupational safety requirements, or applicable laws and standards.",
            styles["SmallCustom"],
        )
    )

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
