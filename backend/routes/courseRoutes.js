import express from "express"
import authenticateToken from '../middleware/auth.js'
import { addCourse, getCourse ,getUserCourses, enrollCourse } from "../controllers/courseController.js"

const router = express.Router()

router.get("/public", getCourse)
router.get("/get", authenticateToken, getUserCourses)
router.post("/create",authenticateToken ,addCourse)
router.post("/enroll/:courseId", authenticateToken, enrollCourse)

export default router