import { useEffect, useState } from 'react';
import axios from '../api/axios';

interface Task {
  id: number;
  title: string;
  deadline: string;
  assignedUser: { id: number; name: string; email: string } | null;
  category: string | null;
}

const UnassignedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/admin/tasks');
        const filtered = res.data.filter(
          (t: Task) => !t.assignedUser || t.category?.toLowerCase() === 'uncategorized'
        );
        setTasks(filtered);
      } catch (err) {
        console.error(err);
        setError('Failed to load unassigned tasks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p>Loading unassigned tasks...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '12px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        Unassigned or Uncategorized Tasks
      </h2>
      {tasks.length === 0 ? (
        <p>No unassigned or uncategorized tasks found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
              <strong>{task.title}</strong> (ID: {task.id})<br />
              Assigned: {task.assignedUser?.name || '—'}<br />
              Category: {task.category || '—'}<br />
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UnassignedTasks;
