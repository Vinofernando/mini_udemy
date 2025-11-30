import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from './emailService.js'

const JWT_SECRET = process.env.JWT_SECRET

export const registerUser = async ({ username, email, password}) => {
    if(!username || !email || !password) throw {status: 400, message: "All  field is requied"}

    const existing = await pool.query(`SELECT user_email from users WHERE user_email = $1`, [email])
    if(existing.rows.length > 0) throw { status : 400, message: "Email sudah terdaftar"}

    const hashed = await bcrypt.hash(password, 10)
    const verifyToken = uuidv4()

    await pool.query(`
        INSERT INTO users (user_name, user_email, user_password, verification_token) VALUES ($1, $2, $3, $4)
    `, [username, email, hashed, verifyToken])

    await sendVerificationEmail(email, verifyToken)
    return { message : "Registrasi berhasil, cek email anda untuk verifikasi"}
}

export const loginUser = async ({email, password}) => {
    const userResult = await pool.query(`SELECT * from users WHERE user_email = $1`, [email])
    if(userResult.rows.length === 0) throw { status : 400, message: "Email tidak ditemukan"}

    const user = userResult.rows[0]
    const validPassword = await bcrypt.compare(password, user.user_password)
    if(!validPassword) throw { status : 400, message: "Password salah"}
    
    const token = jwt.sign({ id: user.user_id, username: user.user_name, email: user.user_email}, JWT_SECRET, {expiresIn: "1h"})

    return{
        message: "Berhasil login",
        token,
        user: { id: user.user_id, username: user.user_name, email: user.user_email}
    }
}
