import {useState} from 'react';
import {validateEmailAndPassword} from '../utils/validation';
import BackButton from '../components/BackButton';
import {useError} from '../context/ErrorContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {showError} = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validation = validateEmailAndPassword(email, password);
    if (!validation.valid) {
      showError(validation.message);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.message || 'Registration error');
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/app');
    } catch {
      showError('Server error');
    }
  };

  return (
    <>
      <BackButton />
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
