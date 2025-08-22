import MainLayout from '@/app/layouts/MainLayout';
import HomePage from '@/pages/home/HomePage.jsx';

export default function App() {
  return (
    <MainLayout stickyFooter={false}>
      <HomePage />
    </MainLayout>
  );
}
