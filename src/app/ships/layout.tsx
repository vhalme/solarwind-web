'use client'

import styles from './layout.module.css'


import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/state/slices/authSlice'
import MainMenu from '@/components/MainMenu'
import Fab from '@mui/material/Fab'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/LightbulbOutlined'
import Tutorial, { TutorialStep, clearTutorialElems } from '@/components/tutorial/Tutorial'
import Cookies from 'js-cookie'
import TutorialHint from '@/components/tutorial/TutorialHint'

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    text: {
      orientation: 'bottom',
      content: (
        <div>
          This is the <b>Ships</b> view. It is the place where you manage your ships.
        </div>
      )
    },
    highlight: {
      id: 'main-menu-item-Ships',
      angle: 90,
      offset: 90,
      shift: -25
    }
  },
  {
    text: {
      orientation: 'bottom',
      content: (
        <div>
          You can see the star your ship is orbiting in the backgrond of your ship.
          <br/><br/>
          Clicking the star&apos;s image will take you to the star&apos;s view.
        </div>
      )
    },
    highlight: {
      id: 'star-component',
      angle: 0,
      offset: 35,
      shift: 17
    }
  },
  {
    text: {
      orientation: 'bottom',
      content: (
        <div>
          This is where the status of the ship is displayed.
          <br /><br />
          Here you can perform status dependent actions with the ship. Such as collecting the Solarwind (SLW) harvested by the ship so far.
        </div>
      )
    },
    highlight: {
      id: 'ship-status',
      angle: 0,
      offset: 115,
      shift: -10
    }
  },
  {
    text: {
      orientation: 'bottom',
      content: (
        <div>
           General ship actions such as <b>Travelling</b> are accessible here.
        </div>
      )
    },
    highlight: {
      id: 'ship-controls',
      angle: 0,
      offset: 100,
      shift: -30
    }

  },
  {
    text: {
      orientation: 'top',
      content: (
        <div>
          Here, in the bottom of the view, you can manage your other existing ships and buid new ones.
        </div>
      )
    },
    highlight: {
      id: 'add-ship-icon',
      angle: 0,
      offset: 50,
      shift: 30
    }

  }

]

export default function ShipsLayout({
  children
}: {
  children: React.ReactNode
}) {
  
  const [ showTutorial, setShowTutorial ] = useState<boolean>(false)
  const [ showTutorialHint, setShowTutorialHint ] = useState<boolean>(false)

  const tutorialHintText = <span>
    This is the <b>Ships</b> view where you manage your ships! Ready to take a quick tour? 
  </span> 

  const tutorialHintId = 'slw-tutorial-ships'
  useEffect(() => {
    const tutorialCookie = Cookies.get(tutorialHintId)
    if (tutorialCookie !== 'BLOCK') {
      setShowTutorialHint(true)
    }
  }, [])

  const auth = useSelector(selectAuth)
  console.log('auth', auth)
  
  return (
    <div className={styles.root}>

      {
        showTutorial && <Tutorial steps={TUTORIAL_STEPS} close={() => { setShowTutorial(false) }}/>
      }

      <MainMenu />
      <div className={styles.content}>
        { children }
      </div>
      {
        auth.user && (
          <>
            <Fab sx={{
              position: 'fixed',
              bottom: '10px',
              right: '10px'
            }} 
            size="small"
            color="primary"
            aria-label="Tutorial"
            onClick={() => {
              
              if (showTutorial) {
                clearTutorialElems(TUTORIAL_STEPS)
              }

              setShowTutorialHint(false)
              Cookies.set(tutorialHintId, 'BLOCK', { expires: 365 })
              setShowTutorial(!showTutorial)

              setShowTutorial(!showTutorial)
            
            }}>
              { showTutorial ? <CloseIcon /> : <InfoIcon /> }
            </Fab>
            {
              (showTutorialHint && !showTutorial) && (
                <TutorialHint id={tutorialHintId} text={tutorialHintText} showTutorial={setShowTutorial} hide={() => { setShowTutorialHint(false) }} />
              )
            }
          </>
        )
      }
      
    </div>
  )
}
