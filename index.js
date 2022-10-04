import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/post.js'

const app = express()
dotenv.config()

app.use(express.json({extended: true}))

// localhost:3005/api/auth/register
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)

function start() {
    try {
        mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(3005, () => console.log('Server has been started...'))
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()


