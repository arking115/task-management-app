import { useEffect, useState } from 'react';
import axios from '../api/axios';
import PageWrapper from '../components/PageWrapper';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'New' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled';
  deadline: string;
  category: { id: number; name: string };
  createdAt: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    categoryId: '',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5232/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (id: number, newStatus: Task['status']) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5232/tasks/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5232/tasks',
        {
          title: newTask.title,
          description: newTask.description,
          deadline: newTask.deadline,
          categoryId: parseInt(newTask.categoryId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks((prev) => [...prev, response.data]);
      setNewTask({ title: '', description: '', deadline: '', categoryId: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const groupedTasks = {
    New: tasks.filter((task) => task.status === 'New'),
    InProgress: tasks.filter((task) => task.status === 'InProgress'),
    OnHold: tasks.filter((task) => task.status === 'OnHold'),
    Completed: tasks.filter((task) => task.status === 'Completed'),
    Cancelled: tasks.filter((task) => task.status === 'Cancelled'),
  };

  if (loading) return <PageWrapper wide><p>Loading...</p></PageWrapper>;
  if (error) return <PageWrapper wide><p style={{ color: 'red' }}>{error}</p></PageWrapper>;

  return (
    <PageWrapper wide>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Your Tasks</h1>

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
            <form onSubmit={handleCreateTask} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 500 }}>
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
              <input
                type="number"
                placeholder="Category ID"
                required
                value={newTask.categoryId}
                onChange={(e) => setNewTask({ ...newTask, categoryId: e.target.value })}
              />
              <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#82ca9d', color: '#fff', border: 'none', borderRadius: '6px' }}>
                Create Task
              </button>
            </form>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2rem' }}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status}>
              <h3>{status}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tasks.map((task) => {
                  const isExpanded = expandedTaskId === task.id;
                  return (
                    <div
                      key={task.id}
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      style={{
                        background: '#fff',
                        padding: isExpanded ? '1.5rem' : '1rem',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderLeft: `4px solid ${
                          status === 'New'
                            ? '#8884d8'
                            : status === 'InProgress'
                            ? '#82ca9d'
                            : status === 'OnHold'
                            ? '#ffbb28'
                            : status === 'Completed'
                            ? '#00c49f'
                            : '#ff6961'
                        }`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: isExpanded ? 'scale(1.03)' : 'scale(1)',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{task.title}</div>
                      <div style={{ fontSize: '0.9rem', color: '#555' }}>{task.category.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </div>

                      {isExpanded && (
                        <div style={{ marginTop: '1rem' }}>
                          <p style={{ color: '#333', fontSize: '0.95rem' }}>{task.description}</p>
                          <label
                            htmlFor={`status-${task.id}`}
                            style={{ display: 'block', marginTop: '1rem' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Change Status:
                          </label>
                          <select
                            id={`status-${task.id}`}
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleStatusChange(task.id, e.target.value as Task['status'])
                            }
                            style={{
                              marginTop: '0.5rem',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              width: '100%',
                            }}
                          >
                            <option value="New">New</option>
                            <option value="InProgress">In Progress</option>
                            <option value="OnHold">On Hold</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Tasks;
