import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/state/store'
import { balanceUpdated } from '../slices/accountSlice'

export const api = createApi({
  reducerPath: 'accountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  endpoints: (build) => ({
    getBalance: build.query<number, void>({
      query: () => '/balance',
      transformResponse: (result: { balance: number }) => {
        return result.balance
      }
    }),
    collectHarvest: build.query<number, string>({
      query: (id: string) => `/ships/${id}/collect-harvest`,
      transformResponse: (result: { harvested: number }): number => {
        return result.harvested
      }
    })
  })
})

export const {
  useGetBalanceQuery,
  useLazyGetBalanceQuery,
  useLazyCollectHarvestQuery
} = api

export default api