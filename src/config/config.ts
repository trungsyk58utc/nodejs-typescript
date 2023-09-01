import * as dotenv from 'dotenv'

dotenv.config()

const CONFIG = {
  port: process.env.PORT,
  url: process.env.DB_URL,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  endURL: '.phak8x5.mongodb.net/?retryWrites=true&w=majority',
  clusterDB: process.env.DB_CLUSTER,
  dbName: process.env.DB_NAME,
  dbUserCollection: process.env.DB_USER_COLLECTION,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_SECRET_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_SECRET_KEY
}

export default CONFIG
