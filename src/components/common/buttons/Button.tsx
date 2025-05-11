import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  className = '',
  style = {}
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded font-medium ${className}`}
      style={{
        zIndex: 999,
        ...style
      }}
    >
      {children}
    </button>
  );
}; 