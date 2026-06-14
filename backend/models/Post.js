const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    text: { type: String, default: '' },
    // Image is stored as a base64 data URL string (e.g. "data:image/png;base64,....")
    image: { type: String, default: '' },
    likes: { type: [likeSchema], default: [] },
    comments: { type: [commentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
