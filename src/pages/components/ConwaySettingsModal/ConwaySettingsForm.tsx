import { ChangeEvent, FormEvent } from 'react';
import {
  AiOutlineBgColors,
  GiPerspectiveDiceSixFacesRandom,
  MdOutlinePhotoSize,
  VscSymbolColor,
} from '../../../components/ui/Icons/Icons';
import { Input } from '../../../components/ui/Inputs/Input';
import { Switch } from '../../../components/ui/Inputs/Switch';

type ConwaySettingsFormProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const ConwaySettingsForm = (props: ConwaySettingsFormProps) => {
  const { onSubmit, onInputChange } = props;
  return (
    <form className={'flex flex-col gap-3 w-full'} onSubmit={onSubmit}>
      <Input type='number' name='cellSize' label='Cell size' Icon={<MdOutlinePhotoSize />} onChange={onInputChange} />
      <Input
        type='number'
        name='randomFillRate'
        label='Random fill rate'
        Icon={<GiPerspectiveDiceSixFacesRandom />}
        onChange={onInputChange}
      />
      <Input
        type='color'
        name='bgColor'
        label='Background color'
        Icon={<AiOutlineBgColors />}
        onChange={onInputChange}
      />
      <Input type='color' name='cellColor' label='Cell color' Icon={<VscSymbolColor />} onChange={onInputChange} />
      <Switch name='ShowGridLines' label='Show grid lines' onChange={onInputChange} />
      <Input type='color' name='gridColor' label='Grid color' Icon={<VscSymbolColor />} onChange={onInputChange} />
    </form>
  );
};
