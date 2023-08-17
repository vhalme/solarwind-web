'use client'

import styles from './ShipItem.module.css'

import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { useRouter } from 'next/navigation'
import { Ship } from 'solarwind-common/dist/model/ship'
import { timeUntilArrival } from '@/common/common'
import { useLazyGetOwnShipsQuery } from '@/state/api/shipsApiSlice'

const getShipStatus = (ship: Ship) => {

  const { status } = ship

  if ([101, 102].includes(status)) {
    return {
      label: 'Harvesting',
      styles: { 
        color: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(200, 200, 200)',
      }
    }
  } else if ([200, 201].includes(status)) {
    const timeUntil = timeUntilArrival(ship)
    if (status === 201 && timeUntil !== null && timeUntil < 0) {
      return {
        label: 'Arrived',
        styles: { 
          color: 'rgb(0, 0, 0)',
          backgroundColor: '#90caf9',
        }
      }  
    }
    return {
      label: 'Travelling',
      styles: { 
        color: 'rgb(0, 0, 0)',
        backgroundColor: '#90caf9',
      }
    }
  } else if (status == 0) {
    return {
      label: 'NFT Mint',
      styles: {
        color: 'rgb(200, 200, 200)',
        backgroundColor: 'rgb(0, 0, 0)',
        border: '1px solid rgb(200, 200, 200)'
      }
    }
  } else if (status == 802) {
    return {
      label: 'Orbital Inj.',
      styles: {
        color: 'rgb(200, 200, 200)',
        backgroundColor: 'rgb(0, 0, 0)',
        border: '1px solid rgb(200, 200, 200)'
      }
    }
  } else if (status == 900) {
    return {
      label: 'Malfunction',
      styles: {
        color: 'rgb(150, 0, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
        border: '1px solid rgb(150, 0, 0)'
      }
    }
  }

  return {
    label: 'Unknown',
    styles: { 
      color: 'rgb(200, 200, 200)',
      backgroundColor: 'rgb(0, 0, 0)',
      border: '1px solid rgb(200, 200, 200)'
    }
  }

}

const getHealthColor = (health: number) => {
  if (health > 75) {
    return 'rgb(0, 150, 0)'
  } else if (health > 50) {
    return 'rgb(180, 180, 0)'
  } else if (health > 25) {
    return 'rgb(200, 120, 0)'
  } else {
    return 'rgb(150, 0, 0)'
  }
}

function ShipItem({ ship }: { ship: Ship }) {
  
  const router = useRouter()

  const [ getOwnShips ] = useLazyGetOwnShipsQuery()

  if (!ship) return null

  const status = getShipStatus(ship)

  return (
    <div onClick={() => {
      getOwnShips()
      router.push(`/ships/${ship.id}`)
    }}>
      <div className={styles.ship}>
        <div className={styles.shipIcon}>
          <RocketLaunchIcon />
        </div>
        <div className={styles.shipInfo}>
          <div className={styles.row1}>
            <div className={styles.shipName}>
              { ship.name }
            </div>
            <div className={styles.shipHealth}>
              <div className={styles.healthValue} style={{ color: getHealthColor(ship.health || 100) }}>
                { ship.health || 100 }  
              </div>
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.shipStatus} style={status.styles}>
              { status.label }
            </div>
            <div className={styles.shipLocation}>
              { ship.starName || ship.targetStarName }
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ShipItem
