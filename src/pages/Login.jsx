import {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {validateEmailAndPassword} from '../utils/validation';
import {Link} from 'react-router-dom';

export default function Login() {
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateEmailAndPassword(email, password);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const res = await login(email, password);

    if (res.token) {
      localStorage.setItem('token', res.token);
      navigate('/app');
    } else {
      alert(res.message || 'Login failed');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
      <p>
        Forgot password? <Link to="/forgot">Reset here</Link>
      </p>

      <button onClick={() => navigate('/')}>Back Home</button>
    </>
  );
}
