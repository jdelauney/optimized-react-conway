import { HTMLAttributes, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ConwayContext, ConwayContextType } from '../../../../contexts/ConwayContext';

type ConwayWorldProps = HTMLAttributes<HTMLDivElement>;

export const ConwayWorld = (props: ConwayWorldProps) => {
  const { children, ...rest } = props;

  const canvasRef = useRef(null);
  const {
    conwayEngine,
    isRunning,
    nbGenerations,
    setNbGenerations,
    isReady,
    averageElapsedTime,
    setAverageElapsedTime,
    needUpdate,
    setNeedUpdate,
  }: ConwayContextType = useContext(ConwayContext);

  const totalTime = useRef<number>(0);
  const generations = useRef<number>(0);

  useEffect(() => {
    if (conwayEngine && canvasRef.current !== null && isReady) {
      conwayEngine.setCanvasRef(canvasRef.current);
      conwayEngine.drawWorld();
    }
  }, [isReady]);

  useEffect(() => {
    if (needUpdate) {
      setNbGenerations(previousState => {
        previousState = generations.current;
        return previousState;
      });

      if (generations.current > 0) {
        setAverageElapsedTime(previousState => {
          previousState = totalTime.current / generations.current;
          return previousState;
        });
      }
      setNeedUpdate(false);
    }
  }, [nbGenerations, averageElapsedTime, totalTime.current, generations.current, needUpdate]);

  const animateCallback = useCallback(() => {
    if (conwayEngine) {
      const start = performance.now();
      conwayEngine.genNextStep();
      conwayEngine.drawWorld();
      const end = performance.now();
      const elapsedTime = end - start;
      generations.current += 1;
      totalTime.current += elapsedTime;
      if (generations.current % 10 === 0) {
        setNeedUpdate(currentState => {
          currentState = !currentState;
          return currentState;
        });
      }
    }
  }, [totalTime.current, generations.current, conwayEngine, needUpdate]);

  useLayoutEffect(() => {
    if (isRunning) {
      let timerId: number;

      const animate = () => {
        animateCallback();
        timerId = requestAnimationFrame(animate);
      };
      timerId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(timerId);
    }
  }, [isRunning]);

  return (
    <div className='w-full h-full' {...rest}>
      <canvas ref={canvasRef} className='w-full h-full' width={'100%'} height={'100%'} />
    </div>
  );
};
