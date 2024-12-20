import axios from 'axios'
import { Config } from './config'

export const apiAixpV2 = axios.create({
    baseURL: Config.AIXP_BASE_URL + '/v2',
    headers: {
        'Content-type': 'application/json',
        'X-API-KEY': Config.AIXP_API_KEY,
    }
})

export const apiQore = axios.create({
    baseURL: Config.QORE_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
})
