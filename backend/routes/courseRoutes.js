import express from "express"
import authenticateToken from '../middleware/auth.js'
import { addCourse, getCourse ,getUserCourses, enrollCourse, getLesson } from "../controllers/courseController.js"
import { authorizeRole } from "../middleware/authorizeRole.js"

const router = express.Router()

router.get("/public", getCourse)
router.get("/get", authenticateToken, authorizeRole("admin"), getUserCourses)
router.post("/create",authenticateToken, authorizeRole("instructor", "admin") ,addCourse)
router.post("/enroll/:courseId", authenticateToken,authorizeRole("student") ,enrollCourse)
router.get("/:courseId/lessons", getLesson)

export default router