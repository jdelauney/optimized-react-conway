import { HTMLAttributes, forwardRef } from 'react';
import { InputDataFieldsType } from './inputDataFields.type';
import { Input } from '../Inputs/Input';
import { Switch } from '../Inputs/Switch';

type InputFieldsProps = {
  inputDataFields: InputDataFieldsType[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  //onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  //onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
} & HTMLAttributes<HTMLInputElement>;

export const InputFields = forwardRef((props: InputFieldsProps, ref) => {
  const { inputDataFields, onInputChange } = props;

  const inputProvider = (inputDataField: InputDataFieldsType) => {
    const { customOptions, value, hasRef, ...inputAttributes } = inputDataField;

    return (
      <Input
        key={inputDataField.id}
        {...inputAttributes}
        {...customOptions}
        value={value as string}
        ref={hasRef ? ref : undefined}
        onChange={onInputChange}
      />
    );
  };

  const switchProvider = (inputDataField: InputDataFieldsType) => {
    const { name, id, value, label } = inputDataField;
    return <Switch key={id} name={name} label={label} checkState={value as boolean} onChange={onInputChange} />;
  };

  return (
    <>
      {inputDataFields.map(inputDataField => {
        const { type } = inputDataField;
        if (type === 'switch') {
          return switchProvider(inputDataField);
        } else {
          return inputProvider(inputDataField);
        }
      })}
    </>
  );
});
InputFields.displayName = 'InputFields';
