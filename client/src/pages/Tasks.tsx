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

const Tasks = () => {
  const { userRole } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState<'date_added' | ''>('date_added');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Tasks</h1>

      {userRole === 'admin' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 16px',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {showForm ? 'Cancel' : 'Add Task'}
          </button>

          {showForm && (
            <form
              onSubmit={handleCreateTask}
              style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 500 }}
            >
              <input
                type="text"
                placeholder="Title"
                required
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <input
                type="date"
                required
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
              <select
                required
                value={newTask.categoryId}
                onChange={(e) => setNewTask({ ...newTask, categoryId: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#82ca9d', color: '#fff', border: 'none', borderRadius: '6px' }}>
                Create Task
              </button>
            </form>
          )}
        </div>
      )}

      {/* Task Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={thStyle} onClick={() => toggleSort('date_added')} title="Sort by Date">
              Date Added {sortField === 'date_added' && (sortOrder === 'asc' ? '▲' : '▼')}
            </th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Assigned User</th>
            <th style={thStyle}>
              <div onClick={() => setShowStatusDropdown(!showStatusDropdown)} style={{ cursor: 'pointer' }}>
                Status ▼
              </div>
              {showStatusDropdown && (
                <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                  <option value="">All</option>
                  <option value="New">New</option>
                  <option value="InProgress">In Progress</option>
                  <option value="OnHold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              )}
            </th>
            <th style={thStyle}>
              <div onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} style={{ cursor: 'pointer' }}>
                Category ▼
              </div>
              {showCategoryDropdown && (
                <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              )}
            </th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{new Date(task.createdAt).toLocaleDateString()}</td>
              <td style={tdStyle}>{task.title}</td>
              <td style={tdStyle}>{task.assignedUser?.name || 'Unassigned'}</td>
              <td style={tdStyle}>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                >
                  <option value="New">New</option>
                  <option value="InProgress">In Progress</option>
                  <option value="OnHold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td style={tdStyle}>{task.category.name}</td>
              <td style={tdStyle}>—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageWrapper>
  );
};

// Styling helpers
const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  color: '#444',
  cursor: 'pointer',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '0.95rem',
  color: '#333',
};

export default Tasks;
