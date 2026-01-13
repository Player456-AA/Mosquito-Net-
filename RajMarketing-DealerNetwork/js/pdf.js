/* ----------------------------------------------------------
   Raj Marketing – PDF Certificate Generator
   File: js/pdf.js
-----------------------------------------------------------*/

export async function generateCertificate(dealer) {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "px", format: "a4" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Raj Marketing – Authorized Dealer Certificate", 30, 50);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");

    doc.text(`Dealer Name: ${dealer.businessName}`, 30, 100);
    doc.text(`Owner: ${dealer.ownerName}`, 30, 130);
    doc.text(`City: ${dealer.city}`, 30, 160);
    doc.text(`Verification Level: ${dealer.badge.toUpperCase()}`, 30, 190);

    doc.text(`Issued On: ${new Date().toLocaleString()}`, 30, 230);
    doc.text(`IP Address: ${dealer.ip || "N/A"}`, 30, 260);

    // Badge icon
    const badgePath = `/images/badges/${dealer.badge}.png`;
    const badge = await fetch(badgePath)
        .then(r => r.blob())
        .then(blob => URL.createObjectURL(blob));

    doc.addImage(badge, "PNG", 350, 90, 120, 120);

    // Signature
    if (dealer.signatureData) {
        doc.text("Authorized Signature:", 30, 320);
        doc.addImage(dealer.signatureData, "PNG", 30, 330, 220, 100);
    }

    doc.save(`Dealer-Certificate-${dealer.id}.pdf`);
}
