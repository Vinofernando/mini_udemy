import express from "express"
import authenticateToken from '../middleware/auth.js'
import { addCourse, creatLesson, getPublicCourse ,getUserCourses, enrollCourse, getPublicLesson, getUserLesson, markCompleteLesson, getProgress, deleteLesson, updateLessonOrder, publishLesson, unpublishLesson, publishCourse, unpublishCourse, getSingleLesson } from "../controllers/courseController.js"
import { authorizeRole } from "../middleware/authorizeRole.js"
import { checkEnrollment } from "../middleware/checkEnrollment.js"
import { checkLessonAccess } from "../middleware/checkLessonAccess.js"
import { checkCourseOwner } from "../middleware/checkCourseOwner.js"
import { optionalAuthenticateToken } from "../middleware/optionalAuth.js"

const router = express.Router()

router.get("/public", getPublicCourse)
router.get("/my", authenticateToken, authorizeRole("instructor"), getUserCourses)
router.get("/", authenticateToken, authorizeRole("admin"), getUserCourses)
router.post("/create-course",authenticateToken, authorizeRole("instructor", "admin") ,addCourse)
router.post("/:courseId/lessons/create-lesson", authenticateToken, authorizeRole("instructor", "admin"), creatLesson)
router.post("/enroll/:courseId", authenticateToken,authorizeRole("student") ,enrollCourse)
router.get("/:courseId/lessons/public", getPublicLesson)
router.get("/:courseId/lessons", authenticateToken, checkEnrollment, getUserLesson)
router.post("/:courseId/lessons/:lessonId/complete", authenticateToken, authorizeRole("instructor", "student", "admin"), checkEnrollment, checkLessonAccess, markCompleteLesson)
router.get("/:courseId/progress", authenticateToken, authorizeRole( "admin", "student"), checkEnrollment, getProgress)
router.delete("/:courseId/lessons/:lessonId", authenticateToken, authorizeRole("admin", "instructor"), checkCourseOwner, deleteLesson)
router.patch("/:courseId/lessons/:lessonId/order", authenticateToken, authorizeRole("admin", "instructor"), checkCourseOwner, updateLessonOrder)
router.patch("/:courseId/lessons/:lessonId/publish", authenticateToken, authorizeRole("admin", "instructor"), checkCourseOwner, publishLesson)
router.patch("/:courseId/lessons/:lessonId/unpublish", authenticateToken, authorizeRole("admin", "instructor"), checkCourseOwner, unpublishLesson)
router.patch('/:courseId/publish', authenticateToken, authorizeRole("admin", "instructor"), checkCourseOwner, publishCourse)
router.patch('/:courseId/unpublish', authenticateToken, authorizeRole("admin", "instructor"), checkCourseOwner, unpublishCourse)
router.get(
  "/lessons/:lessonId",
  optionalAuthenticateToken,
  getSingleLesson
)


export default router