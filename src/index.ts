import express from 'express'
import CONFIG from './config/config'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import userRoutes from './routes/users.routes'
import databaseService from './services/database.service'

const app = express()
const port = CONFIG.port

//connect to database
// run().catch(console.dir)
databaseService.connect()
//config morgan to get detail method and adress in logs
app.use(morgan('dev'))

//conver body to json
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '30mb' }))

//api authen
app.use('/api', userRoutes)

app.listen(port, () => {
  console.log(`NodeTS listening on port ${port}`)
})
