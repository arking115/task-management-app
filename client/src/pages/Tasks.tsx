import { useEffect, useState } from 'react';
import axios from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import React from 'react';

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
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState<'date_added' | 'status' | 'category'>('date_added');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [taskDetails, setTaskDetails] = useState<Record<number, Task>>({});

  const statusMap: Record<Task['status'], number> = {
    New: 0,
    InProgress: 1,
    OnHold: 2,
    Completed: 3,
    Cancelled: 4,
  };

  const fetchData = async () => {
    try {
      const params: any = {};
      if (sortField) {
        params.sortBy = sortField;
        params.sortOrder = sortOrder;
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

  const toggleSort = (field: 'date_added' | 'status' | 'category') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (id: number, status: Task['status']) => {
    try {
      await axios.put(`/tasks/${id}`, { status: statusMap[status] });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status } : task))
      );
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleExpandTask = async (taskId: number) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      return;
    }

    if (!taskDetails[taskId]) {
      try {
        const res = await axios.get(`/tasks/${taskId}`);
        setTaskDetails((prev) => ({ ...prev, [taskId]: res.data }));
      } catch (err) {
        console.error(`Failed to fetch task ${taskId} details`, err);
        return;
      }
    }

    setExpandedTaskId(taskId);
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this task?');
    if (!confirm) return;

    try {
      await axios.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setExpandedTaskId(null);
    } catch (err) {
      console.error('Failed to delete task', err);
      alert('Failed to delete task.');
    }
  };

  const getHeaderStyle = (field: string): React.CSSProperties => ({
    ...thStyle,
    cursor: 'pointer',
    textDecoration: sortField === field ? 'underline' : undefined,
    color: sortField === field ? '#4F46E5' : '#374151',
  });

  const getSortArrow = (field: string) =>
    sortField === field ? (sortOrder === 'asc' ? '↑' : '↓') : '';

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
      onClick={() => navigate('/tasks/create')}
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
      ➕ Add Task
    </button>
  </div>
)}


      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F3F4F6' }}>
              <th style={getHeaderStyle('date_added')} onClick={() => toggleSort('date_added')}>
                Date Added {getSortArrow('date_added')}
              </th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Assigned</th>
              <th style={getHeaderStyle('status')} onClick={() => toggleSort('status')}>
                Status {getSortArrow('status')}
              </th>
              <th style={getHeaderStyle('category')} onClick={() => toggleSort('category')}>
                Category {getSortArrow('category')}
              </th>
              {isAdmin && <th style={thStyle}>Actions</th>}
            </tr>
          </thead>
          <tbody>
{tasks.map((task) => (
  <React.Fragment key={task.id}>
    <tr>
      <td style={tdStyle} onClick={() => handleExpandTask(task.id)}>
        {new Date(task.createdAt).toLocaleDateString()}
      </td>
      <td style={tdStyle} onClick={() => handleExpandTask(task.id)}>{task.title}</td>
      <td style={tdStyle} onClick={() => handleExpandTask(task.id)}>{task.assignedUser?.name || '—'}</td>
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
          onClick={(e) => e.stopPropagation()}
        >
          <option value="New">New</option>
          <option value="InProgress">In Progress</option>
          <option value="OnHold">On Hold</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </td>
      <td style={tdStyle} onClick={() => handleExpandTask(task.id)}>{task.category.name}</td>
      {isAdmin && (
        <td style={tdStyle}>
          <select
            onChange={(e) => {
              const action = e.target.value;
              if (action === 'edit') navigate(`/tasks/edit/${task.id}`);
              else if (action === 'delete') handleDelete(task.id);
              e.currentTarget.selectedIndex = 0; // reset to default
            }}
            defaultValue=""
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '0.9rem',
              backgroundColor: '#F9FAFB',
              cursor: 'pointer',
            }}
          >
            <option disabled value="">Select</option>
            <option value="edit">✏️ Edit</option>
            <option value="delete">🗑️ Delete</option>
          </select>
        </td>
      )}
    </tr>

    {expandedTaskId === task.id && taskDetails[task.id] && (
      <tr>
        <td colSpan={isAdmin ? 6 : 5} style={{ padding: '1rem 2rem', backgroundColor: '#f9fafb' }}>
          <div style={{
            animation: 'zoomIn 0.3s ease',
            transformOrigin: 'top',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            position: 'relative'
          }}>
            <button
              onClick={() => setExpandedTaskId(null)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: '#9CA3AF'
              }}
              title="Close"
            >
              ×
            </button>
            <h3 style={{ margin: '0 0 0.5rem' }}>{taskDetails[task.id].title}</h3>
            <p style={{ marginBottom: '1rem', color: '#4B5563' }}>
              {taskDetails[task.id].description?.trim() || 'No description provided.'}
            </p>
            <p><strong>Status:</strong> {taskDetails[task.id].status}</p>
            <p><strong>Deadline:</strong> {new Date(taskDetails[task.id].deadline).toLocaleDateString()}</p>
            <p><strong>Assigned User:</strong> {taskDetails[task.id].assignedUser.name} ({taskDetails[task.id].assignedUser.email})</p>
          </div>
        </td>
      </tr>
    )}
  </React.Fragment>
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
