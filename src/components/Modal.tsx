import React, { SetStateAction, Dispatch, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDosState } from '../atom';

interface IModalProps {
  boardId: string;
  toDoId: number;
  setIsModal: Dispatch<SetStateAction<boolean>>;
}

interface IForm {
  modify: string;
}

function Modal({ boardId, setIsModal, toDoId }: IModalProps) {
  const [toDos, setToDos] = useRecoilState(toDosState);
  const { register, handleSubmit } = useForm<IForm>();

  const onClickModify = ({ modify }: IForm) => {
    setToDos((allBoard) => {
      const copyModifyBaord = [...allBoard[boardId]];
      const modifyIndex = copyModifyBaord.findIndex((todo) => todo.id === toDoId);
      const modifiyBoard = {
        id: copyModifyBaord[modifyIndex].id,
        text: modify,
      };
      copyModifyBaord.splice(modifyIndex, 1);
      copyModifyBaord.splice(modifyIndex, 0, modifiyBoard);
      return {
        ...allBoard,
        [boardId]: copyModifyBaord,
      };
    });
    setIsModal(false);
  };

  return (
    <ModalContainer>
      <ModalBox onSubmit={handleSubmit(onClickModify)}>
        <ModalTitle>수정할 {boardId}</ModalTitle>
        <ModalInput {...register('modify', { required: true })} type='text' placeholder='수정할 Text를 입력하세요' />
        <ModalButton>
          <button>수정</button>
          <button onClick={() => setIsModal(false)}>취소</button>
        </ModalButton>
      </ModalBox>
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const ModalBox = styled.form`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100px;
  border-radius: 5px;
  background-color: #fff;
`;

const ModalTitle = styled.h3`
  margin-top: 10px;
  font-size: 18px;
  text-align: center;
  font-weight: 700;
`;

const ModalInput = styled.input`
  margin: auto;
`;

const ModalButton = styled.div`
  margin: auto;
`;

export default Modal;
