import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {AuthProvider} from './context/AuthContext';
import {BrowserRouter} from 'react-router-dom';
import {ErrorProvider} from './context/ErrorContext';
import {LoadingProvider} from './context/LoadingContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </ErrorProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
