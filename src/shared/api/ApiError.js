/**
 * 표준 API 에러 객체
 * 정의된 API 규격서 상으론 응답 status는 모두 200이 전달되지만
 * Debug용으로 status 속성을 포함시킴
 */
export default class ApiError extends Error {
  constructor(
    message,
    {
      code = 'UNKNOWN',
      details = [],
      status = 0, // Debug용
      requestId,
      meta,
      url,
      method,
    } = {}
  ) {
    super(message ?? 'Request failed');
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
    this.status = status;
    this.requestId = requestId;
    this.meta = meta;
    this.url = url;
    this.method = method;
  }
}
