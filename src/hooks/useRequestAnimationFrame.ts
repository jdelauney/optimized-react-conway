import { Dispatch, SetStateAction, useLayoutEffect, useRef } from 'react';

export type RequestAnimationFrameCallback = (deltaTime: number) => void;

export const useRequestAnimationFrame = (
  isRunning: boolean,
  setIsRunning: Dispatch<SetStateAction<boolean>>,
  isLooping: boolean,
  animateCallback: RequestAnimationFrameCallback
) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>();
  const msStartRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const timeElapsedRef = useRef<number>(0);
  const targetFPSRef = useRef<number>(30);
  const msPerFrameRef = useRef<number>(1000 / targetFPSRef.current);
  const framesRef = useRef<number>(0);
  const averageFpsRef = useRef<number>(0);

  useLayoutEffect(() => {
    const animate = (time: number) => {
      if (msStartRef.current == undefined) {
        msStartRef.current = time;
        startTimeRef.current = msStartRef.current;
      }
      animateCallback(timeElapsedRef.current);

      timeElapsedRef.current = time - msStartRef.current;

      const dt = time - startTimeRef.current!;

      framesRef.current++;
      if (dt >= 1000) {
        averageFpsRef.current = (framesRef.current * 1000) / dt;
        framesRef.current = 0;
        startTimeRef.current = msStartRef.current;
      }

      if (isLooping) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(requestRef.current!);
        setIsRunning((previousState: boolean) => {
          previousState = !previousState;
          return previousState;
        });
      }
      // If the time elapsed is less than the time per frame, do nothing, no we limit the framerate to the target FPS
      // If the time elapsed is greater than the time per frame, we skip frame to keep the target fps constant
      // we need to update the msStartRef to the current time
      if (timeElapsedRef.current > msPerFrameRef.current) {
        msStartRef.current = time;
        return;
      }
      const excessTime = timeElapsedRef.current % msPerFrameRef.current;
      msStartRef.current = time - excessTime;
    };

    if (!isRunning) {
      cancelAnimationFrame(requestRef.current!);
      msStartRef.current = undefined;
      startTimeRef.current = undefined;
      timeElapsedRef.current = 0;
      framesRef.current = 0;
      averageFpsRef.current = 0;
      return;
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isRunning, isLooping, animateCallback, setIsRunning]);

  return averageFpsRef.current;
};
