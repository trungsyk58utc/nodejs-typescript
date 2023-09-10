import twilio from 'twilio'
import TWILIOCONFIG from '~/config/twilioConfig'

function generateOTP() {
  // Tạo mã OTP 6 chữ số
  const digits = '0123456789'
  let OTP = ''
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }
  return OTP
}

// Gửi OTP qua SMS
export const sendOTPService = async (phoneNumber: string) => {
  const OTP = generateOTP()
  const client = twilio(TWILIOCONFIG.twilioAccountSID, TWILIOCONFIG.twilioAuthToken)
  client.messages
    .create({
      body: `Your OTP is ${OTP}`,
      from: TWILIOCONFIG.twilioPhoneNumber,
      to: phoneNumber
    })
    .then((message) => {
      console.log(`OTP sent: ${message.sid}`)
    })
    .catch((error) => console.error(`Error sending OTP: ${error.message}`))
}
