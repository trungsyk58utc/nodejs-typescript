import { Response, Request } from 'express'
import { sendOTPService } from '~/services/phone.service'

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const result = sendOTPService(req.body.phoneNumber)
    console.log(result)
    return res.json()
  } catch (error) {
    return res.status(400).json({
      message: 'Can not send OTP at current time. Please try again'
    })
  }
}
