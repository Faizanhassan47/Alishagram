import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ photoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/photos/${photoId}/comments`);
      setComments(data);
    } catch (error) {
      console.error('Fetch comments failed', error);
    }
  };

  useEffect(() => {
    if (photoId) fetchComments();
  }, [photoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      await api.post(`/photos/${photoId}/comments`, { text });
      setText('');
      fetchComments();
    } catch (error) {
      console.error('Post comment failed', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Add a comment..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !text.trim()}>
            <Send size={18} />
          </button>
        </form>
      ) : (
        <div style={{ marginBottom: '24px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
          Please login to add a comment.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {comments.map((comment) => (
          <div key={comment._id} style={{ padding: '16px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{comment.userId?.name || 'Unknown'}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{comment.text}</p>
          </div>
        ))}
        {comments.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No comments yet. Be the first to share your thoughts!</p>}
      </div>
    </div>
  );
};

export default CommentSection;
