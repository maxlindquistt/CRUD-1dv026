import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

/**
 * This function will check if the user exists in the database and log them in.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const checkUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username })
    if (!existingUser) {
      req.session.flash = {
        type: 'error',
        text: 'invalid username or password'
      }
      res.redirect('/')
    } else if (!bcrypt.compareSync(req.body.password, existingUser.password)) {
      req.session.flash = {
        type: 'error',
        text: 'invalid username or password'
      }
      res.redirect('/')
    } else {
      req.session.username = req.body.username
      req.session.flash = {
        type: 'success',
        text: 'User logged in successfully'
      }
      res.redirect('/home')
    }
  } catch (err) {
    res.status(400)
    res.send(err.message)
  }
}

export { checkUser }
