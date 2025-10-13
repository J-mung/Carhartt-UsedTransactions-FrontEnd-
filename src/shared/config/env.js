export const ENV = {
  NAME: import.meta.env.VITE_ENV || 'development',
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL?.trim() ||
    (import.meta.env.VITE_ENV === 'production'
      ? 'https://carhartt-usedtransactions.com' // fallback
      : 'https://localhost:5173'),
};

export const IS_PROD = ENV.NAME === 'production';
export const IS_DEV = !IS_PROD;
