import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const TaskCreate = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: '',
    categoryId: '',
    assignedUserId: '',
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [catRes, userRes] = await Promise.all([
          axios.get('/categories'),
          axios.get('/admin/users'),
        ]);
        setCategories(catRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load users or categories.');
      }
    };

    fetchData();
  }, [isAdmin, navigate]);

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post('/categories', { name: newCategory });
      setCategories((prev) => [...prev, res.data]);
      setForm((f) => ({ ...f, categoryId: res.data.id }));
      setNewCategory('');
    } catch (err) {
      console.error(err);
      setError('Failed to create category.');
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    await axios.post('/tasks', {
      title: form.title,
      description: form.description,
      deadline: new Date(form.deadline).toISOString(), // ✅ ISO format
      status: 0, // ✅ 0 = "New"
      assignedUserId: parseInt(form.assignedUserId),
      categoryId: parseInt(form.categoryId),
    });

    navigate('/tasks');
  } catch (err: any) {
    console.error('Error details:', err.response?.data);
    setError(err.response?.data?.message || 'Failed to create task.');
  }
};


  return (
    <PageWrapper wide>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4rem',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
      }}>
        {/* Left column: Title + Subtext */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #4F46E5, #6366F1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Create New Task ✍️
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#6B7280' }}>
            Fill out the form to create a new task. You can choose from existing categories,
            assign a user, and set a deadline. Want a new category? Just add one below!
          </p>
          {error && <p style={{ color: '#EF4444', marginTop: '1rem' }}>{error}</p>}
        </div>

        {/* Right column: Form */}
        <div style={{
          flex: 1,
          minWidth: 360,
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, minHeight: '100px' }}
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
              style={inputStyle}
            />

            {/* Category dropdown */}
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              style={inputStyle}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Inline new category */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="New category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                style={addBtnStyle}
              >
                + Add
              </button>
            </div>

            {/* User dropdown */}
            <select
              required
              value={form.assignedUserId}
              onChange={(e) => setForm({ ...form, assignedUserId: e.target.value })}
              style={inputStyle}
            >
              <option value="">Assign to User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                padding: '14px',
                backgroundColor: '#10B981',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              ✅ Create Task
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  border: '1px solid #E5E7EB',
  borderRadius: '10px',
  fontSize: '1rem',
  backgroundColor: '#F9FAFB',
};

const addBtnStyle: React.CSSProperties = {
  padding: '12px 14px',
  backgroundColor: '#6366F1',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};

export default TaskCreate;
