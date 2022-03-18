import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { toDoState } from './atom';
import { useRecoilState } from 'recoil';
import Board from './componentes/Board';

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = ({ destination, draggableId, source }: DropResult) => {
    if (!destination) return;
    if (destination.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const copyBoard = [...allBoards[source.droppableId]];
        const teskObj = copyBoard[source.index];
        copyBoard.splice(source.index, 1);
        copyBoard.splice(destination?.index, 0, teskObj);
        return {
          ...allBoards,
          [source.droppableId]: copyBoard,
        };
      });
    } else {
      setToDos((allBoards) => {
        const copySoucre = [...allBoards[source.droppableId]];
        const copyDestination = [...allBoards[destination.droppableId]];
        const teskObj = copySoucre[source.index];
        copySoucre.splice(source.index, 1);
        copyDestination.splice(destination?.index, 0, teskObj);
        return {
          ...allBoards,
          [source.droppableId]: copySoucre,
          [destination.droppableId]: copyDestination,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} toDos={toDos[boardId]} boardId={boardId} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1020px;
  height: 100vh;
  margin: 0 auto;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 10px;
`;

export default App;
