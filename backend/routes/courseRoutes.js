import express from "express"
import authenticateToken from '../middleware/auth.js'
import { addCourse } from "../controllers/courseController.js"

const router = express.Router()

router.post("/create",authenticateToken ,addCourse)

export default router