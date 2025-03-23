import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function KanbanBoard() {
  const [toDo, setToDo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json) => {
        const tasks = json.slice(0, 10); // Limit to 10 tasks for testing
        setToDo(tasks.filter((task) => !task.completed));
        setDone(tasks.filter((task) => task.completed));
      });
  }, []);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // Exit if no destination or dropped in the same place
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Helper function to reorder an array
    const reorder = (list, startIndex, endIndex) => {
      const newList = Array.from(list);
      const [movedItem] = newList.splice(startIndex, 1);
      newList.splice(endIndex, 0, movedItem);
      return newList;
    };

    // Function to get the correct state and setter
    const getColumnState = (droppableId) => {
      switch (droppableId) {
        case "1":
          return { list: toDo, setList: setToDo };
        case "2":
          return { list: inProgress, setList: setInProgress };
        case "3":
          return { list: done, setList: setDone };
        default:
          return null;
      }
    };

    const sourceColumn = getColumnState(source.droppableId);
    const destinationColumn = getColumnState(destination.droppableId);

    if (!sourceColumn || !destinationColumn) return;

    if (source.droppableId === destination.droppableId) {
      // REORDER TASKS WITHIN THE SAME COLUMN
      sourceColumn.setList(
        reorder(sourceColumn.list, source.index, destination.index)
      );
    } else {
      // MOVE TASK TO ANOTHER COLUMN
      const movedTask = sourceColumn.list[source.index];

      sourceColumn.setList(
        sourceColumn.list.filter((_, idx) => idx !== source.index)
      );
      destinationColumn.setList([
        ...destinationColumn.list.slice(0, destination.index),
        movedTask,
        ...destinationColumn.list.slice(destination.index),
      ]);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: "center", color: "#242d49" }}>Progress Board</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <Column title="To Do" tasks={toDo} id={"1"} />
        <Column title="In Progress" tasks={inProgress} id={"2"} />
        <Column title="Done" tasks={done} id={"3"} />
      </div>
    </DragDropContext>
  );
}
