import { InputDataFieldsType } from '../../../../components/ui/Form/inputDataFields.type';
import {
  AiOutlineBgColors,
  GiPerspectiveDiceSixFacesRandom,
  MdOutlinePhotoSize,
  VscSymbolColor,
} from '../../../../components/ui/Icons/Icons';
import { ConwaySettingsType } from '../../../../engine/conway';

type ConwayFormSetting = {
  backgroundColor: string;
} & ConwaySettingsType;

export const getConwaySettingsFormConfig = (currentSettings: ConwayFormSetting): InputDataFieldsType[] => {
  return [
    {
      id: 'conwaySettings-cellSize',
      name: 'cellSize',
      type: 'number',
      label: 'Cell size',
      placeholder: 'Cell size',
      value: currentSettings.cellSize.toString(),
      Icon: <MdOutlinePhotoSize />,
      customOptions: {
        min: 3,
        max: 24,
      },
      hasRef: true,
    },
    {
      id: 'conwaySettings-randFillRate',
      name: 'randomFillRate',
      type: 'number',
      label: 'Random fill rate',
      placeholder: 'Random fill rate',
      value: currentSettings.randomFillRate.toString(),
      Icon: <GiPerspectiveDiceSixFacesRandom />,
      customOptions: {
        min: 5,
        max: 95,
      },
    },
    {
      id: 'conwaySettings-backgroundColor',
      name: 'backgroundColor',
      type: 'color',
      label: 'Background color',
      value: currentSettings.backgroundColor,
      Icon: <AiOutlineBgColors />,
    },
    {
      id: 'conwaySettings-cellColor',
      name: 'cellColor',
      type: 'color',
      label: 'Cell color',
      value: currentSettings.cellColor,
      Icon: <VscSymbolColor />,
    },
    {
      id: 'conwaySettings-decompositionFX',
      name: 'decompositionFX',
      type: 'switch',
      label: 'Enable decomposition FX',
      value: currentSettings.decompositionFX,
    },
    {
      id: 'conwaySettings-cellShapeCircle',
      name: 'cellShapeCircle',
      type: 'switch',
      label: 'Cell shape circle',
      value: currentSettings.cellShapeCircle,
    },
    {
      id: 'conwaySettings-showGridLines',
      name: 'showGridLines',
      type: 'switch',
      label: 'Show grid lines',
      value: currentSettings.showGridLines,
    },
    {
      id: 'conwaySettings-gridColor',
      name: 'gridColor',
      type: 'color',
      label: 'Grid color',
      value: currentSettings.gridColor,
      Icon: <VscSymbolColor />,
    },
  ];
};
