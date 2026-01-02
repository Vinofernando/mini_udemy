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