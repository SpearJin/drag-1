import { atom } from 'recoil';
import { loadTodos } from './util/localstorage';

export interface IToDoState {
  [key: string]: IToDo[];
}

export interface IToDo {
  id: number;
  text: string;
}
export const defaultTodos: IToDoState = {
  'To Do': [],
  Doing: [],
  Done: [],
};

export const toDosState = atom<IToDoState>({
  key: 'toDos',
  default: loadTodos() ?? defaultTodos,
});
