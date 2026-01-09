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

export const creatLesson = async( {courseId, title, content}) => {
    const existedLesson = await pool.query(
        `SELECT MAX(order_number) FROM lessons WHERE course_id = $1`, [courseId]
    )

    const maxOrder = existedLesson.rows[0].max
    const orderNumber = maxOrder === null ? 1 : Number(maxOrder) + 1
    if(existedLesson.rows[0].max === null) return(
        await pool.query(
            `INSERT INTO lessons(course_id, title, content, order_number) VALUES($1, $2, $3, 1) RETURNING *`, [courseId, title, content]
        )
    )

    const autoOrderNumber = await pool.query(
        `INSERT INTO lessons(course_id, title, content, order_number) VALUES($1, $2, $3, $4) RETURNING *`, [courseId, title, content, orderNumber]
    )
    
    return autoOrderNumber
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

export const deleteLesson = async({courseId, lessonId}) => {
    const client = await pool.connect()
    try{
        await client.query("BEGIN")

        const lesson = await client.query(
            `SELECT order_number FROM lessons WHERE course_id = $1 AND lesson_id = $2`, [courseId, lessonId]
        )

        if(lesson.rows.length === 0) throw({status:404, message: "Lesson not found"})

        const deleteOrder = lesson.rows[0].order_number

        await client.query(
            `DELETE FROM learning_progress WHERE lesson_id = $1`, [lessonId]
        )

        await client.query(
            `DELETE FROM lessons WHERE lesson_id = $1 AND course_id = $2`, [lessonId, courseId]
        )

        await client.query(
            `UPDATE lessons SET order_number = order_number - 1 WHERE course_id = $1 AND order_number > $2`, [courseId, deleteOrder]
        )

        await client.query("COMMIT")
        return{message: "Lesson deleted and reorder successfully"}
    }  catch(err) {
        await client.query("ROLLBACK")
        throw err
    } finally {
        client.release()
    }
}

export const updateLessonOrder = async ({ courseId, lessonId, newOrder }) => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // 1️⃣ Ambil order saat ini
    const lesson = await client.query(
      `SELECT order_number FROM lessons
       WHERE course_id = $1 AND lesson_id = $2`,
      [courseId, lessonId]
    )

    if (lesson.rows.length === 0) {
      throw { status: 404, message: "Lesson not found" }
    }

    const currentOrder = lesson.rows[0].order_number

    if (currentOrder === newOrder) {
      throw { message: "Lesson order unchanged" }
    }

    // 2️⃣ Validasi max order
    const maxOrderRes = await client.query(
      `SELECT MAX(order_number) FROM lessons WHERE course_id = $1`,
      [courseId]
    )

    const maxOrder = Number(maxOrderRes.rows[0].max)

    if (newOrder < 1 || newOrder > maxOrder) {
      throw { status: 400, message: "Invalid order number" }
    }

    await client.query(
        `UPDATE lessons SET order_number = 0 WHERE lesson_id = $1`, [lessonId]
    )

    // 3️⃣ Geser lesson lain
    if (newOrder < currentOrder) {
      // Naik
      await client.query(
        `UPDATE lessons
         SET order_number = order_number + 1
         WHERE course_id = $1
         AND order_number >= $2
         AND order_number < $3`,
        [courseId, newOrder, currentOrder]
      )
    } else {
      // Turun
      await client.query(
        `UPDATE lessons
         SET order_number = order_number - 1
         WHERE course_id = $1
         AND order_number > $2
         AND order_number <= $3`,
        [courseId, currentOrder, newOrder]
      )
    }

    // 4️⃣ Update lesson target
    await client.query(
      `UPDATE lessons
       SET order_number = $1
       WHERE lesson_id = $2`,
      [newOrder, lessonId]
    )

    await client.query("COMMIT")

    return { message: "Lesson order updated successfully" }

  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

export const publishLesson = async({courseId, lessonId}) => {
    const result = await pool.query(
        `UPDATE lessons 
        SET status = 'published' 
        WHERE course_id = $1 AND lesson_id = $2 
        RETURNING lesson_id, status`, [courseId, lessonId]
    )

    if(result.rows.length === 0) throw ({status: 404, message: "Lesson not found"})

    return result.rows[0]
}

export const unpublishLesson = async({courseId, lessonId}) => {
    const result = await pool.query(
        `UPDATE lessons SET status = 'draft' WHERE course_id = $1 AND lesson_id = $2 RETURNING lesson_id, status`, [courseId, lessonId]
    )

    if(result.rows.length === 0) throw ({status: 404, message: "Lesson not found"})

    return result.rows[0]
}