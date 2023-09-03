import { ObjectId } from 'mongodb'
import { decodeAccessToken } from './../utils/jwtToken'
import { checkSchema } from 'express-validator'
import databaseService from '~/services/database.service'
import { decodeRefreshToken } from '~/utils/jwtToken'
import { validate } from '~/utils/validation'
import * as argon2 from 'argon2'

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

export const changePasswordValide = validate(
  checkSchema({
    oldPassword: {
      notEmpty: true,
      errorMessage: 'oldPassword is required',
      custom: {
        options: async (value, { req }) => {
          const decodeToken = decodeAccessToken(req?.headers?.authorization.split(' ')[1])
          const userId = decodeToken.userId
          const user = await databaseService.users.findOne({ _id: new ObjectId(userId) })
          const compareHassPass = await argon2.verify(user?.password as string, value)
          if (!compareHassPass) {
            throw new Error('Old password is not true')
          }
        }
      }
    },
    newPassword: {
      notEmpty: true,
      errorMessage: 'newPassword is required'
    },
    confirmNewPassword: {
      notEmpty: true,
      errorMessage: 'confirmNewPassword is required',
      custom: {
        options: async (value, { req }) => {
          const { newPassword } = req.body
          if (value !== newPassword) {
            throw new Error('newPassword & confirm password must be the same')
          }
        }
      }
    }
  })
)
