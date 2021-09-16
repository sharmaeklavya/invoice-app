import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function GeneratePdf(props) {
  const pdfGenerator = () => {
    const targetInvoice = props.target;
    const invoiceData = props.data.filter((data, i) => i === targetInvoice);

    let items = [];
    for (let i in invoiceData[0].products) {
      const row = [];
      row.push(invoiceData[0].products[i].description);
      row.push(invoiceData[0].products[i].rate);
      row.push(invoiceData[0].products[i].qty);
      row.push(invoiceData[0].products[i].amount);
      row.push(invoiceData[0].products[i].taxPct);
      items.push(row);
    }

    invoiceData.forEach((inv, index) => {
      const docDefinition = {
        content: [
          {
            alignment: "center",
            text: `Invoice No # ${inv.invoiceNumber}`,
            fontSize: 16,
            bold: true,
          },
          "\n\n",
          {
            columns: [
              { text: "Seller Information ", bold: true, fontSize: 14 },
              { text: "Buyer Information ", bold: true, fontSize: 14 },
            ],
          },
          "\n\n",
          {
            columns: [
              { text: "Name :", width: 100 },
              { text: inv.consignorName, bold: true, width: 100 },
              { text: "", width: 20 },
              { text: "", width: 20 },

              { text: "Name :", width: 100 },
              { text: inv.consigneeName, bold: true, width: 100 },
            ],
          },
          "\n",
          {
            columns: [
              { text: "Email :", width: 100 },
              { text: inv.consignorEmail, bold: true, width: 100 },
              { text: "", width: 20 },
              { text: "", width: 20 },

              { text: "Email :", width: 100 },
              { text: inv.consigneeEmail, bold: true, width: 100 },
            ],
          },
          "\n",
          {
            columns: [
              { text: "Address :", width: 100 },
              { text: inv.consignorAddress, bold: true, width: 100 },
              { text: "", width: 20 },
              { text: "", width: 20 },

              { text: "Address :", width: 100 },
              { text: inv.consigneeAddress, bold: true, width: 100 },
            ],
          },
          "\n",
          {
            columns: [
              { text: "Phone :", width: 100 },
              { text: inv.consignorPhoneNumber, bold: true, width: 100 },
              { text: "", width: 20 },
              { text: "", width: 20 },

              { text: "Phone :", width: 100 },
              { text: inv.consigneePhoneNumber, bold: true, width: 100 },
            ],
          },
          "\n",
          {
            columns: [
              { text: "Invoice Number :", width: 100 },
              { text: inv.invoiceNumber, bold: true, width: 100 },
            ],
          },
          "\n",
          {
            columns: [
              { text: "Payment due date :", width: 100 },
              {
                text: inv.invoiceDueDate.split("T")[0],
                bold: true,
                width: 100,
              },
            ],
          },
          {
            alignment: "center",
            text: "Product/Services rendered",
            bold: true,
            margin: [0, 25, 0, 0],
            fontSize: 13,
          },
          "\n",
          {
            columns: [
              { text: "Description", width: 100, bold: true },
              { text: "Price (per unit)", width: 100, bold: true },
              { text: "Quantity", width: 100, bold: true },
              { text: "Total Amount", width: 100, bold: true },
              { text: "Tax (in %)", width: 100, bold: true },
            ],
          },
          "\n",
          {
            table: {
              widths: [90, 90, 90, 90, 70],
              alignment: "center",
              body: [...items],
            },
          },
          "\n\n\n",
          {
            columns: [
              { text: "", width: 100 },
              { text: "", width: 100 },
              { text: "", width: 100 },

              { text: "before tax", bold: true, width: 100 },
              { text: inv.totalAmount, width: 100 },
            ],
          },
          "\n",
          {
            columns: [
              { text: "", width: 100 },
              { text: "", width: 100 },
              { text: "", width: 100 },

              { text: "Total tax", bold: true, width: 100 },
              { text: inv.totalTax, width: 100 },
            ],
          },
          "\n",
          {
            columns: [
              { text: "", width: 100 },
              { text: "", width: 100 },
              { text: "", width: 100 },

              { text: "Grand Total", bold: true, width: 100 },
              { text: inv.totalPayable, width: 100 },
            ],
          },
          "\n",
          {
            columns: [
              { text: "", width: 100 },
              { text: "", width: 100 },
              { text: "", width: 100 },

              { text: "Balance due", bold: true, width: 100 },
              { text: inv.totalPayable, width: 100 },
            ],
          },
          "\n\n",
          {
            text: "Notes:",
            bold: true,
          },
          inv.invoiceNotes,
          "\n\n",
          {
            alignment: "center",
            columns: [
              {
                text: "This is a computer generated invoice hence no signature required",
                bold: true,
              },
            ],
          },
        ],
      };
      pdfMake.createPdf(docDefinition).download();
    });
  };

  return (
    <small className="pdf__btn" onClick={pdfGenerator}>
      PDF
    </small>
  );
}

export default GeneratePdf;
