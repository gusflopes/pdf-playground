import React from 'react';

// import { Container } from './styles';

interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <>
      <button
        className="bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        {...rest}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
