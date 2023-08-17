import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import accountReducer from './slices/accountSlice'
import { api as authApi } from './api/authApiSlice'
import { api as starsApi } from './api/starsApiSlice'
import { api as shipsApi } from './api/shipsApiSlice'
import { api as accountApi } from './api/accountApiSlice'
import { api as usersApi } from './api/usersApiSlice'
import { api as eventsApi } from './api/eventsApiSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [starsApi.reducerPath]: starsApi.reducer,
    [shipsApi.reducerPath]: shipsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    auth: authReducer,
    account: accountReducer
  },
  // Add the RTK Query API middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(accountApi.middleware)
      .concat(starsApi.middleware)
      .concat(shipsApi.middleware)
      .concat(usersApi.middleware)
      .concat(eventsApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
