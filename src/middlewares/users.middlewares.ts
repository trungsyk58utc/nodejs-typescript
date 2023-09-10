import { ObjectId } from 'mongodb'
import { decodeAccessToken, decodeForgotPasswordToken } from '~/utils/jwtToken'
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

export const checkForgotPasswordValidate = validate(
  checkSchema({
    emailRegister: {
      notEmpty: true,
      isEmail: {
        errorMessage: 'Email is not validate'
      },
      errorMessage: 'Email Register is required',
      custom: {
        options: async (value) => {
          const checkMailResult = await databaseService.users.findOne({ email: value })
          if (!checkMailResult) throw new Error('Email is not exist in system')
        }
      }
    }
  })
)

export const checkForgotPasswordTokenValidate = validate(
  checkSchema({
    forgotPasswordToken: {
      notEmpty: true,
      custom: {
        options: async (value) => {
          const checkForgotPassToken = await databaseService.users.findOne({ forgot_password_token: value })
          if (!checkForgotPassToken) throw new Error('This is not reset password token')
          const decode = decodeForgotPasswordToken(value)
          const currentTimestamp = Math.floor(Date.now() / 1000)
          if ((decode.exp as number) * 1000 < currentTimestamp) throw new Error('This token has been expired')
        }
      }
    }
  })
)

export const changeForgotPasswordValidate = validate(
  checkSchema({
    forgotPasswordToken: {
      notEmpty: true,
      errorMessage: 'Forgot password token is required'
    },
    newPassword: {
      notEmpty: true,
      errorMessage: 'New password token is required'
    },
    confirmNewPassword: {
      notEmpty: true,
      errorMessage: 'Confirm new password is  required',
      custom: {
        options: async (value, { req }) => {
          if (value !== req.body.newPassword) throw new Error('New password & confirm new password must be same')
        }
      }
    }
  })
)
