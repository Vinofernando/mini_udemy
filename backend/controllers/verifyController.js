import pool from "../config/db.js";

export const verifyAccount = async (req, res, next) => {
    try{
        const {token} = req.params
        const result = await pool.query(`SELECT * FROM users WHERE verification_token = $1`, [token])
        if(result.rows.length === 0) throw { status: 400, message: `Token tidak valid`}
        await pool.query(`UPDATE users set is_verified = true, verification_token = null WHERE verification_token = $1`, [token])
        res.json({message : `Akun berhasil di verifikasi, silahkan login`})
    } catch (err) { next(err)}
}