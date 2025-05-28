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

      const decoded: TokenPayload = jwtDecode(token);
      const rawRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const role = rawRole?.toLowerCase();

      if (!role) throw new Error('Role not found in token.');

      if (role === 'admin' || role === 'user') {
        login(role);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', role);

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: '4rem',
        }}
      >
        {/* Left side content for welcome / image */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4f46e5' }}>
            Welcome Back 
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '400px' }}>
            Log in to your account to manage tasks and stay productive. We're glad to see you again!
          </p>
        </div>

        {/* Right side: Login Card */}
        <div
          style={{
            flex: 1,
            maxWidth: '480px',
            backgroundColor: '#fff',
            padding: '2.5rem',
            borderRadius: '1.5rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="email"
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="password"
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
              >
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                }}
              />
            </div>
            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
            >
              Login
            </button>
          </form>
          <p style={{ marginTop: '1.25rem', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 500 }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
