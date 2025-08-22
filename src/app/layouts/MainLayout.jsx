import Footer from '@/widgets/footer/Footer';
import Header from '@/widgets/header/Header';
import './layout.scss';
/**
 * 앱 공통 레이아웃
 * - 헤더/푸터는 기본 위젯을 사용하되, 필요 시 교체 슬롯 지원
 * - stickyFooter 옵션으로 바닥 고정 모드 on/off
 */

export default function MainLayout({
  headerSlot = <Header title="Carhartt 중고거래 플랫폼" />,
  footerSlot = <Footer />,
  stickyFooter = false,
  children,
}) {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="app__header" role="banner">
        <div className="container header__inner">{headerSlot}</div>
      </header>

      <main id="main" className="app__main" role="main">
        <div className="container">{children}</div>
      </main>

      <footer
        className={`app__footer ${stickyFooter ? 'app__footer--sticky' : ''}`}
        role="contentinfo"
      >
        <div className="container footer__inner">{footerSlot}</div>
      </footer>
    </div>
  );
}
