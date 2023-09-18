import { useContext, useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button/Button';
import { ConwayContext } from '../../../contexts/ConwayContext';

export const Navbar = () => {
  const { conwayEngine, setIsRunning, isRunning, nbGenerations, isReady } = useContext(ConwayContext);
  const [totalCell, setTotalCell] = useState<number>(0);
  const [cellAlive, setCellAlive] = useState<number>(0);

  useEffect(() => {
    if (conwayEngine) {
      setTotalCell(conwayEngine.getTotalCell());
      setCellAlive(conwayEngine.getCellAlive());
    }
  }, [conwayEngine, isReady, nbGenerations]);

  const handlePlayClick = () => {
    setIsRunning(currentState => {
      currentState = !currentState;
      return currentState;
    });
  };

  return (
    <div className={'relative'}>
      <nav className='fixed top-0 left-0 right-0 w-full flex justify-end items-center py-3 px-4 gap-3 bg-slate-800/60'>
        <span className='text-2xl leading-none font-bold text-gray-100 border-e-2 border-slate-400 mr-2 pr-2'>
          Conway's Game of Life
        </span>
        <div className='flex-grow flex items-center divide-x-2 divide-slate-300'>
          <span className='leading-none font-bold text-gray-100 mr-2 pr-2'>
            Total cells : <span className='text-blue-300 font-normal'>{isNaN(totalCell) ? '-' : totalCell}</span>
          </span>
          <span className='leading-none font-bold text-gray-100 px-2'>
            Generation : <span className='text-yellow-400 font-normal'>{nbGenerations}</span>
          </span>
          <span className='leading-none font-bold text-gray-100 px-2'>
            Cells alive : <span className='text-green-300 font-normal'>{cellAlive}</span>
          </span>
          <span className='leading-none font-bold text-gray-100 px-2'>
            Performance : <span className='text-red-200 font-normal'>0ms</span>
          </span>
        </div>

        <Button variant='primary' onClick={handlePlayClick}>
          {isRunning ? 'Stop' : 'Play'}
        </Button>
        <Button variant='primary'>Next step</Button>
        <Button variant='accent'>Setup</Button>
        <Button variant='danger'>Reset</Button>
        <Button variant='primary'>Random</Button>
      </nav>
    </div>
  );
};
