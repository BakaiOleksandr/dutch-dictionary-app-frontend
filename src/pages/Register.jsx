import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmailAndPassword } from '../utils/validation';
import { useError } from '../context/ErrorContext';
import { AuthContext } from '../context/AuthContext';

const API = import.meta.env.VITE_API;

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showError } = useError();
  const { loginWithToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateEmailAndPassword(email, password);
    if (!validation.valid) {
      showError(validation.message);
      return;
    }

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || 'Registration error');
        return;
      }

      await loginWithToken(data.token); // ⭐ ключевая строка
      navigate('/app',{ replace: true });

    } catch {
      showError('Server error');
    }
  };

  return (
    <>
      <Link style={{display: 'flex', justifyContent: 'center'}} to={'/'}>
        <button style={{backgroundColor: 'lightblue'}}>Home</button>
      </Link>

      <div className="h1-container">
        <h2>Register</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
    </>
  );
}
