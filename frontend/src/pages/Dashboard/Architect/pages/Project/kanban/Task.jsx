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

// Fixed description display
const Description = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  text-align: left;
`;

// Adding due date display
const DueDate = styled.div`
  font-size: 11px;
  color: #888;
  margin-top: 4px;
  text-align: right;
`;

export default function Task({ task, index }) {
  // Using _id instead of id for MongoDB
  return (
    <Draggable draggableId={task._id.toString()} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          $isDragging={snapshot.isDragging}
        >
          <TextContent>{task.title}</TextContent>
          {task.description && <Description>{task.description}</Description>}
          {task.dueDate && (
            <DueDate>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </DueDate>
          )}
        </Container>
      )}
    </Draggable>
  );
}
