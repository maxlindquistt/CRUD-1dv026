import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { getSnippet } from './controllers/snippet.controller.js'
import { checkUser } from './controllers/index.controller.js'
import path from 'path'
import snippetsRouter from './routes/snippets.js'
import registerRouter from './routes/register.js'

const app = express()

app.enable('trust proxy') // add this code to enable secure cookies in production environment (https)
// app.use(function (req, res, next) {
//   if (req.secure) {
//     next()
//   } else {
//     res.redirect('https://' + req.headers.host + req.url)
//   }
// })

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'secret',
  name: 'sessionID',
  cookie: {
    maxAge: 6000000,
    httpOnly: false
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

app.use('/register', registerRouter)
app.use('/snippets', snippetsRouter)

app.set('view engine', 'ejs')
app.set('views', path.join(path.resolve(), 'src/views'))

app.get('/', (req, res) => {
  res.render('index')
  req.session.destroy()
})

app.post('/login', (req, res) => {
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

mongoose.connect('mongodb+srv://ml227cu:Maxatt312@crudbackend.p0wnf.mongodb.net/Crud-Backend?retryWrites=true&w=majority&appName=CRUDBackend')
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(3000, () => {
      console.log('Server is running on port 3000')
    })
  })
