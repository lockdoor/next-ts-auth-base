import axios from "axios";
const BASE_URL : string = '/api/auth'
import {Register} from '@/ts/userInterface'

export const register = async (payload: Register) => {
  const {data} = await axios.post(`${BASE_URL}/register`, payload)
  return data
}

export const verifyRegister = async(token: string)=>{
  const {data} = await axios.get(`${BASE_URL}/register?token=${token}`)
  return data
}

export const recovery = async (payload: {email: string}) => {
  const {data} = await axios.post(`${BASE_URL}/recovery`, payload)
  return data
}

export const verifyRecovery = async(token: string)=>{
  const {data} = await axios.get(`${BASE_URL}/recovery?token=${token}`)
  return data
}

export const changeUserPassword = async(payload: {email: string, password: string}) => {
  const {data} = await axios.put(`${BASE_URL}/recovery`, payload)
  return data
}