import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes.js"
import connectToMongoDB from "./db/connectToMongoDB.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 6060;

// Middleware

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

// app.get('/', (req, res) => {
//     // root route http://localhost:8000/
//     res.send("hello gausm!");
// })


app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`http://localhost:${PORT}`)
})