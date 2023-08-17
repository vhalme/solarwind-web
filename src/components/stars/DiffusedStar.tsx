'use client'

import cx from 'classnames'
import styles from './DiffusedStar.module.css'
import { getSpectralColor } from '@/utils/spectre'
import { Star } from 'solarwind-common/dist/model/star'

interface DiffusedStarProps {
  size: number
  star: Star
  noise?: number
}

const getStarStyleParams = (star: Star) => {
    
  let gradient = 'black'
  let color = 'black'

  if (star) {
    const starColor = getSpectralColor(star.spectralType)
    color = `rgba(${starColor.r}, ${starColor.g}, ${starColor.b}, 1)`
    gradient = `radial-gradient(ellipse at center, ${color}, rgba(0, 0, 0, 1) 35%, rgba(0, 0, 0, 1))`
  }

  return {
    color,
    gradient
  }

}

export default function StarComponent({ star, size, noise = 0 }: DiffusedStarProps) {

  const starStyles = getStarStyleParams(star)

  return (
    <div className={styles.root}>
      <div className={styles.layeredStar} 
        style={{ width: `${size}px`, height: `${size}px`}}>
        {
          noise > 0 && <div className={cx(styles.backgroundLayer, styles.animation1)} />
        }
        {
          noise > 1 && <div className={cx(styles.backgroundLayer, styles.animation2)} />
        }
        {
          noise > 2 && <div className={cx(styles.backgroundLayer, styles.animation3)} />
        }
        <div className={cx(styles.gradientLayer, styles.animation1)} style={{
          background: starStyles.gradient,
          opacity: 0.1,
          zIndex: -4
        }}></div>
        <div className={cx(styles.gradientLayer, styles.animation2)} style={{
          background: starStyles.gradient,
          opacity: 0.15,
          zIndex: -3
        }}></div>
        <div className={cx(styles.gradientLayer, styles.animation3)} style={{
          background: starStyles.gradient,
          opacity: 0.2,
          zIndex: -2
        }}>
        </div>
        <div className={cx(styles.gradientLayer, styles.animation4)} style={{
          background: starStyles.gradient,
          opacity: 0.25,
          zIndex: -1
        }}></div>
      </div>
    </div>
  )
}