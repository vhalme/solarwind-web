'use client'

import styles from './TutorialHint.module.css'

import Cookies from 'js-cookie'
import { isMobile } from 'react-device-detect'
import React, { useState } from 'react'
import Button from '@mui/material/Button'

const TutorialHint = ({ id, text, showTutorial, hide, nested } : {
  id: string
  text: React.ReactNode
  showTutorial: (show: boolean) => void
  hide: () => void,
  nested?: boolean
}) => {

  const contentStyle: { [key: string ]: any } = {
    width: '320px',
    position: 'absolute',
    border: '2px solid #90caf9',
    borderRadius: '18px',
    backgroundColor: 'white',
    padding: '18px',
    zIndex: 5
  }

  contentStyle.bottom = nested ? '30px' : '40px'
  contentStyle.right = nested ? '30px' : '40px'
  
  return (
    <div style={contentStyle}>
      <div style={{
        marginBottom: '18px',
        color: 'black',
      }}>
        { text }
      </div>
      <div style={{
      }}>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '12px'
        }}>
          <Button style={{ width: '200px' }} variant="contained" onClick={(e) => {
            hide()
            showTutorial(true)
            Cookies.set(id, 'BLOCK', { expires: 365 })
            e.stopPropagation()
            e.preventDefault()
          }}>
            SHOW ME!
          </Button>
        </div>
        <div>
          <Button style={{ width: '95px', marginLeft: '5px', marginRight: '5px' }} variant="outlined" onClick={(e) => {
            Cookies.set(id, 'BLOCK', { expires: 365 })
            hide()
            e.stopPropagation()
            e.preventDefault()
          }}>
            NEVER
          </Button>
          <Button style={{ width: '95px', marginLeft: '5px', marginRight: '5px' }} variant="outlined" onClick={(e) => {
            hide()
            e.stopPropagation()
            e.preventDefault()
          }}>
            LATER
          </Button>
        </div>
      </div>
      <div style={{
        position: 'absolute',
        right: '-2px',
        bottom: '-2px',
        backgroundColor: 'white',
        width: '20px',
        height: '20px',
        borderRight: '2px solid #90caf9',
        borderBottom: '2px solid #90caf9',
        zIndex: 4
      }}>

      </div>
    </div>
  )

  /*
  return nested ? content : (
    <div style={{
      position: 'fixed',
      top: '0px',
      left: '0px',
      height: '100vh',
      width: '100vw',
      zIndex: 3,
    }}>
      { content }
    </div>
  )
  */

}

export default TutorialHint