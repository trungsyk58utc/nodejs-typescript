import User from '~/models/Schemas/User.schemas'
import databaseService from './database.service'
import * as argon2 from 'argon2'
import { generateAccessToken, generateRefreshToken } from '~/utils/jwtToken'
import jwt, { Secret } from 'jsonwebtoken'
import CONFIG from '~/config/config'
import { ObjectId } from 'mongodb'

interface IPayload {
  username: string
  password: string
}

const listUserProjection = {
  ['password']: 0,
  ['email_verify_token']: 0,
  ['forgot_password_token']: 0
}

export const loginService = async (payload: IPayload) => {
  const { username, password } = payload
  const result = await databaseService.users.findOne({ username: username })
  const compareHassPass = await argon2.verify(result?.password as string, password)
  if (compareHassPass) {
    const accessToken = generateAccessToken(result?._id.toString() as string)
    const refreshToken = generateRefreshToken(result?._id.toString() as string)
    return { accessToken, refreshToken }
  }
}

export const getMeService = async (payload: string) => {
  const accessToken = payload.split(' ')[1]
  const decodeAcessToken = jwt.verify(accessToken, CONFIG.accessTokenPrivateKey as Secret) as { userId: string }
  const filter = { _id: new ObjectId(decodeAcessToken.userId) }
  const user = await databaseService.users.findOne(filter, {
    projection: listUserProjection
  })
  if (user) return user
  return false
}

export const getListUserService = async () => {
  const listUser = await databaseService.users.find({}, { projection: listUserProjection }).toArray()
  if (listUser) return listUser
  return false
}

export const registerService = async (payload: IPayload) => {
  const { username, password } = payload
  const hashPassword = await argon2.hash(password)
  const result = await databaseService.users.insertOne(new User({ username, password: hashPassword }))
  return result
}
