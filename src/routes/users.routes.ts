import { Router } from 'express'
import {
  changeForgotPassword,
  changePassword,
  checkResetPassToken,
  getListUser,
  getMe,
  getUserById,
  login,
  logout,
  refresh,
  registerUser,
  sendMailForgotPassword
} from '~/controllers/users'
import { validateToken } from '~/middlewares/auth.middlewares'
import {
  changeForgotPasswordValidate,
  changePasswordValide,
  checkForgotPasswordTokenValidate,
  checkForgotPasswordValidate,
  loginValidate,
  refreshValidate,
  registerValidate
} from '~/middlewares/users.middlewares'

const userRoutes = Router()

userRoutes.post('/login', loginValidate, login)
userRoutes.post('/logout', refreshValidate, logout)
userRoutes.post('/refresh', refreshValidate, refresh)
userRoutes.post('/register', registerValidate, registerUser)
userRoutes.post('/changePassword', validateToken, changePasswordValide, changePassword)
userRoutes.post('/forgotPassword', checkForgotPasswordValidate, sendMailForgotPassword)
userRoutes.post('/checkExpiredResetPassToken', checkForgotPasswordTokenValidate, checkResetPassToken)
userRoutes.post('/changeForgotPassword', changeForgotPasswordValidate, changeForgotPassword)
userRoutes.get('/getMe', validateToken, getMe)
userRoutes.get('/getUser/:id', validateToken, getUserById)
userRoutes.get('/listUser', validateToken, getListUser)

export default userRoutes
