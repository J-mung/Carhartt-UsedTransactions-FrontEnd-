import LoginPage from '@/pages/login';
import LoginCallback from '@/pages/login/ui/LoginCallback';
import PaymentPage from '@/pages/payment';
import PaymentResult from '@/pages/payment/ui/PaymentResult';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import TestProfilePage from '../pages/profile';
import SingleProductPage from '../pages/single-product';
import MainLayout from './layouts/MainLayout';
// import ProductUploadPage from '@/pages/product-upload';
import ProductsPage from '@/pages/home/ProductsPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout stickyFooter={false} />,
      children: [
        // { index: true, element: <HomePage /> },
        { index: true, element: <ProductsPage /> },
        { path: 'profile', element: <TestProfilePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'login/callback', element: <LoginCallback /> },
        { path: 'product/:itemId', element: <SingleProductPage /> },
        // { path: '/product/new', element: <ProductUploadPage /> },
        // { path: '/product/:itemId/edit', element: <ProductUploadPage /> },
        { path: `payment/:itemId`, element: <PaymentPage /> },
        { path: `payment/:itemId/result`, element: <PaymentResult /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
