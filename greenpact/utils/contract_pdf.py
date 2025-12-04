from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from django.core.files.base import ContentFile

# Import your models (keeping your existing imports)
from user.models import FarmerProfile, ContractorProfile
from contract.models import Contract

def generate_contract_pdf_bytes(contract: Contract) -> bytes:
    """
    Generate a professional PDF agreement for the given contract using 
    ReportLab Platypus for advanced formatting.
    """
    buffer = BytesIO()
    
    # Setup the document with margins
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
        title=f"Contract_{contract.contract_id}"
    )

    # --- Styles ---
    styles = getSampleStyleSheet()
    
    # Custom Brand Color (Greenpact Green)
    brand_color = colors.HexColor("#2E7D32") 
    
    # Title Style
    style_title = ParagraphStyle(
        'GreenpactTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=brand_color,
        alignment=TA_CENTER,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    )
    
    # Section Header Style
    style_section_head = ParagraphStyle(
        'SectionHead',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.white,
        backColor=brand_color,
        borderPadding=(5, 2, 5, 2), # top, right, bottom, left
        spaceAfter=10,
        spaceBefore=15,
        fontName='Helvetica-Bold'
    )
    
    # Normal Text Style
    style_normal = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        leading=14, # Line spacing
        spaceAfter=6
    )

    # Label-Value Style (for specific data points)
    style_label = ParagraphStyle(
        'Label',
        parent=styles['Normal'],
        fontSize=10,
        fontName='Helvetica-Bold',
        textColor=colors.darkgrey
    )

    # --- Data Fetching Logic (Preserved from your code) ---
    farmer_profile = FarmerProfile.objects.filter(user=contract.farmer).first()
    contractor_profile = ContractorProfile.objects.filter(user=contract.buyer).first()

    farmer_name = farmer_profile.name if farmer_profile else contract.farmer.username
    farmer_address = getattr(farmer_profile, "address", "N/A") if farmer_profile else "N/A"
    farmer_phone = getattr(farmer_profile, "phoneno", "N/A") if farmer_profile else "N/A"

    buyer_name = contractor_profile.name if contractor_profile else contract.buyer.username
    buyer_address = getattr(contractor_profile, "address", "N/A") if contractor_profile else "N/A"
    buyer_phone = getattr(contractor_profile, "phoneno", "N/A") if contractor_profile else "N/A"

    # --- Building the Story (Content) ---
    story = []

    # 1. Header
    story.append(Paragraph("GREENPACT CROP SUPPLY AGREEMENT", style_title))
    
    # Contract Meta Info (Right aligned table)
    meta_data = [
        [Paragraph(f"<b>Contract ID:</b> {contract.contract_id}", style_normal)],
        [Paragraph(f"<b>Date:</b> {contract.created_at.date()}", style_normal)]
    ]
    meta_table = Table(meta_data, colWidths=[doc.width], hAlign='RIGHT')
    story.append(meta_table)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey))
    story.append(Spacer(1, 15))

    # 2. Parties Involved (Side-by-Side Table)
    story.append(Paragraph("1. PARTIES INVOLVED", style_section_head))
    
    # Create content for Farmer and Buyer cells
    farmer_info = [
        [Paragraph("FARMER / SELLER", style_label)],
        [Paragraph(f"<b>{farmer_name}</b>", style_normal)],
        [Paragraph(f"{farmer_address}", style_normal)],
        [Paragraph(f"Tel: {farmer_phone}", style_normal)],
    ]
    
    buyer_info = [
        [Paragraph("BUYER / CONTRACTOR", style_label)],
        [Paragraph(f"<b>{buyer_name}</b>", style_normal)],
        [Paragraph(f"{buyer_address}", style_normal)],
        [Paragraph(f"Tel: {buyer_phone}", style_normal)],
    ]

    # Nested tables for clean layout inside the main row
    t_farmer = Table(farmer_info, colWidths=[3.2*inch])
    t_buyer = Table(buyer_info, colWidths=[3.2*inch])

    parties_data = [[t_farmer, t_buyer]]
    parties_table = Table(parties_data, colWidths=[3.5*inch, 3.5*inch])
    parties_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LINEAFTER', (0,0), (0,0), 1, colors.lightgrey), # Vertical separator
    ]))
    story.append(parties_table)

    # 3. Crop & Order Details (Grid Table)
    story.append(Paragraph("2. CROP & ORDER DETAILS", style_section_head))
    
    total_amount = contract.quantity * contract.nego_price
    
    order_data = [
        ["Crop Name", contract.crop.crop_name, "Delivery Date", str(contract.delivery_date)],
        ["Quantity", f"{contract.quantity}", "Price per Unit", f"{contract.nego_price}"],
        ["Total Amount", f"{total_amount}", "Delivery Address", Paragraph(str(contract.delivery_address), style_normal)]
    ]

    order_table = Table(order_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 2*inch])
    order_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.whitesmoke), # Header-like row
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'), # First col bold
        ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'), # Third col bold
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(order_table)

    # 4. Agreement Terms
    story.append(Paragraph("3. AGREEMENT TERMS", style_section_head))
    
    if contract.terms:
        for i, term in enumerate(contract.terms, start=1):
            story.append(Paragraph(f"{i}. {term}", style_normal))
    else:
        story.append(Paragraph("No specific additional terms were recorded for this contract.", style_normal))

    # 5. Payment & Responsibilities (Compact Section)
    story.append(Paragraph("4. PAYMENT & RESPONSIBILITIES", style_section_head))
    
    p_text = f"""
    <b>Payment Terms:</b> The total payable amount is <b>{total_amount}</b>. 
    Payment shall be completed as per the mutually agreed schedule. Any delay may attract penalties.
    <br/><br/>
    <b>Farmer Responsibilities:</b> Deliver the agreed crop in specified quantity and quality; inform buyer of any delays.
    <br/><br/>
    <b>Buyer Responsibilities:</b> Accept delivery at the agreed time/place and complete payments on time.
    """
    story.append(Paragraph(p_text, style_normal))

    # 6. Liability & Dispute Resolution
    story.append(Paragraph("5. LEGAL & TERMINATION", style_section_head))
    legal_text = """
    In case of disputes, parties agree to amicable resolution. If unresolved, jurisdiction lies with the 
    local district court of the farmer. Either party may terminate with prior written notice, subject to 
    settlement of outstanding obligations.
    """
    story.append(Paragraph(legal_text, style_normal))

    story.append(Spacer(1, 30))

    # 7. Signatures
    story.append(HRFlowable(width="100%", thickness=1, color=colors.black))
    story.append(Spacer(1, 10))
    
    sig_data = [
        [Paragraph("<b>FARMER SIGNATURE</b>", style_normal), Paragraph("<b>BUYER SIGNATURE</b>", style_normal)],
        [Spacer(1, 40), Spacer(1, 40)], # Space for signing
        [Paragraph(f"{farmer_name}", style_normal), Paragraph(f"{buyer_name}", style_normal)],
        [Paragraph(f"Date: _________________", style_normal), Paragraph(f"Date: _________________", style_normal)]
    ]
    
    sig_table = Table(sig_data, colWidths=[3.5*inch, 3.5*inch])
    sig_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(sig_table)
    
    # Footer Text
    story.append(Spacer(1, 30))
    footer = Paragraph(
        "This is a computer-generated document. Greenpact facilitates the connection but is not a party to the direct trade.",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER)
    )
    story.append(footer)

    # Build the PDF
    doc.build(story)
    
    buffer.seek(0)
    return buffer.getvalue()