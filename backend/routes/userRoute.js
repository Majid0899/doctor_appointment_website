import express from 'express'
import { handleRegisterUser,handleLoginUser,handleGetProfile, handleUpdateProfile, handleBookAppointment, handleListAppointments, handleCancelAndDeleteAppointment, handleGetAllDoctors} from  '../controllers/userController.js'
import { jwtAuthMiddleware } from '../middlewares/auth.js'
import upload from '../middlewares/upload.js';

const router=express.Router();


router.post("/register",handleRegisterUser.validate,handleRegisterUser)
router.post("/login",handleLoginUser.validate,handleLoginUser)
router.get("/profile",jwtAuthMiddleware,handleGetProfile)
router.get("/all-doctors",handleGetAllDoctors)
router.put("/profile/update",jwtAuthMiddleware,upload.single("image"),handleUpdateProfile)
router.post("/appointment/:doctorId",jwtAuthMiddleware,handleBookAppointment.validate,handleBookAppointment)
router.get("/appointments",jwtAuthMiddleware,handleListAppointments)
router.put("/cancel-appointment/:appointmentId",jwtAuthMiddleware,handleCancelAndDeleteAppointment)

export default router