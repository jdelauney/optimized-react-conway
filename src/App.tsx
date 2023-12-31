import { useEffect, useMemo, useState } from 'react';
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
  const [fps, setFPS] = useState<number>(0);
  const [needUpdate, setNeedUpdate] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('#0f172a');
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const windowSize: WindowSize = useWindowSize();

  useEffect(() => {
    conwayEngine.setSettings(conwaySettings);
    if (windowSize.width > 0 && windowSize.height > 0 && conwayEngine) {
      if (!isReady) {
        conwayEngine.initWorld(windowSize.width, windowSize.height);
        conwayEngine.generateRandomWorld().then(() => {
          setIsReady(true);
        });
      }
    }
  }, [windowSize, conwayEngine, isReady, conwaySettings]);

  const conwayContextValue: ConwayContextType = useMemo<ConwayContextType>(
    () => ({
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
      backgroundColor: backgroundColor,
      setBackgroundColor: setBackgroundColor,
      fps: fps,
      setFPS: setFPS,
      isLooping: isLooping,
      setIsLooping: setIsLooping,
    }),
    [
      conwayEngine,
      isRunning,
      setIsRunning,
      conwaySettings,
      setConwaySettings,
      nbGenerations,
      setNbGenerations,
      isReady,
      setIsReady,
      averageElapsedTime,
      setAverageElapsedTime,
      needUpdate,
      setNeedUpdate,
      backgroundColor,
      setBackgroundColor,
      fps,
      setFPS,
      isLooping,
      setIsLooping,
    ]
  );

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
