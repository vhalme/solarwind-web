'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import { selectAuth } from '@/state/slices/authSlice'
import { selectAccount } from '@/state/slices/accountSlice'
import styles from './UserHeader.module.css'
import { useGetBalanceQuery } from '@/state/api/accountApiSlice'

export default function Account() {

  const auth = useSelector(selectAuth)
  const account = useSelector(selectAccount)

  const router = useRouter()

  const { data: balance, refetch: refreshBalance } = useGetBalanceQuery()

  useEffect(() => {
    console.log('Account updated', account.updated)
    refreshBalance()
  }, [account.updated])

  let accountControls
  
  if (auth.user) {
    accountControls = (
      <Button variant="text" onClick={(event) => {
        event.preventDefault()
        router.push('/account')
      }}>ACCOUNT</Button>
    )
  } else {
    accountControls = (
      <Button variant="text" onClick={(event) => {
        event.preventDefault()
        router.push('/login')
      }}>LOG IN</Button>
    )
  }

  const accountHeading = auth.user ?
    (
      <div className={styles.accountHeading}>
        {
          <div>SLW { Math.round((balance || 0) * 100) / 100 }</div>
        }
        
      </div>
    ) : (
      <div className={styles.accountHeading}>
        SOLARWIND
      </div>
    )

  return (
    <div className={styles.account}>
      { accountHeading }
      { accountControls }
    </div>
  )

}