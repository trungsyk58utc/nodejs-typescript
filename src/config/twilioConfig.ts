import * as dotenv from 'dotenv'

dotenv.config()

const TWILIOCONFIG = {
  twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER
}

export default TWILIOCONFIG
