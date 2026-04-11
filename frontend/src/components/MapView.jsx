import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GeocodedMarker = ({ photo }) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // Simple geocoding using OSM Nominatim
    const geocode = async () => {
      try {
        const query = encodeURIComponent(`${photo.city}, ${photo.country}`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
        const data = await res.json();
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (err) {
        console.error('Geocoding error', err);
      }
    };
    geocode();
  }, [photo]);

  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup>
        <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(`/photo/${photo._id}`)}>
          <img src={photo.imageUrl} alt={photo.title} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
          <h4 style={{ margin: '8px 0 4px', fontSize: '1rem' }}>{photo.title}</h4>
          <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>{photo.city}</p>
        </div>
      </Popup>
    </Marker>
  );
};

const MapView = ({ photos }) => {
  return (
    <div style={{ height: '600px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%', backgroundColor: '#1e293b' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {photos.map(photo => (
          <GeocodedMarker key={photo._id} photo={photo} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
