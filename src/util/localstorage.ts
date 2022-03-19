import { IToDoState } from './../atom';

export const loadTodos = () => {
  const localTodos = localStorage.getItem('toDos');
  if (localTodos) {
    return JSON.parse(localTodos);
  }
  return null;
};

export const saveTodos = (todos: IToDoState) => {
  localStorage.setItem('toDos', JSON.stringify(todos));
};
