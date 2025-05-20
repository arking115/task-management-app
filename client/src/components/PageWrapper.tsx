import React from 'react';

const PageWrapper = ({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) => {
  return (
    <div
      style={{
        minHeight: '85vh',
        width: '100%',
        background: 'linear-gradient(to bottom right, #eef2ff, #f9fafb)',
        padding: '4rem 1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          maxWidth: wide ? '1280px' : '768px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '1.5rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(200, 200, 255, 0.25)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
