import {Routes, Route} from 'react-router-dom';
import Start from './pages/Start';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Folder from './pages/Folder';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
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

      ✅ {/* ВОТ ЭТОГО НЕ ХВАТАЛО */}
      <Route
        path="/folders/:id"
        element={
          <ProtectedRoute>
            <Folder />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
