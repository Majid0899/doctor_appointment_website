import express from 'express'
import { handleRegisterUser,handleLoginUser,handleGetProfile} from  '../controllers/userController.js'
import { jwtAuthMiddleware } from '../middlewares/auth.js'


const router=express.Router();


router.post("/register",handleRegisterUser.validate,handleRegisterUser)
router.post("/login",handleLoginUser.validate,handleLoginUser)
router.get("/profile",jwtAuthMiddleware,handleGetProfile)


export default router