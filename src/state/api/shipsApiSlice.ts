import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Ship } from 'solarwind-common/dist/model/ship'

interface ShipsResponse {
    ships: Ship[]
}

export const api = createApi({
  reducerPath: 'shipsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  endpoints: (build) => ({
    getShip: build.query<Ship, string>({
      query: (id: string) => `/ships/${id}`
    }),
    getOwnShips: build.query<Ship[], void>({
      query: () => '/ships',
      transformResponse: (result: ShipsResponse) => {
        return result.ships
      }
    }),
    getShipsOnOrbit: build.query<Ship[], string>({
      query: (starId) => `/ships/star/${starId}`,
      transformResponse: (result: ShipsResponse) => {
        return result.ships
      }
    }),
    sendShip: build.mutation<Ship, { shipId: string, starId: string, fuel: number }>({
      query: ({ shipId, starId, fuel }) => {
        return {
          url: `/ships/${shipId}/travel/${starId}`,
          method: 'POST',
          body: { fuel }
        }
      }
    }),
    putShipOnOrbit: build.mutation<Ship, { shipId: string, starId: string }>({
      query: ({ shipId, starId }) => {
        return {
          url: `/ships/${shipId}/stars/${starId}`,
          method: 'PUT'
        }
      }
    }),
    claimShip: build.mutation<Ship, { name: string }>({
      query: (ship) => {
        return {
          url: '/ships/claim',
          method: 'POST',
          body: ship
        }
      },
      transformResponse: (ship: Ship): Ship => {
        return ship
      }
    }),
    buildShip: build.mutation<{ success: boolean, message?: string, ship?: Ship }, { name: string }>({
      query: (ship) => {
        return {
          url: '/ships/build',
          method: 'POST',
          body: ship
        }
      }
    }),
    mintShipNft: build.mutation<number, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/ships/${id}/mint`,
          method: 'PUT'
        }
      },
      transformResponse: ({ tokenId }): number => {
        return tokenId
      }
    }),
    attackShip: build.mutation<{ success: boolean; amount?: number }, { attackerId: string, targetId: string, power: number }>({
      query: ({ attackerId, targetId, power }) => {
        return {
          url: `/ships/${attackerId}/attack/${targetId}/${power}`,
          method: 'POST'
        }
      }
    })
  })
})

export const {
  useGetOwnShipsQuery,
  useLazyGetOwnShipsQuery,
  useGetShipQuery,
  useLazyGetShipQuery,
  useGetShipsOnOrbitQuery,
  useClaimShipMutation,
  useBuildShipMutation,
  useMintShipNftMutation,
  useSendShipMutation,
  usePutShipOnOrbitMutation,
  useAttackShipMutation
} = api

export default api