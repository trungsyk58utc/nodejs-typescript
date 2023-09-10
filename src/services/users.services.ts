import User from '~/models/Schemas/User.schemas'
import databaseService from './database.service'
import * as argon2 from 'argon2'
import {
  decodeRefreshToken,
  generateAccessToken,
  generateForgotPasswordToken,
  generateNewRefreshToken,
  generateRefreshToken
} from '~/utils/jwtToken'
import jwt, { Secret } from 'jsonwebtoken'
import CONFIG from '~/config/config'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/Schemas/RefreshToken.schemas'
import { sendEmail } from './email.service'

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
    await databaseService.refreshToken.insertOne(
      new RefreshToken({
        token: refreshToken,
        user_id: result?._id as ObjectId
      })
    )
    return { accessToken, refreshToken }
  }
}

export const logoutService = async (refreshToken: string) => {
  await databaseService.refreshToken.deleteOne({ token: refreshToken })
  return true
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
  return await databaseService.users.insertOne(new User({ username, password: hashPassword }))
}

export const getUserByIdService = async (userId: string) => {
  const filter = { _id: new ObjectId(userId) }
  return await databaseService.users.findOne(filter, { projection: listUserProjection })
}

export const refreshService = async (refreshToken: string) => {
  const decodeToken = decodeRefreshToken(refreshToken)
  const newAccessToken = generateAccessToken(decodeToken.userId)
  const newRefreshToken = generateNewRefreshToken(decodeToken.userId, decodeToken.exp as number)
  await databaseService.refreshToken.findOneAndUpdate({ token: refreshToken }, { $set: { token: newRefreshToken } })
  return { newAccessToken, newRefreshToken }
}

export const changePasswordService = async (userId: string, newPassword: string) => {
  const hashNewPassword = await argon2.hash(newPassword)
  return await databaseService.users.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { password: hashNewPassword } }
  )
}

export const forgotPasswordService = async (emailRegister: string) => {
  const newUserForgotToken = generateForgotPasswordToken(emailRegister)
  await databaseService.users.findOneAndUpdate(
    { email: emailRegister },
    { $set: { forgot_password_token: newUserForgotToken as string } }
  )
  try {
    return sendEmail(emailRegister, newUserForgotToken)
  } catch (error) {
    return error
  }
}

export const changeForgotPasswordService = async (forgotPasswordToken: string, newPassword: string) => {
  try {
    const hashpassword = await argon2.hash(newPassword)
    return await databaseService.users.findOneAndUpdate(
      { forgot_password_token: forgotPasswordToken },
      { $set: { password: hashpassword } }
    )
  } catch (error) {
    return error
  }
}
