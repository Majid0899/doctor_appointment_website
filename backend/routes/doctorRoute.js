import express from 'express'
import { jwtAuthMiddleware} from '../middlewares/auth.js'
import { handleLogin,handleChangeAvailability} from '../controllers/doctorController.js'

const router=express.Router()


router.post("/login",handleLogin)
router.put("/change-availability",jwtAuthMiddleware,handleChangeAvailability)

export default router