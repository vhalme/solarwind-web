'use client'

import UserHeader from '@/components/UserHeader'
import { useSelector, useDispatch } from 'react-redux'
import { useGetAuthUserQuery } from '@/state/api/authApiSlice'

import { useGetUserEventsQuery, useDismissEventMutation } from '@/state/api/eventsApiSlice'
import { useGetBalanceQuery } from '@/state/api/accountApiSlice'
import { userLoggedIn } from '@/state/slices/authSlice'
import { balanceUpdated } from '@/state/slices/accountSlice'
import { ReactElement, useEffect } from 'react'
import { AppDispatch } from '@/state/store'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AttackIcon from '@mui/icons-material/MyLocation'
import InfoIcon from '@mui/icons-material/Info'
import styles from './App.module.css'
import { usePathname } from 'next/navigation'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

interface AppProps {
    children: React.ReactNode | React.ReactNode[]
}

const eventTypeIcons: { [key: number]: ReactElement } = {
  1: <AttackIcon />
}

const getEventIcon = (eventType: number) => {
  const icon = eventTypeIcons[eventType]
  return icon || <InfoIcon />
}

function App({ children }: AppProps) {

  const dispatch = useDispatch<AppDispatch>()
  const fetchedUser = useGetAuthUserQuery()
  const accountBalance = useGetBalanceQuery()

  const { data: events, refetch: getUserEvents } = useGetUserEventsQuery()
  const [ dismissEvent ] = useDismissEventMutation()
  
  useEffect(() => {
    if (fetchedUser.isSuccess) {
      dispatch(userLoggedIn({ user: fetchedUser.data }))
    }
  }, [fetchedUser.isSuccess])

  useEffect(() => {
    if (accountBalance.isSuccess) {
      dispatch(balanceUpdated({ balance: accountBalance.data }))
    }
  }, [accountBalance.isSuccess])

  const pathname = usePathname()
  
  const isStarView = pathname.startsWith('/stars/') && pathname.length > 7

  return (
    
    <ThemeProvider theme={darkTheme}>
      <div className={styles.root}>
        {
          !isStarView &&
            <div className={styles.topSection}>
              <UserHeader />
            </div>
        }
        {
          events && events.length > 0 && (
            <div className={styles.events}>
              {
                (events || []).map(event => {
                  return (
                    <div key={`event-${event.id}`} className={styles.event}>
                      <div className={styles.content}>
                        <div className={styles.icon}>
                          { getEventIcon(event.type) }
                        </div>
                        <p className={styles.text}>
                          { event.text }
                        </p>
                      </div>
                      <div className={styles.close} onClick={async () => {
                        const result = await dismissEvent(event.id).unwrap()
                        console.log('Dismiss result', result)
                        if (result.status === 'OK') {
                          console.log('Event dismissed')
                          await getUserEvents()
                        }
                      }}>
                        <div className={styles.icon}>
                        </div>
                        <div className={styles.text}>
                          Dismiss
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          )
        }
        {children}
      </div>
    </ThemeProvider>
  )

}

export default App