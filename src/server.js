import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { getSnippet } from './controllers/snippet.controller.js'
import { checkUser } from './controllers/index.controller.js'
import path from 'path'
import snippetsRouter from './routes/snippets.js'
import registerRouter from './routes/register.js'

// Load environment variables
dotenv.config()

const app = express()

app.enable('trust proxy') // add this code to enable secure cookies in production environment (https)

// Security: Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use(function (req, res, next) {
    if (req.secure) {
      next()
    } else {
      res.redirect('https://' + req.headers.host + req.url)
    }
  })
}

// Security: Helmet middleware for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}))

// Rate limiting for login and registration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many attempts, please try again later.'
})

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  name: 'sessionID',
  cookie: {
    maxAge: 6000000,
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict' // CSRF protection
  },
  resave: false,
  saveUninitialized: false
}))

app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }
  next()
})

// Apply rate limiting to register route
app.use('/register', authLimiter, registerRouter)
app.use('/snippets', snippetsRouter)

app.set('view engine', 'ejs')
app.set('views', path.join(path.resolve(), 'src/views'))

app.get('/', (req, res) => {
  res.render('index')
  req.session.destroy()
})

app.post('/login', authLimiter, (req, res) => {
  checkUser(req, res)
})

app.get('/guest', (req, res) => {
  req.session.username = 'guest'
  req.session.flash = {
    type: 'success',
    text: 'Continued as guest'
  }
  res.redirect('/home')
})

app.use((req, res, next) => {
  if (req.session.username) {
    next()
  } else {
    res.redirect('/')
  }
})

app.get('/home', async (req, res) => {
  const snippets = await getSnippet(req, res)
  res.render('home', { snippets, username: req.session.username })
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crud-app'

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
