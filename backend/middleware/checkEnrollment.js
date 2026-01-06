import pool from "../config/db.js";

export const checkEnrollment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { courseId } = req.params;

    if (!courseId) {
      return next({ status: 400, message: "Course ID required" });
    }

    // ✅ ADMIN: bebas
    if (role === "admin") {
      return next();
    }

    // ✅ INSTRUCTOR: harus pemilik course
    if (role === "instructor") {
      const course = await pool.query(
        `SELECT course_id FROM course WHERE course_id = $1 AND created_by = $2`,
        [courseId, userId]
      );

      if (course.rows.length === 0) {
        return next({
          status: 403,
          message: "You are not the course owner"
        });
      }

      return next();
    }

    // ✅ STUDENT: harus sudah enroll
    if (role === "student") {
      const enrolled = await pool.query(
        `SELECT enrollment_id FROM enrollments
         WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
      );

      if (enrolled.rows.length === 0) {
        return next({
          status: 403,
          message: "You are not enrolled in this course"
        });
      }

      return next();
    }

    // ❌ role tidak dikenal
    return next({ status: 403, message: "Access denied" });

  } catch (err) {
    next(err);
  }
};
