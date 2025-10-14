import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const ModalContext = createContext();

export default function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  /**
   * 모달 열기
   * @param {*} Component
   * @param {*} props
   * @returns
   */
  const openModal = (Component, props) => {
    const id = `modal_${Date.now()}_${Math.random()}`;
    setModals((prev) => [...prev, { id, Component, props }]);
    return id;
  };

  /**
   * 모달 닫기
   * @param {*} id : 닫을 모달 id
   */
  const closeModal = (id) => {
    setModals((prev) => prev.filter((_modal) => _modal.id !== id));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {createPortal(
        <div className={'modal-root'}>
          {modals.map(({ id, Component, props }) => (
            <Component key={id} {...props} onClose={() => closeModal(id)} />
          ))}
        </div>,
        document.body
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
