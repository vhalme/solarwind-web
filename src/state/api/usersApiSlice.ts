import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  endpoints: (build) => ({
    getPublicUser: build.query<{ id: string; username: string; address: string; }, string>({
      query: (id: string) => `/users/${id}`
    })
  })
})

export const {
  useGetPublicUserQuery,
  useLazyGetPublicUserQuery
} = api

export default api