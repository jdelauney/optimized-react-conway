import { InputHTMLAttributes, ReactNode } from 'react';

type InputProps = {
  label?: string;
  Icon?: ReactNode;
  placeholder?: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'search'
    | 'tel'
    | 'url'
    | 'color'
    | 'date'
    | 'month'
    | 'time'
    | 'week'
    | 'file'
    | 'hidden'
    | 'range';
  name: string;
  autoComplete?: boolean;
  inline?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: InputProps) => {
  const { label, Icon, placeholder, type, name, autoComplete, inline, onChange, ...rest } = props;
  return (
    <div className={`flex w-[20rem]  ${inline ? 'flex-row items-center' : 'flex-col'} gap-1`}>
      {label && (
        <label htmlFor={name} className='text-sm text-slate-300'>
          {label}
        </label>
      )}
      <div className='relative text-accent-200 focus-within:text-accent-100 focus-within:bg-slate-500 h-10 py-2 px-3  bg-slate-900 rounded-md'>
        <span className='absolute inset-y-0 left-1 flex items-center pl-2'>{Icon && Icon}</span>
        <input
          type={type}
          name={name}
          id={name}
          className={
            'w-full h-full  bg-transparent outline-none focus:outline-none flex items-center text-sm text-slate-400 focus:text-slate-200 pl-6 pr-3'
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          {...rest}
        />
      </div>
    </div>
  );
};
