import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  updateTaskStatus,
  selectTasksByStatus,
  selectTasksLoading,
} from "../../../../../../redux/slices/TaskSlice"; // Adjust the import path as needed
import Column from "./Column";
import TaskForm from "./TaskForm";
import { Button, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // If using Material UI icons

export default function KanbanBoard() {
  const dispatch = useDispatch();
  const [openTaskForm, setOpenTaskForm] = useState(false);

  // Get tasks by status from Redux
  const todoTasks = useSelector((state) => selectTasksByStatus(state, "todo"));
  const inProgressTasks = useSelector((state) =>
    selectTasksByStatus(state, "in-progress")
  );
  const doneTasks = useSelector((state) => selectTasksByStatus(state, "done"));
  const loading = useSelector((state) => state.tasks.loading);

  // Fetch tasks when component mounts
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Exit if no destination or dropped in the same place
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Map droppableId to status
    const getStatus = (droppableId) => {
      switch (droppableId) {
        case "1":
          return "todo";
        case "2":
          return "in-progress";
        case "3":
          return "done";
        default:
          return null;
      }
    };

    // Get the status of the destination column
    const newStatus = getStatus(destination.droppableId);

    if (newStatus) {
      // Update task status in Redux and backend
      dispatch(
        updateTaskStatus({
          id: draggableId,
          status: newStatus,
        })
      );
    }
  };

  const handleOpenTaskForm = () => {
    setOpenTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setOpenTaskForm(false);
  };

  // Render loading state
  if (
    loading &&
    todoTasks.length === 0 &&
    inProgressTasks.length === 0 &&
    doneTasks.length === 0
  ) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px" }}>
        <Typography>Loading tasks...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" sx={{ color: "#242d49" }}>
          Task Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenTaskForm}
        >
          New Task
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <Column title="To Do" tasks={todoTasks} id={"1"} />
          <Column title="In Progress" tasks={inProgressTasks} id={"2"} />
          <Column title="Done" tasks={doneTasks} id={"3"} />
        </Box>
      </DragDropContext>

      <TaskForm open={openTaskForm} handleClose={handleCloseTaskForm} />
    </Box>
  );
}
