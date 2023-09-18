import { HTMLAttributes, useCallback, useContext, useEffect, useLayoutEffect, useRef } from "react"
import { ConwayContext, ConwayContextType } from "../../../../contexts/ConwayContext"


type ConwayWorldProps = HTMLAttributes<HTMLDivElement>

export const ConwayWorld = (props: ConwayWorldProps) => {
  const {  children, ...rest } = props

  const canvasRef = useRef(null)
  const {conwayEngine, isRunning, setNbGenerations, isReady}: ConwayContextType = useContext(ConwayContext)


  useEffect(() => {
    if (conwayEngine && canvasRef.current !== null && isReady) {
      conwayEngine.setCanvasRef(canvasRef.current)
      conwayEngine.drawWorld()
    }
  }, [isReady])

  const animateCallback = useCallback(() => {
    if (conwayEngine) {
      conwayEngine.genNextStep()
      setNbGenerations((currentNbGenerations) => {
        return currentNbGenerations + 1
      })
      conwayEngine.drawWorld()
    }
    
  }, [])

  useLayoutEffect(() => {
      if (isRunning) {
        let timerId: number

        const animate = () => {
          animateCallback();
            timerId = requestAnimationFrame(animate)
        }
        timerId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(timerId)
      }
  }, [isRunning])
    
  return (
    <div className="w-full h-full" {...rest}>
      <canvas ref={canvasRef} className="w-full h-full" width={"100%"} height={"100%"}/>
    </div>
  )
}
