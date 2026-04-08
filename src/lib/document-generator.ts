export function generateDocumentContent(
  type: string,
  data: {
    startupName: string;
    projectDetails: string;
    partiesInvolved: string;
    date: string;
    amount?: string;
  }
): string {
  const templates: Record<string, string> = {
    mou: `MEMORANDUM OF UNDERSTANDING

This Memorandum of Understanding ("MoU") is entered into on ${data.date} by and between:

Party 1: ${data.startupName}
Party 2: ${data.partiesInvolved}

1. PURPOSE
This MoU sets forth the terms and understanding between the parties regarding the following project:

${data.projectDetails}

2. SCOPE OF WORK
Both parties agree to collaborate on the above-mentioned project and contribute their respective expertise and resources as mutually agreed upon.

3. RESPONSIBILITIES
- ${data.startupName} shall be responsible for project execution, deliverables, and timely communication.
- ${data.partiesInvolved} shall provide mentorship, resources, and strategic guidance as needed.

4. DURATION
This MoU shall be effective from the date of signing and shall remain in effect for a period of 12 months unless terminated by either party with 30 days written notice.

5. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of all proprietary information shared during the course of this collaboration.

6. FINANCIAL TERMS
${data.amount ? `The agreed financial consideration for this engagement is ₹${data.amount}.` : "Financial terms to be determined and agreed upon separately."}

7. GENERAL PROVISIONS
This MoU is not legally binding and serves as a statement of intent between the parties. Either party may withdraw with written notice.

IN WITNESS WHEREOF, the parties have executed this Memorandum of Understanding.

_________________________          _________________________
${data.startupName}                ${data.partiesInvolved}
Date: ${data.date}                 Date: ${data.date}`,

    invoice: `INVOICE

Invoice Number: INV-${Date.now().toString().slice(-6)}
Date: ${data.date}

FROM:
${data.startupName}

TO:
${data.partiesInvolved}

DESCRIPTION OF SERVICES:
${data.projectDetails}

ITEMS:
─────────────────────────────────────────────
Description                          Amount
─────────────────────────────────────────────
Project Services                     ₹${data.amount || "0.00"}
─────────────────────────────────────────────
SUBTOTAL                             ₹${data.amount || "0.00"}
GST (18%)                            ₹${data.amount ? (parseFloat(data.amount) * 0.18).toFixed(2) : "0.00"}
─────────────────────────────────────────────
TOTAL                                ₹${data.amount ? (parseFloat(data.amount) * 1.18).toFixed(2) : "0.00"}
─────────────────────────────────────────────

PAYMENT TERMS:
Payment is due within 30 days of invoice date.

Bank Details:
Account Name: ${data.startupName}
Bank: [Bank Name]
Account No: [Account Number]
IFSC: [IFSC Code]`,

    "work-order": `WORK ORDER

Work Order No: WO-${Date.now().toString().slice(-6)}
Date: ${data.date}

ISSUED BY: ${data.partiesInvolved}
ISSUED TO: ${data.startupName}

1. SCOPE OF WORK
${data.projectDetails}

2. DELIVERABLES
The following deliverables are expected as part of this work order:
- Project documentation and reports
- Working prototype/solution
- Final presentation and handover

3. TIMELINE
Start Date: ${data.date}
Expected Completion: [To be determined]

4. COMPENSATION
${data.amount ? `Total compensation for this work order: ₹${data.amount}` : "Compensation to be mutually agreed upon."}

5. TERMS AND CONDITIONS
- All work must meet the quality standards specified by the issuer
- Progress reports must be submitted bi-weekly
- Any changes to scope must be approved in writing

6. ACCEPTANCE
This work order is accepted by both parties as indicated by the signatures below.

_________________________          _________________________
Authorized Signatory               ${data.startupName}
${data.partiesInvolved}
Date: ${data.date}`,

    "purchase-order": `PURCHASE ORDER

PO Number: PO-${Date.now().toString().slice(-6)}
Date: ${data.date}

BUYER: ${data.partiesInvolved}
VENDOR: ${data.startupName}

1. ORDER DETAILS
${data.projectDetails}

2. ITEMS ORDERED
─────────────────────────────────────────────
Item                     Qty    Unit Price
─────────────────────────────────────────────
Project Deliverable      1      ₹${data.amount || "0.00"}
─────────────────────────────────────────────
TOTAL                           ₹${data.amount || "0.00"}
─────────────────────────────────────────────

3. DELIVERY TERMS
- Delivery Date: [To be confirmed]
- Delivery Location: [Address]

4. PAYMENT TERMS
- Payment within 30 days of delivery
- Mode of payment: Bank Transfer

5. TERMS AND CONDITIONS
- All items must meet specified quality standards
- Vendor must provide warranty as applicable
- This PO is subject to the buyer's standard terms

_________________________
Authorized Buyer
${data.partiesInvolved}
Date: ${data.date}`,
  };

  return templates[type] || templates.mou;
}
