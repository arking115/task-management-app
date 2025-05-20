import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import PageWrapper from '../components/PageWrapper';

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusMap: Record<string, number> = {
  New: 0,
  InProgress: 1,
  OnHold: 2,
  Completed: 3,
  Cancelled: 4,
};

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const [taskRes, catRes] = await Promise.all([
          axios.get(`/tasks/${id}`),
          axios.get('/categories')
        ]);
        setTask(taskRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev: any) => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const payload = {
      title: task.title,
      description: task.description,
      status: statusMap[task.status], // convert to int
      deadline: new Date(task.deadline).toISOString(), // ISO format
      assignedUserId: task.assignedUser?.id || task.assignedUserId || 0,
      categoryId: parseInt(task.category.id),
    };

    await axios.put(`/admin/tasks/${id}`, payload);
    navigate('/tasks');
  } catch (err) {
    console.error(err);
    alert('Failed to update task.');
  }
};


  if (loading) return <PageWrapper><p>Loading...</p></PageWrapper>;
  if (error) return <PageWrapper><p style={{ color: 'red' }}>{error}</p></PageWrapper>;
  if (!task) return <PageWrapper><p>Task not found.</p></PageWrapper>;

  return (
    <PageWrapper>
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2rem 2.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          background: 'linear-gradient(90deg, #4F46E5, #6366F1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Edit Task
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Title</label>
            <input type="text" name="title" value={task.title} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={task.description} onChange={handleChange} rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Deadline</label>
            <input type="date" name="deadline" value={task.deadline.split('T')[0]} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Category</label>
            <select name="category.id" value={task.category.id} onChange={handleChange} style={inputStyle}>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={task.status} onChange={handleChange} style={inputStyle}>
              <option value="New">New</option>
              <option value="InProgress">In Progress</option>
              <option value="OnHold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button type="submit" style={buttonStyle}>💾 Save Changes</button>
        </form>
      </div>
    </PageWrapper>
  );
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '1.25rem'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
  color: '#374151'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
  fontSize: '1rem',
  backgroundColor: '#F9FAFB',
  color: '#111827'
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#4F46E5',
  color: '#ffffff',
  padding: '0.75rem 1.5rem',
  border: 'none',
  borderRadius: '10px',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background 0.2s ease-in-out'
};

export default EditTask;
