import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

/**
 * This function will register a new user in the database.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const registerUser = async (req, res) => {
  try {
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
