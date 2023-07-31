import User from '~/models/Schemas/User.schemas'
import { Response, Request } from 'express'
import { loginService, registerService } from '~/services/users.services'

export const login = async (req: Request, res: Response) => {
  try {
    const results = await loginService(req.body)
    if (results) {
      return res.json({
        message: 'Login success'
      })
    } else {
      return res.status(400).json({
        message: 'Wrong username or password'
      })
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Login fail',
      error
    })
  }
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await registerService(req.body)
    console.log(result)
    return res.json({
      message: 'Create user successfully',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Create user fail',
      error
    })
  }
}
