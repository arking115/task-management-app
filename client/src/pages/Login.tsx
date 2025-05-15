import { useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  [key: string]: any;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5232/auth/login', { email, password });

      const { token } = response.data;
      localStorage.setItem('token', token);

      // Decode role from JWT token
      const decoded: TokenPayload = jwtDecode(token);
      const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const role = rawRole?.toLowerCase(); // normalize to 'admin' or 'user'

      if (!role) {
        throw new Error('Role not found in token.');
      }

      if (role === 'admin' || role === 'user') {
        login(role); // Update context with role
      } else {
        throw new Error('Invalid role in token.');
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Something went wrong. Try again later.');
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
