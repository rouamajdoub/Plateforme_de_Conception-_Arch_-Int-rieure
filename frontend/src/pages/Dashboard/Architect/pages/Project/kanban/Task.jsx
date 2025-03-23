import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div`
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.$isDragging ? "#ff919d" : "#fffada")};
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const TextContent = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => props.textColor || "var(--black)"};
  text-align: center;
`;

export default function Task({ task, index }) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          $isDragging={snapshot.isDragging}
        >
          <TextContent>{task.title}</TextContent>
        </Container>
      )}
    </Draggable>
  );
}
