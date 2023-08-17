'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/state/slices/authSlice'
import styles from './Account.module.css'
import MainMenu from '@/components/MainMenu'

function AccountPage() {

  const auth = useSelector(selectAuth)

  console.log('auth', auth)

  const content = (
    <div>
      Coming soon!
      <br/><br/>
      Trade your SLW, stars and ships!
    </div>
  )
  
  return (
    <div className={styles.root}>
      <MainMenu />
      <div className={styles.content}>
        { content }
      </div>
    </div>
  )
}

export default AccountPage