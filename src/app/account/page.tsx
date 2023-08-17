'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/state/slices/authSlice'
import { useGetAuthUserQuery } from '@/state/api/authApiSlice'
import Button from '@mui/material/Button'
import styles from './Account.module.css'

function AccountPage() {

  const fetchedUser = useGetAuthUserQuery()

  const auth = useSelector(selectAuth)

  console.log('auth', auth)

  return (
    <div className={styles.root}>
      <div className={styles.contentSection}>
        <div>
          {
            fetchedUser.isSuccess && (
              <div>
                <div>
                  <Button variant="text" onClick={() => {
                    window.location.href = '/auth/logout'
                  }}>LOG OUT</Button>
                </div>
                <div>E-mail: {fetchedUser.data.email}</div>
                <div>Address: {fetchedUser.data.address}</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default AccountPage