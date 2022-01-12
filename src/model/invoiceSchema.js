const mongoose = require("mongoose");
const { isEmail } = require("validator");

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  invoices: [
    {
      consignorName: {
        type: String,
        lowercase: true,
        required: [true, "Please enter consignor name"],
      },

      consignorEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"],
        required: [true, "Please enter consignor email"],
      },

      consignorAddress: { type: String, lowercase: true },
      consignorPhoneNumber: {
        type: Number,
        trim: true,
        required: [true, "Please enter consignor phone number"],
      },

      consigneeName: {
        type: String,
        lowercase: true,
        required: [true, "Please enter consignee name"],
      },

      consigneeEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"],
        required: [true, "Please enter consignee email"],
      },

      consigneeAddress: { type: String, lowercase: true },
      consigneePhoneNumber: {
        type: Number,
        trim: true,
        required: [true, "Please enter consignee phone number"],
      },

      invoiceNumber: {
        type: Number,
        trim: true,
        unique: [true, "Invoice number already exits"],
        required: [true, "Please enter invoice number"],
      },

      invoiceDueDate: {
        type: Date,
        min: Date.now(),
        required: [true, "Please select a valid date"],
      },

      dateCreated: { type: Date, default: Date.now() },

      products: [
        {
          description: {
            type: String,
            lowercase: true,
            required: [
              true,
              "Please enter description of the product/services",
            ],
          },

          rate: {
            type: Number,
            trim: true,
            required: [true, "Please enter per product/service rate"],
          },

          qty: {
            type: Number,
            trim: true,
            required: [true, "Please enter quantity"],
          },

          amount: {
            type: Number,
            trim: true,
          },

          taxPct: {
            type: Number,
            trim: true,
          },
        },
      ],

      totalAmount: { type: Number, trim: true },

      totalTax: { type: Number, trim: true },

      totalPayable: { type: Number, trim: true },

      invoiceNotes: {
        type: String,
        lowercase: true,
      },
    },
  ],
});

const InvoiceCollection = mongoose.model("invoices", invoiceSchema);

module.exports = InvoiceCollection;
