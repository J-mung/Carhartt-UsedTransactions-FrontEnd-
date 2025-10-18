import LoginPage from '@/pages/login';
import LoginCallback from '@/pages/login/ui/LoginCallback';
import PaymentPage from '@/pages/payment';
import PaymentResult from '@/pages/payment/ui/PaymentResult';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import TestProfilePage from '../pages/profile';
import MainLayout from './layouts/MainLayout';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout stickyFooter={false} />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'profile', element: <TestProfilePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'login/callback', element: <LoginCallback /> },
        { path: 'payment', element: <PaymentPage /> },
        { path: 'payment/result', element: <PaymentResult /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
