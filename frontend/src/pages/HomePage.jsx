import React, { useState, useEffect } from 'react';
import { Map, Grid } from 'lucide-react';
import PhotoCard from '../components/PhotoCard';
import MapView from '../components/MapView';
import api from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'map'

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await api.get('/photos');
        setPhotos(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching photos', error);
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      <div className="hero-section text-center">
        <h1 className="hero-title">Discover the World</h1>
        <p className="hero-subtitle">Beautiful stories captured by travelers around the globe.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
          <button 
            className={`btn ${viewMode === 'gallery' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setViewMode('gallery')}
          >
            <Grid size={18} /> Gallery
          </button>
          <button 
            className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setViewMode('map')}
          >
            <Map size={18} /> Map View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading amazing photos...</div>
      ) : viewMode === 'gallery' ? (
        <div className="photo-grid">
          {photos.map(photo => (
            <PhotoCard key={photo._id} photo={photo} />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <MapView photos={photos} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
