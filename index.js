import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import connectDB from './config/connectdb.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
const port = process.env.PORT || 8000
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
// CORS Policy
app.use(cors())

// Database Connection
connectDB(username,password);

// JSON
app.use(express.json());

// Load Routes
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server listening at ${port}`)
})