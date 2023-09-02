import { ObjectId } from 'mongodb'

interface IRefreshToken {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId

  constructor(refresh: IRefreshToken) {
    this._id = refresh._id || new ObjectId()
    this.token = refresh.token
    this.created_at = refresh.created_at || new Date()
    this.user_id = refresh.user_id
  }
}
