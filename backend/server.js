import express from 'express'
import dotenv from 'dotenv'
import { createConnection } from './config/db.js';
import userRouter from './routes/userRoute.js'


//creating an express app
const app=new express();

dotenv.config()

//Create database connections
createConnection()

/*JSON Middleware */
app.use(express.json())

//Define PORT
const PORT=process.env.PORT || 5100;


app.use("/user",userRouter)


app.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING ON ${PORT}`)
})