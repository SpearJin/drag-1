import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDosState } from './atom';
import Board from './components/Board';

function App() {
  const [toDos, setToDos] = useRecoilState(toDosState);

  const onDragEnd = ({ destination, draggableId, source }: DropResult) => {
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
    if (!destination) return;
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
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} toDos={toDos[boardId]} boardId={boardId} />
          ))}
        </Boards>
        <Droppable droppableId='trash'>
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
  max-width: 680px;
  height: 100vh;
  margin: 0 auto;
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
