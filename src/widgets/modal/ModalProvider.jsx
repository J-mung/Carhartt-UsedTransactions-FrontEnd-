import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

// ModalProvider가 아직 렌더링되지 않은 상태에서 안전하게 사용하도록 기본 구현 제공
const ModalContext = createContext({
  openModal: () => {
    throw new Error('ModalProvider is not mounted.');
  },
  closeModal: () => {},
  updateModal: () => {},
});

export default function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  /**
   * 모달 열기
   * @param {*} Component
   * @param {*} props
   * @returns
   */
  // 새 모달을 열고 고유 id를 반환, 타 컴포넌트에서 해당 id로 제어 가능
  const openModal = useCallback((Component, props) => {
    const id = `modal_${Date.now()}_${Math.random()}`;
    setModals((prev) => [...prev, { id, Component, props }]);
    return id;
  }, []);

  /**
   * 모달 닫기
   * @param {*} id : 닫을 모달 id
   */
  // 특정 id를 가진 모달만 제거, 다른 모달 상태는 보존
  const closeModal = useCallback((id) => {
    setModals((prev) => prev.filter((_modal) => _modal.id !== id));
  }, []);

  const updateModal = useCallback((id, newProps) => {
    // 열린 모달의 props를 갱신하여 외부에서 콘텐츠/버튼 등을 즉시 변경
    setModals((prev) => {
      let updated = false;

      const next = prev.map((modal) => {
        if (modal.id !== id) return modal;

        const nextProps =
          typeof newProps === 'function' ? newProps(modal.props) : newProps;
        if (!nextProps) return modal;

        updated = true;

        return {
          ...modal,
          props: {
            ...modal.props,
            ...nextProps,
          },
        };
      });

      return updated ? next : prev;
    });
  }, []);

  // open/close/update가 재생성되지 않도록 메모이제이션한 컨텍스트 값
  const contextValue = useMemo(
    () => ({
      openModal,
      closeModal,
      updateModal,
    }),
    [openModal, closeModal, updateModal]
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {/* 전역 모달 루트를 body 아래에 두어 어디서든 표시 가능하도록 포탈 사용 */}
      {createPortal(
        <div className={'modal-root'}>
          {modals.map(({ id, Component, props }) => {
            const { onClose: userOnClose, ...restProps } = props ?? {};
            return (
              <Component
                key={id}
                {...restProps}
                onClose={(e) => {
                  // 사용자가 넘겨준 onClose를 먼저 호출하여 후속 로직 실행 보장
                  if (typeof userOnClose === 'function') {
                    userOnClose(e);
                  }
                  // 실제 모달 스택에서 제거하여 DOM을 정리
                  closeModal(id);
                }}
              />
            );
          })}
        </div>,
        document.body
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
