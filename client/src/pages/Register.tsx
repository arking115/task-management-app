import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        setError('Email already exists or invalid input.');
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Try again later.');
      }
    }
  };

  return (
    <div style={{ marginTop: '-60px' }}>
    <PageWrapper wide>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: '4rem',
        }}
      >
        {/* Left Side */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4f46e5' }}>
            Create an Account 
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '400px' }}>
            Start managing your tasks efficiently and stay on top of your goals. Register to begin!
          </p>
        </div>

        {/* Right Side: Form */}
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
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Register</h2>
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="name"
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
              >
                Name:
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              Register
            </button>
          </form>
          <p style={{ marginTop: '1.25rem', fontSize: '0.95rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 500 }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
    </div>
  );
};

export default Register;
