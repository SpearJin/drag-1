import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDosState } from './atom';
import Board from './components/Board';

interface IBoard {
  board: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDosState);
  const { register, setValue, handleSubmit } = useForm<IBoard>();

  const onDragEnd = ({ destination, draggableId, source }: DropResult) => {
    if (!destination) return;
    if (source.droppableId === 'Board') {
      setToDos((allBoards) => {
        const copyAllBoards = { ...allBoards };
        const taskObj = Object.entries(copyAllBoards)[source.index];
        const arr = Object.entries(copyAllBoards);
        arr.splice(source.index, 1);
        arr.splice(destination.index, 0, taskObj);
        let newObj = {};
        arr.forEach((board) => {
          newObj = { ...newObj, [board[0]]: board[1] };
        });
        console.log(newObj);
        return newObj;
      });
      return;
    }
    console.log(destination);
    if (destination?.droppableId === 'trash') {
      setToDos((allBoards) => {
        const copyAllBoard = [...allBoards[source.droppableId]];
        const filterBoard = copyAllBoard.filter((board) => board.id !== Number(draggableId));
        return {
          ...allBoards,
          [source.droppableId]: filterBoard,
        };
      });
      return;
    }

    if (destination.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const copyAllBoard = [...allBoards[source.droppableId]];
        const taskObj = copyAllBoard[source.index];
        copyAllBoard.splice(source.index, 1);
        copyAllBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: copyAllBoard,
        };
      });
    } else {
      setToDos((allBoards) => {
        const copySourceBoard = [...allBoards[source.droppableId]];
        const copyDestinationBoard = [...allBoards[destination.droppableId]];
        const taskObj = copySourceBoard[source.index];
        copySourceBoard.splice(source.index, 1);
        copyDestinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: copySourceBoard,
          [destination.droppableId]: copyDestinationBoard,
        };
      });
    }
  };

  const onValild = ({ board }: IBoard) => {
    console.log(board);
    const newBoard = { [board]: [] };
    setToDos({ ...toDos, ...newBoard });
    setValue('board', '');
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Form onSubmit={handleSubmit(onValild)}>
          <input {...register('board', { required: true })} type='text' placeholder='추가할 Board' />
        </Form>
        <Droppable droppableId='Board' direction='horizontal' type='abc'>
          {(magic) => (
            <Boards ref={magic.innerRef} {...magic.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board key={boardId} toDos={toDos[boardId]} boardId={boardId} index={index} />
              ))}
              {magic.placeholder}
            </Boards>
          )}
        </Droppable>
        <Droppable droppableId='trash' type='BOARD'>
          {(magic) => (
            <>
              <Trash>
                <span ref={magic.innerRef}>🗑</span>
                {magic.placeholder}
              </Trash>
            </>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 680px;
  height: 100vh;
  margin: 0 auto;
`;

const Form = styled.form`
  margin-bottom: 20px;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  min-height: 200px;
  gap: 10px;
`;

const Trash = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 100px;
  height: 100px;
  list-style: none;
  span {
    font-size: 80px;
  }
`;

export default App;
