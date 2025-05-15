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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#d0ed57'];

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

  return (
    <PageWrapper>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>
          Welcome to Your Dashboard
        </h1>

        <div style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          <p>Total Tasks: <strong>{totalTasks}</strong></p>
          <p>🆕 New: <strong>{statusCounts.New}</strong></p>
          <p>🚧 In Progress: <strong>{statusCounts.InProgress}</strong></p>
          <p>⏸️ On Hold: <strong>{statusCounts.OnHold}</strong></p>
          <p>✅ Completed: <strong>{statusCounts.Completed}</strong></p>
          <p>❌ Cancelled: <strong>{statusCounts.Cancelled}</strong></p>
        </div>

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
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
