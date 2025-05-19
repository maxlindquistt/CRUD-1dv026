import mongoose from 'mongoose'

const snippetSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Enter a short description']
  },
  snippet: {
    type: String,
    required: [true, 'Enter a code snippet']
  },
  createdBy: {
    type: String,
    required: true
  }
}
, { timestamps: true }
)

const Snippet = mongoose.model('Snippet', snippetSchema)

export default Snippet
