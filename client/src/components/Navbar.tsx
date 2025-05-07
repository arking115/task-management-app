import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) return null;

  const linkStyle: React.CSSProperties = {
    padding: '10px 18px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    textDecoration: 'none',
    color: '#1a1a1a',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'background-color 0.2s, box-shadow 0.2s'
  };

  const linkHoverStyle: React.CSSProperties = {
    backgroundColor: '#f5f5f5',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
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
        zIndex: 1000,
        height: '50px'
      }}
    >
      {/* Logo / App Name */}
      <Link to="/dashboard" style={{ fontWeight: 'bold', fontSize: '1.3rem', textDecoration: 'none', color: '#1a1a1a' }}>
        Task Manager
      </Link>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '1.2rem', marginLeft: '2rem' }}>
        <HoverableLink to="/dashboard" baseStyle={linkStyle} hoverStyle={linkHoverStyle}>
          Dashboard
        </HoverableLink>
        <HoverableLink to="/tasks" baseStyle={linkStyle} hoverStyle={linkHoverStyle}>
          Tasks
        </HoverableLink>
      </div>
    </nav>
  );
};

// Utility component to apply inline hover styles
const HoverableLink = ({
  to,
  baseStyle,
  hoverStyle,
  children
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
