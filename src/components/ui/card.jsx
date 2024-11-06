const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
};

export { Card };
