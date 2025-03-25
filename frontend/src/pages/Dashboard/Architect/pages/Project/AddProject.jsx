import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createProject } from "../../../../../redux/slices/ProjectSlice";

const AddProject = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const [projectData, setProjectData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "",
    budget: "",
    startDate: "",
    endDate: "",
    coverImage: "",
    isPublic: false,
    showroomStatus: "normal",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProjectData({
      ...projectData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    dispatch(createProject(projectData));
    onClose(); // Close modal after submission
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={projectData.title}
          onChange={handleChange}
          margin="dense"
          required
        />
        <TextField
          fullWidth
          label="Short Description"
          name="shortDescription"
          value={projectData.shortDescription}
          onChange={handleChange}
          margin="dense"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={projectData.description}
          onChange={handleChange}
          margin="dense"
          multiline
          rows={3}
          required
        />
        <TextField
          select
          fullWidth
          label="Category"
          name="category"
          value={projectData.category}
          onChange={handleChange}
          margin="dense"
          required
        >
          <MenuItem value="Interior Design">Interior Design</MenuItem>
          <MenuItem value="Architecture">Architecture</MenuItem>
          <MenuItem value="Renovation">Renovation</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Budget (TND)"
          name="budget"
          type="number"
          value={projectData.budget}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Start Date"
          name="startDate"
          type="date"
          value={projectData.startDate}
          onChange={handleChange}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="End Date"
          name="endDate"
          type="date"
          value={projectData.endDate}
          onChange={handleChange}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Cover Image (URL)"
          name="coverImage"
          value={projectData.coverImage}
          onChange={handleChange}
          margin="dense"
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isPublic"
              checked={projectData.isPublic}
              onChange={handleChange}
            />
          }
          label="Make Public (Showroom)"
        />
        <TextField
          select
          fullWidth
          label="Showroom Status"
          name="showroomStatus"
          value={projectData.showroomStatus}
          onChange={handleChange}
          margin="dense"
        >
          <MenuItem value="featured">Featured</MenuItem>
          <MenuItem value="trending">Trending</MenuItem>
          <MenuItem value="normal">Normal</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Add Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProject;
