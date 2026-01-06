import pool from "../config/db.js";

export const getCourse = async() => {
    const result = await pool.query(
        `SELECT * FROM course`
    )

    return result.rows
}

export const getUserCourses = async(userId) => {
    const result = await pool.query(
        `SELECT * FROM course WHERE created_by = $1`
    , [userId])

    return result.rows
}

export const createCourse = async ({title, description, price, thumbnail, createdBy}) => {
    if(!title || !description || !price || !thumbnail || !createdBy) throw ({status: 400, message: "All field required"})

    const result = await pool.query(
        `
        INSERT INTO course (title, description, price, thumbnail, created_by)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
        `, [title, description, price, thumbnail, createdBy]
    )

    return result
}

export const enrollCourse = async (userId, courseId) => {
    if(!courseId) throw ({status: 400, message: "Cant find course id"})

    const course = await pool.query(
        `SELECT course_id FROM course WHERE course_id = $1`,[courseId]
    )

    if(course.rows.length === 0) throw {status: 400, message: "Cant find course"}

    const existing = await pool.query(
        `SELECT enrollment_id FROM enrollments WHERE user_id = $1 AND course_id = $2` , [userId, courseId]
    )

    if(existing.rows.length > 0) throw ({status: 400, message: "User already enroll this course"})

    const result = await pool.query(
        `INSERT INTO enrollments(user_id, course_id) VALUES($1, $2) RETURNING *`,[userId, courseId]
    )

    return result
}

export const getLesson = async(courseId) => {
    if(!courseId) throw ({status: 400, message: "All field required"})

    const result = await pool.query(
        `SELECT * FROM lessons WHERE course_id = $1` ,[courseId]
    )

    return result
}

export const markCompleteLesson = async({courseId, lessonId, userId}) => {
    if(!courseId) throw ({status: 400, message: "Course id required"})
    if(!lessonId) throw ({status: 400, message: "lesson id id required"})

    const lessonCourse = await pool.query(
        `SELECT * FROM lessons WHERE course_id = $1 AND lesson_id = $2`, [courseId, lessonId]
    )

    if(lessonCourse.rows.length === 0) throw({status: 400, message: "this lesson is not from the course"})

     return await pool.query(
        `INSERT INTO learning_progress(user_id, lesson_id) VALUES($1, $2) RETURNING *`, [userId, lessonId]
    )

}

export const getProgress = async({userId, courseId}) => {
    const totalLesson = await pool.query(
        `SELECT COUNT(lesson_id) FROM lessons WHERE course_id = $1`, [courseId]
    )
    const completedLessons = await pool.query(
        `
        SELECT COUNT(learning_progress_id)
        FROM learning_progress
        JOIN lessons ON
        learning_progress.lesson_id = lessons.lesson_id
        WHERE learning_progress.user_id = $1 AND lessons.course_id = $2
        `, [userId, courseId]
    )
    
    if(Number(totalLesson.rows[0].count) === 0) throw({status: 400, message: "Lesson undefined"})
    
    const total = Number(totalLesson.rows[0].count)
    const completed = Number(completedLessons.rows[0].count)
    const progressPercent = completed / total * 100
    
    return ({
        totalLesson: total,
        completedLessons: completed,
        progressPercent: progressPercent
    })
}