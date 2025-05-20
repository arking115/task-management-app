import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import UserManagement from './UserManagement';
import TaskManagement from './TaskManagement';
import TaskHistory from './TaskHistory';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'history'>('users');

  if (userRole !== 'admin') {
    return (
      <PageWrapper>
        <p style={{ color: 'red' }}>Access denied. Admins only.</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper wide>
      <div style={{ display: 'flex', gap: '2rem', minHeight: '600px' }}>
        {/* Sidebar navigation */}
        <aside style={{
          width: '280px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Admin Panel</h2>

          <div>
            <button onClick={() => setActiveTab('users')} style={tabStyle(activeTab === 'users')}>
              👥 User Management
            </button>
            <p style={descStyle}>View and manage all registered users. Delete users when needed.</p>
          </div>

          <div>
            <button onClick={() => setActiveTab('tasks')} style={tabStyle(activeTab === 'tasks')}>
              🛠 Task Management
            </button>
            <p style={descStyle}>Edit tasks, reassign users, and change task status or deadlines.</p>
          </div>

          <div>
            <button onClick={() => setActiveTab('history')} style={tabStyle(activeTab === 'history')}>
              📚 Task History
            </button>
            <p style={descStyle}>Browse the log of all task updates and status changes.</p>
          </div>
        </aside>

        {/* Content area */}
        <section style={{ flex: 1 }}>
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'tasks' && <TaskManagement />}
          {activeTab === 'history' && <TaskHistory />}
        </section>
      </div>
    </PageWrapper>
  );
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  width: '100%',
  textAlign: 'left',
  padding: '10px 14px',
  backgroundColor: active ? '#4F46E5' : '#F3F4F6',
  color: active ? '#ffffff' : '#1F2937',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '1rem'
});

const descStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6B7280',
  marginTop: '6px',
  marginBottom: '16px'
};

export default AdminPanel;
