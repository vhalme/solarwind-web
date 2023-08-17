import { refreshBalance } from './slices/accountSlice'
import { store } from '@/state/store'

export const updateBalance = () => {
  store.dispatch(refreshBalance())
}