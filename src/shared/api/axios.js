import ApiError from '@/shared/api/ApiError';
import { AXIOS_CONFIG } from '@/shared/config/constants';
import { ENV } from '@/shared/config/env';
import axios from 'axios';

/**
 * 요청 ID 생성기
 * @returns
 */
function getUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID)
    return crypto.randomUUID();

  // fallback (랜덤 생성)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 공용 Axios 인스턴스
 *
 *  try {
 *    // 성공 시
 *    const { data, meta, status } = await api.get('/products');
 *    // data: 서버가 응답한 data 그대로 반환
 *    // meta: 서버 meta + requestId 포함 (변경될 수 있음)
 *  } catch (e) {
 *    // 실패 시
 *    if (e instanceof ApiError) {
 *      // e.code, e.message, e.details, e.status, e.requestId, e.meta 사용 가능
 *    }
 *  }
 */
export const carHarttApi = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true, // 세션 쿠키 포함
  timeout: AXIOS_CONFIG.TIMEOUT_MS,
  headers: {
    ...AXIOS_CONFIG.DEFAULT_HEADERS,
  },
  // XSRF 공격 대응
  xsrfCookieName: AXIOS_CONFIG.XSRF_COOKIE_NAME,
  xsrfHeaderName: AXIOS_CONFIG.XSRF_HEADER_NAME,
});

carHarttApi.interceptors.request.use((config) => {
  // 요청 ID 부여 (서버/로그 추적)
  if (!config.headers[AXIOS_CONFIG.REQUEST_ID_HEADER]) {
    config.headers[AXIOS_CONFIG.REQUEST_ID_HEADER] = getUuid();
  }
  return config;
});

/**
 * 응답 인터셉터: API 규격 기반 표준 처리
 */
carHarttApi.interceptors.response.use(
  (res) => {
    const requestId =
      res.headers?.['x-request-id'] ||
      res.headers?.['X-Request-Id'] ||
      res.config?.headers?.[AXIOS_CONFIG.REQUEST_ID_HEADER];

    const body = res.data;

    // API 규격: { success: true|false, data|error, meta }
    if (body && typeof body === 'object' && 'success' in body) {
      // 성공 규격: { success: true, data, meta }
      if (body.success === true) {
        return {
          data: body.data,
          meta: { ...(body.meta || {}), requestId },
          status: res.status ?? '200',
          headers: res.headers,
        };
      }

      // 실패 규격: { success: false, error: {code, message, details[]}, meta }
      const err = new ApiError({
        code: body.error.code ?? 'UNKNOWN',
        message: body.error.message,
        details: body.error.detail ?? [],
        status: res.status ?? '404',
        requestId,
        meta: body.meta,
        url: res.config?.url,
        method: res.config?.method?.toUpperCase(),
      });

      return Promise.reject(err);
    }

    // 정의된 규격 외 응답이면 원본 data만 통과
    return body;
  },
  // 예기치 못한 에러 대응
  (error) => {
    const res = error?.response;
    const cfg = error?.config || {};
    const requestId =
      res?.headers?.['x-request-id'] ||
      cfg.headers?.[AXIOS_CONFIG.REQUEST_ID_HEADER];

    // 네트워크/타임아웃 등 일반 Axios 에러를 처리
    const code =
      error.code === 'ECONNABORTED'
        ? 'TIMEOUT'
        : res?.status
          ? `HTTP_${res.status}`
          : 'NETWORK_ERROR';

    const err = new ApiError(error.message, {
      code,
      status: res?.status ?? 0,
      requestId,
      url: cfg.url,
      method: cfg.method?.toUpperCase(),
    });

    return Promise.reject(err);
  }
);
