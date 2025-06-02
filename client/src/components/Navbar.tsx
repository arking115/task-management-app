import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.svg';       // ⭐ import the SVG

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';
  if (isAuthPage) return null;

  const linkStyle: React.CSSProperties = {
    padding: '10px 18px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    textDecoration: 'none',
    color: '#1a1a1a',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'background-color 0.2s, box-shadow 0.2s',
  };

  const linkHoverStyle: React.CSSProperties = {
    backgroundColor: '#f5f5f5',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        height: '50px',
      }}
    >
      {/* Left Side: Logo and Links */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 👇 Clickable logo leading to /dashboard */}
        <Link
          to="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            marginRight: '2rem',
          }}
        >
          <img
            src={logo}
            alt="Task Manager logo"
            style={{ height: '90px', width: 'auto' }}
          />
        </Link>

        <div style={{ display: 'flex', gap: '1.2rem' }}>
          <HoverableLink
            to="/dashboard"
            baseStyle={linkStyle}
            hoverStyle={linkHoverStyle}
          >
            Dashboard
          </HoverableLink>
          <HoverableLink
            to="/tasks"
            baseStyle={linkStyle}
            hoverStyle={linkHoverStyle}
          >
            Tasks
          </HoverableLink>
          {isAdmin && (
            <HoverableLink
              to="/admin_panel"
              baseStyle={linkStyle}
              hoverStyle={linkHoverStyle}
            >
              Admin Panel
            </HoverableLink>
          )}
        </div>
      </div>

      {/* Right Side: Logout */}
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #ff4d4f',
          backgroundColor: '#ff4d4f',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '0.95rem',
        }}
      >
        Logout
      </button>
    </nav>
  );
};

// Utility component to apply inline hover styles
const HoverableLink = ({
  to,
  baseStyle,
  hoverStyle,
  children,
}: {
  to: string;
  baseStyle: React.CSSProperties;
  hoverStyle: React.CSSProperties;
  children: React.ReactNode;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={to}
      style={{ ...baseStyle, ...(hover ? hoverStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </Link>
  );
};

export default Navbar;
