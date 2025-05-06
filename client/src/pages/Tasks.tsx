import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done';
  deadline: string;
  category: { id: number; name: string };
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Design login screen',
    description: 'Create layout and design in Figma for the login screen.',
    status: 'To Do',
    deadline: '2025-05-25',
    createdAt: '2025-05-01',
    category: { id: 1, name: 'Frontend' },
  },
  {
    id: 2,
    title: 'Implement task API',
    description: 'Build and test the backend task API endpoints.',
    status: 'In Progress',
    deadline: '2025-05-20',
    createdAt: '2025-05-02',
    category: { id: 2, name: 'Backend' },
  },
  {
    id: 3,
    title: 'Fix dashboard pie chart',
    description: 'Resolve rendering issue in pie chart on dashboard.',
    status: 'Done',
    deadline: '2025-05-18',
    createdAt: '2025-05-03',
    category: { id: 3, name: 'Bugfix' },
  },
];

const Tasks = () => {
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const handleStatusChange = (id: number, newStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
<PageWrapper wide>
  <div>
    <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Your Tasks</h1>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
      }}
    >
      {['To Do', 'In Progress', 'Done'].map((status) => (
        <div key={status}>
          <h3>{status}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => {
                const isExpanded = expandedTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    onClick={() =>
                      setExpandedTaskId(isExpanded ? null : task.id)
                    }
                    style={{
                      background: '#fff',
                      padding: isExpanded ? '1.5rem' : '1rem',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderLeft: `4px solid ${
                        status === 'To Do'
                          ? '#8884d8'
                          : status === 'In Progress'
                          ? '#82ca9d'
                          : '#ffc658'
                      }`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: isExpanded ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#555' }}>
                      {task.category.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#999' }}>
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ color: '#333', fontSize: '0.95rem' }}>
                          {task.description}
                        </p>
                        <label
                          htmlFor={`status-${task.id}`}
                          style={{ display: 'block', marginTop: '1rem' }}
                          onClick={(e) => e.stopPropagation()} // prevent label click from collapsing
                        >
                          Change Status:
                        </label>
                        <select
                          id={`status-${task.id}`}
                          value={task.status}
                          onClick={(e) => e.stopPropagation()} // ✅ this line prevents closing
                          onChange={(e) =>
                            handleStatusChange(
                              task.id,
                              e.target.value as Task['status']
                            )
                          }
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            width: '100%',
                          }}
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Done">Done</option>
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
