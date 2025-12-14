import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendResetPasswordEmail, sendSuccessResetPassword } from "./emailService.js";

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

    const link = `http://localhost:5000/user/reset-token/${token}`;

    await sendResetPasswordEmail(email , link)

    return { message: "Link reset telah dikirim"}
}

export const getResetPasswordLink = async(token) => {
    const reset_token = await pool.query(
      `SELECT reset_token FROM users WHERE reset_token = $1`, [token]
    )

    if(reset_token.rows.length === 0) throw ({status: 400, message: "Token tidak valid"})

    return { message: "Berhasil reset password"}
}

export const resetPassword = async({token, newPassword}) => {
  const result = await pool.query(`
      SELECT * FROM users WHERE reset_token = $1
    `, [token])

    if(result.rows.length === 0) throw {status: 400, message: "Token tidak valid dari reset password"}

    const user = result.rows[0]
    if( new Date(user.reset_expires) < new Date()){
      await pool.query(
        `UPDATE users
        SET reset_token = NULL, reset_expires = NULL
        WHERE reset_token = $1
        `, [token])
      throw { status: 400, message: 'Token expired'}
    }

    if(!newPassword) throw { status: 400, message: "Password tidak boleh kosong"}
    const hashed = await bcrypt.hash(newPassword, 10)

    await pool.query(
      `UPDATE users
      SET user_password = $1, reset_token = NULL, reset_expires = NULL
      WHERE reset_token = $2
      `, [hashed, token])

    await sendSuccessResetPassword(user.user_email)
    return { message: "Password berhasil direset."}
}

export const updateUserRole = async({email, updatedRole}) => {
  if(!email || !updatedRole) throw ({status: 400, message: "All field required"})

  const roleOption = ['student', 'instructor', 'admin']
  const availableRole = roleOption.includes(updatedRole)
  if(!availableRole) throw ({status: 400, message: "Unavailable role"})

  await pool.query(
    `UPDATE users SET role = $1 WHERE user_email = $2` , [updatedRole, email]
  )

  return {message: "Data successfully updated"}
}