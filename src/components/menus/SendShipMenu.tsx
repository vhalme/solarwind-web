import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Backspace'
import TravelIcon from '@mui/icons-material/SwitchAccessShortcut'
import CancelIcon from '@mui/icons-material/CancelOutlined'
import { Ship } from 'solarwind-common/dist/model/ship'
import { useGetShipQuery, useSendShipMutation } from '@/state/api/shipsApiSlice'
import { useGetStarsQuery } from '@/state/api/starsApiSlice'
import { useLazyGetBalanceQuery } from '@/state/api/accountApiSlice'
import { Star } from 'solarwind-common/dist/model/star'
import { calculateArrivalDate, formatDateToString, formatRemainigTimeToString, getTimeTo } from '@/common/common'
import styles from './SendShipMenu.module.css'


const SendShipMenu = ({ shipId, from, cancel } : { shipId: string, from: Star, cancel?: () => void }) => {

  const [ starSearchInput, setStarSearchInput ] = useState<string>('')
  const [ fuelAmountInput, setFuelAmountInput ] = useState<string>('')
  const [ selectedStar, setSelectedStar ] = useState<Star | null>(null)
  
  const { data: ship } = useGetShipQuery(shipId, {
    pollingInterval: 2000
  })

  const { data: stars } = useGetStarsQuery()

  const [ sendShip ] = useSendShipMutation()
  const [ getBalance ] = useLazyGetBalanceQuery()

  const router = useRouter()

  if (!ship) return null

  let arrivalDate = null
  let arrival = null
  let timeUntilArrival = null
  let inputError = null
  if (selectedStar && fuelAmountInput.length > 0) {
    try {
      arrivalDate = calculateArrivalDate(fuelAmountInput, from, selectedStar, false)
      arrival = formatDateToString(arrivalDate)
      timeUntilArrival = formatRemainigTimeToString(getTimeTo(arrivalDate))
    } catch (err: any) {
      inputError = err.message
    }
  }
  
  return (
    <div className={styles.sendShipMenu}>
      {
        cancel && (
          <div className={styles.closeMenu}>
            <div className={styles.closeButton} onClick={cancel}>
              <CancelIcon />
            </div>
          </div>
        )
      }
      <div className={styles.ship}>
        { ship.name }
      </div>
      <div className={styles.starSearch}>
        {
          selectedStar ? (
            <div className={styles.selectedStar}>
              <div className={styles.selectedStarName}>
                { selectedStar.name }
              </div>
              <div className={styles.searchAnotherStar} onClick={() => {
                setSelectedStar(null)
                setStarSearchInput('')
                setFuelAmountInput('')
              }}>
                <SearchIcon />
              </div>
            </div>
          ) : (
            <div className={styles.searchField}>
              <TextField label="Send to" variant="outlined" 
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setStarSearchInput(event.target.value)
                }} />
            </div>
          )
        }
        
        {
          !selectedStar && (
            <div className={styles.searchResults}>
              {
                starSearchInput.length === 0 && (
                  <div>
                    <a href="/stars">Discover stars</a>
                  </div>
                )
              }
              {
                starSearchInput.length > 0 && (stars || [])
                  .filter(star => star.name.toLowerCase().includes(starSearchInput.toLowerCase()))
                  .map((star, index) => {
                    return (
                      <div key={`star-result-${index}`} className={styles.starResult} onClick={() => {
                        setSelectedStar(star)
                      }}>
                        { star.name }
                      </div>
                    )
                  })
              }
            </div>
          )
        }
        {

          selectedStar && (      
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
                          if (cancel) cancel()
                          sendShip({ shipId, starId: selectedStar.id, fuel: Number(fuelAmountInput) })
                          router.push(`/ships/${shipId}`)
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

export default SendShipMenu
