import Snippet from '../models/snippet.model.js'
import { body, validationResult } from 'express-validator'

/**
 * Validation rules for snippet creation and editing
 */
export const snippetValidation = [
  body('description')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Description must be between 3 and 200 characters')
    .escape(),
  body('snippet')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Snippet must be between 1 and 5000 characters')
]

/**
 * This function will get all the snippets from the database and return them as an array.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {Array} - An array of snippets
 */
const getSnippet = async (req, res) => {
  try {
    const snippets = await Snippet.find()
    const snippet = []
    snippets.forEach((item) => {
      snippet.push({
        description: item.description,
        snippet: item.snippet,
        id: item._id,
        createdBy: item.createdBy
      })
    })
    return snippet
  } catch (err) {
    res.status(400).send(err)
  }
}

/**
 * This function will find a snippet by its ID and render the viewSnippet page.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const viewSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    res.render('viewSnippet', { snippet, username: req.session.username })
  } catch (err) {
    res.status(400).send(err)
  }
}

/**
 * This function will add a new snippet to the database and redirect to the home page.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const addSnippet = async (req, res) => {
  try {
    if (req.session.username === 'guest' || !req.session.username) {
      res.sendStatus(404)
    } else {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.session.flash = {
          type: 'error',
          text: errors.array()[0].msg
        }
        return res.redirect('/snippets/new')
      }

      const snippet = new Snippet({
        description: req.body.description,
        snippet: req.body.snippet,
        createdBy: req.session.username
      })
      await snippet.save()
      res.redirect('redirect')
    }
  } catch (err) {
    res.status(400)
    res.send(err.message)
  }
}

/**
 * This function will find a snippet by its ID and render the deleteSnippet page.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const getDeleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    res.render('deleteSnippet', { snippet, username: req.session.username })
  } catch (err) {
    res.status(400)
    res.send(err.message)
  }
}

/**
 * This function will delete a snippet by its ID and redirect to the home page.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const postDeleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    const author = snippet.createdBy
    if (req.session.username !== author) {
      res.send('You are not authorized to delete this snippet')
    } else {
      await Snippet.findByIdAndDelete(req.params.id)
      req.session.flash = {
        type: 'success',
        text: 'Snippet deleted successfully'
      }
      res.redirect('/home')
    }
  } catch (err) {
    res.status(400)
    res.send(err.message)
  }
}

/**
 * This function will find a snippet by its ID and render the editSnippet page.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const getEditSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    const author = snippet.createdBy
    if (req.session.username !== author) {
      res.send('You are not authorized to edit this snippet')
    } else {
      const snippet = await Snippet.findById(req.params.id)
      res.render('editSnippet', { snippet, username: req.session.username })
    }
  } catch (err) {
    res.status(400)
    res.send(err.message)
  }
}

/**
 * This function will find a snippet by its ID and update the description and snippet fields. It will then redirect to the home page.
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
const postEditSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
    const author = snippet.createdBy
    if (req.session.username !== author && req.session.username === 'guest') {
      res.sendStatus(403)
    } else if (req.session.username === 'guest' || !req.session.username) {
      res.sendStatus(404)
    } else {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.session.flash = {
          type: 'error',
          text: errors.array()[0].msg
        }
        return res.redirect(`/snippets/${req.params.id}/edit`)
      }

      await Snippet.findByIdAndUpdate(req.params.id, {
        description: req.body.description,
        snippet: req.body.snippet
      })
    }
    req.session.flash = {
      type: 'success',
      text: 'Snippet edited successfully'
    }
    res.redirect('/home')
  } catch (err) {
    res.status(400)
    res.send(err.message)
  }
}

export { getSnippet, viewSnippet, addSnippet, getDeleteSnippet, postDeleteSnippet, getEditSnippet, postEditSnippet }
