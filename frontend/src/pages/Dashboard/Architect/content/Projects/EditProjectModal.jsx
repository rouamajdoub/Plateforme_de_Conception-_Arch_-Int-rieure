import React, { useEffect, useState } from "react";
import { Modal, Button, Input } from "@mui/material"; // Adjust the imports based on your UI library

const EditProjectModal = ({ project, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        budget: project.budget,
      });
    }
  }, [project]);

  const handleUpdate = () => {
    onUpdate({ ...project, ...formData });
    onClose();
  };

  return (
    <Modal open={Boolean(project)} onClose={onClose}>
      <div
        style={{ padding: "20px", background: "white", borderRadius: "8px" }}
      >
        <h2>Edit Project</h2>
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <Input
          placeholder="Budget"
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        />
        <Button onClick={handleUpdate}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

export default EditProjectModal;
