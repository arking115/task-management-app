import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'New' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled';
}

const statusColors: Record<Task['status'], string> = {
  New: '#4F46E5',
  InProgress: '#F59E0B',
  OnHold: '#9CA3AF',
  Completed: '#10B981',
  Cancelled: '#EF4444',
};

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { userRole } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/tasks/${id}`)
      .then((res) => setTask(res.data))
      .catch((err) => console.error('Error fetching task:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageWrapper><p>Loading...</p></PageWrapper>;
  if (!task) return <PageWrapper><p>Task not found.</p></PageWrapper>;

  return (
    <PageWrapper>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: '#1F2937',
          }}
        >
          {task.title}
        </h1>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#374151',
            marginBottom: '1.5rem',
            whiteSpace: 'pre-wrap',
          }}
        >
          {task.description || 'No description provided.'}
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <strong style={{ marginRight: '0.5rem' }}>Status:</strong>
          <span
            style={{
              backgroundColor: statusColors[task.status] + '20',
              color: statusColors[task.status],
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {task.status.replace(/([A-Z])/g, ' $1').trim()}
          </span>
        </div>

        {userRole === 'admin' && (
          <div
            style={{
              padding: '1.25rem',
              border: '1px dashed #CBD5E1',
              borderRadius: '12px',
              backgroundColor: '#F9FAFB',
              color: '#64748B',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            Admin features coming soon: assign users, edit details, log history...
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default TaskDetail;
