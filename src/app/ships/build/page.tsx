'use client'

import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import RocketOutlined from '@mui/icons-material/RocketOutlined'
import { selectAuth } from '@/state/slices/authSlice'
import { useState } from 'react'
import { useBuildShipMutation, useGetOwnShipsQuery, useLazyGetOwnShipsQuery } from '@/state/api/shipsApiSlice'
import styles from './page.module.css'
import { useRouter } from 'next/navigation'

function BuildShipView() {

  const auth = useSelector(selectAuth)

  const [shipName, setShipName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const { data: ships, isError: shipsError } = useGetOwnShipsQuery()
  const [ getOwnShips ] = useLazyGetOwnShipsQuery()
  const [ buildShip ] = useBuildShipMutation()

  const router = useRouter()

  if (!auth.user) return null

  return (
    <div className={styles.root}>
      <div className={styles.buildShipHeader}>
        COST: 1 000 000 SLW
      </div>
      {
        error && (
          <div className={styles.buildShipError}>
            { error }
          </div>
        )
      }
      <div className={styles.buildShipForm}>
        <div className={styles.shipName}>
          <TextField
            label="Ship name"
            value={shipName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setShipName(event.target.value)
            }}
          />
        </div>
        <div className={styles.buildButton}>
          <Button 
            variant="outlined"
            size="large"
            endIcon={<RocketOutlined />}
            onClick={async () => {
              const result = await buildShip({ name: shipName }).unwrap()
              if (result.success && result.ship) {
                setError(null)
                await getOwnShips()
                router.push(`/ships/${result.ship.id}`)
              } else {
                setError(result.message || null)
              }
            }}>BUILD</Button>
        </div>
      </div>
    </div>
  )

}
 
export default BuildShipView