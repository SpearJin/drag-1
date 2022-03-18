import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

interface IDragCardProps {
  index: number;
  toDoId: number;
  toDoText: string;
}

function DragCard({ index, toDoId, toDoText }: IDragCardProps) {
  return (
    <Draggable draggableId={toDoId + ''} index={index}>
      {(magic, info) => (
        <Card isDragging={info.isDragging} ref={magic.innerRef} {...magic.dragHandleProps} {...magic.draggableProps}>
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

const Card = styled.div<{ isDragging: boolean }>`
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.isDragging ? '#e4f2ff' : props.theme.cardColor)};
  box-shadow: ${(props) => (props.isDragging ? '2px 2px 6px 2px rgba(0,0,0,0.5)' : 'none')};
`;

export default React.memo(DragCard);
