import { forwardRef, useContext, useState } from 'react';
import { ConwayContext } from '../../../../contexts/ConwayContext';
import { ConwaySettingsType } from '../../../../engine/conway';
import { Form } from '../../../../components/ui/Form/Form';
import { getConwaySettingsFormConfig } from './conwaySettingsForm.config';

type ConwaySettingsFormProps = {
  id: string;
  onFormSubmitted?: () => void;
};

export const ConwaySettingsForm = forwardRef((props: ConwaySettingsFormProps, ref) => {
  const { id, onFormSubmitted } = props;

  const { conwaySettings, setConwaySettings, backgroundColor, setBackgroundColor } = useContext(ConwayContext);
  const [bgColor, setBgColor] = useState<string>(backgroundColor);
  const [newSettings, setNewSettings] = useState<ConwaySettingsType>(conwaySettings);

  const conwaySettingsInputFields = getConwaySettingsFormConfig({ ...newSettings, backgroundColor: bgColor });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setConwaySettings(newSettings);

    setBackgroundColor(bgColor);

    if (onFormSubmitted) {
      onFormSubmitted();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | boolean | number = value;

    if (name === 'backgroundColor') {
      setBgColor(newValue);
      return;
    }

    if (e.target.type === 'checkbox') {
      newValue = e.target.checked;
    }

    setNewSettings({
      ...newSettings,
      [name]: newValue,
    });
  };

  return (
    <>
      <Form
        id={id}
        className={'flex flex-col gap-3 w-full'}
        inputDataFields={conwaySettingsInputFields}
        onSubmit={handleFormSubmit}
        onInputChange={handleInputChange}
        ref={ref}
      />
    </>
  );
});
ConwaySettingsForm.displayName = 'ConwaySettingsForm';
