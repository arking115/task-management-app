import { useEffect, useState } from 'react';
import axios from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'New' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled';
  deadline: string;
  createdAt: string;
  category: { id: number; name: string };
  assignedUser: { id: number; name: string; email: string };
}

interface Category {
  id: number;
  name: string;
}

const statusColors: Record<Task['status'], string> = {
  New: '#4F46E5',
  InProgress: '#F59E0B',
  OnHold: '#9CA3AF',
  Completed: '#10B981',
  Cancelled: '#EF4444',
};

const Tasks = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<'date_added' | ''>('date_added');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    categoryId: '',
  });

  const fetchData = async () => {
    try {
      const params: any = {};
      if (sortField) {
        params.sort = sortField;
        params.order = sortOrder;
      }
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const [taskRes, categoryRes] = await Promise.all([
        axios.get('/tasks', { params }),
        axios.get('/categories'),
      ]);
      setTasks(taskRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks or categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortField, sortOrder, statusFilter, categoryFilter]);

  const toggleSort = (field: 'date_added') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (id: number, status: Task['status']) => {
    try {
      await axios.put(`/tasks/${id}`, { status });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status } : task))
      );
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/tasks', {
        title: newTask.title,
        description: newTask.description,
        deadline: newTask.deadline,
        categoryId: parseInt(newTask.categoryId),
      });
      setTasks((prev) => [...prev, response.data]);
      setNewTask({ title: '', description: '', deadline: '', categoryId: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  if (loading) return <PageWrapper wide><p>Loading...</p></PageWrapper>;
  if (error) return <PageWrapper wide><p style={{ color: 'red' }}>{error}</p></PageWrapper>;

  return (
    <PageWrapper wide>
      <h1 style={{
        fontSize: '2.2rem',
        marginBottom: '1rem',
        color: '#4F46E5',
        background: 'linear-gradient(90deg, #4F46E5, #6366F1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Tasks
      </h1>

      {isAdmin && (
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 18px',
              backgroundColor: '#4F46E5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              boxShadow: '0 2px 6px rgba(79,70,229,0.3)',
              cursor: 'pointer',
              transition: 'background 0.2s ease-in-out',
            }}
          >
            {showForm ? 'Cancel' : '➕ Add Task'}
          </button>

          {showForm && (
            <form
              onSubmit={handleCreateTask}
              style={{
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxWidth: 500,
                backgroundColor: '#fff',
                padding: '1.2rem',
                borderRadius: '10px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
              }}
            >
              <input type="text" placeholder="Title" required
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
              <textarea placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              <input type="date" required
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} />
              <select required
                value={newTask.categoryId}
                onChange={(e) => setNewTask({ ...newTask, categoryId: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button type="submit" style={{
                backgroundColor: '#10B981',
                color: '#fff',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}>
                ✅ Create Task
              </button>
            </form>
          )}
        </div>
      )}

      {/* Task Table */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F3F4F6' }}>
              <th style={thStyle} onClick={() => toggleSort('date_added')}>
                Date Added {sortField === 'date_added' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Assigned</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Category</th>
              {isAdmin && <th style={thStyle}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={tdStyle}>{new Date(task.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>{task.title}</td>
                <td style={tdStyle}>{task.assignedUser?.name || '—'}</td>
                <td style={tdStyle}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                    style={{
                      backgroundColor: statusColors[task.status] + '20',
                      color: statusColors[task.status],
                      border: `1px solid ${statusColors[task.status]}70`,
                      borderRadius: '999px',
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      appearance: 'none',
                    }}
                  >
                    <option value="New">New</option>
                    <option value="InProgress">In Progress</option>
                    <option value="OnHold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={tdStyle}>{task.category.name}</td>
                {isAdmin && <td style={tdStyle}>—</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
};

const thStyle: React.CSSProperties = {
  padding: '14px 20px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#374151',
  backgroundColor: '#F3F4F6',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 20px',
  fontSize: '0.95rem',
  color: '#111827',
};

export default Tasks;
