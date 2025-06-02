import { useEffect, useState } from 'react';
import axios from '../api/axios';
import ModalPortal from '../components/ModalPortal';

interface Category {
  id: number;
  name: string;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [modalCategoryId, setModalCategoryId] = useState<number | null>(null);

  useEffect(() => {
    axios.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => setError('Failed to fetch categories.'));
  }, []);

  const confirmDelete = (id: number) => {
    setModalCategoryId(id);
  };

  const cancelDelete = () => {
    setModalCategoryId(null);
  };

  const performDelete = async () => {
    if (modalCategoryId === null) return;
    try {
      await axios.delete(`/categories/${modalCategoryId}`);
      setCategories(prev => prev.filter(cat => cat.id !== modalCategoryId));
    } catch {
      setError('Failed to delete category.');
    } finally {
      setModalCategoryId(null);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📂 Category Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td style={tdStyle}>{cat.id}</td>
              <td style={tdStyle}>{cat.name}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => confirmDelete(cat.id)}
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalCategoryId !== null && (
        <ModalPortal>
          <div style={modalBackdropStyle}>
            <div style={modalStyle}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Delete this category?</h3>
              <p style={{ marginBottom: '1.5rem', color: '#6B7280' }}>
                Tasks under this category will move to "Uncategorized".
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
  textAlign: 'left',
  padding: '8px',
  borderBottom: '1px solid #ccc'
};

// ⬇︎ just append textAlign: 'left'
const tdStyle: React.CSSProperties = {
  padding: '14px 20px',
  fontSize: '0.95rem',
  color: '#111827',
  textAlign: 'left',          //  <-- NEW
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

export default CategoryManagement;
