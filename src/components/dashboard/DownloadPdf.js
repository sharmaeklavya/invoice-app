import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function GeneratePdf(props) {
  const pdfGenerator = () => {
    const invoiceData = props.data;
    const targetInvoice = props.target;
    const resultedData = invoiceData.filter((data, i) => i === targetInvoice);

    resultedData.forEach((inv) => {
      const docDefinition = {
        content: [
          {
            alignment: "center",
            text: `Invoice No ${inv.invoiceNumber}`,
            fontSize: 22,
            bold: true,
          },
          "\n\n\n",
          {
            columns: [
              { text: "Seller Information ", bold: true, fontSize: 16 },
              { text: "Buyer Information ", bold: true, fontSize: 16 },
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
          "\n\n",
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
          "\n\n",
          {
            columns: [
              { text: "Description", width: 100, bold: true },
              { text: "Price (per)", width: 100, bold: true },
              { text: "Quantity", width: 100, bold: true },
              { text: "Total Amount", width: 100, bold: true },
              { text: "Tax (%)", width: 100, bold: true },
            ],
          },
          "\n",
          {
            columns: [
              inv.products.map((item) => {
                return (
                  { text: item.description, width: 100 },
                  { text: item.rate, width: 100 },
                  { text: item.qty, width: 100 },
                  { text: item.amount, width: 100 },
                  { text: item.taxPct, width: 100 }
                );
              }),
            ],
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
          "\n",
          inv.invoiceNotes,
          "\n\n\n",
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
