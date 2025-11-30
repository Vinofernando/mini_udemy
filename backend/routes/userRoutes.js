import express from 'express'
import { getUser, forgotPassword } from '../controllers/userController.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, getUser)
router.post('/forgot-password', forgotPassword)

export default router