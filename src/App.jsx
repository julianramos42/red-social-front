import './App.css';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js'
import { router } from './pages/index.js'
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <Provider store={store}>
        <RouterProvider router={router} />
        <Analytics />
    </Provider>
  );
}

export default App;
