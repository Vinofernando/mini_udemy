import express from 'express'
import { getUser, forgotPassword, resetPassword, getToken, updateUserRole } from '../controllers/userController.js'
import authenticateToken from '../middleware/auth.js'
import { authorizeRole } from '../middleware/authorizeRole.js'

const router = express.Router()

router.get('/', authenticateToken, getUser)
router.post('/forgot-password', forgotPassword)
router.get('/reset-token/:token', getToken)
router.post('/reset-password', resetPassword)
router.patch('/role', authenticateToken, authorizeRole("admin"), updateUserRole)

export default router