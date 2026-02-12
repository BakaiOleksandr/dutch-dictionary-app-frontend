import {Routes, Route} from 'react-router-dom';
import Start from './pages/Start';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Folder from './pages/Folder';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import {useContext} from 'react';
import {LoadingContext} from './context/LoadingContext';
import Spinner from './components/Spinner';

function App() {
  const {loading} = useContext(LoadingContext);
  return (
    <>
      {loading && <Spinner />}
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/folders/:folderId"
          element={
            <ProtectedRoute>
              <Folder />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
