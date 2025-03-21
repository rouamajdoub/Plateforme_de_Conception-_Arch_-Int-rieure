import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function KanbanBoard() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json) => {
        setCompleted(json.filter((task) => task.completed));
        setIncomplete(json.filter((task) => !task.completed));
      });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    console.log("Source:", source);
    console.log("Destination:", destination);
    console.log("Draggable ID:", draggableId);

    if (!destination || source.droppableId === destination.droppableId) {
      return; // Exit if there's no destination or if the task is dropped in the same column
    }

    // Remove item from source array
    if (source.droppableId === "3") {
      setCompleted(removeItemById(draggableId, completed));
    } else {
      setIncomplete(removeItemById(draggableId, incomplete));
    }

    // Get the item
    const task = findItemById(draggableId, [...incomplete, ...completed]);

    if (!task) {
      console.error("Task not found:", draggableId);
      return; // Exit if the task is not found
    }

    // Add item to destination array
    if (destination.droppableId === "3") {
      setCompleted([{ ...task, completed: !task.completed }, ...completed]);
    } else {
      setIncomplete([{ ...task, completed: !task.completed }, ...incomplete]);
    }
  };

  function removeItemById(id, array) {
    return array.filter((item) => item.id.toString() !== id); // Convert item.id to string
  }

  function findItemById(id, array) {
    return array.find((item) => item.id.toString() === id); // Convert item.id to string
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <h2 style={{ textAlign: "center", color: "#242d49" }}>
          Progress Board
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Column title="To Do" tasks={incomplete} id={"1"} />
          <Column title="In Progress" tasks={[]} id={"2"} />
          <Column title="Done" tasks={completed} id={"3"} />
        </div>
      </DragDropContext>
    </>
  );
}
