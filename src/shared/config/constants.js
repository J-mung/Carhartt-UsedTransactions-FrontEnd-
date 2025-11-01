export const AXIOS_CONFIG = {
  TIMEOUT_MS: 10000,
  XSRF_COOKIE_NAME: 'XSRF-TOKEN',
  XSRF_HEADER_NAME: 'X-XSRF-TOKEN',
  REQUEST_ID_HEADER: 'X-Request-Id',

  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Accept-Charset': 'utf-8',
    'X-Server-Timezone': 'UTC',
    'X-Server-Time-Format': 'ISO-8601',
  },
};
