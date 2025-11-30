import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET

export const authenticateToken = async (req, res, next ) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) throw ({status : 401, message: "Token tidak ditemukan"})

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) throw ({status: 403, message: "Token tidak valid"})

        req.user = user
        next()
    })
}

export default authenticateToken