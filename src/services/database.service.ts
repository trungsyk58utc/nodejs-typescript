import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import CONFIG from '~/config/config'
import User from '~/models/Schemas/User.schemas'

const { url, username, password, endURL, clusterDB, dbName, dbUserCollection } = CONFIG
const uri = `${url}${username}:${password}@${clusterDB}${endURL}`
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
class MongoDBClient {
  private uri: string
  private client: MongoClient
  private db: Db
  constructor(uri: string) {
    this.uri = uri
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(dbName)
  }

  async connect() {
    try {
      await this.client.connect()
      await this.client.db(dbName).command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
    }
  }

  async close() {
    try {
      await this.client.close()
    } catch (error) {
      console.log(error)
    }
  }

  get users(): Collection<User> {
    return this.db.collection(dbUserCollection as string)
  }
}

const databaseService = new MongoDBClient(uri)
export default databaseService
