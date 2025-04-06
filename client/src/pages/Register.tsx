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
      navigate('/login'); // Redirect after successful registration
    } catch (err: any) {
      console.log(err); // helpful for debugging
      if (err.response?.status === 400) {
        setError('Email already exists or invalid input.');
      } else {
        setError(err.response?.data?.message || 'Something went wrong. Try again later.');
      }
    }
  };

  return (
    <PageWrapper>
      <h2 style={{ marginBottom: '1.5rem' }}>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          Register
        </button>
      </form>
      <p style={{ marginTop: '1.5rem' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </PageWrapper>
  );
};

export default Register;
