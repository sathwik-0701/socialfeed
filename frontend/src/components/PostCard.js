import { useState } from 'react';
import { Card, Button, Form, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  const liked = user && post.likes.some((like) => like.username === user.username);

  const handleLike = async () => {
    if (!user) return;
    setLoadingLike(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      onUpdate(data); // instantly reflect new like count / state
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setLoadingComment(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, {
        text: commentText.trim(),
      });
      onUpdate(data); // instantly reflect new comment
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComment(false);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      {post.image && (
        <Card.Img variant="top" src={post.image} alt="post" className="post-image" />
      )}
      <Card.Body>
        <Card.Title className="post-card-username mb-1" style={{ fontSize: '1rem' }}>
          {post.username}
        </Card.Title>
        <Card.Subtitle className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>
          {new Date(post.createdAt).toLocaleString()}
        </Card.Subtitle>

        {post.text && <Card.Text className="mb-2">{post.text}</Card.Text>}

        <div className="d-flex align-items-center gap-2 mt-2">
          <Button
            variant={liked ? 'danger' : 'outline-danger'}
            size="sm"
            className="like-btn"
            onClick={handleLike}
            disabled={!user || loadingLike}
          >
            {liked ? '❤️' : '🤍'} {post.likes.length}{' '}
            {post.likes.length === 1 ? 'Like' : 'Likes'}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowComments((s) => !s)}
          >
            💬 {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>
        </div>

        {showComments && (
          <div className="mt-3">
            {post.likes.length > 0 && (
              <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>
                Liked by: {post.likes.map((l) => l.username).join(', ')}
              </p>
            )}

            <ListGroup variant="flush" className="mb-2">
              {post.comments.length === 0 ? (
                <ListGroup.Item className="text-muted px-0">
                  No comments yet
                </ListGroup.Item>
              ) : (
                post.comments.map((c, idx) => (
                  <ListGroup.Item key={c._id || idx} className="px-0" style={{ fontSize: '0.9rem' }}>
                    <strong>{c.username}: </strong>
                    {c.text}
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>

            {user ? (
              <Form onSubmit={handleComment} className="d-flex gap-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button size="sm" type="submit" disabled={loadingComment}>
                  Send
                </Button>
              </Form>
            ) : (
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                Login to comment
              </p>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default PostCard;
