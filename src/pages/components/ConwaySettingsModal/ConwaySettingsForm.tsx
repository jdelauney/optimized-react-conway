import { useContext, useState } from 'react';
import {
  AiOutlineBgColors,
  GiPerspectiveDiceSixFacesRandom,
  MdOutlinePhotoSize,
  VscSymbolColor,
} from '../../../components/ui/Icons/Icons';
import { Input } from '../../../components/ui/Inputs/Input';
import { Switch } from '../../../components/ui/Inputs/Switch';
import { ConwayContext } from '../../../contexts/ConwayContext';
import { ConwaySettingsType } from '../../../engine/conway';

type ConwaySettingsFormProps = {
  id: string;
  //   onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  //   onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  // settings: ConwaySettingsType | null;
};

export const ConwaySettingsForm = (props: ConwaySettingsFormProps) => {
  //const { onSubmit, onInputChange } = props;

  const { conwaySettings, setConwaySettings, backgroundColor, setBackgroundColor, setIsReady } =
    useContext(ConwayContext);
  const [bgColor, setBgColor] = useState<string>(backgroundColor);
  const [newSettings, setNewSettings] = useState<ConwaySettingsType>(conwaySettings);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submit');
    console.log('New ConwaySettings : ', newSettings);

    setConwaySettings(newSettings);
    setBackgroundColor(previousState => {
      previousState = bgColor;
      return previousState;
    });
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
    <form id={props.id} className={'flex flex-col gap-3 w-full'} onSubmit={handleFormSubmit}>
      <Input
        type='number'
        name='cellSize'
        label='Cell size'
        value={newSettings.cellSize}
        min={3}
        max={24}
        Icon={<MdOutlinePhotoSize />}
        onChange={handleInputChange}
      />
      <Input
        type='number'
        name='randomFillRate'
        label='Random fill rate'
        value={newSettings.randomFillRate}
        Icon={<GiPerspectiveDiceSixFacesRandom />}
        onChange={handleInputChange}
      />
      <Input
        type='color'
        name='backgroundColor'
        label='Background color'
        value={bgColor}
        Icon={<AiOutlineBgColors />}
        onChange={handleInputChange}
      />
      <Input
        type='color'
        name='cellColor'
        label='Cell color'
        value={newSettings.cellColor}
        Icon={<VscSymbolColor />}
        onChange={handleInputChange}
      />
      <Switch
        name='decompositionFX'
        label='enable decomposition FX'
        checkState={newSettings.decompositionFX}
        onChange={handleInputChange}
      />
      <Switch
        name='cellShapeCircle'
        label='Cell shape circle'
        checkState={newSettings.cellShapeCircle}
        onChange={handleInputChange}
      />
      <Switch
        name='showGridLines'
        label='Show grid lines'
        checkState={newSettings.showGridLines}
        onChange={handleInputChange}
      />
      <Input
        type='color'
        name='gridColor'
        label='Grid color'
        value={newSettings.gridColor}
        Icon={<VscSymbolColor />}
        onChange={handleInputChange}
      />
    </form>
  );
};
