/**
 * 표준 API 에러 객체
 * 정의된 API 규격서 상으론 응답 status는 모두 200이 전달되지만
 * Debug용으로 status 속성을 포함시킴
 *
 * 코드       |   상황
 * 001       |   미인증(세션 없음/만료)
 * 002       |   로그인 정보 오류
 * 003       |   권한 없음(본인 아님)
 * 004       |   리소스 없음(사용자/주소/상품)
 * 009       |   입력 유효성 실패
 * 013       |   파라미터 오류
 * 010       |   내부 처리 오류
 * 012       |   과부하/점검
 * 008       |   CSRF 값 불일치
 *
 * 코드 접두사  |  도메인
 * O         |  주문
 * C         |  회원
 * I         |  물품
 *
 */

// 코드 → 상수 매핑
const ERROR_CODES = Object.freeze({
  '001': 'UNAUTHORIZED', // 미인증(세션 없음/만료)
  '002': 'INVALID_LOGIN', // 로그인 정보 오류
  '003': 'FORBIDDEN', // 권한 없음(본인 아님)
  '004': 'NOT_FOUND', // 리소스 없음(사용자/주소/상품)
  '009': 'VALIDATION_FAILED', // 입력 유효성 실패
  '013': 'PARAMETER_ERROR', // 파라미터 오류
  '010': 'INTERNAL_ERROR', // 내부 처리 오류
  '012': 'SERVICE_UNAVAILABLE', // 과부하/점검
  '008': 'CSRF_MISMATCH', // CSRF 값 불일치
});

const ERROR_DESC = Object.freeze({
  [ERROR_CODES['001']]: '미인증(세션 없음/만료)',
  [ERROR_CODES['002']]: '로그인 정보 오류',
  [ERROR_CODES['003']]: '권한 없음(본인 아님)',
  [ERROR_CODES['004']]: '리소스 없음(사용자/주소/상품)',
  [ERROR_CODES['009']]: '입력 유효성 실패',
  [ERROR_CODES['013']]: '파라미터 오류',
  [ERROR_CODES['010']]: '내부 처리 오류',
  [ERROR_CODES['012']]: '과부하/점검',
  [ERROR_CODES['008']]: 'CSRF 값 불일치',
});

export default class ApiError extends Error {
  constructor({
    code = 'UNKNOWN',
    message,
    details = [],
    status,
    requestId,
    meta,
    url,
    method,
  } = {}) {
    // 정의된 코드 접두사인지 확인
    const match = code.match('/^[COI]/');
    // 정의된 코드일 경우 도메인 추출
    const safeDomain = match ? match[0] : 'UNHANDLED_DOMAIN';
    // 정의된 코드일 경우 코드 추출
    const safeCode = match ? match.slice(1, match.length) : 'UNHANDLED_CODE';
    // 정의된 코드에 대한 부연 설명
    const getCodeDesc = (code) => {
      return ERROR_DESC[code] || 'UNKNOWN';
    };

    super(message ?? 'Request failed');
    this.name = 'ApiError';
    this.domain = safeDomain;
    this.code = safeCode;
    this.codeDesc = getCodeDesc(safeCode);
    this.details = details;
    this.status = status;
    this.requestId = requestId;
    this.meta = meta;
    this.url = url;
    this.method = method;
  }
}
