import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Event } from 'solarwind-common/dist/model/event'

export const api = createApi({
  reducerPath: 'eventsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  endpoints: (build) => ({
    getUserEvents: build.query<Event[], void>({
      query: () => `/events`,
      transformResponse: (result: { events: Event[] }) => {
        return result.events
      }
    }),
    dismissEvent: build.mutation<{ status: string }, string>({
      query: (id) => {
        return {
          url: `/events/${id}/dismiss`,
          method: 'PUT'
        }
      }
    }),
  })
})

export const {
  useGetUserEventsQuery,
  useLazyGetUserEventsQuery,
  useDismissEventMutation
} = api

export default api