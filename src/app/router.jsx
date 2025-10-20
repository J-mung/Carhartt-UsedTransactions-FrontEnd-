import LoginPage from '@/pages/login';
import LoginCallback from '@/pages/login/ui/LoginCallback';
import PaymentPage from '@/pages/payment';
import PaymentResult from '@/pages/payment/ui/PaymentResult';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import TestProfilePage from '../pages/profile';
import MainLayout from './layouts/MainLayout';
import SingleProductPage from '../pages/product';
// import ProductUploadPage from '@/pages/product-upload';
// import ProductsPage from '@/pages/home/ProductsPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout stickyFooter={false} />,
      children: [
        { index: true, element: <HomePage /> },
        // { index: true, element: <ProductsPage /> },
        { path: 'profile', element: <TestProfilePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'login/callback', element: <LoginCallback /> },
        { path: 'single-product', element: <SingleProductPage /> },
        // { path: '/product/new', element: <ProductUploadPage /> },
        // { path: '/product/:itemId/edit', element: <ProductUploadPage /> },
        { path: 'payment', element: <PaymentPage /> },
        { path: 'payment/result', element: <PaymentResult /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
