const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// ---------------------------------------------
// POST /api/posts
// Create a new post (text and/or image)
// Protected route - requires login
// ---------------------------------------------
router.post('/', auth, async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ message: 'Post must have text or an image' });
    }

    const post = await Post.create({
      user: req.user.id,
      username: req.user.username,
      text: text || '',
      image: image || '',
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---------------------------------------------
// GET /api/posts
// Get all posts for the public feed (newest first)
// ---------------------------------------------
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---------------------------------------------
// POST /api/posts/:id/like
// Like or unlike (toggle) a post
// Protected route - requires login
// ---------------------------------------------
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLikedIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    if (alreadyLikedIndex !== -1) {
      // user already liked -> remove like (unlike)
      post.likes.splice(alreadyLikedIndex, 1);
    } else {
      // add new like
      post.likes.push({ user: req.user.id, username: req.user.username });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---------------------------------------------
// POST /api/posts/:id/comment
// Add a comment to a post
// Protected route - requires login
// ---------------------------------------------
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user.id,
      username: req.user.username,
      text: text.trim(),
    });

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
