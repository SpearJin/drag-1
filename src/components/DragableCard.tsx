import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDosState } from '../atom';
import Modal from './Modal';

interface IDragableProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

function DragableCard({ toDoId, toDoText, index, boardId }: IDragableProps) {
  const [isModal, setIsModal] = useState(false);
  const [toDos, setToDos] = useRecoilState(toDosState);
  const deleteCard = () => {
    setToDos((allBoards) => {
      const copyDeleteBoard = [...allBoards[boardId]];
      console.log(copyDeleteBoard);
      const filterBoard = copyDeleteBoard.filter((todo) => todo.id !== toDoId);
      console.log(filterBoard);
      return {
        ...allBoards,
        [boardId]: filterBoard,
      };
    });
  };

  return (
    <>
      <Draggable draggableId={toDoId + ''} index={index}>
        {(magic, info) => (
          <Card isDragging={info.isDragging} ref={magic.innerRef} {...magic.dragHandleProps} {...magic.draggableProps}>
            {toDoText}
            <Edit onClick={() => setIsModal(true)}>수정</Edit>
            <Delete onClick={deleteCard}>삭제</Delete>
          </Card>
        )}
      </Draggable>
      {isModal && <Modal boardId={boardId} setIsModal={setIsModal} toDoId={toDoId} />}
    </>
  );
}

const Card = styled.li<{ isDragging: boolean }>`
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: ${(props) => (props.isDragging ? '#e4f2ff' : props.theme.cardColor)};
  box-shadow: ${(props) => (props.isDragging ? '0px 2px 5px rgba(0, 0, 0, 0.5)' : 'none')};
`;

const Edit = styled.button``;

const Delete = styled.button``;

export default React.memo(DragableCard);
