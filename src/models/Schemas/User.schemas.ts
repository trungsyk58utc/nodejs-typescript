import { ObjectId } from 'mongodb'

enum UserVerifyStatus {
  Unverify,
  Verify,
  Banned
}

interface IUser {
  _id?: ObjectId
  name?: string
  email?: string
  date_of_birth?: string
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  bio?: string
  location?: string
  website?: string
  username: string
  avatar?: string
  cover_photo?: string
}

class User {
  _id: ObjectId
  name: string
  email: string
  date_of_birth: string
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string

  constructor(user: IUser) {
    this._id = user._id || new ObjectId()
    this.name = user.name || ''
    this.email = user.email || ''
    this.date_of_birth = user.date_of_birth || ''
    this.password = user.password
    this.created_at = user.created_at || new Date()
    this.updated_at = user.updated_at || new Date()
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverify
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
  }
}

export default User
