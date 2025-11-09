import bcrypt from 'bcryptjs'
import { body, validationResult } from 'express-validator'
import User from '../models/user.model.js'

/**
 * Validation rules for user registration
 */
export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers')
    .escape(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]

/**
 * This function will register a new user in the database.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const registerUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.session.flash = {
        type: 'error',
        text: errors.array()[0].msg
      }
      return res.redirect('/register')
    }

    const existingUser = await User.findOne({ username: req.body.username })
    if (existingUser || req.body.username === 'guest') {
      req.session.flash = {
        type: 'error',
        text: 'Username already exists or is invalid'
      }
      res.redirect('/register')
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      })
      await user.save()
      req.session.flash = {
        type: 'success',
        text: 'User registered successfully'
      }
      res.redirect('/')
    }
  } catch (err) {
    res.status(400)
    res.send(err.message)
  }
}

export { registerUser }
