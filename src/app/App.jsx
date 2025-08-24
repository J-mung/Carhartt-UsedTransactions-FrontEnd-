import MainLayout from '@/app/layouts/MainLayout';
import HomePage from '@/pages/home/HomePage.jsx';

export default function App({
  Page = HomePage,
  pageProps = {},
  layoutProps = { stickyFooter: false },
}) {
  return (
    <MainLayout {...layoutProps}>
      <Page {...pageProps} />
    </MainLayout>
  );
}
