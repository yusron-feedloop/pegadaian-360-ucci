import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import { fetchJson } from './fetch'
import Cookies from 'js-cookie'
import { Config } from './config'

type UserRole = {
  displayField: string
}

export type User = {
    email: string
    role: UserRole
}

export function useUser() {
  const userFetcher = () => fetchJson(`${Config.QORE_BASE_URL}/v1/user`, {
    method: 'get',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
    },
})
  const { data, mutate, error } = useSWR<User>('api_auth_me', userFetcher)


  return { 
    user: data, 
    mutateUser: mutate,
    loading: !data && !error,
    error 
  }
}
