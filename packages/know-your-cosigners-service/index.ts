import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import * as QueryController from './routes/query'

const port = process.env.PORT || 4000

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const router = express.Router()
app.use('/api/v1', router)

router.get('/query', QueryController.query)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
