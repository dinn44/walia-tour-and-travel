import React from 'react';
import { Star } from 'lucide-react';

const ReviewStars = ({ rating, size = 16, interactive = false, onRatingChange }) => {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          disabled={!interactive}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            padding: 0,
            display: 'inline-flex'
          }}
        >
          <Star
            size={size}
            fill={star <= rating ? "var(--warning)" : "none"}
            stroke={star <= rating ? "var(--warning)" : "var(--text-muted)"}
            style={{ transition: 'var(--transition-smooth)' }}
          />
        </button>
      ))}
    </div>
  );
};

export default ReviewStars;
