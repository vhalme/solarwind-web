'use client'

import styles from './ShipsList.module.css'
import AddIcon from '@mui/icons-material/Add'
import { useGetOwnShipsQuery, useLazyGetOwnShipsQuery, useClaimShipMutation } from '@/state/api/shipsApiSlice'
import { selectAuth } from '@/state/slices/authSlice'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import RocketOutlined from '@mui/icons-material/RocketOutlined'
import { useState } from 'react'
import ShipItem from './ShipItem'
import { useSelector } from 'react-redux'
import { usePathname, useRouter } from 'next/navigation'


function ShipsList() {

  const [shipName, setShipName] = useState<string>('')

  const { data: ships, isError: shipsError } = useGetOwnShipsQuery()
  const [ getOwnShips ] = useLazyGetOwnShipsQuery()
  const [ claimShip ] = useClaimShipMutation()

  const auth = useSelector(selectAuth)

  const router = useRouter()
  const pathname = usePathname()

  let content = null

  const selectedId = pathname.substring(7)

  if (ships && ships.length > 0 && selectedId.length === 0) {
    router.push(`/ships/${ships[0].id}`)
  }
  
  if (!auth.user && shipsError) {
    content = (
      <div className={styles.logIn}>
        <a href="/login">Log in</a> to manage yor ships.
      </div>
    )
  } else if (ships) {
    content = ships.length === 0 ? (
      <div className={styles.claimShip}>
        <div className={styles.claimShipInfo}>
          Welcome to the Solarwind Metaverse!
          <br /><br />
          You will need some ships to get around!
          Looks like you don&apos;t have any yet, but don&apos;t worry we got ya!
          <br /><br />
          You can claim your first ship for free right here! Just give it a name and click the button!
        </div>
        <div className={styles.claimShipForm}>
          <div className={styles.shipName}>
            <TextField
              label="Ship name"
              value={shipName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setShipName(event.target.value)
              }}
            />
          </div>
          <div className={styles.claimButton}>
            <Button 
              variant="outlined"
              size="large"
              endIcon={<RocketOutlined />}
              onClick={async () => {
                console.log('Claim first ship')
                const result = claimShip({ name: shipName })
                const ship = await result.unwrap()
                console.log('Claimed ship', ship)
                await getOwnShips()
                router.push(`/ships/${ship.id}`)
              }}>CLAIM</Button>
          </div>
        </div>
      </div>
    ) : (
      <div id="ships-list" className={styles.ships}>
        {
          selectedId !== 'build' && (
            <div className={styles.add} onClick={() => {
              router.push('/ships/build')
            }}>
              <div id="add-ship-icon" className={styles.addIcon}>
                <AddIcon />
              </div>
              <div className={styles.addLabel}>
                Build ship
              </div>
            </div>
          )
        }
        {
          ships.filter(ship => ship.id !== selectedId).map((ship) => {
            return (
              <ShipItem key={`own-ships-${ship.id}`} ship={ship} />
            )
          })
        }
      </div>
    )
  }

  return content

}

export default ShipsList
