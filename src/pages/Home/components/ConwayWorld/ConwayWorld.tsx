import { CSSProperties, HTMLAttributes, useCallback, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { ConwayContext, ConwayContextType } from '../../../../contexts/ConwayContext';

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
      //previousTime.current = deltaTime;
      if (generations.current % 10 === 0) {
        setNeedUpdate(currentState => {
          currentState = !currentState;
          return currentState;
        });
      }
    },
    [totalTime.current, generations.current, conwayEngine, needUpdate]
  );

  useLayoutEffect(() => {
    if (isRunning) {
      let timerId: number;

      let msStart: number;
      let startTime: number;
      let timeElapsed = 0;

      const fps = 30;
      const msPerFrame = 1000 / fps;
      let frames = 0;

      const animate = (time: number) => {
        if (!msStart) {
          msStart = time;
          startTime = msStart;
        }
        animateCallback(timeElapsed);

        timeElapsed = time - msStart;

        const dt = time - startTime;

        frames++;
        if (dt >= 1000) {
          averageFps.current = (frames * 1000) / dt;
          frames = 0;
          startTime = msStart;
        }

        if (isLooping) {
          timerId = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(timerId);
          setIsRunning(previousState => {
            previousState = !previousState;
            return previousState;
          });
        }
        if (timeElapsed < msPerFrame) return;
        const excessTime = timeElapsed % msPerFrame;
        msStart = time - excessTime;
      };

      timerId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(timerId);
    }
  }, [isRunning]);

  const inlineStyle: CSSProperties = { backgroundColor: backgroundColor };

  return (
    <div className='w-full h-full' {...rest} style={inlineStyle}>
      <canvas ref={canvasRef} className='w-full h-full' width={'100%'} height={'100%'} />
    </div>
  );
};
