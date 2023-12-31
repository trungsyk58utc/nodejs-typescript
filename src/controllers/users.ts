import { Response, Request } from 'express'
import {
  changeForgotPasswordService,
  changePasswordService,
  forgotPasswordService,
  getListUserService,
  getMeService,
  getUserByIdService,
  loginService,
  logoutService,
  refreshService,
  registerService
} from '~/services/users.services'
import { decodeAccessToken } from '~/utils/jwtToken'

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

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    const results = await logoutService(refreshToken)
    if (results) {
      return res.json({
        message: 'Logout successfully'
      })
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Logout fail',
      error
    })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await getMeService(req.headers.authorization as string)
    return res.json(user)
  } catch (error) {
    console.log(error)
  }
}

export const getListUser = async (req: Request, res: Response) => {
  try {
    const user = await getListUserService()
    return res.json(user)
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

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await getUserByIdService(id)
    return res.json(result)
  } catch (error) {
    return res.status(400).json({
      message: 'Get user fail',
      error
    })
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    const result = await refreshService(refreshToken)
    return res.json({
      message: 'Request new token succesfully',
      result: {
        accessToken: result.newAccessToken,
        refreshToken: result.newRefreshToken
      }
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Get new token fail',
      error
    })
  }
}

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = decodeAccessToken(req?.headers?.authorization?.split(' ')[1] as string).userId
    await changePasswordService(userId, req?.body.newPassword)
    return res.json({ message: 'Change password successfully' })
  } catch (error) {
    return res.status(400).json({
      message: 'Change password fail',
      error
    })
  }
}

export const sendMailForgotPassword = async (req: Request, res: Response) => {
  try {
    const { emailRegister } = req.body
    await forgotPasswordService(emailRegister)
    return res.json({ message: 'Email has been sent to ' + emailRegister })
  } catch (error) {
    return res.status(400).json({
      message: 'Send email fail, pls retry',
      error
    })
  }
}

export const checkResetPassToken = async (req: Request, res: Response) => {
  return res.json({ message: 'Token can be use' })
}

export const changeForgotPassword = async (req: Request, res: Response) => {
  try {
    const { forgotPasswordToken, newPassword } = req.body
    await changeForgotPasswordService(forgotPasswordToken, newPassword)
    return res.json({ message: 'Password has been changed' })
  } catch (error) {
    return res.status(400).json({
      message: 'Change password fail, pls retry',
      error
    })
  }
}
