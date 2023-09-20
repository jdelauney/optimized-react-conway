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
  const previousTime = useRef<number>(0);
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
    (currentTime: number) => {
      const deltaTime = currentTime - previousTime.current;
      if (conwayEngine) {
        conwayEngine.genNextStep();
        conwayEngine.drawWorld();

        generations.current += 1;
        totalTime.current += deltaTime;
        previousTime.current = currentTime;
        if (generations.current % 10 === 0) {
          setNeedUpdate(currentState => {
            currentState = !currentState;
            return currentState;
          });
        }
      }
    },
    [totalTime.current, generations.current, conwayEngine, needUpdate]
  );

  useLayoutEffect(() => {
    if (isRunning) {
      let timerId: number;

      let msPrev = 0; //window.performance.now();
      let startTime = msPrev; //Date.now();

      const fps = 40;
      const msPerFrame = 1000 / fps;
      let frames = 0;

      const animate = (time: number) => {
        const msNow = time; // window.performance.now();

        animateCallback(time);
        const dt = msNow - startTime;

        frames++;
        if (dt > 1000) {
          averageFps.current = (frames * 1000) / dt;
          frames = 0;
          startTime = msNow;
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

        const msPassed = msNow - msPrev;
        if (msPassed < msPerFrame) return;
        const excessTime = msPassed % msPerFrame;
        msPrev = msNow - excessTime;
      };

      // setTimeout(function () {
      // }, 100); // 1000 / 20

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
