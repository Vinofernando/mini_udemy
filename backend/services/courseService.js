import pool from "../config/db.js";

export const createCourse = async ({title, description, price, thumbnail, createdBy}) => {
    if(!title || !description || !price || !thumbnail || !createdBy) throw ({status: 400, message: "All field required"})

    const result = await pool.query(
        `
        INSERT INTO course (title, description, price, thumbnail, created_by)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
        `, [title, description, price, thumbnail, createdBy]
    )

    return result.rows[0]
}