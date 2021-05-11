import axios from 'axios'
import { API_URL } from './properties.constants'

export function getGrupoZapProperties(): Promise<any> {
  return axios.get(API_URL)
}
