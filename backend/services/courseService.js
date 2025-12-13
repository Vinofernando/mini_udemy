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
    if(!courseId) throw ({status: 400, message: "Cant find course"})

    const existingUser = await pool.query(
        `SELECT * FROM enrollments WHERE user_id = $1`, [userId]
    )
    const course = await pool.query(
        `SELECT * FROM enrollments WHERE course_id = $1`,[courseId]
    )

    if(course.rows.length > 0 || existingUser.rows.length > 0) throw {status: 400, message: "Course or user already enrolled"}

    const result = pool.query(
        `INSERT INTO enrollments(user_id, course_id) VALUES($1, $2) RETURNING *`,[userId, courseId]
    )

    return result
}