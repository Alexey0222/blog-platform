import { Provider } from 'react-redux';
import './index.module.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';

import store from './store';
import App from './Component/App/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
