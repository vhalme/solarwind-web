import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Backspace'
import TravelIcon from '@mui/icons-material/SwitchAccessShortcut'
import { Ship } from 'solarwind-common/dist/model/ship'
import { selectAuth } from '@/state/slices/authSlice'
import { useGetOwnShipsQuery, useSendShipMutation } from '@/state/api/shipsApiSlice'
import { useLazyGetStarQuery } from '@/state/api/starsApiSlice'
import { useLazyGetBalanceQuery } from '@/state/api/accountApiSlice'
import { Star } from 'solarwind-common/dist/model/star'
import { calculateArrivalDate, formatDateToString, formatRemainigTimeToString, getTimeTo } from '@/common/common'
import styles from './SendShipMenu.module.css'


const SendShipToMenu = ({ to } : { to: Star }) => {

  const [ shipSearchInput, setShipSearchInput ] = useState<string>('')
  const [ fuelAmountInput, setFuelAmountInput ] = useState<string>('')
  const [ ship, setShip ] = useState<Ship | null>(null)
  const [ from, setFrom ] = useState<Star | null>(null)
  
  const { data: ships, refetch: getShips } = useGetOwnShipsQuery()
  const [ sendShip ] = useSendShipMutation()
  const [ getStar ] = useLazyGetStarQuery()
  const [ getBalance ] = useLazyGetBalanceQuery()

  const auth = useSelector(selectAuth)

  const router = useRouter()

  useEffect(() => {
    if (ship) {
      getStar(ship.starId!).unwrap()
        .then(star => {
          setFrom(star)
        })
        .catch((err) => {
          console.log('Failed to fetch star', err)
        })
    }
  }, [ship])

  if (!auth.user) {
    return (
      <div className={styles.sendShipMenu}>
        <a href="/login">Log in</a> to manage ships
      </div>
    )
  }

  const availableShips = (ships || []).filter(s => s.starId !== to.id)

  if (ships && availableShips.length === 0) {
    return (
      <div className={styles.sendShipMenu}>
        You don&apos;t have any available ships to send here.<br/><br/>
        <a href="/ships">Manage ships</a>
      </div>
    )
  }

  let arrivalDate = null
  let arrival = null
  let timeUntilArrival = null
  let inputError = null
  if (from && fuelAmountInput.length > 0) {
    try {
      arrivalDate = calculateArrivalDate(fuelAmountInput, from, to, false)
      arrival = formatDateToString(arrivalDate)
      timeUntilArrival = formatRemainigTimeToString(getTimeTo(arrivalDate))
    } catch (err: any) {
      inputError = err.message
    }
  }
  
  return (
    <div className={styles.sendShipMenu}>
      <div className={styles.starSearch}>
        {
          ship ? (
            <div className={styles.selectedStar}>
              <div className={styles.selectedStarName}>
                { ship.name }
              </div>
              <div className={styles.searchAnotherStar} onClick={() => {
                setShip(null)
                setShipSearchInput('')
                setFuelAmountInput('')
              }}>
                <SearchIcon />
              </div>
            </div>
          ) : (
            <div className={styles.searchField}>
              <TextField label="Ship to send" variant="outlined" 
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setShipSearchInput(event.target.value)
                  getShips()
                }} />
            </div>
          )
        }
        
        {
          !ship && (
            <div className={styles.searchResults}>
              {
                shipSearchInput.length === 0 && (
                  <div>
                    <a href="/ships">Manage ships</a>
                  </div>
                )
              }
              {
                ships && availableShips.length > 0 && shipSearchInput.length > 0 &&
                  availableShips.filter(ship => ship.starId !== null && ship.name.toLowerCase().includes(shipSearchInput.toLowerCase()))
                    .map((ship, index) => {
                      return (
                        <div key={`ship-result-${index}`} className={styles.starResult} onClick={() => {
                          setShip(ship)
                        }}>
                          { ship.name }
                        </div>
                      )
                    })
              }
            </div>
          )
        }
        {

          ship && (      
            <div className={styles.fuelCalculator}>
              <div className={styles.fuelConfig}>
                <div className={styles.fuelAmountInput}>
                  <TextField label="Fuel" variant="standard" 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFuelAmountInput(event.target.value)
                    }} />
                </div>
                <div className={styles.slw}>
                  SLW
                </div>
              </div>
              <div className={styles.travelSubmit}>
                {
                  fuelAmountInput.length > 0 && !inputError ? (
                    <div>
                      <div className={styles.travelTime}>
                        <div className={styles.travelTimeTitle}>
                          Your estimated arrival time
                        </div>
                        <div className={styles.travelTimeValue}>
                          { arrival }
                        </div>
                      </div>
                      <div className={styles.travelTime}>
                        <div className={styles.travelTimeTitle}>
                          Time until your estimated arrival
                        </div>
                        <div className={styles.travelTimeValue}>
                          { timeUntilArrival }
                        </div>
                      </div>
                      <div className={styles.go}>
                        <Button variant="outlined" endIcon={<TravelIcon />} onClick={() => {
                          sendShip({ shipId: ship.id, starId: to.id, fuel: Number(fuelAmountInput) })
                          router.push(`/ships/${ship.id}`)
                        }}>
                          TRAVEL
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      { inputError }
                    </div>
                  )
                }
              </div>
            </div>
          )

        }
      </div>
    </div>
  )
}

export default SendShipToMenu
