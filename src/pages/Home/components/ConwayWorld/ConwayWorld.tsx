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

      let msPrev = window.performance.now();
      const fps = 25;
      const msPerFrame = 1000 / fps;
      //let frames = 0;

      const animate = () => {
        animateCallback();
        timerId = requestAnimationFrame(animate);

        const msNow = window.performance.now();
        const msPassed = msNow - msPrev;

        if (msPassed < msPerFrame) return;

        const excessTime = msPassed % msPerFrame;
        msPrev = msNow - excessTime;

        //frames++;
      };

      // setTimeout(function () {
      // }, 100); // 1000 / 20

      timerId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(timerId);
    }
  }, [isRunning]);

  return (
    <div className='w-full h-full' {...rest}>
      {isReady ? (
        <canvas ref={canvasRef} className='w-full h-full' width={'100%'} height={'100%'} />
      ) : (
        <div className='w-full h-full flex justify-center items-center text-2xl text-gray-100'>Loading...</div>
      )}
    </div>
  );
};
