import pool from "../config/db.js"
export const checkCourseOwner = async(req, res, next) => {
    try{
        const courseId = req.params.courseId
        const userId = req.user.id

        const result = await pool.query(
            `SELECT created_by FROM course WHERE course_id = $1`, [courseId]
        )

        if(result.rows.length === 0) throw({status: 403, message: "Course not found"})

        if(result.rows[0].created_by !== userId) throw({status: 403, message: "You are not the owner of this course"})

        next()
    } catch(err) { next(err) }
}