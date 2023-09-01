import jwt from 'jsonwebtoken'
import CONFIG from '~/config/config'
import { Secret } from 'jsonwebtoken'

export const generateAccessToken = (userId: string) => {
  const accessToken = jwt.sign({ userId }, CONFIG.accessTokenPrivateKey as Secret, { expiresIn: '30m' })
  return accessToken
}

export const generateRefreshToken = (userId: string) => {
  const refreshToken = jwt.sign({ userId }, CONFIG.refreshTokenPrivateKey as Secret, { expiresIn: '5d' })
  return refreshToken
}
