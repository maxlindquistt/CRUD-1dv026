import express from 'express'
import { viewSnippet, addSnippet, getDeleteSnippet, postDeleteSnippet, getEditSnippet, postEditSnippet, snippetValidation } from '../controllers/snippet.controller.js'
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('add', { username: req.session.username })
})

router.post('/new', snippetValidation, addSnippet)

router.get('/redirect', (req, res) => {
  req.session.flash = {
    type: 'success',
    text: 'Snippet added successfully'
  }
  res.redirect('/home')
})

router.get('/:id', viewSnippet)

router.get('/:id/edit', getEditSnippet)

router.post('/:id/edit', snippetValidation, postEditSnippet)

router.get('/:id/delete', getDeleteSnippet)

router.post('/:id/delete', postDeleteSnippet)

export default router
