const express = require("express");
const router = express.Router();
const {
  // Quote functions
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
  convertToInvoice,

  // Invoice functions
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  recordPayment,

  // Shared functions
  generatePDF,
} = require("../controllers/quoteController");

// Middleware
const { protect } = require("../middlewares/authMiddleware"); // Use protect

// Apply protect middleware to all routes
router.use(protect);

// ==== QUOTE ROUTES ====
// Create a new quote and get all quotes
router
  .route("/quotes")
  .post(createQuote) // Create a new quote
  .get(getAllQuotes); // Get all quotes

// Get, update, delete a specific quote
router
  .route("/quotes/:id")
  .get(getQuoteById) // Get a specific quote
  .patch(updateQuote) // Update a specific quote
  .delete(deleteQuote); // Delete a specific quote

// Convert a quote to an invoice
router.patch("/quotes/:id/convert", convertToInvoice); // Convert quote to invoice

// ==== INVOICE ROUTES ====
// Create a new invoice and get all invoices
router
  .route("/invoices")
  .post(createInvoice) // Create a new invoice
  .get(getAllInvoices); // Get all invoices

// Get, update, delete a specific invoice
router
  .route("/invoices/:id")
  .get(getInvoiceById) // Get a specific invoice
  .patch(updateInvoice) // Update a specific invoice
  .delete(deleteInvoice); // Delete a specific invoice

// Record payment for a specific invoice
router.post("/invoices/:id/payment", recordPayment); // Record payment for invoice

// ==== SHARED ROUTES ====
// Generate PDF for a specific quote
router.get("/quotes/:id/pdf", generatePDF); // Generate PDF for quote

// Generate PDF for a specific invoice
router.get("/invoices/:id/pdf", generatePDF); // Generate PDF for invoice

module.exports = router;
