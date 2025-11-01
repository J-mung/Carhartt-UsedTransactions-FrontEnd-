import react from '@vitejs/plugin-react';
import fs from 'fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // .env.development 또는 .env.production 파일 로드
  const env = loadEnv(mode, process.cwd());

  console.log('🧩 [VITE DEBUG]');
  console.log('NODE_ENV:', mode);
  console.log('VITE_USE_HTTPS:', env.VITE_USE_HTTPS);
  console.log('HOME:', process.env.HOME);
  console.log('Working dir:', process.cwd());
  console.log('====================');

  const useHttps = env.VITE_USE_HTTPS === 'true';

  return {
    base: '/',
    plugins: [react()],
    optimizeDeps: {
      include: ['cookie', 'set-cookie-parser', 'pica'],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@styles': path.resolve(__dirname, './src/shared/styles'),
      },
    },
    build: {
      rollupOptions: {
        external: ['set-cookie-parser'],
      },
    },
    server: {
      ...(useHttps
        ? {
            https: {
              key: fs.readFileSync(
                path.resolve(process.env.HOME, '.cert/localhost-key.pem')
              ),
              cert: fs.readFileSync(
                path.resolve(process.env.HOME, '.cert/localhost-cert.pem')
              ),
            },
          }
        : {}), // HTTPS 비활성화 시 옵션 제거
      host: 'carhartt-local.com',
      proxy: {
        '^/v1': {
          target: 'https://carhartt-usedtransactions.com',
          changeOrigin: true,
          secure: false, // self-signed 인증서면 false
          rewrite: (path) => path.replace(/^\/v1/, '/v1'),

          configure: (proxy, options) => {
            proxy.on('proxyRes', (proxyRes) => {
              const cookies = proxyRes.headers['set-cookie'];
              if (cookies) {
                // 원본 쿠키 헤더를 localhost 기준으로 변경
                const newCookies = cookies.map((cookie) => {
                  // domain 재설정 / 프록시 쿠키를 localhost로 저장
                  let modified = cookie
                    .replace(/Domain=[^;]+/i, 'Domain=localhost')
                    .replace(/SameSite=[^;]+/i, 'SameSite=None');

                  // 개발환경에서 secure 제거 가능 (HTTP로 테스트 시)
                  if (!useHttps) {
                    modified = modified.replace(/; Secure/gi, '');
                  }

                  return modified;
                });

                proxyRes.headers['set-cookie'] = newCookies;
              }
            });
          },
        },
      },
    },
  };
});
