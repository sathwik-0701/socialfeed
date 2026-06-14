import { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add a brand-new post to the top of the feed instantly
  const handleNewPost = (post) => {
    setPosts((prev) => [post, ...prev]);
  };

  // Replace a post with its updated version (after like/comment) for instant UI updates
  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <div className="feed-container">
      {!user && (
        <Alert variant="info">
          <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link> to create
          posts, like, or comment.
        </Alert>
      )}

      {user && <CreatePost onPostCreated={handleNewPost} />}

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : posts.length === 0 ? (
        <Alert variant="secondary" className="text-center">
          No posts yet. Be the first to post!
        </Alert>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
        ))
      )}
    </div>
  );
}

export default Feed;
