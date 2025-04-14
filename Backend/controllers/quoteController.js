const Quote = require("../models/Quote");
const { NotFoundError, BadRequestError } = require("../utils/customErrors");
const { StatusCodes } = require("http-status-codes");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// ============== QUOTE FUNCTIONS ==============

// Create a new quote
const createQuote = async (req, res) => {
  try {
    const { client, project, items, taxRate, discount } = req.body;

    // Calculate financials
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount - discount;

    // Add calculated item totals
    const itemsWithTotals = items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const newQuote = await Quote.create({
      ...req.body,
      type: "quote", // Explicitly set type as quote
      items: itemsWithTotals,
      subtotal,
      taxAmount,
      totalAmount,
      architect: req.user.userId,
      status: "draft",
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: newQuote,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all quotes
const getAllQuotes = async (req, res) => {
  try {
    const { status, client } = req.query;
    const filter = {
      architect: req.user.userId,
      type: "quote",
    };

    if (status) filter.status = status;
    if (client) filter.client = client;

    const quotes = await Quote.find(filter)
      .populate("client", "name email")
      .populate("project", "title")
      .sort("-issueDate");

    res.status(StatusCodes.OK).json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single quote
const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      architect: req.user.userId,
      type: "quote",
    }).populate("client project");

    if (!quote) {
      throw new NotFoundError("Quote not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      error: error.message,
    });
  }
};

// Update quote
const updateQuote = async (req, res) => {
  try {
    const { items, taxRate, discount } = req.body;

    let updateData = req.body;

    if (items || taxRate !== undefined || discount !== undefined) {
      const existingQuote = await Quote.findById(req.params.id);

      if (!existingQuote || existingQuote.type !== "quote") {
        throw new NotFoundError("Quote not found");
      }

      const newItems = items || existingQuote.items;
      const newTaxRate =
        taxRate !== undefined ? taxRate : existingQuote.taxRate;
      const newDiscount =
        discount !== undefined ? discount : existingQuote.discount;

      const subtotal = newItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      const taxAmount = subtotal * (newTaxRate / 100);
      const totalAmount = subtotal + taxAmount - newDiscount;

      // Add calculated totals to each item
      const itemsWithTotals = newItems.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }));

      updateData = {
        ...req.body,
        items: itemsWithTotals,
        subtotal,
        taxAmount,
        totalAmount,
      };
    }

    const updatedQuote = await Quote.findOneAndUpdate(
      {
        _id: req.params.id,
        architect: req.user.userId,
        type: "quote", // Ensure it's a quote
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedQuote) {
      throw new NotFoundError("Quote not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedQuote,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete quote
const deleteQuote = async (req, res) => {
  try {
    const deletedQuote = await Quote.findOneAndDelete({
      _id: req.params.id,
      architect: req.user.userId,
      type: "quote", // Ensure it's a quote
    });

    if (!deletedQuote) {
      throw new NotFoundError("Quote not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Quote deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Convert quote to invoice
const convertToInvoice = async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      architect: req.user.userId,
      type: "quote", // Ensure it's a quote
    });

    if (!quote) {
      throw new NotFoundError("Quote not found");
    }

    // Set due date (default 30 days if not provided)
    const dueDate =
      req.body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const invoice = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        type: "invoice",
        dueDate,
        paymentStatus: "unpaid",
        status: "sent",
        // Record this conversion in revision history
        $push: {
          revisionHistory: {
            date: new Date(),
            changes: "Converted from quote to invoice",
            revisedBy: req.user.userId,
          },
        },
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message,
    });
  }
};

// ============== INVOICE FUNCTIONS ==============

// Create a new invoice directly
const createInvoice = async (req, res) => {
  try {
    const { client, project, items, taxRate, discount, dueDate } = req.body;

    // Calculate financials
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount - discount;

    // Add calculated item totals
    const itemsWithTotals = items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    // Default due date is 30 days from now if not provided
    const invoiceDueDate =
      dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const newInvoice = await Quote.create({
      ...req.body,
      type: "invoice", // Explicitly set type as invoice
      items: itemsWithTotals,
      subtotal,
      taxAmount,
      totalAmount,
      architect: req.user.userId,
      status: "sent",
      dueDate: invoiceDueDate,
      paymentStatus: "unpaid",
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: newInvoice,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const { status, client, paymentStatus } = req.query;
    const filter = {
      architect: req.user.userId,
      type: "invoice", // Only get invoices
    };

    if (status) filter.status = status;
    if (client) filter.client = client;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const invoices = await Quote.find(filter)
      .populate("client", "name email")
      .populate("project", "title")
      .sort("-issueDate");

    res.status(StatusCodes.OK).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single invoice
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Quote.findOne({
      _id: req.params.id,
      architect: req.user.userId,
      type: "invoice", // Ensure it's an invoice
    }).populate("client project");

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      error: error.message,
    });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const { items, taxRate, discount, paymentStatus } = req.body;

    // Recalculate financials if items/tax/discount change
    let updateData = req.body;

    if (items || taxRate !== undefined || discount !== undefined) {
      const existingInvoice = await Quote.findById(req.params.id);

      if (!existingInvoice || existingInvoice.type !== "invoice") {
        throw new NotFoundError("Invoice not found");
      }

      const newItems = items || existingInvoice.items;
      const newTaxRate =
        taxRate !== undefined ? taxRate : existingInvoice.taxRate;
      const newDiscount =
        discount !== undefined ? discount : existingInvoice.discount;

      // Calculate new subtotal and item totals
      const subtotal = newItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      const taxAmount = subtotal * (newTaxRate / 100);
      const totalAmount = subtotal + taxAmount - newDiscount;

      // Add calculated totals to each item
      const itemsWithTotals = newItems.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }));

      updateData = {
        ...req.body,
        items: itemsWithTotals,
        subtotal,
        taxAmount,
        totalAmount,
      };
    }

    // Add revision history if applicable
    if (Object.keys(updateData).length > 0) {
      updateData.$push = {
        revisionHistory: {
          date: new Date(),
          changes: "Invoice updated",
          revisedBy: req.user.userId,
        },
      };
    }

    const updatedInvoice = await Quote.findOneAndUpdate(
      {
        _id: req.params.id,
        architect: req.user.userId,
        type: "invoice", // Ensure it's an invoice
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      throw new NotFoundError("Invoice not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedInvoice,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Quote.findOneAndDelete({
      _id: req.params.id,
      architect: req.user.userId,
      type: "invoice", // Ensure it's an invoice
    });

    if (!deletedInvoice) {
      throw new NotFoundError("Invoice not found");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Invoice deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};

// Record payment for an invoice
const recordPayment = async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || amount <= 0) {
      throw new BadRequestError("Valid payment amount is required");
    }

    const invoice = await Quote.findOne({
      _id: req.params.id,
      architect: req.user.userId,
      type: "invoice",
    });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    // Add the new payment
    const payment = {
      amount,
      method: method || "bank_transfer",
      date: new Date(),
    };

    // Calculate total paid amount including the new payment
    const totalPaid =
      invoice.payments.reduce((sum, payment) => sum + payment.amount, 0) +
      amount;

    // Determine new payment status
    let paymentStatus;
    if (totalPaid >= invoice.totalAmount) {
      paymentStatus = "paid";
    } else if (totalPaid > 0) {
      paymentStatus = "partial";
    } else {
      paymentStatus = "unpaid";
    }

    const updatedInvoice = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        $push: { payments: payment },
        paymentStatus,
        status: paymentStatus === "paid" ? "accepted" : invoice.status,
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedInvoice,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message,
    });
  }
};

// ============== SHARED FUNCTIONS ==============

// Generate PDF for quote or invoice
const generatePDF = async (req, res) => {
  try {
    const document = await Quote.findById(req.params.id)
      .populate("client", "name email address")
      .populate("architect", "companyName phone")
      .populate("project", "title");

    if (!document) {
      throw new NotFoundError("Document not found");
    }

    // Create PDF document
    const doc = new PDFDocument();
    const buffers = [];

    // Collect PDF chunks
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Save to filesystem (or cloud storage)
      const folderPath =
        document.type === "invoice" ? "./storage/invoices" : "./storage/quotes";

      // Create directory if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const pdfPath = `${folderPath}/${document._id}.pdf`;
      fs.writeFileSync(pdfPath, pdfBuffer);
    });

    // Build PDF content
    // ----------------- Header -----------------
    doc
      .image("./public/logo.png", 50, 45, { width: 50 }) // Add your logo
      .fillColor("#444444")
      .fontSize(20)
      .text(`${document.type.toUpperCase()} #${document._id}`, 110, 57)
      .fontSize(10)
      .text(document.architect.companyName, 200, 50, { align: "right" })
      .text(document.architect.phone, 200, 65, { align: "right" })
      .moveDown();

    // ----------------- Client Info -----------------
    doc
      .fontSize(12)
      .text(`Client: ${document.clientName}`)
      .text(`Project: ${document.projectTitle}`)
      .text(`Date: ${document.issueDate.toLocaleDateString()}`);

    // Add due date for invoices
    if (document.type === "invoice" && document.dueDate) {
      doc.text(`Due Date: ${document.dueDate.toLocaleDateString()}`);
    }

    doc.moveDown();

    // ----------------- Items Table -----------------
    const tableTop = 180;
    let yPosition = tableTop;

    // Table Header
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Description", 50, yPosition)
      .text("Qty", 280, yPosition)
      .text("Price", 350, yPosition)
      .text("Total", 450, yPosition)
      .font("Helvetica");

    // Table Rows
    document.items.forEach((item, index) => {
      yPosition = tableTop + 25 + index * 25;
      doc
        .fontSize(10)
        .text(item.description, 50, yPosition)
        .text(item.quantity.toString(), 280, yPosition)
        .text(`$${item.unitPrice.toFixed(2)}`, 350, yPosition)
        .text(
          `$${(item.quantity * item.unitPrice).toFixed(2)}`,
          450,
          yPosition
        );
    });

    // ----------------- Totals -----------------
    yPosition += 40;
    doc
      .font("Helvetica-Bold")
      .text("Subtotal:", 350, yPosition)
      .text(`$${document.subtotal.toFixed(2)}`, 450, yPosition)
      .text(`Tax (${document.taxRate}%):`, 350, yPosition + 20)
      .text(`$${document.taxAmount.toFixed(2)}`, 450, yPosition + 20)
      .text("Discount:", 350, yPosition + 40)
      .text(`-$${document.discount.toFixed(2)}`, 450, yPosition + 40)
      .text("TOTAL:", 350, yPosition + 60)
      .text(`$${document.totalAmount.toFixed(2)}`, 450, yPosition + 60)
      .font("Helvetica");

    // Add payment info for invoices
    if (
      document.type === "invoice" &&
      document.payments &&
      document.payments.length > 0
    ) {
      const totalPaid = document.payments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );
      const balance = document.totalAmount - totalPaid;

      yPosition += 80;
      doc
        .font("Helvetica-Bold")
        .text("Amount Paid:", 350, yPosition)
        .text(`$${totalPaid.toFixed(2)}`, 450, yPosition)
        .text("Balance Due:", 350, yPosition + 20)
        .text(`$${balance.toFixed(2)}`, 450, yPosition + 20)
        .font("Helvetica");
    }

    // ----------------- Footer -----------------
    doc
      .fontSize(10)
      .text(document.termsConditions || "Payment due within 30 days", 50, 700, {
        width: 500,
        align: "center",
      });

    if (document.notes) {
      doc
        .moveDown()
        .text("Notes:", 50, 730, { underline: true })
        .text(document.notes, 50, 750, {
          width: 500,
        });
    }

    doc.end();

    // Update document with PDF path
    const pdfUrl =
      document.type === "invoice"
        ? `/invoices/${document._id}.pdf`
        : `/quotes/${document._id}.pdf`;

    const updatedDoc = await Quote.findByIdAndUpdate(
      document._id,
      { $addToSet: { attachments: pdfUrl } },
      { new: true }
    );

    // Send PDF as response
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${document.type}_${document._id}.pdf"`,
    });
    res.send(Buffer.concat(buffers));
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to generate PDF",
    });
  }
};

module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  convertToInvoice,

  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  recordPayment,

  // Shared functions
  generatePDF,
};
