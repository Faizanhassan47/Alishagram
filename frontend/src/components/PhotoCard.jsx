import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, MessageCircle } from 'lucide-react';
import './PhotoCard.css';

const PhotoCard = ({ photo }) => {
  const navigate = useNavigate();

  return (
    <div className="photo-card glass-card" onClick={() => navigate(`/photo/${photo._id}`)}>
      <div className="photo-wrapper">
        <img src={photo.imageUrl} alt={photo.title} className="photo-img" />
        <div className="photo-overlay">
          <div className="photo-actions">
            <button className="icon-btn"><Heart size={20} /></button>
            <button className="icon-btn"><MessageCircle size={20} /></button>
          </div>
        </div>
      </div>
      <div className="photo-info">
        <h3 className="photo-title">{photo.title}</h3>
        <p className="photo-location">
          <MapPin size={14} className="location-icon" />
          {photo.city}, {photo.country}
        </p>
        <div className="photo-meta">
          <span className="photo-author">By {photo.authorName || 'Traveler'}</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
