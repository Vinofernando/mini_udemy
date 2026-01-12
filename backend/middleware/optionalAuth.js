import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET

export const optionalAuthenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  // 🟢 Tidak ada token → lanjut
  if (!token) {
    req.user = null
    return next()
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    // 🔴 Token ada tapi invalid → error
    if (err) {
      return next({ status: 401, message: "Invalid token" })
    }

    // 🟢 Token valid
    req.user = user
    next()
  })
}
