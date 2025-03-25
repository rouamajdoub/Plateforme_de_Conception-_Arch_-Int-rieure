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
import { Add, Edit, Delete, PictureAsPdf, Receipt } from "@mui/icons-material";
import {
  fetchQuotes,
  addQuote,
  updateQuote,
  deleteQuote,
  convertQuoteToInvoice,
  generateQuotePDF,
  clearCurrentItems,
} from "../../../../../redux/slices/architectSlice";

const Quotes = () => {
  const dispatch = useDispatch();
  const { quotes, loading, currentQuote } = useSelector(
    (state) => state.architect
  );
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    project: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    taxRate: 15,
    discount: 0,
    notes: "",
    terms: "",
  });

  useEffect(() => {
    dispatch(fetchQuotes());
    return () => dispatch(clearCurrentItems());
  }, [dispatch]);

  const handleOpenModal = (quote = null) => {
    if (quote) {
      setFormData({
        ...quote,
        items: quote.items.map((item) => ({
          ...item,
          quantity: item.quantity.toString(),
        })),
      });
    } else {
      setFormData({
        client: "",
        project: "",
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
        taxRate: 15,
        discount: 0,
        notes: "",
        terms: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };

    if (currentQuote) {
      dispatch(updateQuote({ ...processedData, _id: currentQuote._id }));
    } else {
      dispatch(addQuote(processedData));
    }
    handleCloseModal();
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Quotes Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Create New Quote
        </Button>
      </Box>

      {loading.quotes ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote._id}>
                  <TableCell>{quote.client?.name}</TableCell>
                  <TableCell>{quote.project?.title}</TableCell>
                  <TableCell>${quote.totalAmount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      color={quote.status === "draft" ? "secondary" : "primary"}
                      badgeContent={quote.status}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(quote)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() =>
                        dispatch(convertQuoteToInvoice({ quoteId: quote._id }))
                      }
                    >
                      <Receipt />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => dispatch(deleteQuote(quote._id))}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => dispatch(generateQuotePDF(quote._id))}
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
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentQuote ? "Edit Quote" : "Create Quote"}
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
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Quotes;
*/