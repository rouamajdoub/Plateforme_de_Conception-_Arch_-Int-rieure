const express = require("express");
const router = express.Router();
const {
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
  generatePDF,
} = require("../controllers/quoteController");

const { protect } = require("../middlewares/authMiddleware"); // Ensure this import is correct

// Apply protect middleware to all routes
router.use(protect);

// Quote routes
router.route("/quotes").post(createQuote).get(getAllQuotes);

router
  .route("/quotes/:id")
  .get(getQuoteById)
  .patch(updateQuote)
  .delete(deleteQuote);

router.patch("/quotes/:id/convert", convertToInvoice);

// Invoice routes
router.route("/invoices").post(createInvoice).get(getAllInvoices);

router
  .route("/invoices/:id")
  .get(getInvoiceById)
  .patch(updateInvoice)
  .delete(deleteInvoice);

router.post("/invoices/:id/payment", recordPayment);

// Shared routes
router.get("/quotes/:id/pdf", generatePDF);
router.get("/invoices/:id/pdf", generatePDF);

module.exports = router;
