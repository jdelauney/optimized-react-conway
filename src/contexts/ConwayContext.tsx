import { Dispatch, SetStateAction, createContext } from "react";
import { ConwayEngine } from "../engine/conway";


export type ConwayContextType = { 
  conwayEngine: ConwayEngine | null;
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  randomFillRate: number;
  setRandomFillRate: Dispatch<SetStateAction<number>>;  
  showGridLines: boolean;
  setShowGridLines: Dispatch<SetStateAction<boolean>>;
  nbGenerations: number;
  setNbGenerations: Dispatch<SetStateAction<number>>;
  isReady: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;
  
};

export const ConwayContext = createContext<ConwayContextType>({    
  conwayEngine: null,
  isRunning: false,
  setIsRunning: () => { },
  randomFillRate: 0,
  setRandomFillRate: () => { },  
  showGridLines: false,
  setShowGridLines: () => { },
  nbGenerations: 0,
  setNbGenerations: () => { },
  isReady: false,
  setIsReady: () => { },
});