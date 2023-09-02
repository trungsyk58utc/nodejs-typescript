import { checkSchema } from 'express-validator'
import databaseService from '~/services/database.service'
import { decodeRefreshToken } from '~/utils/jwtToken'
import { validate } from '~/utils/validation'

export const loginValidate = validate(
  checkSchema({
    username: {
      notEmpty: true,
      errorMessage: 'Name is not empty'
    },
    password: {
      notEmpty: true,
      errorMessage: 'Password is not empty'
    }
  })
)

export const registerValidate = validate(
  checkSchema({
    // email: {
    //   notEmpty: true,
    //   isEmail: true,
    //   custom: {
    //     options: async (value) => {
    //       const results = await databaseService.users.findOne({ email: value })
    //       if (results) throw new Error('Email has already exist')
    //       return true
    //     }
    //   }
    // },
    username: {
      notEmpty: true,
      custom: {
        options: async (value) => {
          const results = databaseService.users.findOne({ username: value })
          if (await results) throw new Error('Username has already exist')
          return true
        }
      }
    }
  })
)

export const refreshValidate = validate(
  checkSchema({
    refreshToken: {
      notEmpty: true,
      errorMessage: 'RefreshToken is not empty',
      custom: {
        options: async (value) => {
          const results = await databaseService.refreshToken.findOne({ token: value })
          if (results) {
            const decodeToken = decodeRefreshToken(value)
            const currentTimestamp = Date.now()
            if ((decodeToken.exp as number) * 1000 < currentTimestamp) throw new Error('Token has expired')
          } else {
            throw new Error('RefreshToken Invalid')
          }
        }
      }
    }
  })
)
