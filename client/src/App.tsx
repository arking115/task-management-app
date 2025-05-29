import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import TaskCreate from './pages/TaskCreate';
import EditTask from './pages/EditTask';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  return (<div>
      <Navbar />
      <div style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/tasks/create" element={<TaskCreate />} />
          <Route path="/tasks/edit/:id" element={<EditTask />} />
          <Route path="/admin_panel" element={<AdminPanel />} />
        </Routes>
      </div>
      </div>
  );
}

export default App;
