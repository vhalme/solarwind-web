'use client'

import { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLazyCollectHarvestQuery, useLazyGetBalanceQuery } from '@/state/api/accountApiSlice'
import { usePutShipOnOrbitMutation } from '@/state/api/shipsApiSlice'
import cx from 'classnames'
import styled, { keyframes } from 'styled-components'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined'
import EnterOrbitIcon from '@mui/icons-material/SettingsBackupRestore'
import TravelIcon from '@mui/icons-material/SwitchAccessShortcut'
import NearMeIcon from '@mui/icons-material/NearMe'
import Button from '@mui/material/Button'
import { Ship } from 'solarwind-common/dist/model/ship'
import StarComponent from '@/components/stars/Star'
import { Star } from 'solarwind-common/dist/model/star'
import { calculateHarvestAmount, timeUntilArrival } from '@/common/common'
import styles from './ShipDetails.module.css'

interface StarTrackParams {
  x: number,
  y: number,
  length: number,
  width: number,
  speed: number,
  color: string
}

const getStarPathKeyFrames = (x: number, y: number) => keyframes`
  from {
    top: ${y}px;
    right: ${x}px;
  }
  to {
    top: ${y + 600}px;
    right: ${x + 600}px;
  }`

const StarTrack = styled.div<StarTrackParams>`
  position: absolute;
  right: ${props => props.x}px;
  top: ${props => props.y}px;
  height: ${props => props.width}px;
  width: ${props => props.length}px;
  background-color: ${props => props.color};
  rotate: 315deg;
  animation: ${props => getStarPathKeyFrames(props.x, props.y)} ${props => props.speed}s linear 1;
}`

const HarvestingIcon = ({ className }: { className: string }) => 
  <svg fill={'white'} className={className} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 576Zm-400 0q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q36 0 71 6t67 18q-14 10-25 22.5T574 249q-23-7-46-10t-48-3q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916q142 0 241-99.5T820 576q0-25-3-48t-10-46q14-8 26.5-19t22.5-25q12 32 18 67t6 71q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576Zm640-130q-45 0-77.5-32.5T610 336q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T720 446Z"/></svg>

const renderStatusElem = (status: string, icon?: ReactElement, extra?: ReactElement, classOverride?: string): ReactElement => {
  return (
    <div id="ship-status" className={classOverride || styles.shipStatus}>
      <div className={styles.shipStatusTitle}>
        <div className={styles.statusText}>
          { status }
        </div>
        {
          icon && (
            <div className={styles.statusIcon}>
              { icon }
            </div>
          )
        }
      </div>
      { extra }
    </div>
  )
}

interface StarTrackProps {
  elem: ReactElement,
  length: number,
  x: number,
  y: number,
  width: number,
  speed: number,
  color: string,
  launched: boolean
}
function ShipDetails({ ship, star }: { ship: Ship, star: Star | null }) {

  const [starTracks, setStarTracks] = useState<StarTrackProps[]>([])

  const generateStarsTracks = (): NodeJS.Timer | null => {
    
    const trackGenInterval = setInterval(() => {
    
      const x = Math.round(-300 + (600 * Math.random()))
      const y = -100 //Math.round(100 * Math.random())
      const length = Math.round(50 * Math.random())
      const width = Math.round(2 * Math.random())
      const speed = Math.round(5 + (10 * Math.random()))
      const rgb = Math.round(100 + (155 * Math.random()))
      const color = `rgb(${rgb}, ${rgb}, ${rgb})`

      const track: StarTrackProps = {
        elem: <StarTrack key={`st-${starTracks.length}`} x={x} y={y} length={length} width={width} speed={speed} color={color} />,
        length: length,
        x: x,
        y: y,
        width,
        speed,
        color,
        launched: false
      }

      if (starTracks.length < 100) {
        starTracks.push(track)
      }

    }, 200)

    return trackGenInterval
    
  }

  const [ collectHarvest ] = useLazyCollectHarvestQuery()
  const [ putShipOnOrbit ] = usePutShipOnOrbitMutation()

  const [starTracksInterval, setStarTracksInterval] = useState<NodeJS.Timer | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (ship.status === 201) {
      console.log('Star interval')
      setStarTracksInterval(generateStarsTracks())
    } else if (starTracksInterval) {
      clearInterval(starTracksInterval)
    }
  }, [ship.status])

  let faded = false
  let statusElem = null

  const now = new Date()
  let shipArrived = false

  if (ship.status === 0) {
    faded = true
    statusElem = renderStatusElem('NFT mint in progress', <TokenOutlinedIcon className={styles.rotatingRight} />)
  } else if (ship.status === 802) {
    statusElem = renderStatusElem('Entering orbit...', <EnterOrbitIcon className={styles.rotatingLeft} />)
  } else if (ship.status === 101 || ship.status === 102) {
    shipArrived = true
    const lastHarvested = new Date(ship.lastHarvested)
    statusElem = renderStatusElem('Harvesting Solarwind', <HarvestingIcon className={styles.rotatingRight} />,
      <div className={styles.collectHarvest}>
        {
          ship.status === 101 ? (
            <Button variant="contained" onClick={async () => {
              console.log('Collect harvest')
              await collectHarvest(ship.id)
            }}>
                COLLECT { calculateHarvestAmount(lastHarvested, star?.luminosity || 0, star?.shipCount) } SLW
            </Button>
          ) : (
            <Button variant="contained"
              disabled={true}>
                COLLECTING...
            </Button>
          )
        }
      </div>,
      styles.harvestingStatus
    )
  } else if (ship.status === 900) {
    statusElem = renderStatusElem('There was a problem with the ship')
  } else if (ship.status === 200) {
    statusElem = renderStatusElem('Preparing for launch....', <TravelIcon />)
  } else if (ship.status === 201) {
    
    const arrivalTime = timeUntilArrival(ship)
    let arrivalTimeText = 'Unknown'
    if (arrivalTime !== null) {
      if (arrivalTime > 0) {
        arrivalTimeText = `${Math.round(arrivalTime / 1000)} s`
      } else {
        shipArrived = true
      }
    }

    statusElem = renderStatusElem(shipArrived ? 'Arrived' : 'In transit', <TravelIcon />,
      <div className={styles.shipStatusInfo}>
        {
          shipArrived ? (
            <div className={styles.shipStatusInfo}>
              <Button variant="contained" onClick={async () => {
                await putShipOnOrbit({ shipId: ship.id, starId: ship.targetStarId! })
              }}>
                  Enter orbit
              </Button>
            </div>
          ) : (
            <div>
              <div className={styles.shipDestination}>
                <div className={styles.destinationIcon}>
                  <NearMeIcon />
                </div>
                <div className={styles.destinationLabel}>
                  { ship.targetStarName }
                </div>
              </div>
              <div>
                { arrivalTimeText }
              </div>
            </div>
          )
        }
      </div>
    )
  }

  const showStar = ship.starId && star
  
  return (
    <div className={cx(styles.ship, faded && styles.faded)}>
      <div className={styles.shipDetails}>
        {
          star && shipArrived && (
            <div className={styles.starLabel}>
              <div className={styles.starLabel}
                onClick={() => router.push(`/stars/${star.id}`)}>
                { ship.starName || ship.targetStarName }
              </div>
            </div>
          )
        }
        
        <div className={styles.shipGraphics}>
          {
            (ship.status === 201 && !shipArrived) &&
              <div className={styles.shipBackground}>
                { 
                  starTracks.map(track => {
                    return track.elem
                  }) 
                }
              </div>
          }
          
          {
            shipArrived &&
              <div className={styles.starContainer} style={ship.targetStarId ? { top: '185px', left: '185px' } : {}}>
                {
                  star &&
                    <StarComponent star={star} size={ship.targetStarId ? 50 : 200} 
                      onClick={() => router.push(`/stars/${star.id}`)} />
                }
              </div>
          }
          <div className={styles.shipIcon}>
            <RocketLaunchIcon />
          </div>
        </div>
        <div className={styles.shipName}>
          { ship.name }
        </div>
      </div>
      { statusElem }
    </div>
  )

}
 
export default ShipDetails