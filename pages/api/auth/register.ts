import type { NextApiRequest, NextApiResponse } from 'next'
import { register, verifyRegister } from '@/controller/user'

export default function handler(req : NextApiRequest, res: NextApiResponse){
  switch(req.method){
    case 'POST' : 
      register(req, res)
      break
    case 'GET' :
      verifyRegister(req, res)
      break
    default:
      return res.json({ error: `${req.method} not allow` });
  }  
}