'use client'

import styles from './ShipView.module.css'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/state/slices/authSlice'
import ArrowForward from '@mui/icons-material/NavigateNext'
import ArrowBack from '@mui/icons-material/NavigateBefore'
import TravelIcon from '@mui/icons-material/SwitchAccessShortcut'
import { useLazyGetBalanceQuery } from '@/state/api/accountApiSlice'
import { useGetShipQuery} from '@/state/api/shipsApiSlice'
import { useLazyGetStarQuery } from '@/state/api/starsApiSlice'
import { Ship } from 'solarwind-common/dist/model/ship'
import { Star } from 'solarwind-common/dist/model/star'
import ShipDetails from './ShipDetails'
import SendShipMenu from '@/components/menus/SendShipMenu'
import { Tooltip } from '@mui/material'

export const metadata = {
  title: 'Solarwind Metaverse - Ships',
  description: 'Physically accurate galactic metaverse',
  openGraph: {
    title: 'Solarwind Metaverse - Ships',
    description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
    url: 'https://solarwindmetaverse.com',
    type: 'article',
    images: ['https://solarwindmetaverse.com/opengraph-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solarwind Metaverse - Ships',
    description: 'Physically accurate galactic metaverse. Race to the stars and claim them as NFTs. Get to know our home galaxy and build your own galactic empire.',
    images: ['https://solarwindmetaverse.com/twitter-image.png']
  }
}

function ShipView({ params }: { params: { id: string } }) {

  const { id } = params

  const [ star, setStar ] = useState<Star | null>(null)
  const [ scrollPosition, setScrollPosition ] = useState<number>(0)
  const [ scrollWidth, setScrollWidth ] = useState<number>(0)
  const [ menu, setMenu ] = useState<ReactElement | null>(null)
  
  const [ getStar ] = useLazyGetStarQuery()
  const [ getBalance ] = useLazyGetBalanceQuery()

  const { data: ship } = useGetShipQuery(id, {
    pollingInterval: 1000
  })

  const ref = useRef<Ship | undefined>(ship)

  useEffect(() => {

    const shipRef = ref.current

    console.log('Init ship', ship, ship?.status, shipRef?.status)

    if (ship) {

      if (window.innerWidth < 640) {
        setScrollWidth(100)
      } else if (window.innerWidth < 960) {
        setScrollWidth(50)
      } else {
        setScrollWidth(33)
      }

      if (
        (ship.status === 101 && shipRef?.status === 102) ||
        (ship.status !== 200 && shipRef?.status === 200) ||
        (ship.status !== 0 && shipRef?.status === 0)) {
        console.log('Update balance')
        getBalance()
      }

      const starId = ship.starId || ship.targetStarId
      if (starId && (starId !== shipRef?.starId || starId !== shipRef?.targetStarId)) {
        console.log('Ship star id changed, update star')
        getStar(starId).unwrap()
          .then(star => setStar(star))
      }

      ref.current = ship

    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ship, ship?.status])


  const auth = useSelector(selectAuth)

  if (!auth.user || !ship) return null

  const customizationBlocks = [
    <div key="block-5">
      <div>...into a real battlestar!</div>
    </div>,
    <div key="block-4">
      <div>Extend and build up your ship...</div>
    </div>,
    <div key="block-3">
      <div>Upgrade your ship and manage its crew.</div>
    </div>,
    <div key="block-2">
      <div>Personalise and customise your ship.</div>
    </div>,
    <div key="block-1">
      <div>SHIP CUSTOMISATION</div>
      <div>Feature coming soon...</div>
    </div>
  ]

  let showScrollNext = false
  if (scrollWidth === 100) {
    showScrollNext = scrollPosition <= -100 && scrollPosition > -100 * (customizationBlocks.length)
  } else if (scrollWidth === 50) {
    showScrollNext = scrollPosition > -50 * (customizationBlocks.length - 1)
  } else {
    showScrollNext = scrollPosition > -33 * (customizationBlocks.length - 2)
  }

  let showScrollPrev = false
  if (scrollWidth === 100) {
    showScrollPrev = scrollPosition <= -200
  } else if (scrollWidth === 50) {
    showScrollPrev = scrollPosition <= -100
  } else {
    showScrollPrev = scrollPosition <= -66
  }

  let showToDetails = false
  if (ship.status > 0) {
    if (scrollWidth === 100) {
      showToDetails = true
    } else if (scrollWidth === 50) {
      showToDetails = scrollPosition <= -50
    } else {
      showToDetails = scrollPosition <= -33
    }
  }

  return (
    <div className={styles.container}>
      {
        showScrollNext && (
          <div className={styles.scrollNext} onClick={() => {
            setScrollPosition(scrollPosition - scrollWidth)
          }}>
            <ArrowBack />
          </div>
        )
      }
      {
        showScrollPrev && (
          <div className={styles.scrollPrev} onClick={() => {
            setScrollPosition(scrollPosition + scrollWidth)
          }}>
            <ArrowForward />
          </div>
        )
      }
      {
        menu ? (
          <div className={styles.menuContainer}>
            { menu }
          </div>
        ) : (
          <div className={styles.scrollPane} style={{ right: `${scrollPosition}vw` }}>
            <div id="ship-controls" className={styles.shipControls}>
              {
                (ship.status >= 100 && ship.status < 200) && (
                  <div className={styles.control} onClick={() => {
                    if (!star) return
                    setMenu(<SendShipMenu shipId={ship.id} from={star} cancel={() => {
                      setMenu(null)
                    }}/>)
                  }}>
                    <Tooltip title="Send">
                      <TravelIcon />
                    </Tooltip>
                  </div>
                )
              }
            </div>
            {
              customizationBlocks.map((block, i) => {
                return (
                  <div key={`ship-details-section-${i}`} className={styles.viewSection}>
                    {
                      (i === customizationBlocks.length - 1 && showToDetails) && (
                        <div className={styles.prevSection}>
                          <div className={styles.viewSectionLabel} onClick={() => {
                            setScrollPosition(scrollPosition + scrollWidth)
                          }}>
                            SHIP DETAILS <ArrowForward />
                          </div>
                        </div>
                      )
                    }
                    { block }
                  </div>
                )
              })
            }
            <div className={styles.viewSection}>
              {
                ship.status > 0 && (
                  <div className={styles.nextSection}>
                    <div className={styles.viewSectionLabel} onClick={() => {
                      setScrollPosition(scrollPosition - scrollWidth)
                    }}>
                      <ArrowBack /> CUSTOMISE SHIP
                    </div>
                  </div>
                )
              }
              <ShipDetails ship={ship} star={star} />
            </div>
          </div>
        )
      }
      
    </div>
  )

}
 
export default ShipView