'use client'

import styles from './InfraOverlay.module.css'

import { useSelector } from 'react-redux'
import { selectAuth } from '@/state/slices/authSlice'
import { Star } from 'solarwind-common/dist/model/star'
import { useGetTaxPaymentsQuery } from '@/state/api/starsApiSlice'

const evStages: { [key: string ]: string } = {
  'red_supergiant': 'Red supergiant',
  'main_sequence': 'Main sequence',
  'white_dwarf': 'White dwarf'
}

export const InfraOverlay = ({ star } : { star: Star }) => {

  const auth = useSelector(selectAuth)

  const { data: taxes } = useGetTaxPaymentsQuery(star.id)
  console.log('taxes', taxes)

  return (
    <>
      <div className={styles.about}>
        <div>TAXES</div>
        {
          (taxes || []).map((tax) => (
            <div key={`tax-${tax.id}`} className={styles.taxRow}>
              You received { tax.amount } SLW in tax from { tax.shipName } at { tax.timestamp.toISOString() }
            </div>
          ))
        }
      </div>
    </>
  )

}
 
export default InfraOverlay