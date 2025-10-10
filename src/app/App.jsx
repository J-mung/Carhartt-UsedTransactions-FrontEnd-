import { router as defaultRouter } from '@/app/router.jsx';
import { RouterProvider } from 'react-router-dom';

export default function App({ router = defaultRouter }) {
  console.log('BASE_URL' + import.meta.env.VITE_API_BASE_URL);

  return <RouterProvider router={router} />;
}
