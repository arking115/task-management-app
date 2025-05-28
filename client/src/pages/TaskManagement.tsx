import { useEffect, useState } from 'react';
import axios from '../api/axios';
import ModalPortal from '../components/ModalPortal';

interface Task {
  id: number;
  title: string;
  deadline: string;
  status: 'New' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled';
  assignedUser: { id: number; name: string; email: string };
}

const statusMap: Record<Task['status'], number> = {
  New: 0,
  InProgress: 1,
  OnHold: 2,
  Completed: 3,
  Cancelled: 4,
};

const statusColors: Record<Task['status'], string> = {
  New: '#4F46E5',
  InProgress: '#F59E0B',
  OnHold: '#9CA3AF',
  Completed: '#10B981',
  Cancelled: '#EF4444',
};

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalTaskId, setModalTaskId] = useState<number | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/admin/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: Task['status']) => {
    try {
      await axios.put(`/admin/tasks/${taskId}`, {
        status: statusMap[newStatus],
      });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Failed to update task status', err);
      alert('Could not update status.');
    }
  };

  const confirmDelete = (taskId: number) => {
    setModalTaskId(taskId);
  };

  const cancelDelete = () => {
    setModalTaskId(null);
  };

  const performDelete = async () => {
    if (modalTaskId === null) return;
    try {
      await axios.delete(`/tasks/${modalTaskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== modalTaskId));
    } catch (err) {
      console.error('Failed to delete task', err);
      alert('Failed to delete task.');
    } finally {
      setModalTaskId(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Task Management</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#F9FAFB' }}>
            <th style={thStyle}>Task ID</th>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Assigned User</th>
            <th style={thStyle}>Deadline</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={tdStyle}>{task.id}</td>
              <td style={tdStyle}>{task.title}</td>
              <td style={tdStyle}>{task.assignedUser?.name || '—'}</td>
              <td style={tdStyle}>{new Date(task.deadline).toLocaleDateString()}</td>
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
              <td style={tdStyle}>
<div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
  <button
    onClick={() => window.location.href = `/tasks/edit/${task.id}`}
    style={{
      backgroundColor: '#4F46E5',
      color: '#fff',
      border: 'none',
      borderRadius: '999px',
      padding: '6px 12px',
      fontSize: '0.85rem',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(79,70,229,0.3)',
    }}
  >
    ✏️ Edit
  </button>
  <button
    onClick={() => confirmDelete(task.id)}
    style={{
      backgroundColor: '#EF4444',
      color: '#fff',
      border: 'none',
      borderRadius: '999px',
      padding: '6px 12px',
      fontSize: '0.85rem',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(239,68,68,0.3)',
    }}
  >
    🗑 Delete
  </button>
</div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalTaskId !== null && (
  <ModalPortal>
    <div style={modalBackdropStyle}>
      <div style={modalStyle}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Delete this task?</h3>
        <p style={{ marginBottom: '1.5rem', color: '#6B7280' }}>This action is irreversible.</p>
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
  backdropFilter: 'blur(4px)',          // ✅ background blur
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,                          // ✅ top-most layer
};


const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
  minWidth: '320px',
  maxWidth: '90%',
};

export default TaskManagement;
