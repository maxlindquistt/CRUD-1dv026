import express from 'express'
import { registerUser, registerValidation } from '../controllers/user.controller.js'

const router = express.Router()

router.get('/', (req, res) => {
  req.session.destroy()
  res.render('register')
})

router.post('/', registerValidation, registerUser)

export default router
