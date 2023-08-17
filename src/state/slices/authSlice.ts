import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

const initialState: {
  user: {
    id: string
  } | null
} = {
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action) {
      const { user } = action.payload
      state.user = user
    },
    userLoggedOut(state, action) {
      state.user = null
    }
  }
})


export const selectAuth = (state: RootState) => state.auth
export const { userLoggedIn, userLoggedOut } = authSlice.actions

export default authSlice.reducer