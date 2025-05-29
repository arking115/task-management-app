import { useEffect, useState } from 'react';
import axios from '../api/axios';
import ModalPortal from '../components/ModalPortal';

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
  const [modalUserId, setModalUserId] = useState<number | null>(null);

  useEffect(() => {
    axios.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = (id: number) => {
    setModalUserId(id);
  };

  const cancelDelete = () => {
    setModalUserId(null);
  };

  const performDelete = async () => {
    if (modalUserId === null) return;
    try {
      await axios.delete(`/admin/users/${modalUserId}`);
      setUsers(prev => prev.filter(user => user.id !== modalUserId));
    } catch (err) {
      console.error('Failed to delete user', err);
      alert('Failed to delete user.');
    } finally {
      setModalUserId(null);
    }
  };

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
                  onClick={() => confirmDelete(user.id)}
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

      {modalUserId !== null && (
        <ModalPortal>
          <div style={modalBackdropStyle}>
            <div style={modalStyle}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Delete this user?</h3>
              <p style={{ marginBottom: '1.5rem', color: '#6B7280' }}>
                This action is permanent and cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  onClick={cancelDelete}
                  style={{
                    backgroundColor: '#E5E7EB',
                    color: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={performDelete}
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
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

const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  minWidth: '320px',
  maxWidth: '90%',
};

export default UserManagement;
