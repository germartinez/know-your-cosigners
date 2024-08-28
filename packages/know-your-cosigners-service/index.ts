import cors from 'cors'
import * as dotenv from 'dotenv'
import express from 'express'
import { getSafeTransactions } from './routes/getSafeTransactions'

const PORT = process.env.PORT || 4000

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const router = express.Router()
app.use('/api/v1', router)

router.get('/transactions', getSafeTransactions)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
