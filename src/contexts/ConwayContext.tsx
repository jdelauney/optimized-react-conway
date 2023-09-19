import { Dispatch, SetStateAction, createContext } from 'react';
import { ConwayEngine, ConwaySettingsType } from '../engine/conway';

export type ConwayContextType = {
  conwayEngine: ConwayEngine | null;
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  conwaySettings: ConwaySettingsType;
  setConwaySettings: Dispatch<SetStateAction<ConwaySettingsType>>;
  nbGenerations: number;
  setNbGenerations: Dispatch<SetStateAction<number>>;
  isReady: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;
  averageElapsedTime: number;
  setAverageElapsedTime: Dispatch<SetStateAction<number>>;
  needUpdate: boolean;
  setNeedUpdate: Dispatch<SetStateAction<boolean>>;
};

export const ConwayContext = createContext<ConwayContextType>({
  conwayEngine: null,
  isRunning: false,
  setIsRunning: () => {},
  conwaySettings: {
    cellSize: 0,
    randomFillRate: 0,
    backgroundColor: '',
    cellColor: '',
    showGridLines: false,
    gridColor: '',
  },
  setConwaySettings: () => {},
  nbGenerations: 0,
  setNbGenerations: () => {},
  isReady: false,
  setIsReady: () => {},
  averageElapsedTime: 0,
  setAverageElapsedTime: () => {},
  needUpdate: false,
  setNeedUpdate: () => {},
});
