import express from "express"
import { Server } from "socket.io"
import { createServer } from "http"

const app = express()
const server = createServer(app)
const io = new Server(server)
const port = 3000




app.listen(port,() => {
    console.log(`sever running at port ${port}`)
})
