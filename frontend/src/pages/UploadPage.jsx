import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const UploadPage = () => {
  const [formData, setFormData] = useState({ title: '', caption: '', city: '', country: '', tags: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('caption', formData.caption);
    fd.append('city', formData.city);
    fd.append('country', formData.country);
    fd.append('tags', formData.tags);
    fd.append('image', file);

    try {
      await api.post('/photos', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo');
      setUploading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-card animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2>Share a Tale</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Upload your travel photos and let the world see.</p>
        </div>

        {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr' }}>
          
          <div style={{ gridColumn: '1 / -1', minHeight: '200px', border: '2px dashed var(--border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.4)', cursor: 'pointer', transition: 'border-color 0.2s ease', position: 'relative' }}>
             <input type="file" onChange={handleFileChange} accept="image/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} required />
             {file ? (
               <div style={{ padding: '16px', textAlign: 'center' }}>
                 <ImageIcon size={48} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
                 <p>{file.name}</p>
               </div>
             ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                 <UploadCloud size={48} style={{ marginBottom: '12px' }} />
                 <p>Drag & drop or click to upload</p>
               </div>
             )}
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Photo Title</label>
            <input type="text" name="title" className="form-input" placeholder="A magical sunset" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <input type="text" name="city" className="form-input" placeholder="Venice" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input type="text" name="country" className="form-input" placeholder="Italy" value={formData.country} onChange={handleChange} required />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Caption / Story</label>
            <textarea name="caption" className="form-input" placeholder="Tell us about this moment..." value={formData.caption} onChange={handleChange} rows={4} style={{ resize: 'vertical' }}></textarea>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Tags (comma separated)</label>
            <input type="text" name="tags" className="form-input" placeholder="sunset, architecture, river" value={formData.tags} onChange={handleChange} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadPage;
