import { Button } from '@/shared/ui/buttons';
import { useEffect, useRef, useState } from 'react';

/**
 * 모달 컴포넌트
 * @param {*} param0
 * @returns
 */
export default function Modal({
  title, // 모달 제목
  children, // 모달 컨텐트
  buttons = [], // 사용자 정의 버튼 그룹
  onClose, // 모달 닫기 핸들러
  width = '350px', // 모달 너비 (최소 너비 기본값 지정)
  visible = true, // 모달 열림 상태 (외부 컨트롤)
  centered = false, // 모달 위치 지정 (중앙)
  className = '', // 추가 사용자 정의 클래스
}) {
  // 모달 열림 상태
  const [openState, setOpenState] = useState(visible);
  // 모달 참조
  const modalRef = useRef(null);

  /**
   * 모달 열림 상태 제어
   */
  useEffect(() => {
    setOpenState(visible);
  }, [visible]);

  /**
   * 모달 닫기 핸들러
   * 애니메이션 적용을 위해 setTimeout
   */
  const handleClose = (e) => {
    setOpenState(false);
    setTimeout(() => {
      onClose && onClose(e);
    }, 200);
  };

  /**
   * 모달 마스크 클래스명 조합
   */
  const modalMaskClass = ['custom-modal-mask', openState && 'custom-modal-open']
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * 모달 클래스명 조합
   */
  const modalClass = [
    'custom-modal',
    openState && 'custom-modal-open',
    centered && 'custom-modal-center',
    className,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * 기본 버튼 '닫기' 추가하여 기본 버튼 그룹 생성
   */
  const defaultButtons = [
    {
      label: '닫기',
      variant: 'standard-secondary',
      onClick: (e) => handleClose(e),
    },
    ...buttons,
  ];

  return (
    <div className={'custom-modal-wrapper'}>
      {/* 모달 마스크(배경) */}
      <div className={modalMaskClass} onClick={(e) => handleClose(e)} />
      {/* 모달 */}
      <div
        className={modalClass}
        style={{ width }}
        ref={modalRef}
        role={'dialog'}
        aria-modal={'true'}
      >
        {/* 모달 헤더 */}
        <div className={'modal-header'}>
          <div className={'modal-title'}>
            <span className={'h5'}>{title}</span>
          </div>
          <Button variant={'standard-link'} onClick={(e) => handleClose(e)}>
            <span>X</span>
          </Button>
        </div>
        {/* 모달 컨텐트 */}
        <div className={'modal-content'}>{children}</div>
        {/* 모달 풋터 (버튼 그룹 삽입) */}
        {defaultButtons && defaultButtons.length > 0 && (
          <div className={'modal-footer'}>
            {defaultButtons.map((_btn, index) => (
              <Button
                key={`modal-btn-${index}`}
                label={_btn.label}
                variant={`${_btn.variant}`}
                onClick={(e) => {
                  _btn.onClick(e);
                  handleClose(e);
                }}
                className={'modal-btn__flex'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
