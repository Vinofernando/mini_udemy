import express from "express"
import authenticateToken from '../middleware/auth.js'
import { addCourse, creatLesson, getCourse ,getUserCourses, enrollCourse, getLesson, markCompleteLesson, getProgress } from "../controllers/courseController.js"
import { authorizeRole } from "../middleware/authorizeRole.js"
import { checkEnrollment } from "../middleware/checkEnrollment.js"
import { checkLessonAccess } from "../middleware/checkLessonAccess.js"

const router = express.Router()

router.get("/public", getCourse)
router.get("/my", authenticateToken, authorizeRole("instructor"), getUserCourses)
router.get("/", authenticateToken, authorizeRole("admin"), getUserCourses)
router.post("/create-course",authenticateToken, authorizeRole("instructor", "admin") ,addCourse)
router.post("/:courseId/lessons/create-lesson", authenticateToken, authorizeRole("instructor", "admin"), creatLesson)
router.post("/enroll/:courseId", authenticateToken,authorizeRole("student") ,enrollCourse)
router.get("/:courseId/lessons", authenticateToken, authorizeRole("student", "instructor", "admin"), checkEnrollment ,getLesson)
router.post("/:courseId/lessons/:lessonId/complete", authenticateToken, authorizeRole("instructor", "student", "admin"), checkEnrollment, checkLessonAccess, markCompleteLesson)
router.get("/:courseId/progress", authenticateToken, authorizeRole( "admin", "student"), checkEnrollment, getProgress)

export default router