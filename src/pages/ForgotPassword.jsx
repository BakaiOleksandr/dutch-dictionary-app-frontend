import {useState} from 'react';
import BackButton from '../components/BackButton';
import {useError} from '../context/ErrorContext';
const API = import.meta.env.VITE_API;
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const {showError} = useError();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword) {
      showError('Fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch(`${API}/auth/forgot`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, newPassword}),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmail('');
        setNewPassword('');
        showError(data.message || 'Error');

        return;
      }

      setSuccess(data.message);
    } catch (err) {
      showError('Server error');
    }
  };

  return (
    <div>
      <BackButton />
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {success && <p style={{color: 'green'}}>{success}</p>}
    </div>
  );
}
