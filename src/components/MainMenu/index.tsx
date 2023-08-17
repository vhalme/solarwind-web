'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import cx from 'classnames'
import styles from './MainMenu.module.css'

const MENU_ITEMS = [
  {
    name: 'Stars',
    path: '/stars'
  },
  {
    name: 'Ships',
    path: '/ships'
  },
  {
    name: 'Market',
    path: '/market'
  }
]

export default function MainMenu() {

  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className={styles.root}>
      {
        MENU_ITEMS.map(item => (
          <div id={`main-menu-item-${item.name}`} key={`main-menu-item-${item.name}`} 
            className={cx(styles.menuSection, pathname.startsWith(item.path) ? styles.menuSectionSelected : null)}
            onClick={(event) => {
              event.preventDefault()
              router.push(item.path)
            }}>
            { item.name }
          </div>
        ))
      }
    </div>
  )
}