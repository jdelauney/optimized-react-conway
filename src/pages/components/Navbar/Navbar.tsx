import { useContext, useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { ConwayContext } from '../../../contexts/ConwayContext';
import { RenderModal } from '../../../components/ModalDialog/RenderModal';
import { ConwaySettingsModal } from '../ConwaySettingsModal/ConwaySettingsModal';

export const Navbar = () => {
  const {
    conwayEngine,
    setIsRunning,
    isRunning,
    nbGenerations,
    isReady,
    setIsReady,
    averageElapsedTime,
    setAverageElapsedTime,
    needUpdate,
    fps,
    setFPS,
    setNbGenerations,
    setIsLooping,
  } = useContext(ConwayContext);

  const [totalCell, setTotalCell] = useState<number>(0);
  const [cellAlive, setCellAlive] = useState<number>(0);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (conwayEngine) {
      setTotalCell(conwayEngine.getTotalCell());
      setCellAlive(conwayEngine.getCellAlive());
    }
  }, [conwayEngine, isReady, needUpdate]);

  const handlePlayClick = () => {
    setIsRunning(currentState => {
      currentState = !currentState;
      return currentState;
    });
    setIsLooping(currentState => {
      currentState = !currentState;
      return currentState;
    });
  };

  const handleSettingsClick = () => {
    setIsSettingsDialogOpen(currentState => {
      currentState = !currentState;
      return currentState;
    });
  };

  const handleResetClick = () => {
    setIsReady(false);
    conwayEngine?.generateRandomWorld().then(() => {
      setCellAlive(conwayEngine.getCellAlive());
      setAverageElapsedTime(0);
      setNbGenerations(0);
      setFPS(0);
      setIsReady(true);
    });
  };

  const handleNextStepClick = () => {
    setIsRunning(!isSettingsDialogOpen);
  };

  const handleModalClose = () => {
    setIsSettingsDialogOpen(false);
  };

  return (
    <>
      <div className={'relative'}>
        <nav className='fixed top-0 left-0 right-0 w-full flex justify-end items-center py-3 px-4 gap-3 bg-slate-800/60'>
          <span className='text-2xl leading-none font-bold text-gray-100 border-e-2 border-slate-400 mr-2 pr-2'>
            Conway's Game of Life
          </span>
          <div className='flex-grow flex items-center divide-x-2 divide-slate-300'>
            <span className='leading-none font-bold text-gray-100 mr-2 pr-2 text-sm'>
              Total cells : <span className='text-blue-300 font-normal'>{isNaN(totalCell) ? '-' : totalCell}</span>
            </span>
            <span className='leading-none font-bold text-gray-100 px-2 text-sm'>
              Generation : <span className='text-yellow-400 font-normal'>{nbGenerations}</span>
            </span>
            <span className='leading-none font-bold text-gray-100 px-2 text-sm'>
              Cells alive : <span className='text-green-300 font-normal'>{cellAlive}</span>
            </span>
            <span className='leading-none font-bold text-gray-100 px-2 text-sm'>
              Average speed rendering :{' '}
              <span className='text-red-200 font-normal'>{averageElapsedTime.toFixed(3)}ms</span>
            </span>
            <span className='leading-none font-bold text-gray-100 px-2 text-sm'>
              Average FPS : <span className='text-red-200 font-normal'>{Math.floor(fps)}</span>
            </span>
          </div>

          <Button variant='primary' onClick={handlePlayClick}>
            {isRunning ? 'Stop' : 'Play'}
          </Button>
          <Button variant='primary' disabled={isRunning} onClick={handleNextStepClick}>
            Next step
          </Button>
          <Button variant='accent' disabled={isRunning} onClick={handleSettingsClick}>
            Settings
          </Button>
          <Button variant='danger' disabled={isRunning} onClick={handleResetClick}>
            Reset
          </Button>
        </nav>
      </div>

      <RenderModal>
        {isSettingsDialogOpen && <ConwaySettingsModal isOpen={isSettingsDialogOpen} onClose={handleModalClose} />}
      </RenderModal>
    </>
  );
};
