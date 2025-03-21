import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import "../Project.css";

const Container = styled.div`
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 8px;
  color: #000;
  min-height: 90px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 8px;
`;

export default function Task({ task, index }) {
  return (
    <Draggable draggableId={`${task.id}`} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          isBacklog={task.isBacklog}
        >
          <div style={{ display: "flex", justifyContent: "start", padding: 2 }}>
            <span>
              <small>#{task.id}</small>
            </span>
          </div>
          <TextContent>{task.title}</TextContent>
          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}
