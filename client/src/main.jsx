import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import './index.css';
import App from './App.jsx';
import store from './redux/appStore'; // Import your store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap your app with Provider */}
      <App />
    </Provider>
  </StrictMode>
);
