'use client'

import styles from './ShipsOverlay.module.css'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import RadarIcon from '@mui/icons-material/Radar'
import TravelIcon from '@mui/icons-material/SwitchAccessShortcut'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { selectAuth } from '@/state/slices/authSlice'
import { selectAccount } from '@/state/slices/accountSlice'
import { useGetBalanceQuery } from '@/state/api/accountApiSlice'
import { 
  useGetStarQuery,
  useLazyGetStarQuery,
  useLazyClaimStarQuery
} from '@/state/api/starsApiSlice'
import { useGetShipsOnOrbitQuery } from '@/state/api/shipsApiSlice'
import SendShipToMenu from '@/components/menus/SendShipToMenu'
import SendShipMenu from '@/components/menus/SendShipMenu'
import AttackShipMenu from '@/components/menus/AttackShipMenu'
import InteractWithShipMenu from '@/components/menus/InteractWithShipMenu'
import { getLogScaleFactor } from '@/utils/math'
import { Ship } from 'solarwind-common/dist/model/ship'
import { ReactElement, useEffect, useState, useRef } from 'react'
import { useGetPublicUserQuery } from '@/state/api/usersApiSlice'
import { shortenAddress } from '@/common/common'
import Outclickable from '@/components/Outclickable'
import { Star } from 'solarwind-common/dist/model/star'

const ShipsListMenu = ({ ownShips, otherShips, onSelect } : { ownShips: Ship[], otherShips: Ship[], onSelect: (ship: Ship) => void }) => {
  return (
    <div className={styles.shipsListContainer}>
      {
        (ownShips || []).length === 0 && (otherShips || []).length === 0 ? (
          <div>
            Nobody here yet<br/><br/>
          </div>
        ) : (
          <div>
            <div className={styles.shipsSection}>
              <div className={styles.shipsSectionTitle}>Own ships</div>
              <div className={styles.shipsList}>
                {
                  ownShips.length === 0 ? (
                    <div>
                      <i>-</i>
                    </div>
                  ) : ownShips.map(ship => {
                    return (
                      <div key={`listed-ship-${ship.id}`} className={styles.ship} onClick={() => {
                        onSelect(ship)
                      }}>
                        { ship.name }
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className={styles.shipsSection}>
              <div className={styles.shipsSectionTitle}>Other ships</div>
              <div className={styles.shipsList}>
                {
                  otherShips.length === 0 ? (
                    <div>
                      <i>-</i>
                    </div>
                  ) : otherShips.map(ship => {
                    return (
                      <div key={`listed-ship-${ship.id}`} className={styles.ship} onClick={() => {
                        onSelect(ship)
                      }}>
                        { ship.name }
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>  
        )
      }
    </div>
  )
}

export const ShipsOverlay = ({ 
  star,
  ships,
  selectedShip,
  onSelectShip 
} : { 
  star: Star,
  ships: Ship[],
  selectedShip: Ship | null, 
  onSelectShip: (ship: Ship | null) => void 
}) => {

  const { data: starOwner } = useGetPublicUserQuery(star?.ownerId!, {
    skip: !star?.ownerId
  })

  const [ getStar ] = useLazyGetStarQuery()

  const [ claimStar ] = useLazyClaimStarQuery()

  const [claiming, setClaiming] = useState<boolean>(false)
  const [menu, setMenu] = useState<ReactElement | null>(null)

  const auth = useSelector(selectAuth)

  const starView = document.getElementById('star-view')

  const isOwn = (ship: Ship) => {
    return !!auth.user && ship.ownerId === auth.user?.id
  }

  const isClaimable = (): boolean => {
    if (star?.name === 'Sol') return false
    return !!auth.user && !!(ships || []).find(ship => ship.ownerId === auth.user?.id)
  }

  const ownShips = (ships || []).filter(ship => isOwn(ship))
  const otherShips = (ships || []).filter(ship => !isOwn(ship))

  return (
    <>
      <div id="star-details" className={styles.starDetails}>
        <div className={styles.starName}>
          { star.name }
        </div>
        <div id="star-basic-info" className={styles.basicInfo}>
          <div>{ star.luminosity } L<sub>☉</sub></div>
          <div>{ star.radius } R<sub>☉</sub></div>
          <div>{ star.mass } M<sub>☉</sub></div>
        </div>
      </div>
      <div className={styles.starControls}>
        <div id="star-ctrl-radar" className={styles.control} onClick={() => {
          setMenu(<ShipsListMenu ownShips={ownShips} otherShips={otherShips} onSelect={(ship: Ship) => {
            onSelectShip(ship)
            setMenu(null)
          }} />)
        }}>
          <Tooltip title="Scan">
            <RadarIcon />
          </Tooltip>
        </div>
        <div id="star-ctrl-send" className={styles.control} style={{ marginLeft: '3px', rotate: '180deg' }} onClick={() => {
          setMenu(<SendShipToMenu to={star} />)
        }}>
          <Tooltip title="Send ship">
            <TravelIcon />
          </Tooltip>
        </div>
      </div>
      { 
        menu && (
          <Outclickable onOutclick={() => {
            console.log('Outclick', (new Date()).getTime())
            setMenu(null)
          }}>
            <div className={styles.floatingMenu}>
              { menu }
            </div>
          </Outclickable>
        )
      }
      <div className={styles.bottomPanel}>
        {
          selectedShip ? (
            <Outclickable onOutclick={() => {
              onSelectShip(null)
            }}>
              <InteractWithShipMenu shipId={selectedShip.id} isOwn={isOwn(selectedShip)} star={star} onClickSend={() => {
                setMenu(<SendShipMenu shipId={selectedShip.id} from={star} />)
              }} onClickAttack={() => {
                setMenu(<AttackShipMenu target={selectedShip} />)
              }}/>
            </Outclickable>
          ) : (
            <div className={styles.claimPanel}>
              {
                starOwner ? (
                  <div className={styles.starOwnerSection}>
                    <div className={styles.starOwnerInfo}>
                      <div className={styles.starOwnerIcon}>
                        <AccountCircleIcon />
                      </div>
                      <div className={styles.starOwnerName}>
                        <div className={styles.starOwnerNameCaption}>
                          Owned by
                        </div>
                        <div className={styles.starOwnerNameValue}>
                          { shortenAddress(starOwner.address) }
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (!star.ownerId && star.name !== 'Sol' && !menu) && (
                  <div className={styles.starOwnerSection}>
                    <div className={styles.starOwnerInfo}>
                      <div className={styles.starOwnerIcon}>
                        <AccountCircleIcon />
                      </div>
                      <div className={styles.starOwnerName}>
                        <div className={styles.starOwnerNameCaption}>
                          No owner
                        </div>
                        <div className={styles.starOwnerNameValue}>
                          This star is unclaimed
                        </div>
                      </div>
                    </div>
                    <div className={styles.claimStar}>
                      { 
                        isClaimable() ? (
                          <Button variant="contained" disabled={claiming} fullWidth={true} onClick={() => {
                            setClaiming(true)
                            claimStar(star.id).unwrap()
                              .then(claimedStar => {
                                console.log('Star claimed successfully', claimedStar)
                                setClaiming(false)
                                getStar(star.id)
                              })
                          }}>
                            { claiming ? 'TRANSFERRING NFT...' : 'CLAIM THE STAR' }
                          </Button>
                        ) : (
                          <Button variant="contained" disabled={claiming} fullWidth={true} onClick={() => {
                            setMenu(<SendShipToMenu to={star} />)
                          }}>
                            SEND SHIP TO CLAIM
                          </Button>
                        )
                      }
                    </div>
                  </div>
                )

              }
            </div>
          )
        }
      </div>
    </>
  )

}
 
export default ShipsOverlay