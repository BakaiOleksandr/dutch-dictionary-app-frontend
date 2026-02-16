import {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import {validateEmailAndPassword} from '../utils/validation';
import {Link} from 'react-router-dom';
import {useError} from '../context/ErrorContext';
import {useNavigate} from 'react-router-dom';

export default function Login() {
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {showError} = useError();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateEmailAndPassword(email, password);
    if (!validation.valid) {
      showError(validation.message);
      return;
    }

    const res = await login(email, password);

    if (res.token) {
      navigate('/app', {replace: true});
    } else {
      showError(res.message || 'Login failed');
    }
  };

  return (
    <>
      <Link style={{display: 'flex', justifyContent: 'center'}} to={'/'}>
        <button style={{backgroundColor: 'lightblue'}}>Home</button>
      </Link>
      <div className="h1-container">
        <h2>Login</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          size={25}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          size={25}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
      <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <p>
          Forgot password? <Link to="/forgot">Reset here</Link>
        </p>
      </div>
    </>
  );
}
