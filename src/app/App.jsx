import { router as defaultRouter } from '@/app/router.jsx';
import { RouterProvider } from 'react-router-dom';

export default function App({ router = defaultRouter }) {
  return <RouterProvider router={router} />;
}
