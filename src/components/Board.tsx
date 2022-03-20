import React, { useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { IToDo, toDosState } from '../atom';
import { saveTodos } from '../util/localstorage';
import DragableCard from './DragableCard';

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, index }: IBoardProps) {
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

  const removeBoard = () => {
    setToDos((allBoards) => {
      const copyAllBoards = { ...allBoards };
      delete copyAllBoards[boardId];
      return {
        ...copyAllBoards,
      };
    });
  };

  return (
    <Draggable draggableId={boardId} index={index}>
      {(magic) => (
        <Wrapper ref={magic.innerRef} {...magic.draggableProps}>
          <Header {...magic.dragHandleProps}>
            <Title>
              <h3>{boardId}</h3>
              <button onClick={removeBoard}>❌</button>
            </Title>
            <Form onSubmit={handleSubmit(onValid)}>
              <input {...register('toDo', { required: true })} type='text' placeholder={`Add to ${boardId}`} />
            </Form>
          </Header>
          <Droppable droppableId={boardId} direction='vertical' type='BOARD'>
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
      )}
    </Draggable>
  );
}

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  min-height: 200px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.boardColor};
`;

const Header = styled.header``;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  h3 {
    margin-bottom: 10px;
    font-size: 18px;
    text-align: center;
  }
  button {
    position: absolute;
    top: -10px;
    right: -20px;
  }
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
  margin-top: 10px;
  width: 100%;
  input {
    width: 100%;
  }
`;

export default Board;
