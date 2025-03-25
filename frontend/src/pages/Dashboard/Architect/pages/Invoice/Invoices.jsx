/*import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Badge,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { Add, Edit, Delete, PictureAsPdf, Payment } from "@mui/icons-material";
import {
  fetchInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  recordInvoicePayment,
  generateInvoicePDF,
  clearCurrentItems,
} from "../../../../../redux/slices/architectSlice";

const Invoices = () => {
  const dispatch = useDispatch();
  const { invoices, loading, currentInvoice } = useSelector(
    (state) => state.architect
  );
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    project: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    taxRate: 15,
    discount: 0,
    dueDate: "",
    notes: "",
    terms: "",
  });
  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "bank_transfer",
  });

  useEffect(() => {
    dispatch(fetchInvoices());
    return () => dispatch(clearCurrentItems());
  }, [dispatch]);

  const handleOpenInvoiceModal = (invoice = null) => {
    if (invoice) {
      setFormData({
        ...invoice,
        items: invoice.items.map((item) => ({
          ...item,
          quantity: item.quantity.toString(),
        })),
        dueDate: invoice.dueDate?.split("T")[0],
      });
    } else {
      setFormData({
        client: "",
        project: "",
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
        taxRate: 15,
        discount: 0,
        dueDate: "",
        notes: "",
        terms: "",
      });
    }
    setOpenInvoiceModal(true);
  };

  const handleCloseInvoiceModal = () => {
    setOpenInvoiceModal(false);
  };

  const handleSubmitInvoice = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };

    if (currentInvoice) {
      dispatch(updateInvoice({ ...processedData, _id: currentInvoice._id }));
    } else {
      dispatch(addInvoice(processedData));
    }
    handleCloseInvoiceModal();
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 1, unitPrice: 0 },
      ],
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleRecordPayment = (invoiceId) => {
    dispatch(
      recordInvoicePayment({
        invoiceId,
        paymentData: {
          amount: Number(paymentData.amount),
          method: paymentData.method,
        },
      })
    );
    setOpenPaymentModal(false);
  };

  const getPaymentStatusBadge = (status) => {
    const variants = {
      unpaid: "error",
      partial: "warning",
      paid: "success",
    };
    return <Badge color={variants[status]} badgeContent={status} />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Invoices Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenInvoiceModal()}
        >
          Create New Invoice
        </Button>
      </Box>

      {loading.invoices ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.client?.name}</TableCell>
                  <TableCell>{invoice.project?.title}</TableCell>
                  <TableCell>${invoice.totalAmount?.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(invoice.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenInvoiceModal(invoice)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => setOpenPaymentModal(true)}
                    >
                      <Payment />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => dispatch(deleteInvoice(invoice._id))}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => dispatch(generateInvoicePDF(invoice._id))}
                    >
                      <PictureAsPdf />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openInvoiceModal}
        onClose={handleCloseInvoiceModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentInvoice ? "Edit Invoice" : "Create Invoice"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Client"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Project"
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                margin="normal"
                required
              />
            </Grid>
            {formData.items.map((item, index) => (
              <React.Fragment key={index}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Unit Price"
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                    margin="normal"
                    required
                  />
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button variant="outlined" onClick={handleAddItem}>
                Add Item
              </Button>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                type="number"
                value={formData.taxRate}
                onChange={(e) =>
                  setFormData({ ...formData, taxRate: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Discount ($)"
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceModal}>Cancel</Button>
          <Button onClick={handleSubmitInvoice} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
      >
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={paymentData.amount}
            onChange={(e) =>
              setPaymentData({ ...paymentData, amount: e.target.value })
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Payment Method"
            select
            value={paymentData.method}
            onChange={(e) =>
              setPaymentData({ ...paymentData, method: e.target.value })
            }
            margin="normal"
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
            <option value="cash">Cash</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentModal(false)}>Cancel</Button>
          <Button
            onClick={() => handleRecordPayment(currentInvoice?._id)}
            variant="contained"
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Invoices;
*/