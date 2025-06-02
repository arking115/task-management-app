import { useEffect, useState } from 'react';
import axios from '../api/axios';

interface LogEntry {
  id: number;
  taskTitle: string;
  oldStatus: string;
  newStatus: string;
  changedBy: {
    id: number;
    name: string;
    email: string;
  };
  changedAt: string;
}
const formatStatus = (status: string) =>
  status.replace(/([a-z])([A-Z])/g, '$1 $2');

const TaskHistory = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/admin/task-history');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load task history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <p>Loading history logs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Task History Logs</h2>
      

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#F9FAFB' }}>
            <th style={thStyle}>Task</th>
            <th style={thStyle}>Status Change</th>
            <th style={thStyle}>Changed By</th>
            <th style={thStyle}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={tdStyle}>{log.taskTitle}</td>
<td style={tdStyle}>
  <span style={{ fontWeight: 600, color: '#4F46E5' }}>{formatStatus(log.oldStatus)}</span> → <span style={{ fontWeight: 600, color: '#10B981' }}>{formatStatus(log.newStatus)}</span>
</td>
              <td style={tdStyle}>{log.changedBy?.name || 'Unknown'}</td>
              <td style={tdStyle}>{new Date(log.changedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

// ⬇︎ just append textAlign: 'left'
const tdStyle: React.CSSProperties = {
  padding: '14px 20px',
  fontSize: '0.95rem',
  color: '#111827',
  textAlign: 'left',          //  <-- NEW
};


export default TaskHistory;
