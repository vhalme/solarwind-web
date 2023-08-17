'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginCredentials, useLazyGetAuthUserQuery, useLazyGetNonceQuery, useLogInMutation, useLogInWithSignatureMutation } from '@/state/api/authApiSlice'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import styles from './Login.module.css'
import { Web3Provider, getWeb3Provider } from '@/utils/web3'

function LogInPage() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const [web3, setWeb3] = useState<Web3Provider | undefined>()

  const [logIn] = useLogInMutation()
  const [logInWithSignature] = useLogInWithSignatureMutation()

  const [getAuthUser] = useLazyGetAuthUserQuery()
  const [getNonce] = useLazyGetNonceQuery()

  const router = useRouter()

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleLogIn = async (credentials: LoginCredentials) => {

    try {
        
      const result = await logIn(credentials).unwrap()
      const { user } = result
      if (user) {
        console.log('Log in success')
        getAuthUser()
        router.push('/stars')
        return
      }
    
      console.log('Log in result unsuccessful ', result)

    } catch (err: any) {
      console.log('Log in failed', err)
    }
    
  }

  const handleMetamaskLogIn = async (publicAddress: string, web3Provider: Web3Provider) => {


    console.log('handleMetamaskLogIn', publicAddress)
    try {
      
      const nonce = await getNonce(publicAddress).unwrap()
      const signature = await web3Provider.sign(`SOLARWIND SIGN-IN ${nonce}`)
      console.log('signature', signature)

      const result = await logInWithSignature({
        publicAddress,
        signature
      })

      console.log('metamask login result', result)

      getAuthUser()
      router.push('/stars')

    } catch (err: any) {

      if (err.data?.id === 'USER_NOT_FOUND') {
        
        console.log('User not found, attempting to register')
        
        const result = await logInWithSignature({
          publicAddress,
          signature: 'none'
        })

        console.log('registered user result', result)

        getAuthUser()
        router.push('/stars')

      } else {
        console.log('Log in failed', err)
      }
      
    }
    
  }

  return (
    <div className={styles.root}>
      <div className={styles.loginFormContainer}>
        <div className={styles.formLabel}>
            SIGN IN / REGISTER
        </div>
        <div className={styles.loginDescription}>
            
        </div>
        <div className={styles.localLogin}>
          <div className={styles.loginInputs}>
            <div className={styles.inputContainer}>
              <div className={styles.textFieldContainer}>
                <TextField
                  id="login-email"
                  label="E-mail"
                  value={email}
                  fullWidth={true}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(event.target.value)
                  }}
                />
              </div>
            </div>
            <div className={styles.inputContainer}>
              <div className={styles.textFieldContainer}>
                <FormControl variant="outlined" fullWidth={true}>
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setPassword(event.target.value)
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </div>
            </div>
          </div>
          <div className={styles.submitContainer}>
            <div className={styles.signInInfo}>
                Your account is created on first sign-in
            </div>
            <div className={styles.loginButtonContainer}>
              <Button fullWidth={true} variant="contained" onClick={async () => {
                await handleLogIn({ email, password })
              }}>SIGN IN</Button>
            </div>
          </div>
        </div>
        <div className={styles.loginTypeDivider}>
          <div className={styles.dividerLabel}>
                Other sign-in options
          </div>
        </div>
        <div className={styles.ssoLogins}>
          <div className={styles.metamaskLogin}>
            <Button variant="outlined" onClick={async () => {
              
              console.log('Do Metamask login')
              let provider = await getWeb3Provider()
              if (!provider) {
                console.error('Could not load Web3 provider')
                return
              }

              if (!provider.getSelectedAccount()) {
                provider = await provider.connect()
              }

              setWeb3(provider)
              if (provider.status === 'connected') {
                const selectedAccount = provider.getSelectedAccount()
                if (!selectedAccount) {
                  console.error('Could not get selected account')
                  return
                }
                await handleMetamaskLogIn(selectedAccount, provider)
              }
              
            }}>METAMASK</Button>
          </div>
          <div className={styles.googleLogin}>
            <Button variant="outlined" onClick={async () => {
              window.location.href = '/auth/google'
            }}>GOOGLE</Button>
          </div>
          <div className={styles.facebookLogin}>
            <Button variant="outlined" disabled={true} onClick={async () => {
              window.location.href = '/auth/facebook'
            }}>FACEBOOK</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogInPage
