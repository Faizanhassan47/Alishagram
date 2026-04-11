import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';
import CommentSection from '../components/CommentSection';
import RatingStars from '../components/RatingStars';

const PhotoDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [ratingObj, setRatingObj] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  const fetchPhotoData = async () => {
    try {
      const [photoRes, ratingRes] = await Promise.all([
        api.get(`/photos/${id}`),
        api.get(`/photos/${id}/ratings`)
      ]);
      setPhoto(photoRes.data);
      setRatingObj(ratingRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load photo', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotoData();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Loading photo...</div>;
  if (!photo) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}>Photo not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px', marginTop: '20px' }}>
      <Helmet>
        <title>{photo.title} - TravelTales</title>
        <meta name="description" content={photo.caption || `A beautiful photo of ${photo.city}, ${photo.country}.`} />
        <meta property="og:title" content={`${photo.title} on TravelTales`} />
        <meta property="og:description" content={photo.caption || `A beautiful photo of ${photo.city}, ${photo.country}.`} />
        <meta property="og:image" content={photo.imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={photo.title} />
        <meta name="twitter:description" content={`A breathtaking view from ${photo.city}.`} />
        <meta name="twitter:image" content={photo.imageUrl} />
      </Helmet>

      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '32px' }}>
        {/* Left Side: Image */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
          <img src={photo.imageUrl} alt={photo.title} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '80vh', objectFit: 'cover' }} />
        </div>

        {/* Right Side: Details & Interactions */}
        <div className="glass-card" style={{ alignSelf: 'start', padding: '32px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{photo.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            <span>{photo.city}, {photo.country}</span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <RatingStars photoId={photo._id} currentRatingObj={ratingObj} onRatingChange={() => api.get(`/photos/${id}/ratings`).then(res => setRatingObj(res.data))} />
          </div>

          {photo.caption && (
            <p style={{ lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '24px', color: 'var(--text-primary)' }}>
              {photo.caption}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {photo.tags?.map((tag, idx) => (
              <span key={idx} style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.85rem' }}>
                #{tag}
              </span>
            ))}
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Uploaded by <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{photo.uploadedBy?.name || 'Unknown'}</span>
            </p>
          </div>

          <CommentSection photoId={photo._id} />
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailsPage;
