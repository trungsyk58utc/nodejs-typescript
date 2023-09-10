import express from 'express'
import CONFIG from './config/config'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import userRoutes from './routes/users.routes'
import databaseService from './services/database.service'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import path from 'path'
import phoneRoutes from './routes/phone.routes'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node TS API',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [path.join(__dirname, './docs/*.yaml')]
}

const openapiSpecification = swaggerJSDoc(options)

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
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('/api/auth', userRoutes)
app.use('/api/phone', phoneRoutes)

app.listen(port, () => {
  console.log(`NodeTS listening on port ${port}`)
})
