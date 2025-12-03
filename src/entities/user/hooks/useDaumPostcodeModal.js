import DaumPostcodeModal from '@/pages/payment/ui/DaumPostcodeModal';
import { useModal } from '@/widgets/modal/ModalProvider';

/**
 * 주소 검색 모달을 열고 결과를 쉽게 Promise 형태로 반환받기 위한 Custom Hook.
 * - openPostcode() 호출 → 모달 표시 → 주소 선택 → resolve(data) 반환
 * - 닫기 버튼 또는 배경 클릭 등으로 종료될 경우 resolve(null)
 *
 * @returns
 */
export default function useDaumPostcodeModal() {
  const { openModal, closeModal } = useModal();

  // 주소 입력 모달 열기
  const openPostcode = () =>
    new Promise((resolve) => {
      const id = openModal(DaumPostcodeModal, {
        onComplete: (data) => {
          resolve(data);
          closeModal(id);
        },
        onClose: () => {
          resolve(null); // 닫기만 한 경우
          closeModal(id);
        },
      });
    });

  return { openPostcode };
}
