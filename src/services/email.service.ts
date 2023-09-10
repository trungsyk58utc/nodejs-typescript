import * as nodemailer from 'nodemailer'
import CONFIG from '~/config/config'

export const sendEmail = async (registerEmail: string, forgotPasswordToken: string) => {
  console.log(CONFIG.userServiceEmail, CONFIG.passwordServiceEmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.userServiceEmail,
      pass: CONFIG.passwordServiceEmail
    }
  })
  // Định nghĩa nội dung email
  const mailOptions = {
    from: 'Admin API Node TS',
    to: registerEmail,
    subject: 'Change password of email',
    text: `You have request to change password, your token is ${forgotPasswordToken}`
  }
  // Gửi email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // eslint-disable-next-line no-undef
      console.log(error)
      throw new Error(error.message)
    } else {
      // eslint-disable-next-line no-undef
      console.log('Email sent: ' + info.response)
      return info.response
    }
  })
}
