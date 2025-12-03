import Modal from '@/widgets/modal/Modal';
import { useEffect, useRef } from 'react';

/**
 * Daum 우편번호 검색 서비스를 모달 내부에 embed 방식으로 삽입하는 컴포넌트
 *
 * Props:
 *  @param {Function} onComplete - 주소 선택 완료 콜백
 *  @param {Function} onClose    - 모달 닫기 요청 콜백
 *  @param {String} title        - 모달 타이틀
 *
 * 예시 반환 데이터 구조:
 *  {
 *    zonecode: "12345",
 *    roadAddress: "서울시 강남구 테헤란로 ...",
 *    jibunAddress: "서울시 강남구 역삼동 ...",
 *    buildingName: "삼성빌딩",
 *    addressType: "R|J",
 *    raw: 원본 data 객체
 *  }
 */
export default function DaumPostcodeModal({
  onComplete,
  onClose,
  title = '주소 검색',
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const scriptUrl =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

    /**
     * Daum Postcode 스크립트 로드 함수
     * - 스크립트 태그 삽입
     * - window.daum.Postcode가 준비될 때까지 interval polling
     */
    const load = () =>
      new Promise((resolve) => {
        if (window.daum && window.daum.Postcode) return resolve();

        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;

        script.onload = () => {
          const intervalPostcode = setInterval(() => {
            if (window.daum?.Postcode) {
              clearInterval(intervalPostcode);
              resolve();
            }
          }, 30);
        };

        document.head.appendChild(script);
      });

    load().then(() => {
      const postcode = new window.daum.Postcode({
        oncomplete: function (data) {
          let extraRoadAddress = ''; // 참고항목

          // 법정동명이 있을 경우 추가 (법정리는 제외, 마지막 글자가 동/로/가)
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraRoadAddress += data.bname;
          }

          // 건물명이 있고, 공동주택일 경우 추가
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraRoadAddress +=
              extraRoadAddress !== ''
                ? ', ' + data.buildingName
                : data.buildingName;
          }

          // 표시할 참고항목이 있을 경우 괄호 포함
          if (extraRoadAddress !== '') {
            extraRoadAddress = ' (' + extraRoadAddress + ')';
          }

          // 예상 주소 안내문 (가이드 예제 동일)
          let guideText = '';
          if (data.autoRoadAddress) {
            const expRoadAddr = data.autoRoadAddress + extraRoadAddress;
            guideText = `예상 도로명 주소 : ${expRoadAddr}`;
          } else if (data.autoJibunAddress) {
            const expJibunAddr = data.autoJibunAddress;
            guideText = `예상 지번 주소 : ${expJibunAddr}`;
          }

          // 주소 선택 완료 후 상위 Caller로 결과 반환
          onComplete?.({
            postcode: data.zonecode,
            roadAddress: data.roadAddress,
            jibunAddress: data.jibunAddress,
            buildingName: data.buildingName,
            addressType: data.addressType,
            extraAddress: extraRoadAddress,
            guide: guideText,
            raw: data,
          });

          // 호출한 측에서 모달 제거
          onClose?.();
        },
        width: '100%',
        height: '100%',
      });

      // 모달 내부 영역에 iframe embed
      postcode.embed(wrapRef.current);
    });
  }, [wrapRef, onClose, onComplete]);

  return (
    <Modal title={title} width={'480px'} onClose={onClose} centered>
      <div
        ref={wrapRef}
        style={{
          width: '100%',
          height: '500px',
          overflow: 'hidden',
        }}
      />
    </Modal>
  );
}
