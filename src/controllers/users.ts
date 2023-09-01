import User from '~/models/Schemas/User.schemas'
import { Response, Request } from 'express'
import { getListUserService, getMeService, loginService, registerService } from '~/services/users.services'

export const login = async (req: Request, res: Response) => {
  try {
    const results = await loginService(req.body)
    if (results) {
      return res.json({
        message: 'Login success',
        data: results
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

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await getMeService(req.headers.authorization as string)
    return res.json({
      user
    })
  } catch (error) {
    console.log(error)
  }
}

export const getListUser = async (req: Request, res: Response) => {
  try {
    const user = await getListUserService()
    return res.json({ user })
  } catch (error) {
    return res.status(404).json({
      error: 'Not found'
    })
  }
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await registerService(req.body)
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
