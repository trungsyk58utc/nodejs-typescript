import jwt, { Secret } from 'jsonwebtoken'
import CONFIG from '~/config/config'

interface decode extends jwt.JwtPayload {
  userId: string
  registerEmail: string
}

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, CONFIG.accessTokenPrivateKey as Secret, { expiresIn: '30m' })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, CONFIG.refreshTokenPrivateKey as Secret, { expiresIn: '5d' })
}

export const generateNewRefreshToken = (userId: string, expiredTime_stamp: number) => {
  const expiredTime = expiredTime_stamp - Math.floor(Date.now() / 1000)
  return jwt.sign({ userId }, CONFIG.refreshTokenPrivateKey as Secret, { expiresIn: expiredTime })
}

export const decodeRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, CONFIG.refreshTokenPrivateKey as string) as decode
}

export const decodeAccessToken = (accessToken: string) => {
  return jwt.verify(accessToken, CONFIG.accessTokenPrivateKey as Secret) as decode
}

export const generateForgotPasswordToken = (registerEmail: string) => {
  return jwt.sign(registerEmail, CONFIG.forgotPasswordTokenSecretKey as string, {
    expiresIn: '30m'
  })
}

export const decodeForgotPasswordToken = (forgotPasswordToken: string) => {
  return jwt.verify(forgotPasswordToken, CONFIG.forgotPasswordTokenSecretKey as string) as decode
}
