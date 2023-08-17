import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

const initialState = {
  updated: new Date().getTime(),
  balance: 0
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    refreshBalance(state) {
      console.log('Refresh balance')
      state.updated = new Date().getTime()
    },
    balanceUpdated(state, action) {
      const { balance } = action.payload
      state.balance = balance
    }

  }
})


export const selectAccount = (state: RootState) => state.account
export const { balanceUpdated, refreshBalance } = accountSlice.actions

export default accountSlice.reducer