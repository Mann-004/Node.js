import express from "express"
const app = express()
import cors from "cors"
import cookieParser  from "cookie-parser"


// cors for cross origin 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// configuration for json files
app.use(express.json({limit : "16kb"}))

// configuration for url
app.use(express.urlencoded({extended : true, limit : "16kb"}))

// configuration for public assets
app.use(express.static("public")) 

app.use(cookieParser())

// routes import

import userRouter from './routes/user.routes.js'

// routes declaration 

app.use("/users",userRouter)



export { app }