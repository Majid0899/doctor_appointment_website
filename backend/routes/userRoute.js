import express from 'express'
import { handleRegisterUser,handleLoginUser,handleGetProfile,handleUpdateProfile} from  '../controllers/userController.js'
import { jwtAuthMiddleware } from '../middlewares/auth.js'
import upload from '../middlewares/upload.js';

const router=express.Router();


router.post("/register",handleRegisterUser.validate,handleRegisterUser)
router.post("/login",handleLoginUser.validate,handleLoginUser)
router.get("/profile",jwtAuthMiddleware,handleGetProfile)
router.put("/profile/update",jwtAuthMiddleware,upload.single("image"),handleUpdateProfile)

export default router