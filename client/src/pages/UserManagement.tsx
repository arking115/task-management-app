import { useEffect, useState } from 'react';
import axios from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      await axios.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>User Management</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#F9FAFB' }}>
            <th style={thStyle}>User ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={tdStyle}>{user.id}</td>
              <td style={tdStyle}>{user.name}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  backgroundColor: user.role === 'admin' ? '#E0E7FF' : '#F3F4F6',
                  color: user.role === 'admin' ? '#4338CA' : '#374151',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  {user.role}
                </span>
              </td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#374151',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '0.95rem',
  color: '#111827',
};

export default UserManagement;
