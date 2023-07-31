import { Router } from 'express'
import { login, registerUser } from '~/controllers/users'
import { loginValidate } from '~/middlewares/users.middlewares'

const userRoutes = Router()

userRoutes.post('/login', loginValidate, login)
userRoutes.post('/register', loginValidate, registerUser)

export default userRoutes
