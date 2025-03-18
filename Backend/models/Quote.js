const mongoose = require("mongoose");

const quoteInvoiceSchema = new mongoose.Schema(
  {
    // Document Type (Quote/Invoice)
    type: {
      type: String,
      required: true,
      enum: ["quote", "invoice"],
      default: "quote",
    },

    // Client Information
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientAddress: {
      street: String,
      city: String,
      zipCode: String,
    },

    // Architect Information
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Project Details
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    projectTitle: {
      type: String,
      required: true,
    },
    projectDescription: String,

    // Quote/Invoice Items
    items: [
      {
        description: {
          type: String,
          required: true,
        },
        quantity: Number,
        unitPrice: Number,
        total: Number,
        category: {
          type: String,
          enum: ["design", "materials", "labor", "furniture", "other"],
        },
      },
    ],

    // Pricing Details
    subtotal: {
      type: Number,
      min: 0,
      required: true,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    taxAmount: Number,
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    // Dates & Validity
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expirationDate: Date, // For quotes
    dueDate: Date, // For invoices

    // Payment Information
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid", "overdue"],
      default: "unpaid",
    },
    payments: [
      {
        amount: Number,
        date: Date,
        method: {
          type: String,
          enum: ["credit_card", "bank_transfer", "check", "cash"],
        },
      },
    ],

    // Document Status
    status: {
      type: String,
      enum: ["draft", "sent", "accepted", "rejected", "revised", "archived"],
      default: "draft",
    },

    // Additional Information
    termsConditions: String,
    notes: String,
    attachments: [String], // URLs to attached files
    revisionHistory: [
      {
        date: Date,
        changes: String,
        revisedBy: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

// Add text index for search
quoteInvoiceSchema.index({
  projectTitle: "text",
  clientName: "text",
  "items.description": "text",
});

module.exports = mongoose.model("Quote", quoteInvoiceSchema);
