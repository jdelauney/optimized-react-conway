import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'success' | 'info';
type ButtonProps = PropsWithChildren<{
  variant: ButtonVariant;
}> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  const { variant, children, ...rest } = props;
  const buttonBaseStyle = `inline-block rounded px-5 pb-1.5 pt-1 text-sm font-medium uppercase leading-none
  shadow shadow-slate-700 transition duration-150 ease-in-out
  hover:shadow-none focus:shadow-sm focus:outline-none focus:ring-0
  disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:ring-0 disabled:hover:shadow-none disabled:focus:shadow-sm disabled:focus:ring-0
  disabled:bg-gray-500 disabled:text-gray-100 disabled:border-gray-600
  `;

  return (
    <button
      className={`${buttonBaseStyle} bg-${variant}-500 text-${variant}-100 border border-${variant}-600  hover:bg-${variant}-700  hover:border-${variant}-500 focus:bg-${variant}-600  focus:border-${variant}-500 `}
      {...rest}
    >
      {children}
    </button>
  );
};
