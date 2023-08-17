'use client'

import styles from './Tutorial.module.css'

import { isMobile } from 'react-device-detect'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'

export type TutorialStep = {
  text: {
    orientation: string
    content: React.ReactNode
    offset?: number
    transparent?: boolean
  }
  highlight: { 
    id: string
    angle: number
    offset: number
    shift?: number
    outward?: boolean
  }
}

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

export const clearTutorialElems = (steps: TutorialStep[]) => {

  for (const step of steps) {
    const elem = document.getElementById(step.highlight.id)
    if (elem) {
      const hlElem = document.getElementById(step.highlight.id + '-highlight')
      if (hlElem) elem.removeChild(hlElem)
    }
  }

}

const createArrow = (id: string, rotation: string, offset: number, options?: { outward?: boolean, shift?: number }) => {

  const { outward, shift } = options || {}

  let animationProperty: any = outward ? 'right' : 'left'
  if (rotation === '90deg') animationProperty = outward ? 'bottom' : 'top'
  else if (rotation === '180deg') animationProperty = outward ? 'left' : 'right'
  else if (rotation === '270deg') animationProperty = outward ? 'top' : 'bottom'


  const animation = document.createElement('style')
  animation.innerHTML = `
    @keyframes arrow {
      0% {
        ${animationProperty}: -${offset}px;
      }
      50% {
        ${animationProperty}: -${offset - 15}px;
      }
      100% {
        ${animationProperty}: -${offset}px;
      }
    }
  `
  document.head.appendChild(animation)

  const arrow = document.createElement('div')
  arrow.id = id
  arrow.style[animationProperty] = `-${offset - 15}px`
  if (shift) {
    let shiftProperty: any = 'top'
    if (animationProperty === 'bottom' || animationProperty === 'top') {
      shiftProperty = 'left'
    }
    arrow.style[shiftProperty] = `${shift}px`
  }
  arrow.style.width = '100px'
  arrow.style.height = '80px'
  arrow.style.position = 'absolute'
  arrow.style.animationName = 'arrow'
  arrow.style.animationDuration = '2s'
  arrow.style.animationTimingFunction = 'ease'
  arrow.style.animationIterationCount = 'infinite'

  const arrowStem = document.createElement('div')
  arrowStem.style.position = 'absolute'
  arrowStem.style.top = '27px'
  arrowStem.style.left = '0px'
  arrowStem.style.width = '70px'
  arrowStem.style.height = '26px'
  arrowStem.style.backgroundColor = 'red'

  const arrowHead = document.createElement('div')
  arrowHead.style.position = 'absolute'
  arrowHead.style.top = '0px'
  arrowHead.style.left = '60px'
  arrowHead.style.width = '0'
  arrowHead.style.height = '0'
  arrowHead.style.borderTop = '40px solid transparent'
  arrowHead.style.borderBottom = '40px solid transparent'
  arrowHead.style.borderLeft = '40px solid red'
  
  arrow.style.scale = '0.5'
  arrow.style.rotate = rotation

  arrow.appendChild(arrowStem)
  arrow.appendChild(arrowHead)

  return arrow

}

const Tutorial = ({ steps, close } : {
  steps: TutorialStep[],
  close: () => void 
}) => {

  const [ step, setStep ] = useState<number>(1)

  const { highlight } = steps[step - 1]
  
  const elem = document.getElementById(highlight.id)
  if (elem) {
    let hlElem = document.getElementById(elem.id + '-highlight')
    if (hlElem) elem.removeChild(hlElem)
    hlElem = createArrow(elem.id + '-highlight', `${highlight.angle}deg`, highlight.offset, { 
      outward: highlight.outward,
      shift: highlight.shift
    })
    elem.appendChild(hlElem)
  }

  const textStyle: { [key: string]: any } = {
    position: 'absolute',
    width: 'calc(100% - 56px)',
    maxWidth: '600px',
    minHeight: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    color: 'black',
    padding: '12px',
    zIndex: 3
  }

  if (steps[step - 1].text.transparent) {
    textStyle.backgroundColor = 'rgba(255, 255, 255, 0)'
    textStyle.border = '1px solid white'
    textStyle.color = 'white'
  }

  const textOffset = 28 + (steps[step - 1].text.offset || 0)
  if (steps[step - 1].text.orientation === 'top') {
    textStyle['top'] = `${textOffset}px`
  } else {
    textStyle['bottom'] = `${textOffset + (isMobile ? 0 : 0)}px`
  } 

  const tutorialStyle: { [key: string]: any } = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: 3
  }

  return (
    <div>
      <Outclickable onOutclick={() => {
        clearTutorialElems(steps)
        close()
      }}>
        <div style={textStyle}>
          <div>
            { steps[step - 1].text.content }
          </div>

          {
            step === steps.length ? (
              <div style={{
                marginTop: '24px',
                marginBottom: '12px'
              }}>
                <Button variant="outlined" onClick={() => {
                  clearTutorialElems(steps)
                  close()
                }}>
                  DONE
                </Button>
              </div>
            ) : (
              <div style={{
                marginTop: '24px',
                marginBottom: '12px'
              }}>
                {
                  step > 1 && (
                    <Button variant="outlined" onClick={() => {
                      clearTutorialElems(steps)
                      setStep(step - 1)
                    }} style={{ marginRight: '6px' }}>
                      BACK
                    </Button>
                  )
                }
                
                <Button variant="outlined" onClick={() => {
                  clearTutorialElems(steps)
                  setStep(step + 1)
                }}>
                  NEXT
                </Button>
              </div>
            )
          }
            
        </div>
      </Outclickable>
    </div>
  )
}

export default Tutorial