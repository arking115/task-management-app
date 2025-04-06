import React from 'react';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '2rem',
      border: '1px solid #eee',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      backgroundColor: '#fff'
    }}>
      {children}
    </div>
  );
};

export default PageWrapper;
