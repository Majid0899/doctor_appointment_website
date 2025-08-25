import express from 'express'
import {handleAddDoctor, handleAdminLogin,handleAllDoctors,handleAllAppointments,handleDashBoard, handleCancelAndDeleteAppointment} from '../controllers/adminController.js'
import { jwtAuthMiddleware } from '../middlewares/auth.js';
import {parseAddressMiddleware} from '../middlewares/parseAddress.js'
import upload from '../middlewares/upload.js'

const router=express.Router();

router.post("/login",handleAdminLogin.validate,handleAdminLogin)
router.post("/add-doctor",jwtAuthMiddleware,upload.single("image"),parseAddressMiddleware,handleAddDoctor.validate,handleAddDoctor)
router.get("/all-doctors",jwtAuthMiddleware,handleAllDoctors)
router.get("/all-appointments",jwtAuthMiddleware,handleAllAppointments)
router.get("/dashboard",jwtAuthMiddleware,handleDashBoard)
router.put("/cancel-appointment/:appointmentId",jwtAuthMiddleware,handleCancelAndDeleteAppointment)
export default router