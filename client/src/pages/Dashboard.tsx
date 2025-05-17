import { useEffect, useState } from 'react';
import axios from '../api/axios';
import PageWrapper from '../components/PageWrapper';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Navigate } from 'react-router-dom';

interface StatusCounts {
  New: number;
  InProgress: number;
  OnHold: number;
  Completed: number;
  Cancelled: number;
}

const COLORS = ['#6366F1', '#F59E0B', '#9CA3AF', '#10B981', '#EF4444'];

const Dashboard = () => {
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null);
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    axios
      .get('/auth/me', { withCredentials: true })
      .then(() => {
        setAuthenticated(true);
        return axios.get('/dashboard', { withCredentials: true });
      })
      .then((res) => {
        setStatusCounts(res.data.statusCounts);
        setTotalTasks(res.data.totalTasks);
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, []);

  if (authenticated === false) return <Navigate to="/login" />;
  if (authenticated === null || !statusCounts) {
    return (
      <div
        style={{
          height: 'calc(100vh - 60px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            padding: '2rem 3rem',
            borderRadius: '12px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            textAlign: 'center',
            fontSize: '1.25rem',
            color: '#666'
          }}
        >
          ⏳ Checking session...
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'New', value: statusCounts.New },
    { name: 'In Progress', value: statusCounts.InProgress },
    { name: 'On Hold', value: statusCounts.OnHold },
    { name: 'Completed', value: statusCounts.Completed },
    { name: 'Cancelled', value: statusCounts.Cancelled }
  ];

  const badgeStyle = (color: string): React.CSSProperties => ({
    backgroundColor: color + '20',
    color,
    fontWeight: 600,
    padding: '10px 16px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
  });

  return (
    <PageWrapper>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: '2rem',
          marginTop: '2rem',
          alignItems: 'flex-start',
        }}
      >
        {/* Stats Column */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minWidth: '300px',
          }}
        >
          <h2
            style={{
              fontSize: '2rem',
              marginBottom: '0.5rem',
              background: 'linear-gradient(90deg, #4F46E5, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Your Task Overview
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#374151' }}>
            Total Tasks: <strong style={{ color: '#4F46E5' }}>{totalTasks}</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={badgeStyle(COLORS[0])}>🆕 New: {statusCounts.New}</div>
            <div style={badgeStyle(COLORS[1])}>🚧 In Progress: {statusCounts.InProgress}</div>
            <div style={badgeStyle(COLORS[2])}>⏸️ On Hold: {statusCounts.OnHold}</div>
            <div style={badgeStyle(COLORS[3])}>✅ Completed: {statusCounts.Completed}</div>
            <div style={badgeStyle(COLORS[4])}>❌ Cancelled: {statusCounts.Cancelled}</div>
          </div>
        </div>

        {/* Chart Column */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            minWidth: '300px',
            height: '100%',
          }}
        >
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#111827' }}>
            Task Distribution
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
