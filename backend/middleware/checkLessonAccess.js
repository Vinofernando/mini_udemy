import pool from "../config/db.js";

export const checkLessonAccess = async(req, res, next) => {
    try{

        if (req.user.role === "admin" || req.user.role === "instructor") {
            return next()
        }

        const userId = req.user.id
        const courseId = req.params.courseId
        const lessonId = req.params.lessonId

        const existedLesson = await pool.query(
            `SELECT order_number FROM lessons WHERE course_id = $1 AND lesson_id = $2`, [courseId, lessonId]
        )

        if(existedLesson.rows.length === 0) throw({status: 404, message: "Cant find lesson"})

        const orderNumber = Number(existedLesson.rows[0].order_number)
        if(orderNumber === 1) return next()

        const previousOrder = orderNumber - 1
        console.log(`previous order: ${previousOrder}`)
        const findLessonId = await pool.query(
            `SELECT lesson_id FROM lessons WHERE course_id = $1 AND order_number = $2`, [courseId, previousOrder]
        )

        if(findLessonId.rows.length === 0) throw({status: 500, message:"Lesson order broken"})

        const lessonIdByOrder = Number(findLessonId.rows[0].lesson_id)
        const finishByOrder = await pool.query(
            `SELECT learning_progress_id FROM learning_progress WHERE user_id = $1 AND lesson_id = $2`, [userId, lessonIdByOrder]
        )

        if(finishByOrder.rows.length === 0) return next({ status: 403, message: "Complete previous lesson first" });

        return next()
    } catch (err) { next(err) }
}