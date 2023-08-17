import { ReactElement, useEffect, useRef } from "react"

const Outclickable = ({ onOutclick, children }: { onOutclick: () => void, children: ReactElement | ReactElement[] }) => {

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutclick = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutclick && onOutclick()
      }
    }
    document.addEventListener('click', handleOutclick, true)
    return () => {
      document.removeEventListener('click', handleOutclick, true)
    }
  }, [ onOutclick ])

  return (
    <div ref={ref}>
      { children }
    </div>
  )
}

export default Outclickable