import App from '@/app/App.jsx';
import Providers from '@/app/providers.jsx';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <Providers>
    <App />
  </Providers>
);
