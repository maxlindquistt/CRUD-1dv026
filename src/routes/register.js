import express from 'express'
import { registerUser } from '../controllers/user.controller.js'

const router = express.Router()

router.get('/', (req, res) => {
  req.session.destroy()
  res.render('register')
})

router.post('/', registerUser)

export default router
