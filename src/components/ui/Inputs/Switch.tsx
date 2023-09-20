import { useState } from 'react';

type SwitchProps = {
  name: string;
  label?: string;
  checkState?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Switch = (props: SwitchProps) => {
  const { name, label, checkState = false, onChange, ...rest } = props;

  const [isChecked, setIsChecked] = useState<boolean>(checkState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(previousState => !previousState);
    e.target.checked = !isChecked;
    console.log('Switch : ', e.target.checked);

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <label htmlFor={name} className='flex items-center cursor-pointer relative h-8'>
      <input
        type='checkbox'
        name={name}
        id={name}
        checked={isChecked}
        onChange={handleInputChange}
        className='appearance-none flex items-center cursor-pointer w-9 focus:outline-none border border-slate-900 checked:bg-accent-200 h-5 bg-slate-800 rounded-full before:inline-block before:rounded-full before:bg-accent-200 before:h-4 before:w-4 checked:before:translate-x-[90%] checked:before:bg-accent-600 shadow-inner transition-all duration-300 before:mx-0.5'
        {...rest}
      />
      {label && <span className='ml-3 text-sm text-slate-300 font-medium'>{label}</span>}
    </label>
  );
};
