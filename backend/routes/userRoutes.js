import express from 'express'
import { getUser, forgotPassword, resetPassword, getToken } from '../controllers/userController.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, getUser)
router.post('/forgot-password', forgotPassword)
router.get('/reset-token/:token', getToken)
router.post('/reset-password', resetPassword)

export default router