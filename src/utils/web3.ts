/* eslint-disable indent */
import { SolarwindWindow } from '@/common/SolarwindWindow'
import Web3 from 'web3'
import Web3Personal from 'web3-eth-personal'
import { AbiItem } from 'web3-utils'
import ERC20 from './ERC20.json'

declare const window: SolarwindWindow

export interface Web3Provider {
    status: string
    web3: Web3
    connect: () => Promise<Web3Provider>
    sign: (message: string) => Promise<string>
    getAccounts: () => Promise<string[]>
    getSelectedAccount: () => string | undefined
    switchToPolygon: () => Promise<Web3Provider>
    accountBalance?: number
    accounts?: string[]
    selectedAccount?: number
    chainId?: string
    getBalance?: () => Promise<string>
}

const tokenAddress = '0x383E282B16F3d9bf69247e34845dC6415e830ed5'
const requiredChainId = '0x13881'

export const getWeb3Provider = async (): Promise<Web3Provider | undefined> => {

  if (!window.ethereum) return undefined

  const web3 = new Web3(window.ethereum)

  const web3Provider: Web3Provider = {
    status: 'initialized',
    web3,
    sign: async (message: string): Promise<string> => {
      const selectedAccount = web3Provider.getSelectedAccount()
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, selectedAccount, 'to the moon'],
      })


      const publicKey = web3.eth.accounts.recover('SOLARWIND SIGN-IN 176204201', '0x6c187f0ba00f9a02ed28c60b8f6b466123b4ade7c1932eef8d4451573bbcdf8e17666b8c4506014949bd03b8255b4a795c8032a724bd3a39790edf92367707ca1b')
      console.log('publicKey', publicKey)
              
      return signature
    },
    connect: async (): Promise<Web3Provider> => {
        await window.ethereum.enable()
        await web3Provider.getAccounts()
        web3Provider.status = 'connected'
        return web3Provider
    },
    getSelectedAccount: () => {
      if (web3Provider.accounts && web3Provider.accounts.length > 0) {
        return web3Provider.accounts[0]
      }
    },
    switchToPolygon: async (): Promise<Web3Provider> => {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }],
        })
        return web3Provider
    },
    getAccounts: async (): Promise<string[]> => {
        console.log('enabled', window.ethereum.networkConfig)
        const accounts = await web3.eth.getAccounts()
        web3Provider.accounts = accounts
        console.log(accounts)
        return accounts
    }
  }

  /*
  const accounts = await web3Provider.getAccounts()

  if (accounts.length > 0) {

    web3Provider.selectedAccount = 0
    web3Provider.accountBalance
    
    web3Provider.getSelectedAccount = () => {
      console.log('getSelectedAccounts', web3Provider)
      if (web3Provider.accounts && web3Provider.selectedAccount !== undefined) {
        return web3Provider.accounts[web3Provider.selectedAccount]
      }
    }
  
    const currentChainId = await web3.eth.getChainId()
    const currentHexChainId = `0x${currentChainId.toString(16)}`
    web3Provider.chainId = currentHexChainId
    
    web3Provider.status = 'connected'
    const selectedAccount = web3Provider.getSelectedAccount()
    console.log('selectedAccount', selectedAccount)

    if (selectedAccount) {
      web3Provider.getBalance = async () => {
        const contract = new web3.eth.Contract(ERC20 as AbiItem[], tokenAddress)
        const accountBalance = await contract.methods.balanceOf(selectedAccount).call()
        web3Provider.accountBalance = accountBalance
        return accountBalance
      }
      const balance = await web3Provider.getBalance()
      console.log(balance)
      web3Provider.status = 'ready'
    }

  } else {
    web3Provider.status = 'noAccount'
  }
  */

  return web3Provider

}