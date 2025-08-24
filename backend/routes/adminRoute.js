import express from 'express'
import {handleAddDoctor, handleAdminLogin} from '../controllers/adminController.js'
import { jwtAuthMiddleware } from '../middlewares/auth.js';
import {parseAddressMiddleware} from '../middlewares/parseAddress.js'
import upload from '../middlewares/upload.js'

const router=express.Router();

router.post("/login",handleAdminLogin.validate,handleAdminLogin)
router.post("/add-doctor",jwtAuthMiddleware,upload.single("image"),parseAddressMiddleware,handleAddDoctor.validate,handleAddDoctor)

export default router