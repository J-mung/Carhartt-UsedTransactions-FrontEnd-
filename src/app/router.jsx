import TestProfilePage from '@/pages/profile/TestProfilePage';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import MainLayout from './layouts/MainLayout';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout stickyFooter={false} />,
      children: [
        { index: true, element: <HomePage /> },
        { path: '/profile', element: <TestProfilePage /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
