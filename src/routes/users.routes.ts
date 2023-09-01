import { Router } from 'express'
import { getListUser, getMe, login, registerUser } from '~/controllers/users'
import { validateToken } from '~/middlewares/auth.middlewares'
import { loginValidate, registerValidate } from '~/middlewares/users.middlewares'

const userRoutes = Router()

userRoutes.post('/login', loginValidate, login)
userRoutes.post('/register', registerValidate, registerUser)
userRoutes.get('/getMe', validateToken, getMe)
userRoutes.get('/listUser', validateToken, getListUser)

export default userRoutes
