import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import MainLayout from './layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout stickyFooter={false} />,
    children: [{ index: true, element: <HomePage /> }],
  },
]);
