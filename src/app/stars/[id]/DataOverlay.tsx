'use client'

import styles from './DataOverlay.module.css'

import { useSelector } from 'react-redux'
import { selectAuth } from '@/state/slices/authSlice'
import { Star } from 'solarwind-common/dist/model/star'

const evStages: { [key: string ]: string } = {
  'red_supergiant': 'Red supergiant',
  'main_sequence': 'Main sequence',
  'white_dwarf': 'White dwarf'
}

export const DataOverlay = ({ star } : { star: Star }) => {

  const auth = useSelector(selectAuth)

  return (
    <>
      <div className={styles.about}>
        <div className={styles.starName}>
          { star.name }
        </div>
        <div className={styles.starStage}>
          { evStages[star.evolutionaryStage] }
        </div>
        <div className={styles.basicInfo}>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Luminosity
            </div>
            <div className={styles.fieldValue}>
              { star.luminosity } L<sub>☉</sub>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Radius
            </div>
            <div className={styles.fieldValue}>
              { star.radius } R<sub>☉</sub>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Mass
            </div>
            <div className={styles.fieldValue}>
              { star.mass } M<sub>☉</sub>
            </div>
          </div>
        </div>
        <div className={styles.basicInfo}>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Right ascension
            </div>
            <div className={styles.fieldValue}>
              { star.ra }
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Declination
            </div>
            <div className={styles.fieldValue}>
              { star.dec }
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Parallax
            </div>
            <div className={styles.fieldValue}>
              { star.parallax } mas
            </div>
          </div>
        </div>
        <div className={styles.basicInfo}>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Proper motion (RA)
            </div>
            <div className={styles.fieldValue}>
              { star.pmRa } mas/yr
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Proper motion (Dec.)
            </div>
            <div className={styles.fieldValue}>
              { star.pmDec } mas/yr
            </div>
          </div>
        </div>
        <div className={styles.basicInfo}>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Magnitude
            </div>
            <div className={styles.fieldValue}>
              { star.magnitude }
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Temperature
            </div>
            <div className={styles.fieldValue}>
              { star.temperature } K
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldName}>
              Age
            </div>
            <div className={styles.fieldValue}>
              { star.age } Myr
            </div>
          </div>
        </div>
      </div>
    </>
  )

}
 
export default DataOverlay