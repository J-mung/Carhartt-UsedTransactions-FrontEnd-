import LoginPage from '@/pages/login';
import PaymentPage from '@/pages/payment';
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
        { path: 'payment', element: <PaymentPage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
