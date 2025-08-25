import express from 'express'
import { jwtAuthMiddleware} from '../middlewares/auth.js'
import { handleLogin,handleChangeAvailability,handleCancelAppointment,handleConfirmAppointment} from '../controllers/doctorController.js'

const router=express.Router()


router.post("/login",handleLogin)
router.put("/change-availability",jwtAuthMiddleware,handleChangeAvailability)
router.get("/cancel-appointment/:token",handleCancelAppointment)
router.get("/confirm-appointment/:token",handleConfirmAppointment)

export default router