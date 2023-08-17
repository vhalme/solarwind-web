import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface AuthUser {
    id: string
    email?: string
    address?: string
}

interface AuthUserResponse {
    user: AuthUser
}


export interface LoginCredentials {
    email: string
    password: string
}

export interface SignatureLoginCredentials {
  publicAddress: string
  signature?: string
}

export const api = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/auth'
  }),
  endpoints: build => ({
    getAuthUser: build.query<AuthUser, void>({
      query: () => '/user',
      transformResponse: (result: AuthUserResponse) => {
        return result.user
      },
    }),
    getNonce: build.query<number, string>({
      query: (publicAddress: string) => `/user/nonce/${publicAddress}`,
      transformResponse: (result: { nonce: number }) => {
        return result.nonce
      },
    }),
    logIn: build.mutation({
      query: (credentials: LoginCredentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials
      })
    }),
    logInWithSignature: build.mutation({
      query: (credentials: { [key: string]: string }) => ({
        url: '/login/metamask',
        method: 'POST',
        body: credentials
      })
    })
  })
})

export const { useGetAuthUserQuery, useLazyGetAuthUserQuery, useLazyGetNonceQuery, useLogInMutation, useLogInWithSignatureMutation } = api

export default api