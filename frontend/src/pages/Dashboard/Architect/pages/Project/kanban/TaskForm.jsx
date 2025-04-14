import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../../../../../../redux/slices/TaskSlice"; // Adjust path as needed
import styled from "styled-components";

// Styled components
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const FormTitle = styled.h2`
  color: var(--pink);
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const SubmitButton = styled(Button)`
  background-color: var(--pink);
  color: white;

  &:hover {
    background-color: #d6008f;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const TaskForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.tasks.loading);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "todo",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTask(taskData))
      .unwrap()
      .then(() => {
        handleClose();
        setTaskData({
          title: "",
          description: "",
          status: "todo",
          dueDate: "",
        });
      })
      .catch((error) => {
        console.error("Failed to create task:", error);
      });
  };

  if (!open) return null;

  return (
    <Modal onClick={handleClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <FormTitle>Add New Task</FormTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              name="status"
              value={taskData.status}
              onChange={handleChange}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
            />
          </FormGroup>

          <ButtonContainer>
            <CancelButton
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </SubmitButton>
          </ButtonContainer>
        </Form>
      </FormContainer>
    </Modal>
  );
};

export default TaskForm;
