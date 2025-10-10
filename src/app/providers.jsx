import { ThemeProvider } from '@/shared/lib/theme';
import '@/shared/styles/global.scss'; // 전역 스타일/토큰
import ModalProvider from '@/widgets/modal/ModalProvider';

/**
 * 전역 Provider 연결만 담당
 * @param {*} param0
 * @returns
 */
export default function Providers({ children }) {
  return (
    <ThemeProvider initial="system">
      <ModalProvider>{children}</ModalProvider>
    </ThemeProvider>
  );
}
