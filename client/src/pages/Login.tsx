import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/auth/login', { email, password }, { withCredentials: true });
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.log(err); // for debugging
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Try again later.');
      }
    }
  };

  return (
    <PageWrapper>
      <h2 style={{ marginBottom: '1.5rem' }}>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '93%',
              padding: '10px 14px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '93%',
              padding: '10px 14px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Login
        </button>
      </form>
      <p style={{ marginTop: '1.5rem' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </PageWrapper>
  );
};

export default Login;
