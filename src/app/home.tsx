'use client'

import { useRouter } from 'next/navigation'
import cx from 'classnames'
import styles from './page.module.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import MovingShip from './MovingShip'

declare const window: any

export default function Home() {

  const [scrollPosition, setScrollPosition] = useState(1)
  const [shipScale, setShipScale] = useState(1)

  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }

  const winRef = useRef<any>(null)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    winRef.current = window
    setScrollPosition(0)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useMemo(() => {
    if (winRef.current) {
      setShipScale((winRef.current.innerWidth / winRef.current.innerHeight))
    }
  }, [winRef.current])

  const router = useRouter()

  const win = winRef.current || {}

  let topLayerY = -20
  let bottomLayerY = 0
  if (win.innerWidth > 1500) {
    topLayerY = -30
    bottomLayerY = 20
  } else if (win.innerWidth > 1300) {
    topLayerY = -20
    bottomLayerY = 20
  }

  const contentBlockStyles: { [key: string]: string }[] = [
    {},
    {},
    {},
    {}
  ]

  const contentBlockClasses: any[] = [
    [styles.contentBlockActionHidded],
    [styles.contentBlockActionHidded],
    [styles.contentBlockActionHidded],
    [styles.contentBlockActionHidded],
    [styles.textBlockUnfocused],
    [styles.textBlockUnfocused],
    [styles.textBlockUnfocused]
  ]

  const scrollBase = win.innerWidth > 400 ? 200 : 0
  const adjustedScrollPosition = scrollPosition + scrollBase

  if (adjustedScrollPosition > 275) {
    contentBlockClasses[0] = [styles.contentBlockActionVisible]
  }

  if (adjustedScrollPosition > 500) {
    contentBlockClasses[1] = [styles.contentBlockActionVisible]
  }

  if (adjustedScrollPosition > 700) {
    contentBlockClasses[2] = [styles.contentBlockActionVisible]
  }

  if (adjustedScrollPosition > 950) {
    contentBlockClasses[3] = [styles.contentBlockActionVisible]
  }

  if (adjustedScrollPosition > 1000) {
    contentBlockClasses[4] = [styles.textBlockFocused]
  }

  if (adjustedScrollPosition > 1050) {
    contentBlockClasses[5] = [styles.textBlockFocused]
  }

  if (adjustedScrollPosition > 1100) {
    contentBlockClasses[6] = [styles.textBlockFocused]
  }

  if (!winRef.current) return null

  return (
    <main className={styles.main}>
      <div className={styles.parallax}>
        <div className={cx(styles.layer, styles.layer1)} style={{
          top: `calc(${(-scrollPosition * 0.12)}px)`
        }}></div>
        <div className={cx(styles.layer, styles.layer2)} style={{
          top: `calc(${topLayerY}vh - ${10 + (scrollPosition * 0.5)}px)`
        }}></div>
        <MovingShip scale={shipScale} />
        <div className={cx(styles.layer, styles.layer3)} style={{
          top: `calc(${bottomLayerY}vh + ${scrollPosition * 0.1}px)`
        }}>
          <img src="/neb11.png" />
        </div>
        <div className={styles.title} style={{
          top: `${240 - (scrollPosition * 1.5)}px`
        }}>
          <div className={styles.logo}>
            <div className={styles.slogan}>
              Mint the Milky Way
            </div>
            <div className={styles.logoSolarwind}>
              SOLARWIND
            </div>
            <div className={styles.logoMetaverse}>
              METAVERSE
            </div>
          </div>
          <div className={styles.openApp}>
            <Button variant="contained" onClick={() => {
              router.push('/stars')
            }}>
              <b style={{ color: '#fff' }}>OPEN METAVERSE</b>
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentBlock}>
          Physically accurate, infinitely growing metaverse based on the Milky Way galaxy.
          <br /><br />
          Become a test pilot and join our community of Solarwind pioneers and Founding Members.
          <div className={cx(contentBlockClasses[0])} style={contentBlockStyles[0]}>
            <a href="https://discord.gg/EgPu4saz" target="_blank">
              <Button variant="outlined">
                JOIN DISCORD
              </Button>
            </a>
          </div>
        </div>
        <div className={styles.contentBlock}>
          Race to the stars and claim them as NFTs! Build communities and economies in the solar systems you have claimed.
          <div className={cx(contentBlockClasses[1])} style={contentBlockStyles[1]}>
            <Button variant="outlined" onClick={() => {
              router.push('/stars')
            }}>
              EXPLORE STARS
            </Button>
          </div>
        </div>
        <div className={styles.contentBlock}>
          Powered by the Solwarwind utility token SLW - the energy source that keeps the metaverse running.
          <div className={cx(contentBlockClasses[2])}>
            <Button variant="outlined" disabled={true} onClick={() => {
              router.push('/buy-slw')
            }}>
              BUY SLW
            </Button>
          </div>
        </div>
        <div className={styles.contentBlock}>
          Harvest and trade SLW to earn income or get competitive advantage. Own, develop and trade your stars and ships as NFTs.
          <div className={cx(contentBlockClasses[3])}>
            <Button variant="outlined" onClick={() => {
              router.push('/market')
            }}>
              VISIT MARKET
            </Button>
          </div>
        </div>
        <div className={styles.lastContentBlock}>
          <div className={cx(styles.textBlock, ...contentBlockClasses[4])}>
            We created Solarwind metaverse because we are fans of space and science and have read too many sci-fi books.
          </div>
          <div className={cx(styles.textBlock, ...contentBlockClasses[5])}>
            This is only a humble demo and proof of concept running on Polygon Testnet. We have big plans though -
            Our goal is to develop a simulation of the Milky Way galaxy that will prepare humanity for its interstellar destiny.
          </div>
          <div className={cx(styles.textBlock, ...contentBlockClasses[6])} style={{
            backgroundColor: 'rgba(255, 255, 255, 1.0)',
            border: '8px solid rgba(200, 200, 200, 0.5)',
            color: 'black',
            fontWeight: 'bold'
          }}>
            Join us!
            <br/><br/>
            Investors, business developers, software developers, artists - contact:
            <br></br><br/>
            <span style={{ fontSize: '16px' }}>contact@solarwindmetaverse.io</span>
            <br/><br/>
            for partnership!
          </div>
        </div>
      </div>
    </main>
  )
}
