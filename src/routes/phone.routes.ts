import { Router } from 'express'
import { sendOTP } from '~/controllers/phone'

const phoneRoutes = Router()

phoneRoutes.post('/sendOTP', sendOTP)

export default phoneRoutes
