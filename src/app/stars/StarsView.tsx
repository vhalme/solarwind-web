'use client'

import styles from './StarsView.module.css'

import Cookies from 'js-cookie'

import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Fab from '@mui/material/Fab'
import SavedSearchIcon from '@mui/icons-material/SavedSearch'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/LightbulbOutlined'
import ArrowForward from '@mui/icons-material/NavigateNext'
import ArrowBack from '@mui/icons-material/NavigateBefore'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ShipIcon from '@mui/icons-material/RocketLaunch'
import Button from '@mui/material/Button'
import { 
  useGetStarQuery,
  useLazyGetStarQuery,
  useLazySearchStarsQuery
} from '@/state/api/starsApiSlice'
import { math } from 'solarwind-common'
import MainMenu from '@/components/MainMenu'
import { NearestStar, Star, StarWithNeighbours } from 'solarwind-common/dist/model/star'
import { getSpectralColor } from '@/utils/spectre'
import { useRouter } from 'next/navigation'
import { getLogScaleFactor } from '@/utils/math'
import Tutorial, { TutorialStep, clearTutorialElems } from '@/components/tutorial/Tutorial'
import { red } from '@mui/material/colors'
import TutorialHint from '@/components/tutorial/TutorialHint'
import { useGetPublicUserQuery, useLazyGetPublicUserQuery } from '@/state/api/usersApiSlice'
import { shortenAddressTo } from '@/common/common'

const ArrowRangeIcon = <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M280 762 94 576l186-185 42 42-113 113h541L637 433l43-42 185 185-185 186-43-42 113-114H209l113 114-42 42Z"/></svg>

function StarNav() {


  const slowTransition = 'left 1s ease-in-out, width 1s ease-in-out, height 1s ease-in-out'
  const starSize = 200
  const scrollContainerWidth = 360

  const getStarStyleParams = (star: Star) => {
    
    let gradient = 'black'
    let color = 'black'

    if (star) {
      const starColor = getSpectralColor(star.spectralType)
      color = `rgb(${starColor.r}, ${starColor.g}, ${starColor.b})`
      gradient = `radial-gradient(circle at center, ${color}, #000 80%, #000)`
    }

    return {
      color,
      gradient
    }

  }
  

  const [scrollX, setScrollX] = useState<number>(0)
  const [finalStarSize, setFinalStarSize] = useState<number>(starSize)
  const [transition, setTransition] = useState<string>(slowTransition)
  const [transitionInProgress, setTransitionInProgress] = useState<boolean>(false)
  const [selectedStarId, setSelectedStarId] = useState<string>('9cdf5aab-c37b-45a3-92e2-44bce3b8a739')
  const [focusedStarIndex, setFocusedStarIndex] = useState<number>(0)
  const [focusedStar, setFocusedStar] = useState<StarWithNeighbours | null>(null)
  const [starOwner, setStarOwner] = useState<{ id: string; address: string } | null>(null)
  const [starSearchInput, setStarSearchInput] = useState<string>('')
  const [starSearchResults, setStarSearchResults] = useState<NearestStar[] | null>(null)

  
  const [ getStar ] = useLazyGetStarQuery()
  const [ getStarOwner ] = useLazyGetPublicUserQuery()
  const [ searchStars ] = useLazySearchStarsQuery()

  const baseStar = useGetStarQuery(selectedStarId)

  console.log('STAR OWNER', starOwner)

  const browsableStars = (baseStar.isSuccess && baseStar.data) ? 
    [baseStar.data, ...baseStar.data.nearestStars] : []

  const fetchStarOwner = (ownerId: string) => {
    if (ownerId) {
      getStarOwner(ownerId).then((result) => {
        if (result.isSuccess) {
          setStarOwner(result.data)
        }
      })
    } else {
      setStarOwner(null)
    }
  }

  useEffect(() => {
    if (baseStar.isSuccess) {
      console.log('Set base star in focus')
      const star = baseStar.data
      setFocusedStar(star)
      setStarSearchInput('')
      setFinalStarSize(starSize * getLogScaleFactor(star.luminosity))
      fetchStarOwner(star.ownerId)
    }
  }, [baseStar.isSuccess, baseStar.data])

  useEffect(() => {
    if (browsableStars.length > 0) {
      console.log('Change focus to ' + focusedStarIndex)
      getStar(browsableStars[focusedStarIndex].id).then((result) => {
        if (result.isSuccess) {
          const { data: star } = result
          setFocusedStar(result.data)
          setStarSearchInput('')
          setFinalStarSize(starSize * getLogScaleFactor(star.luminosity))
          fetchStarOwner(star.ownerId)
        }
      })
    }
  }, [focusedStarIndex])

  useEffect(() => {
    console.log('Search for stars with name', starSearchInput)
    if (starSearchInput.length === 0) {
      setStarSearchResults(null)
    } else if (focusedStar?.id) {
      searchStars({ id: focusedStar?.id, name: starSearchInput }).then((result) => {
        if (result.isSuccess) {
          setStarSearchResults(result.data)
        }
      })
    }
  }, [starSearchInput])

  const router = useRouter()

  const scroll = (index: number, scrollAmount: number) => {
    const finalStarSize = starSize * getLogScaleFactor(browsableStars[index].luminosity)
    if (transitionInProgress) return
    setTransitionInProgress(true)
    setTransition(slowTransition)
    setScrollX(scrollX + scrollAmount)
    setTimeout(() => {
      setFinalStarSize(10)
    }, 10)
    setTimeout(() => {
      setTransition('none')
      setFocusedStarIndex(index)
      setScrollX(0)
      setFinalStarSize(finalStarSize)
      setTransitionInProgress(false)
    }, 1100)
  }

  if (focusedStar === null) {
    return (
      <div>
        Scanning star charts...
      </div>
    )
  }

  const NavBack = () => {
    return (
      <div className={styles.rightNav} onClick={() => scroll(focusedStarIndex - 1, scrollContainerWidth)}>
        <div className={styles.prevStarInfo}>
          <div className={styles.arrow}>
            <ArrowBack />
          </div>
          <div>
            <div>{ browsableStars[focusedStarIndex - 1].name }</div>
            <div>{ math.getRoundedDistance(browsableStars[focusedStarIndex - 1], browsableStars[focusedStarIndex]) } parsecs</div>
          </div>
        </div>
      </div>
    )
  }

  const NavFwd = () => {
    return (
      <div className={styles.leftNav} onClick={() => scroll(focusedStarIndex + 1, -scrollContainerWidth)}>
        <div className={styles.nextStarInfo}>
          <div>
            <div>{ browsableStars[focusedStarIndex + 1].name }</div>
            <div>{ math.getRoundedDistance(browsableStars[focusedStarIndex + 1], browsableStars[focusedStarIndex]) } parsecs</div>
          </div>
          <div className={styles.arrow}>
            <ArrowForward />
          </div>
        </div>
      </div>
    )
  }

  const drawHiddenStar = (side: string, star: Star | undefined) => {
    
    if (!star) return null
    const scaledStarSize = starSize * getLogScaleFactor(star.luminosity)
    const starDiameter = side === 'left' ?
      (scrollX > 0 ? scaledStarSize : 10) :
      (scrollX < 0 ? scaledStarSize : 10)

    const starStyles = getStarStyleParams(star)
    return (
      <div className={styles.hiddenStar} style={{ 
        left: side === 'left' ? scrollX - scrollContainerWidth : scrollX + scrollContainerWidth,
        transition
      }} onClick={() => scroll(
        focusedStarIndex + side === 'left' ? -1 : 1, 
        side === 'left' ? scrollContainerWidth : -scrollContainerWidth
      )}>
        <div className={styles.starPlaceholder} style={{ 
          width: `${starDiameter}px`,
          height: `${starDiameter}px`,
          background: starStyles.gradient,
          transition
        }}>
        </div>
        {
          !transitionInProgress &&
            <div className={styles.hiddenStarInfo}>
              <div>{ star.name }</div>
              <div>{ (Math.round(math.calculateDistance(browsableStars[focusedStarIndex], star) * 100) / 100) } parsecs</div>
            </div>
        }
      </div>
    )
  }

  const drawFocusedStar = (star: Star, final: boolean) => {

    const focusedStarStyles = getStarStyleParams(browsableStars[focusedStarIndex])

    const radiusScale = getLogScaleFactor(focusedStar.radius)
    const massScale = getLogScaleFactor(focusedStar.mass)

    return final ? (
      <div className={styles.focusedStarContent}>
        <div className={styles.focusedStarStats}>
          <div className={styles.shipCount}>
            <div className={styles.shipCountIcon}>
              <ShipIcon />
            </div>
            <div className={styles.shipCountValue}>
              { star.shipCount }
            </div>
          </div>
        </div>
        <div className={styles.focusedStarInfo}>
          <div className={styles.starName}>{ star.name }</div>
          {
            star.name !== 'Sol' && (
              <div className={styles.ownerInfo}>
                {
                  starOwner ? (
                    <div className={styles.ownerBadge}>
                      <div className={styles.ownerIcon}>
                        <AccountCircleIcon />
                      </div>
                      <div className={styles.ownerLabel}>
                        { shortenAddressTo(starOwner.address, 8, -6) }
                      </div>
                    </div>
                  ) : (
                    <div className={styles.ownerBadge}>
                      <div className={styles.ownerIcon}>
                        <AccountCircleIcon />
                      </div>
                      <div className={styles.ownerLabel}>
                        Unclaimed
                      </div>
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
        <div className={styles.starCircleContainer}>                    
          <div id="focused-star-circle" className={styles.focusedStarCircle}
            style={{
              background: focusedStarStyles.gradient, 
              width: `${finalStarSize}px`, 
              height: `${finalStarSize}px` 
            }}>
          </div>
          <div className={styles.focusedStarCircle} 
            onClick={() => router.push(`/stars/${star.id}`)}
            style={{ 
              cursor: 'pointer',
              width: `${starSize * radiusScale}px`,
              height: `${starSize * radiusScale}px`,
              border: `2px solid ${focusedStarStyles.color}` 
            }}>
          </div>
          <div className={styles.focusedStarCircle} 
            onClick={() => router.push(`/stars/${star.id}`)}
            style={{ 
              cursor: 'pointer',
              width: `${(starSize/2) * massScale}px`,
              height: `${(starSize/2) * massScale}px`,
              border: '1px solid rgb(200, 200, 200)'
            }}>
          </div>
        </div>
        <div className={styles.focusedStarDetails}>
          { star.luminosity } L<sub>☉</sub>&nbsp;
          { star.radius } R<sub>☉</sub>&nbsp;
          { star.mass } M<sub>☉</sub>&nbsp;
        </div>
      </div>
    ) : (
      <div className={styles.focusedStarContent}>
        <div className={styles.starPlaceholder} style={{ 
          width: `${finalStarSize}px`,
          height: `${finalStarSize}px`,
          background: focusedStarStyles.gradient
        }}>
        </div>
      </div>
    )
  }

  const { nearestStars } = focusedStar
  
  const timelineSections: { 
    height: number
    distance: number
    y: number 
  }[] = []

  let timelineHeight = 0

  const timelineStars = starSearchResults || nearestStars || []
  for (let i = 0; i < timelineStars.length; i++) {

    const star = timelineStars[i]
    const distanceFromPrev = i === 0 ? 
      star.distance :
      star.distance - nearestStars[i - 1].distance
    
    const distanceFromPrevScale = Math.log10(distanceFromPrev * 100)
    let sectionHeight = distanceFromPrevScale * 40
    if (sectionHeight < 20) sectionHeight = 20
    timelineHeight += sectionHeight
    
    const distanceLy = math.parsecsToLy(star.distance, true)

    const timelineSection = {
      height: sectionHeight,
      distance: distanceLy,
      y: Number(timelineHeight)
    }

    timelineSections.push(timelineSection)

  }

  return (
    <div className={styles.starNav}>
      <div className={styles.focusedStarContainer}>
        { focusedStarIndex > 0 && <NavBack /> }
        { focusedStarIndex < browsableStars.length - 1 && <NavFwd /> }
        <div className={styles.focusedStarScroller}>
          { drawHiddenStar('left', browsableStars[focusedStarIndex - 1]) }
          <div id="focused-star" className={styles.focusedStar} style={{ left: scrollX, transition }}>
            { drawFocusedStar(focusedStar, scrollX === 0) }
          </div>
          { drawHiddenStar('right', browsableStars[focusedStarIndex + 1]) }
        </div>
      </div>
      
      <div className={styles.bottomSection}>
        <div id="nearest-stars-container" className={styles.nearestStarsContainer}>
          <div className={styles.searchStars}>
            <TextField label="Search stars" type="search" variant="outlined"
              fullWidth={true}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SavedSearchIcon />
                  </InputAdornment>
                ),
              }}
              value={starSearchInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setStarSearchInput(event.target.value)
              }} />
          </div>
          <div className={styles.distanceUnit}>
            { ArrowRangeIcon } ly
          </div>
          <div className={styles.nearestStars}>
            {
              (starSearchResults || focusedStar.nearestStars || []).map((nearestStar, i) => {

                const redShift = (timelineSections[i].y / timelineHeight) * 255

                return (
                  <div key={`nearest-star-${nearestStar.id}`}
                    className={styles.nearestStar}
                    style={{ height: `${timelineSections[i].height}px` }}
                    onClick={() => {
                      setFocusedStarIndex(0)
                      setSelectedStarId(nearestStar.id)
                    }}>
                    <div className={styles.distance} style={{ borderBottom: `1px solid rgb(${redShift}, 0, ${255 - redShift})` }}>
                      { timelineSections[i].distance }
                    </div>
                    <div className={styles.name}>
                      {nearestStar.name}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )

}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    text: {
      orientation: 'bottom',
      content: (
        <div>
          This is the <b>Stars</b> view. It is the place where you can browse and search stars available in the metaverse.
        </div>
      )
    },
    highlight: {
      id: 'main-menu-item-Stars',
      angle: 270,
      offset: 70,
      shift: -30
    }
  },
  {
    text: {
      orientation: 'bottom',
      content: (
        <div>
          Once you&apos;ve found a star that interests you, you can click it to open that star&apos;s view.
        </div>
      )
    },
    highlight: {
      id: 'focused-star',
      angle: 0,
      offset: 25
    }
  },
  {
    text: {
      orientation: 'top',
      content: (
        <div>
          You can see what other stars are reachable from the selected star ordered by the proximity. Click any of the stars in the list to focus on it.
          <br/><br/>
          Ships move from star to star, so you need this information to plan your jumps. The longer the trip - the more time and/or fuel it will take.
        </div>
      )
    },
    highlight: {
      id: 'nearest-stars-container',
      angle: 90,
      offset: 25,
      shift: 300
    }
  },
  {
    text: {
      orientation: 'bottom',
      content: (
        <div>
          You can also browse the stars by tapping/clicking left and right!
          <br /><br />
          You can finish the tutorial and play around with the stars by yourself or we can also suggest
          to go learn about the <a href="/ships">Ships</a> view.
        </div>
      )
    },
    highlight: {
      id: 'focused-star',
      angle: 0,
      offset: 25,
      outward: true
    }

  }

]



function StarsPage() {

  const [ showTutorial, setShowTutorial ] = useState<boolean>(false)
  const [ showTutorialHint, setShowTutorialHint ] = useState<boolean>(false)

  const tutorialHintText = <span>
    Greetings, Earthling! This is the <b>Stars</b> view, where you discover stars and navigate. Would you like to take a quick tour? 
  </span> 

  const tutorialHintId = 'slw-tutorial-stars'
  useEffect(() => {
    const tutorialCookie = Cookies.get(tutorialHintId)
    if (tutorialCookie !== 'BLOCK') {
      setShowTutorialHint(true)
    }
  }, [])

  return (
    <div className={styles.root}>
      
      {
        showTutorial && <Tutorial steps={TUTORIAL_STEPS} close={() => { setShowTutorial(false) }}/>
      }

      <MainMenu />
      <div className={styles.contentSection}>
        <StarNav />
      </div>
      <div id="stars-fab" className={styles.helpButtonContainer}>
        <Fab id="stars-fab"
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
            
          }}>
          { showTutorial ? <CloseIcon /> : <InfoIcon /> }
        </Fab>
        {
          (showTutorialHint && !showTutorial) && (
            <TutorialHint id={tutorialHintId} text={tutorialHintText} showTutorial={setShowTutorial} hide={() => {
              setShowTutorialHint(false) 
            }} />
          )
        }
      </div>
    </div>
  )
}

export default StarsPage