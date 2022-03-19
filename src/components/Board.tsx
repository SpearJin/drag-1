import React, { useEffect } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { IToDo, toDosState } from '../atom';
import { saveTodos } from '../util/localstorage';
import DragableCard from './DragableCard';

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const [toDoss, setToDos] = useRecoilState(toDosState);
  const onValid = ({ toDo }: IForm) => {
    const newTods = { id: Date.now(), text: toDo };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newTods],
      };
    });
    setValue('toDo', '');
  };

  useEffect(() => {
    saveTodos(toDoss);
  }, [toDoss]);

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input {...register('toDo', { required: true })} type='text' placeholder={`Add to ${boardId}`} />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            draggingFromThisWith={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos?.map((toDo, index) => (
              <DragableCard key={toDo.id} toDoId={toDo.id} toDoText={toDo.text} index={index} />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.boardColor};
`;

const Title = styled.h3`
  margin-bottom: 10px;
  font-size: 18px;
  text-align: center;
`;

interface AreaProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Area = styled.div<AreaProps>`
  flex-grow: 1;
  padding: 10px;
  background-color: ${(props) =>
    props.isDraggingOver ? '#dfe6e9' : props.draggingFromThisWith ? '#b2bec3' : 'transparent'};
  transition: background-color 250ms ease-in;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

export default Board;
