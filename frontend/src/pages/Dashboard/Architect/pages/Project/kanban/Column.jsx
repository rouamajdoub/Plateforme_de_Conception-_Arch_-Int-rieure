import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Task from "./Task";

// Styled components
const Container = styled.div`
  border-radius: 5px;
  width: 300px;
  height: 475px;
  overflow-y: auto;
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
  padding: 10px;
  min-height: 100px;
  background-color: ${(props) =>
    props.$isDraggingOver ? "rgba(135, 206, 235, 0.3)" : "transparent"};
`;

export default function Column({ title, tasks, id }) {
  return (
    <Container>
      <Title>{title}</Title>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            $isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}
