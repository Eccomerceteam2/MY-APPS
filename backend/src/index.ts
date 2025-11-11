import express from 'express'
import cors from 'cors'
import assetsRouter from './routes/assets'
const app = express()
app.use(cors()); app.use(express.json())
app.use('/api/assets', assetsRouter)
const port = process.env.PORT || 4000
app.listen(port, ()=> console.log('EaseTracker backend running on', port))
