import {createContext, useContext} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ErrorContext = createContext();

export const useError = () => useContext(ErrorContext);

export function ErrorProvider({children}) {
  // функция для ошибки
  const showError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      closeOnClick: true,
      theme: 'colored',
    });
  };

  return (
    <ErrorContext.Provider value={{showError}}>
      {children}
      <ToastContainer />
    </ErrorContext.Provider>
  );
}
