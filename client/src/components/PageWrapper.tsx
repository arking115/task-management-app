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
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(circle at top left, #F0F4FF, #F9FAFB)',
        padding: '3rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: wide ? '1440px' : '900px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '3rem 2.5rem',
          boxShadow: `
            0 4px 12px rgba(0, 0, 0, 0.04),
            0 8px 40px rgba(99, 102, 241, 0.1)
          `,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
