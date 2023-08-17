'use client'

import styles from './StarView.module.css'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { isMobile } from 'react-device-detect'
import Cookies from 'js-cookie'
import cx from 'classnames'
import styled, { keyframes } from 'styled-components'
import CancelIcon from '@mui/icons-material/Cancel'
import InfoIcon from '@mui/icons-material/LightbulbOutlined'
import ArrowForward from '@mui/icons-material/NavigateNext'
import ArrowBack from '@mui/icons-material/NavigateBefore'
import StarsIcon from '@mui/icons-material/AutoAwesome'
import MarketIcon from '@mui/icons-material/CurrencyExchange'
import ShipIcon from '@mui/icons-material/RocketLaunch'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { selectAuth } from '@/state/slices/authSlice'
import { selectAccount } from '@/state/slices/accountSlice'
import { useGetBalanceQuery } from '@/state/api/accountApiSlice'
import { 
  useGetStarQuery,
  useLazyGetStarQuery,
  useLazyClaimStarQuery
} from '@/state/api/starsApiSlice'
import { useGetShipsOnOrbitQuery } from '@/state/api/shipsApiSlice'
import DiffusedStar from '@/components/stars/DiffusedStar'
import { getLogScaleFactor } from '@/utils/math'
import { Ship } from 'solarwind-common/dist/model/ship'
import { ReactElement, useEffect, useState, useRef } from 'react'
import { Star } from 'solarwind-common/dist/model/star'
import InteractWithShipMenu from '@/components/menus/InteractWithShipMenu'
import { useGetPublicUserQuery } from '@/state/api/usersApiSlice'
import { shortenAddress } from '@/common/common'
import Tutorial, { TutorialStep, clearTutorialElems } from '@/components/tutorial/Tutorial'
import TutorialHint from '@/components/tutorial/TutorialHint'
import Outclickable from '@/components/Outclickable'
import ShipsOverlay from './ShipsOverlay'
import { SHIPS_TUTORIAL_STEPS } from './tutorials'
import DataOverlay from './DataOverlay'
import InfraOverlay from './InfraOverlay'

interface TrajectoryParams {
  radius: number,
  speed: number,
  inclination: number,
  rotationFrom: number
}

const getOrbitKeyFrames = (inclination: number, rotationFrom: number) => keyframes`
  from {
    transform: rotateX(${inclination}deg) rotateY(0deg) rotateZ(${rotationFrom}deg);
  }
  to {
    transform: rotateX(${inclination}deg) rotateY(0deg) rotateZ(${rotationFrom + 360}deg);
  }`

const ShipTrajectory = styled.div<TrajectoryParams>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${props => props.radius}px;
  height: ${props => props.radius}px;
  border-radius: 50%;
  transform-style: preserve-3d;
  animation: ${props => getOrbitKeyFrames(props.inclination, props.rotationFrom)} ${props => props.speed}s linear infinite;
}`

const renderStarGraphics3d = (
  star: Star,
  size: number,
  ships: Ship[],
  trajectories: TrajectoryParams[],
  selectedShip: Ship | null,
  onSelectShip: (ship: Ship) => void
) => {

  const scaledSize = isMobile ? size * 0.75 : size
  const translateX = Math.round(scaledSize / 2)
  const translateY = Math.round(scaledSize / 3)

  const starTransform = `perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate3d(-${translateX}px, -${translateY}px, 0px)`
  console.log('Render star gfx 3d, ships & trajectories', (ships || []).length, trajectories.length)

  return (
    <div className={styles.objInSpace} style={{
      transform: starTransform
    }}>
      <DiffusedStar star={star} size={scaledSize} />
      {
        (ships && trajectories.length > 0) && ships.map((ship, i) => {

          const { inclination, rotationFrom, radius, speed } = trajectories[i]
          // console.log('Recalculate trajectories', inclination, rotationFrom, radius)

          const onClick = () => onSelectShip(ship)
          return (
            <ShipTrajectory key={ship.id}
              radius={ isMobile ? radius * 0.75 : radius }
              speed={speed}
              inclination={inclination}
              rotationFrom={rotationFrom}>
              <div className={styles.shipSphere}>
                <div className={cx(styles.circle, styles.t1)}></div>
                <div className={cx(styles.circle, styles.t3)}></div>
                <div className={cx(styles.circle, styles.t5)}></div>
                <div className={cx(styles.circle, styles.t7)}></div>
                <div className={cx(styles.circle, styles.t9)}></div>
                <div className={cx(styles.circle, styles.t11)}></div>
                <div className={cx(styles.clickableCircle, styles.visibleClickableCircle, selectedShip && selectedShip.id === ship.id ? styles.shipSelected : null)}
                  onClick={onClick}></div>
                <div className={cx(styles.clickableCircle, styles.invisibleClickableCircle1)} onClick={onClick}></div>
                <div className={cx(styles.clickableCircle, styles.invisibleClickableCircle2)} onClick={onClick}></div>
                <div className={cx(styles.clickableCircle, styles.invisibleClickableCircle3)} onClick={onClick}></div>
              </div>
            </ShipTrajectory>
          )
        })
      }
    </div>
  )

}


const StarView = ({ params }: { params: { id: string } }) => {

  const { id } = params

  const tutorialHintId = 'slw-tutorial-star'
  const tutorialHintText = <span>
    This is the <b>Star</b> view where a lot of metaverse action happens! Care to take a quick tour?
  </span> 

  const [trajectories, setTrajectories] = useState<TrajectoryParams[]>([])

  const { data: star } = useGetStarQuery(id)
  const { data: starOwner } = useGetPublicUserQuery(star?.ownerId!, {
    skip: !star?.ownerId
  })

  const [ getStar ] = useLazyGetStarQuery()
  const { data: ships, refetch: getShips } = useGetShipsOnOrbitQuery(id)
  const { data: balance, refetch: refreshBalance } = useGetBalanceQuery()

  const [menu, setMenu] = useState<ReactElement | null>(null)
  const [showTutorial, setShowTutorial] = useState<boolean>(false)
  const [showTutorialHint, setShowTutorialHint] = useState<boolean>(false)
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null)
  const [overlayIndex, setOverlayIndex] = useState<number>(0)

  const [touchStartX, setTouchStartX] = useState(null)
  const [touchStartY, setTouchStartY] = useState(null)
  const [touchEndX, setTouchEndX] = useState(null)
  const [touchEndY, setTouchEndY] = useState(null)

  const auth = useSelector(selectAuth)
  const account = useSelector(selectAccount)
  const router = useRouter()

  useEffect(() => {
    console.log('Calc trajectories for ships', (ships || []).length)
    const trajectories = (ships || []).map(() => {
      const inclination = isMobile ? 40 + Math.round(Math.random() * 40) : 20 + Math.round(Math.random() * 60)
      const speed = 100 + Math.round(Math.random() * 100)
      const rotationFrom = isMobile ? 80 + Math.round(Math.random() * 30) : 40 + Math.round(Math.random() * 50)
      const radius = starSize + Math.round(Math.random() * (isMobile ? 50 : 200))
      return {
        inclination,
        speed,
        rotationFrom,
        radius
      }
    })
    setTrajectories(trajectories)
  }, [star, ships])

  useEffect(() => {
    const tutorialCookie = Cookies.get(tutorialHintId)
    if (tutorialCookie !== 'BLOCK') {
      setShowTutorialHint(true)
    }
  }, [])

  useEffect(() => {
    if (star) {
      getShips()
    }
  }, [star])
  
  const starSize = star ? 1000 * getLogScaleFactor(star.luminosity) : 0


  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50 

  const onTouchStart = (e: any) => {
    setTouchEndX(null) // otherwise the swipe is fired even with usual touch events
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchEndY(null)
    setTouchStartY(e.targetTouches[0].clientY)
  }

  const onTouchMove = (e: any) => {
    setTouchEndX(e.targetTouches[0].clientX)
    setTouchEndY(e.targetTouches[0].clientY)
  }

  const onTouchEnd = () => {
    
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return
    
    const distanceX = touchStartX - touchEndX
    const distanceY = touchStartY - touchEndY
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance

    if (isRightSwipe && Math.abs(distanceX) > distanceY) {
      if (overlayIndex > 0) {
        setOverlayIndex((overlayIndex - 1))
      }
    } 
    
    if (isLeftSwipe && distanceX > distanceY) {
      if (overlayIndex < overlays.length - 1) {
        setOverlayIndex((overlayIndex + 1))
      }
    }

  }

  const overlays = [
    <ShipsOverlay key="ships-overlay"
      star={star!}
      ships={ships || []}
      selectedShip={selectedShip}
      onSelectShip={setSelectedShip} />,
    <DataOverlay key="data-overlay" star={star!} />,
    <InfraOverlay key="infra-overlay" star={star!} />
  ]

  return (
    <div id="star-view" className={styles.root} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {
        overlayIndex > 0 && (
          <div className={styles.prevOverlayArrow} onClick={() => {
            setOverlayIndex((overlayIndex - 1))
          }}>
            <ArrowBack />
          </div>   
        )
      }
      {
        overlayIndex < overlays.length - 1 && (
          <div className={styles.nextOverlayArrow} onClick={() => {
            setOverlayIndex((overlayIndex + 1))
          }}>
            <ArrowForward />
          </div>   
        )
      }
      {
        showTutorial && <Tutorial steps={SHIPS_TUTORIAL_STEPS} close={() => { setShowTutorial(false) }}/>
      }
      {
        star && (
          <div className={styles.starView}>
            <div>
              {
                star && (
                  renderStarGraphics3d(star, starSize, ((overlayIndex === 0 && ships) || []), trajectories, selectedShip, (ship: Ship) => {
                    setSelectedShip((!selectedShip || selectedShip.id !== ship.id) ? ship : null)
                  })
                )
              }
              <div className={styles.overlays} style={{ left: `-${overlayIndex * 100}vw` }}>
                <div className={styles.overlay} style={{ left: '0vw' }}>
                  { overlays[0] }
                </div>
                <div className={styles.overlay} style={{ left: '100vw' }}>
                  { overlays[1] }
                </div>
                <div className={styles.overlay} style={{ left: '200vw' }}>
                  { overlays[2] }
                </div>
              </div>
            </div>
            <div className={styles.appControls}>
              {
                overlayIndex < 1 && (
                  <div className={styles.control} style={{ marginBottom: '24px' }} onClick={() => {
                
                    if (showTutorial) {
                      clearTutorialElems(SHIPS_TUTORIAL_STEPS)
                    }
                    
                    setShowTutorialHint(false)
                    Cookies.set(tutorialHintId, 'BLOCK', { expires: 365 })
                    
                    setShowTutorial(!showTutorial)
              
                  }}>
                    { 
                      showTutorial ?
                        <Tooltip title="Close tutorial">
                          <CancelIcon />
                        </Tooltip> :
                        <Tooltip title="Tutorial">
                          <InfoIcon />
                        </Tooltip>
                    }
                    {
                      (showTutorialHint && !showTutorial) && (
                        <TutorialHint id={tutorialHintId} text={tutorialHintText} showTutorial={setShowTutorial} hide={() => { setShowTutorialHint(false) }} nested={true} />
                      )
                    }
                  </div>
                )
              }
              <div id="app-ctrl-stars" className={styles.control} onClick={() => {
                router.push('/stars')
              }}>
                <Tooltip title="Close">
                  <StarsIcon />
                </Tooltip>
              </div>
              <div className={styles.control} onClick={() => {
                router.push('/ships')
              }}>
                <Tooltip title="Close">
                  <ShipIcon />
                </Tooltip>
              </div>
              <div className={styles.control} onClick={() => {
                router.push('/market')
              }}>
                <Tooltip title="Close">
                  <MarketIcon />
                </Tooltip>
              </div>
            </div>
            <div className={styles.accountControls}>
              {
                auth.user ? 
                  <div className={styles.accountControlsLabel} onClick={() => {
                    router.push('/account')
                  }}>
                    <div>{ Math.round((balance || 0) * 100) / 100 } SLW</div>
                  </div> : 
                  <div className={styles.accountControlsLabel} onClick={() => {
                    router.push('/login')
                  }}>
                    LOG IN
                  </div>
              }
            </div>
          </div>
        )
      }
    </div>
  )

}
 
export default StarView