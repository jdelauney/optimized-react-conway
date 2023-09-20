import { PropsWithChildren, forwardRef } from 'react';
import { InputDataFieldsType } from './inputDataFields.type';
import { InputFields } from './InputFields';

type FormProps = PropsWithChildren<{
  id: string;
  inputDataFields: InputDataFieldsType[];
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  //onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  //onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}>;

export const Form = forwardRef((props: FormProps, ref) => {
  const { id, inputDataFields, className, onSubmit, onInputChange, children } = props;
  return (
    <form id={id} className={className} onSubmit={onSubmit}>
      <InputFields inputDataFields={inputDataFields} onInputChange={onInputChange} ref={ref} />
      {children}
    </form>
  );
});
