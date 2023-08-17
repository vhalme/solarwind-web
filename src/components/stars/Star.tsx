'use client'

import cx from 'classnames'
import styles from './Star.module.css'
import { getSpectralColor } from '@/utils/spectre'
import { Star } from 'solarwind-common/dist/model/star'

interface StarProps {
  size: number
  star: Star
  onClick?: () => void
}

const getStarStyleParams = (star: Star) => {
    
  let gradient = 'black'
  let color = 'black'

  if (star) {
    const starColor = getSpectralColor(star.spectralType)
    color = `rgb(${starColor.r}, ${starColor.g}, ${starColor.b})`
    gradient = `radial-gradient(circle at center, ${color}, #000 40%, #000)`
  }

  return {
    color,
    gradient
  }

}

export default function StarComponent({ star, size, onClick }: StarProps) {

  const starStyles = getStarStyleParams(star)

  return (
    <div className={styles.root} id="star-component">
      <div className={styles.star} onClick={onClick} style={{ 
        width: `${size}px`,
        height: `${size}px`,
        background: starStyles.gradient
      }}>
      </div>
    </div>
  )
}