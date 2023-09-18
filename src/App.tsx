import { useEffect, useState } from 'react';
import { Navbar } from './pages/components/Navbar/Navbar';
import { ConwayEngine } from './engine/conway';
import { WindowSize, useWindowSize } from './hooks/useWindowSize';
import { Home } from './pages/Home/Home';
import { ConwayContext, ConwayContextType } from './contexts/ConwayContext';

const App = () => {
  const [conwayEngine, setConwayEngine] = useState<ConwayEngine>(new ConwayEngine());
  const [nbGenerations, setNbGenerations] = useState<number>(0);
  const [cellSize, setCellSize] = useState<number>(10);
  const [randomFillRate, setRandomFillRate] = useState<number>(50);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [averageElapsedTime, setAverageElapsedTime] = useState<number>(0);
  const [needUpdate, setNeedUpdate] = useState<boolean>(false);

  const windowSize: WindowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width > 0 && windowSize.height > 0 && conwayEngine) {
      conwayEngine.initWorld(windowSize.width, windowSize.height, cellSize);
      conwayEngine.setShowGridLines(showGridLines);
      conwayEngine.generateRandomWorld(randomFillRate).then(() => {
        setIsReady(true);
      });
    }
  }, [windowSize, cellSize, conwayEngine, randomFillRate]);

  const conwayContextValue: ConwayContextType = {
    conwayEngine: conwayEngine,
    isRunning: isRunning,
    setIsRunning: setIsRunning,
    randomFillRate: randomFillRate,
    setRandomFillRate: setRandomFillRate,
    showGridLines: showGridLines,
    setShowGridLines: setShowGridLines,
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
