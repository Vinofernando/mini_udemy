import express from 'express'
import cors from  'cors'
import dotenv from 'dotenv'
import errorHandler from './middleware/errorHandler.js'
dotenv.config()

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import courseRoutes from './routes/courseRoutes.js'

const app = express()
console.log("ENV DB_PASSWORD:", process.env.DB_PASS);

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/course", courseRoutes)
app.get("/", (req, res) => res.send("API running"))

app.use(errorHandler)

app.listen(5000, () => console.log("Server running on 5000"))