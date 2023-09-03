import { Router } from 'express'
import {
  changePassword,
  getListUser,
  getMe,
  getUserById,
  login,
  logout,
  refresh,
  registerUser
} from '~/controllers/users'
import { validateToken } from '~/middlewares/auth.middlewares'
import { changePasswordValide, loginValidate, refreshValidate, registerValidate } from '~/middlewares/users.middlewares'

const userRoutes = Router()

userRoutes.post('/login', loginValidate, login)
userRoutes.post('/logout', refreshValidate, logout)
userRoutes.post('/register', registerValidate, registerUser)
userRoutes.post('/changePassword', validateToken, changePasswordValide, changePassword)
userRoutes.post('/refresh', refreshValidate, refresh)
userRoutes.get('/getMe', validateToken, getMe)
userRoutes.get('/getUser/:id', validateToken, getUserById)
userRoutes.get('/listUser', validateToken, getListUser)

export default userRoutes
