import { CSSProperties, HTMLAttributes, useCallback, useContext, useEffect, useRef } from 'react';
import { ConwayContext, ConwayContextType } from '../../../../contexts/ConwayContext';
import { useRequestAnimationFrame } from '../../../../hooks/useRequestAnimationFrame';

type ConwayWorldProps = HTMLAttributes<HTMLDivElement>;

export const ConwayWorld = (props: ConwayWorldProps) => {
  const { children, ...rest } = props;

  const canvasRef = useRef(null);
  const {
    conwayEngine,
    isRunning,
    setIsRunning,
    nbGenerations,
    setNbGenerations,
    isReady,
    averageElapsedTime,
    setAverageElapsedTime,
    needUpdate,
    setNeedUpdate,
    backgroundColor,
    setFPS,
    isLooping,
  }: ConwayContextType = useContext(ConwayContext);

  const totalTime = useRef<number>(0);
  const generations = useRef<number>(0);
  const averageFps = useRef<number>(0);

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

      setFPS(previousState => {
        previousState = averageFps.current;
        return previousState;
      });

      setNeedUpdate(false);
      return;
    }
    if (nbGenerations === 0) {
      totalTime.current = 0;
      generations.current = 0;
      averageFps.current = 0;
    }
  }, [nbGenerations, averageElapsedTime, totalTime.current, generations.current, needUpdate]);

  const animateCallback = useCallback(
    (deltaTime: number) => {
      conwayEngine!.genNextStep();
      conwayEngine!.drawWorld();

      generations.current += 1;
      totalTime.current += deltaTime;

      if (generations.current % 10 === 0) {
        setNeedUpdate(currentState => {
          currentState = !currentState;
          return currentState;
        });
      }
    },
    [totalTime.current, generations.current, conwayEngine, needUpdate]
  );

  averageFps.current = useRequestAnimationFrame(isRunning, setIsRunning, isLooping, animateCallback);

  const inlineStyle: CSSProperties = { backgroundColor: backgroundColor };

  return (
    <div className='w-full h-full' {...rest} style={inlineStyle}>
      <canvas ref={canvasRef} className='w-full h-full' width={'100%'} height={'100%'} />
    </div>
  );
};
