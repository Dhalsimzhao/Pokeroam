import { useEffect, useRef, type RefObject } from 'react'

interface DragCallbacks {
  onDragStart: () => void
  onDragEnd: () => void
}

/**
 * Drag the pet window by mouse. Uses screenX/screenY to avoid jitter.
 * Calls onDragStart/onDragEnd so physics can switch anim states.
 */
export function usePetDrag(
  containerRef: RefObject<HTMLElement | null>,
  callbacks: DragCallbacks
): void {
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const cbRef = useRef(callbacks)
  cbRef.current = callbacks

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onMouseDown = (e: MouseEvent): void => {
      if (e.button !== 0) return
      isDragging.current = true
      lastPos.current = { x: e.screenX, y: e.screenY }
      window.api.setClickThrough(false)
      cbRef.current.onDragStart()
    }

    const onMouseMove = (e: MouseEvent): void => {
      if (!isDragging.current) return
      const dx = e.screenX - lastPos.current.x
      const dy = e.screenY - lastPos.current.y
      if (dx === 0 && dy === 0) return
      lastPos.current = { x: e.screenX, y: e.screenY }
      window.api.dragMove(dx, dy)
    }

    const onMouseUp = (): void => {
      if (!isDragging.current) return
      isDragging.current = false
      cbRef.current.onDragEnd()
    }

    el.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [containerRef])
}
