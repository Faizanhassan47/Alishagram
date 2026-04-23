import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import './PhotoCard.css';

const optimizeCloudinaryUrl = (url) => {
  if (url && url.includes('cloudinary.com/') && !url.includes('/f_auto,q_auto/')) {
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  return url;
};

const PhotoCard = ({ photo }) => {
  const navigate = useNavigate();

  return (
    <div
      className="pcard"
      onClick={() => navigate(`/photo/${photo._id}`)}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/photo/${photo._id}`)}
      role="button"
      aria-label={`View photo: ${photo.title}`}
    >
      <div className="pcard-img-wrap">
        <img
          src={optimizeCloudinaryUrl(photo.imageUrl)}
          alt={photo.title}
          className="pcard-img"
          loading="lazy"
        />
        {/* Hover Overlay */}
        <div className="pcard-overlay">
          <div className="pcard-overlay-top">
            <span className="pcard-location-badge">
              <MapPin size={11} />
              {photo.city && photo.country
                ? `${photo.city}, ${photo.country}`
                : photo.country || 'Unknown'}
            </span>
          </div>
          <div className="pcard-overlay-bottom">
            <button
              className="pcard-like-btn"
              onClick={e => e.stopPropagation()}
              aria-label="Like photo"
            >
              <Heart size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="pcard-info">
        <h3 className="pcard-title">{photo.title}</h3>
        <p className="pcard-author">by {photo.authorName || 'Explorer'}</p>
      </div>
    </div>
  );
};

export default PhotoCard;
