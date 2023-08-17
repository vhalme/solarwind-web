import Tooltip from '@mui/material/Tooltip'
import AttackIcon from '@mui/icons-material/MyLocation'
import TravelIcon from '@mui/icons-material/SwitchAccessShortcut'
import WithdrawIcon from '@mui/icons-material/Output'
import SyncIcon from '@mui/icons-material/Sync'
import { InputCircle as CollectHarvestIcon } from '@/icons'
import styles from './InteractWithShipMenu.module.css'
import { useGetShipQuery, useAttackShipMutation } from '@/state/api/shipsApiSlice'
import { useLazyCollectHarvestQuery, useLazyGetBalanceQuery } from '@/state/api/accountApiSlice'
import { calculateHarvestAmount } from '@/common/common'
import { Star } from 'solarwind-common/dist/model/star'
import { useEffect, useRef } from 'react'
import { Ship } from 'solarwind-common/dist/model/ship'

const InteractWithShipMenu = ({ 
  shipId,
  isOwn,
  star,
  onClickSend,
  onClickAttack
}: { 
  shipId: string
  isOwn: boolean
  star: Star
  onClickSend: () => void
  onClickAttack: () => void
 }) => {

  const { data: ship } = useGetShipQuery(shipId, {
    pollingInterval: 1000
  })
  
  const [ collectHarvest ] = useLazyCollectHarvestQuery()
  const [ getBalance ] = useLazyGetBalanceQuery()

  useEffect(() => {
    if (ship?.status === 101) {
      getBalance()
    }
  }, [ship?.status])

  if (!ship) return null

  return (
    <div className={styles.detailPanel}>
      <div className={styles.shipDetails}>
        <div className={styles.shipName}>
          { ship.name }
        </div>
        <div className={styles.shipActions}>
          <div className={styles.shipActionsLeft}>
            {
              isOwn && (
                <div className={styles.action}>
                  <Tooltip title="Withdraw">
                    <div style={{ display: 'flex', rotate: '270deg' }}>
                      <WithdrawIcon />
                    </div>
                  </Tooltip>
                </div>
              )
            }  
          </div>
          <div className={styles.shipActionsRight}>
            {
              isOwn && (
                <div className={styles.action} onClick={async () => {
                  if (ship.status === 102) return
                  collectHarvest(shipId)
                }}>
                  {
                    ship.status === 102 ? (
                      <div className={styles.rotation}>
                        <SyncIcon />
                      </div>
                    ) : (
                      <Tooltip title={`Collect ${calculateHarvestAmount(ship.lastHarvested, star.luminosity, star.shipCount)} SLW`}>
                        <div style={{ rotate: '180deg', display: 'flex' }}>
                          <CollectHarvestIcon />
                        </div>
                      </Tooltip>
                    )
                  }
                </div>
              )
            }
            {
              !isOwn && (
                <div className={styles.action} onClick={onClickAttack}>
                  <Tooltip title="Attack">
                    <AttackIcon />
                  </Tooltip>
                </div>
              )
            }
            {
              isOwn && (
                <div className={styles.action} onClick={onClickSend}>
                  <Tooltip title="Travel">
                    <TravelIcon />
                  </Tooltip>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>

  )

}

export default InteractWithShipMenu