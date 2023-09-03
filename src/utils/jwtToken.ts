import jwt from 'jsonwebtoken'
import CONFIG from '~/config/config'
import { Secret } from 'jsonwebtoken'

interface decode extends jwt.JwtPayload {
  userId: string
}

export const generateAccessToken = (userId: string) => {
  const accessToken = jwt.sign({ userId }, CONFIG.accessTokenPrivateKey as Secret, { expiresIn: '30m' })
  return accessToken
}

export const generateRefreshToken = (userId: string) => {
  const refreshToken = jwt.sign({ userId }, CONFIG.refreshTokenPrivateKey as Secret, { expiresIn: '5d' })
  return refreshToken
}

export const generateNewRefreshToken = (userId: string, expiredTime_stamp: number) => {
  const expiredTime = expiredTime_stamp - Math.floor(Date.now() / 1000)
  const refreshToken = jwt.sign({ userId }, CONFIG.refreshTokenPrivateKey as Secret, { expiresIn: expiredTime })
  return refreshToken
}

export const decodeRefreshToken = (refreshToken: string) => {
  const decodeToken = jwt.verify(refreshToken, CONFIG.refreshTokenPrivateKey as string) as decode
  return decodeToken
}

export const decodeAccessToken = (accessToken: string) => {
  const decodeToken = jwt.verify(accessToken, CONFIG.accessTokenPrivateKey as string) as decode
  return decodeToken
}
