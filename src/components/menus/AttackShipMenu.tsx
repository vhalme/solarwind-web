import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Backspace'
import AttackIcon from '@mui/icons-material/MyLocation'
import { Ship } from 'solarwind-common/dist/model/ship'
import { selectAuth } from '@/state/slices/authSlice'
import { useGetOwnShipsQuery, useAttackShipMutation } from '@/state/api/shipsApiSlice'
import styles from './SendShipMenu.module.css'
import { useLazyGetBalanceQuery } from '@/state/api/accountApiSlice'
import { AppDispatch } from '@/state/store'

const AttackShipMenu = ({ target } : { target: Ship }) => {

  const [ shipSearchInput, setShipSearchInput ] = useState<string>('')
  const [ fuelAmountInput, setFuelAmountInput ] = useState<string>('')
  const [ attackStatus, setAttackStatus ] = useState<number>(0)

  const [ ship, setShip ] = useState<Ship | null>(null)
  
  const { data: ships, refetch: getShips } = useGetOwnShipsQuery()
  const [ attackShip ] = useAttackShipMutation()
  const [ getBalance ] = useLazyGetBalanceQuery()

  const auth = useSelector(selectAuth)

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  if (!auth.user) {
    return (
      <div className={styles.sendShipMenu}>
        <a href="/login">Log in</a> to manage ships
      </div>
    )
  }

  const availableShips = (ships || []).filter(s => s.starId === target.starId)

  if (ships && availableShips.length === 0) {
    return (
      <div className={styles.sendShipMenu}>
        You don&apos;t have any ships available for this attack.<br/><br/>
        <a href="/ships">Manage ships</a>
      </div>
    )
  }

  let inputError = null
  
  const attackPlanElem = (
    <div className={styles.sendShipMenu}>
      <div className={styles.attackShipHeader}>
        BATTLE PLAN
      </div>
      <div className={styles.targetShip}>
        <div className={styles.targetShipTitle}>
          Targeted ship
        </div>
        <div className={styles.targetShipName}>
          { target.name }
        </div>
        <div className={styles.attackingShipTitle}>
          Attack with
        </div>
      </div>
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
              <TextField label="Attacking ship" variant="outlined" 
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
                  <TextField label="Attack power" variant="standard" 
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
                      {
                        attackStatus !== 1 && (
                          <div className={styles.go}>
                            <Button variant="outlined" endIcon={<AttackIcon />} onClick={() => {
                              
                              setAttackStatus(1)
                              attackShip({ attackerId: ship.id, targetId: target.id, power: Number(fuelAmountInput) }).unwrap()
                                .then(result => {
                                  if (result.success) {
                                    setAttackStatus(result.amount || 0)
                                  } else {
                                    setAttackStatus(-1)
                                  }
                                  getBalance()
                                })
                            }}>
                              ATTACK
                            </Button>
                          </div>
                        )
                      }
                      
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
  
  const defeatElem = (
    <div className={styles.sendShipMenu}>
      <div className={styles.attackShipHeader}>
        DEFEAT
      </div>

      <div className={styles.starSearch}>
        
        <div className={styles.searchResults}>
          Attack unsuccessful. You were defeated in battle.
          <br /> <br />
          Better luck next time!  
        </div>
        
        <div className={styles.travelSubmit}>
          <div className={styles.go}>
            <Button variant="outlined" onClick={() => {
              setAttackStatus(0)
            }}>
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const victoryElem = (
    <div className={styles.sendShipMenu}>
      <div className={styles.attackShipHeader}>
        VICTORY
      </div>

      <div className={styles.starSearch}>
        
        <div className={styles.searchResults}>
          The attack was successful!
          <br /> <br />
          You have captured { attackStatus } SLW from {target.name}.
        </div>
        
        <div className={styles.travelSubmit}>
          <div className={styles.go}>
            <Button variant="outlined" onClick={() => {
              setAttackStatus(0)
            }}>
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const progressElem = (
    <div className={styles.sendShipMenu}>
      <div className={styles.attackShipHeader}>
        ATTACK IN PROGRESS
      </div>

      <div className={styles.starSearch}>
        
        <div className={styles.searchResults}>
          Executing attack maneuver...
          <br /> <br />
        </div>
      </div>
    </div>
  )

  if (attackStatus === 0) {
    return attackPlanElem
  } else if (attackStatus === -1) {
    return defeatElem
  } else if (attackStatus === 1) {
    return progressElem
  } else {
    return victoryElem
  }

}

export default AttackShipMenu
