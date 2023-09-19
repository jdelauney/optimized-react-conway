import { useEffect, useState } from 'react';
import { Navbar } from './pages/components/Navbar/Navbar';
import { CONWAY_DEFAULT_SETTINGS, ConwayEngine, ConwaySettingsType } from './engine/conway';
import { WindowSize, useWindowSize } from './hooks/useWindowSize';
import { Home } from './pages/Home/Home';
import { ConwayContext, ConwayContextType } from './contexts/ConwayContext';

const App = () => {
  const [conwayEngine] = useState<ConwayEngine>(new ConwayEngine());
  const [conwaySettings, setConwaySettings] = useState<ConwaySettingsType>(CONWAY_DEFAULT_SETTINGS);
  const [nbGenerations, setNbGenerations] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [averageElapsedTime, setAverageElapsedTime] = useState<number>(0);
  const [needUpdate, setNeedUpdate] = useState<boolean>(false);

  const windowSize: WindowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width > 0 && windowSize.height > 0 && conwayEngine) {
      conwayEngine.initWorld(windowSize.width, windowSize.height, conwaySettings.cellSize);
      conwayEngine.setShowGridLines(conwaySettings.showGridLines);
      conwayEngine.generateRandomWorld(conwaySettings.randomFillRate).then(() => {
        setIsReady(true);
      });
    }
  }, [windowSize, conwaySettings, conwayEngine]);

  const conwayContextValue: ConwayContextType = {
    conwayEngine: conwayEngine,
    isRunning: isRunning,
    setIsRunning: setIsRunning,
    conwaySettings: conwaySettings,
    setConwaySettings: setConwaySettings,
    nbGenerations: nbGenerations,
    setNbGenerations: setNbGenerations,
    isReady: isReady,
    setIsReady: setIsReady,
    averageElapsedTime: averageElapsedTime,
    setAverageElapsedTime: setAverageElapsedTime,
    needUpdate: needUpdate,
    setNeedUpdate: setNeedUpdate,
  };

  return (
    <>
      <ConwayContext.Provider value={conwayContextValue}>
        <Navbar />
        <Home />
      </ConwayContext.Provider>
    </>
  );
};

export default App;
