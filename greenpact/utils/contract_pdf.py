from io import BytesIO
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from user.models import FarmerProfile, ContractorProfile
from contract.models import Contract

def generate_contract_pdf_bytes(contract: Contract) -> bytes:
    """
    Generate a PDF agreement for the given contract and
    return the PDF as raw bytes.
    """

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 50 

    def write_line(text: str, font_size=11, gap=14, bold=False):
        nonlocal y
        if y < 60: 
            p.showPage()
            y = height - 50
        font_name = "Helvetica-Bold" if bold else "Helvetica"
        p.setFont(font_name, font_size)
        p.drawString(50, y, text)
        y -= gap

    # ---------- 1. Header ----------
    write_line("Greenpact Crop Supply Agreement", font_size=16, gap=20, bold=True)
    write_line(f"Contract ID: {contract.contract_id}", font_size=11)
    write_line(f"Date of Agreement: {contract.created_at.date()}", font_size=11)
    y -= 10

    farmer_profile = FarmerProfile.objects.filter(user=contract.farmer).first()
    contractor_profile = ContractorProfile.objects.filter(user=contract.buyer).first()

    farmer_name = farmer_profile.name if farmer_profile else contract.farmer.username
    farmer_address = getattr(farmer_profile, "address", "") if farmer_profile else ""
    farmer_phone = getattr(farmer_profile, "phoneno", "") if farmer_profile else ""

    buyer_name = contractor_profile.name if contractor_profile else contract.buyer.username
    buyer_address = getattr(contractor_profile, "address", "") if contractor_profile else ""
    buyer_phone = getattr(contractor_profile, "phoneno", "") if contractor_profile else ""

    # ---------- 2. Parties ----------
    write_line("1. Parties Involved", bold=True, gap=18)

    write_line("Farmer Details:", bold=True)
    write_line(f"  Name   : {farmer_name}")
    write_line(f"  Address: {farmer_address}")
    write_line(f"  Phone  : {farmer_phone}")
    y -= 6

    write_line("Buyer / Contractor Details:", bold=True)
    write_line(f"  Name   : {buyer_name}")
    write_line(f"  Address: {buyer_address}")
    write_line(f"  Phone  : {buyer_phone}")
    y -= 10

    # ---------- 3. Crop & Order Details ----------
    write_line("2. Crop & Order Details", bold=True, gap=18)
    write_line(f"Crop Name      : {contract.crop.crop_name}")
    write_line(f"Quantity       : {contract.quantity}")
    write_line(f"Price per Unit : {contract.nego_price}")
    total_amount = contract.quantity * contract.nego_price
    write_line(f"Total Amount   : {total_amount}")
    write_line(f"Delivery Date  : {contract.delivery_date}")
    write_line(f"Delivery Address: {contract.delivery_address}")
    y -= 10

    # ---------- 4. Agreement Terms ----------
    write_line("3. Agreement Terms", bold=True, gap=18)
    if contract.terms:
        for i, term in enumerate(contract.terms, start=1):
            write_line(f"{i}. {term}")
    else:
        write_line("No additional terms specified.")
    y -= 10

    # ---------- 5. Payment Terms ----------
    write_line("4. Payment Terms", bold=True, gap=18)
    write_line(f"Total payable amount is {total_amount}.")
    write_line("Payment shall be completed as per the mutually agreed schedule.")
    write_line("Any delay in payment may attract penalties as per mutual agreement.")
    y -= 10

    # ---------- 6. Responsibilities ----------
    write_line("5. Responsibilities of Both Parties", bold=True, gap=18)

    write_line("Farmer Responsibilities:", bold=True)
    write_line("- Deliver the agreed crop in specified quantity and quality.")
    write_line("- Inform buyer in case of any expected delay or issue.")
    y -= 6

    write_line("Buyer Responsibilities:", bold=True)
    write_line("- Pay the agreed amount as per the payment terms.")
    write_line("- Accept delivery at the agreed time and place.")
    y -= 10

    # ---------- 7. Liability & Dispute Resolution ----------
    write_line("6. Liability & Dispute Resolution", bold=True, gap=18)
    write_line("In case of disputes, both parties agree to resolve the matter amicably.")
    write_line(
        "If unresolved, the issue will be handled under the jurisdiction of the "
    )
    write_line("local district court where the farmer resides.")
    y -= 10

    # ---------- 8. Termination Clause ----------
    write_line("7. Termination Clause", bold=True, gap=18)
    write_line(
        "Either party may terminate the contract with prior written notice, "
    )
    write_line("subject to settlement of any outstanding obligations.")
    write_line(
        "The contract automatically terminates after full delivery and payment."
    )
    y -= 10

    # ---------- 9. Signatures ----------
    write_line("8. Signatures", bold=True, gap=18)
    write_line("Farmer:", bold=True)
    write_line(f"  Name: {farmer_name}")
    write_line("  Signature: ____________________________")
    write_line(f"  Date: {contract.created_at.date()}")
    y -= 10

    write_line("Buyer / Contractor:", bold=True)
    write_line(f"  Name: {buyer_name}")
    write_line("  Signature: ____________________________")
    write_line(f"  Date: {contract.created_at.date()}")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer.getvalue()


def attach_contract_pdf(contract: Contract) -> None:
    """
    Generate the PDF and save it into contract.pdf_document.
    """
    pdf_bytes = generate_contract_pdf_bytes(contract)
    filename = f"contract_{contract.contract_id}.pdf"
    contract.pdf_document.save(filename, ContentFile(pdf_bytes), save=True)
