import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Task from "./Task";

const Container = styled.div`
  border-radius: 2.5px;
  width: 300px;
  height: 475px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  padding: 8px;
  background-color: var(--pink);
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TaskList = styled.div`
  padding: 3px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.isDraggingOver ? "rgba(135, 206, 235, 0.3)" : "transparent"};
  flex-grow: 1;
  min-height: 100px; // Ensure the Droppable area has a minimum height
`;

export default function Column({ title, tasks, id }) {
  return (
    <Container className="column">
      <Title>{title}</Title>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))
            ) : (
              <div style={{ padding: "8px" }}>Drop tasks here</div> // Placeholder for empty columns
            )}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}
