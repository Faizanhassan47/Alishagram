import React, { useState } from 'react';
import { Search } from 'lucide-react';
import PhotoCard from '../components/PhotoCard';
import api from '../services/api';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get(`/photos/search?q=${query}`);
      setResults(data);
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', minHeight: 'calc(100vh - 80px)' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Explore the World</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Find photos by title, city, country, or tags.
        </p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search destinations..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '48px', height: '100%' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {searched && !loading && results.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
          No findings for "{query}". Try another location!
        </div>
      )}

      <div className="photo-grid">
        {results.map(photo => (
          <PhotoCard key={photo._id} photo={photo} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
