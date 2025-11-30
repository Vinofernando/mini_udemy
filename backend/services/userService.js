import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendResetPasswordEmail } from "./emailService.js";
// import { sendResetPasswordEmail, sendSuccessReset} from "./emailService.js";

export const getUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
};

export const forgotPassword = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE user_email = $1`,
    [email])

    if(result.rows.length === 0) throw ({status: 400, message: "Email tidak ditemukan"})

    const token = uuidv4()
    const expires = new Date(Date.now() + 1000 * 60 * 10);

    await pool.query(`
            UPDATE users SET reset_token = $1, reset_expires = $2 WHERE user_email = $3
    `, [token, expires, email])

    const link = `http://localhost:5500/frontend/view/resetpassword.html?token=${encodeURIComponent(token)}`;

    await sendResetPasswordEmail(email , link)

    return { message: "Link reset telah dikirim"}
}