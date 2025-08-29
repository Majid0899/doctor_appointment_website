import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createConnection } from './config/db.js';
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import path from 'path'

//creating an express app
const app=new express();

dotenv.config()

//Create database connections
createConnection()

/*JSON Middleware */
app.use(express.json())

//Define PORT
const PORT=process.env.PORT || 5100;

app.use(cors())

app.use("/user",userRouter)
app.use("/admin",adminRouter)
app.use("/doctor",doctorRouter)

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING ON ${PORT}`)
})