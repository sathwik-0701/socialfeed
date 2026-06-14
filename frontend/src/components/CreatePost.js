import { useState } from 'react';
import { Card, Form, Button, Alert, Image } from 'react-bootstrap';
import api from '../api/api';

function CreatePost({ onPostCreated }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Keep images reasonably small since they are stored as base64 in MongoDB
    if (file.size > 3 * 1024 * 1024) {
      setError('Image must be smaller than 3MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage('');
    setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!text.trim() && !image) {
      setError('Please add some text or an image');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/posts', { text: text.trim(), image });
      onPostCreated(data);
      setText('');
      setImage('');
      setPreview('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>

          {preview && (
            <div className="mb-2 position-relative">
              <Image src={preview} alt="preview" thumbnail style={{ maxHeight: '200px' }} />
              <Button
                variant="danger"
                size="sm"
                className="ms-2"
                onClick={removeImage}
                type="button"
              >
                Remove image
              </Button>
            </div>
          )}

          <Form.Group className="mb-2">
            <Form.Label className="text-muted" style={{ fontSize: '0.85rem' }}>
              Add an image (optional)
            </Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default CreatePost;
