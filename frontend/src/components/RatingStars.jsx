import React, { useState } from 'react';
import { Star } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RatingStars = ({ photoId, currentRatingObj, onRatingChange }) => {
  const { user } = useAuth();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const average = currentRatingObj?.average || 0;
  const count = currentRatingObj?.count || 0;

  const handleRating = async (value) => {
    if (!user) return alert('Please login to rate');
    
    setSubmitting(true);
    try {
      await api.post(`/photos/${photoId}/ratings`, { value });
      onRatingChange(); // Callback to refresh ratings
    } catch (error) {
      console.error('Failed to submit rating', error);
      alert('Failed to submit rating');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            style={{
              cursor: user ? (submitting ? 'wait' : 'pointer') : 'not-allowed',
              color: star <= (hoveredRating || average) ? '#fbbf24' : 'var(--text-secondary)',
              fill: star <= (hoveredRating || average) ? '#fbbf24' : 'transparent',
              transition: 'color 0.2s',
            }}
            onMouseEnter={() => user && setHoveredRating(star)}
            onMouseLeave={() => user && setHoveredRating(0)}
            onClick={() => !submitting && handleRating(star)}
          />
        ))}
      </div>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        {average} ({count} {count === 1 ? 'rating' : 'ratings'})
      </span>
    </div>
  );
};

export default RatingStars;
