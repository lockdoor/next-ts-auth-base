import type { NextApiRequest, NextApiResponse } from 'next'
import { recovery, verifyRecovery, changeUserPassword } from '@/controller/user'

export default function handler(req : NextApiRequest, res: NextApiResponse){
  switch(req.method){
    case 'POST' : 
      recovery(req, res)
      break
    case 'GET' :
      verifyRecovery(req, res)
      break
    case 'PUT' :
      changeUserPassword(req, res)
      break
    default:
      return res.json({ error: `${req.method} not allow` });
  }  
}