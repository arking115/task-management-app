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
        height: 'calc(100vh - 60px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: wide ? '1200px' : '600px', // 👈 wider if needed
          padding: '2rem',
          border: '1px solid #eee',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          backgroundColor: '#fff',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
