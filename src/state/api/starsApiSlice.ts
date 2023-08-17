import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Star, StarWithNeighbours, StarData, NearestStar } from 'solarwind-common/dist/model/star'
import { TaxPayment } from 'solarwind-common/dist/model/taxPayment'

interface StarsResponse {
    stars: StarWithNeighbours[]
}

interface SearchStarsResponse {
  stars: NearestStar[]
}

interface TaxPaymentsResponse {
  taxPayments: TaxPayment[]
}

export const api = createApi({
  reducerPath: 'starsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  endpoints: (build) => ({
    getStars: build.query<StarWithNeighbours[], void>({
      query: () => '/stars',
      transformResponse: (result: StarsResponse) => {
        return result.stars
      }
    }),
    getStar: build.query<StarWithNeighbours, string>({
      query: (id: string) => `/stars/${id}`,
      transformResponse: (result: StarWithNeighbours) => {
        return result
      }
    }),
    searchStars: build.query<NearestStar[], { id: string, name: string; }>({
      query: ({ id, name }) => `/stars/${id}/${name}`,
      transformResponse: (result: SearchStarsResponse) => {
        return result.stars
      }
    }),
    claimStar: build.query<Star, string>({
      query: (id: string) => `/stars/${id}/claim`
    }),
    getTaxPayments: build.query<TaxPayment[], string>({
      query: (id) => `/stars/${id}/taxes`,
      transformResponse: (result: TaxPaymentsResponse) => {
        return result.taxPayments
      }
    }),
    createStar: build.mutation<Star, StarData>({
      query: (star: StarData) => ({
        url: '/stars',
        method: 'POST',
        body: star
      }),
      transformResponse: (result: Star): Star => {
        return result
      }
    }),
    updateStar: build.mutation<void, { id: string, star: StarData }>({
      query: ({ id, star }) => {
        return {
          url: `/stars/${id}`,
          method: 'PUT',
          body: star
        }
      }
    }),
    mintStarNft: build.mutation<number, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/stars/${id}/mint`,
          method: 'PUT'
        }
      },
      transformResponse: ({ tokenId }): number => {
        return tokenId
      }
    }),
    deleteStar: build.mutation<void, string>({
      query: (id: string) => ({
        url: `/stars/${id}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetStarsQuery,
  useLazyGetStarsQuery,
  useGetStarQuery,
  useLazySearchStarsQuery,
  useLazyClaimStarQuery,
  useLazyGetStarQuery,
  useGetTaxPaymentsQuery,
  useCreateStarMutation,
  useUpdateStarMutation,
  useDeleteStarMutation,
  useMintStarNftMutation
} = api

export default api