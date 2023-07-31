import User from '~/models/Schemas/User.schemas'
import databaseService from './database.service'

interface IPayload {
  username: string
  password: string
}

export const loginService = async (payload: IPayload) => {
  const { username, password } = payload
  const result = await databaseService.users.findOne({ username, password })
  return result
}

export const registerService = async (payload: IPayload) => {
  const { username, password } = payload
  const result = await databaseService.users.insertOne(new User({ username, password }))
  return result
}
