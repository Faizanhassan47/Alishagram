import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, TrendingUp, Globe, Camera, Compass,
  Mountain, Waves, Building2, Trees, Sunset, Star,
  MapPin, Upload, Users, Image
} from 'lucide-react';
import Masonry from 'react-masonry-css';
import PhotoCard from '../components/PhotoCard';
import MapView from '../components/MapView';
import api from '../services/api';
import './HomePage.css';

/* ── Data ─────────────────────────────── */
const CATEGORIES = [
  { label: 'Mountains', icon: Mountain, color: '#7B8FA3' },
  { label: 'Beaches',   icon: Waves,    color: '#4A9FC4' },
  { label: 'Cities',    icon: Building2,color: '#C07050' },
  { label: 'Forests',   icon: Trees,    color: '#5A9A70' },
  { label: 'Sunsets',   icon: Sunset,   color: '#D4854A' },
  { label: 'Explore',   icon: Compass,  color: '#9A75C8' },
];

const RECOMMENDED = [
  {
    name: 'Amalfi Coast',
    tag: 'Coastal',
    location: 'Italy, Europe',
    img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80',
  },
  {
    name: 'Cappadocia',
    tag: 'Adventure',
    location: 'Türkiye, Asia',
    img: 'https://images.unsplash.com/photo-1530267781934-73a22b881994?w=600&q=80',
  },
  {
    name: 'Kyoto',
    tag: 'Culture',
    location: 'Japan, Asia',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
  },
  {
    name: 'Patagonia',
    tag: 'Wilderness',
    location: 'Argentina, S. America',
    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
  },
];

const STATS = [
  { value: '2M+',  label: 'Photos', icon: Image },
  { value: '180+', label: 'Countries', icon: Globe },
  { value: '50K+', label: 'Explorers', icon: Users },
  { value: '99%',  label: 'Free',   icon: Star },
];

const PHRASES = [
  'Find your next adventure...',
  'Explore hidden mountain trails...',
  'Discover secret beaches...',
  'Wander through ancient cities...',
  'Chase golden hour anywhere...',
];

/* Mosaic: 6 curated placeholder images that look great together */
const MOSAIC_IMGS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',  // mountains
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',  // lake
  'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80',  // beach
  'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',  // city night
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',  // peak
  'https://images.unsplash.com/photo-1502786129293-79981df4e689?w=600&q=80',  // forest
];

/* ── Component ─────────────────────────── */
const HomePage = () => {
  const [photos, setPhotos]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [viewMode, setViewMode]       = useState('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const navigate = useNavigate();

  /* Typewriter */
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typed, setTyped]         = useState('');
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const phrase = PHRASES[phraseIdx];
      if (!deleting) {
        setTyped(phrase.substring(0, typed.length + 1));
        if (typed.length === phrase.length) setTimeout(() => setDeleting(true), 2200);
      } else {
        setTyped(phrase.substring(0, typed.length - 1));
        if (typed === '') {
          setDeleting(false);
          setPhraseIdx(p => (p + 1) % PHRASES.length);
        }
      }
    }, deleting ? 28 : 72);
    return () => clearTimeout(t);
  }, [typed, deleting, phraseIdx]);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    api.get('/photos')
      .then(({ data }) => setPhotos(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const filteredPhotos = activeCategory
    ? photos.filter(p =>
        p.tags?.some(t => t.toLowerCase().includes(activeCategory.toLowerCase())) ||
        p.title?.toLowerCase().includes(activeCategory.toLowerCase()) ||
        p.country?.toLowerCase().includes(activeCategory.toLowerCase()))
    : photos;

  return (
    <div className="hp-root">

      {/* ══════════════════════════════════════
          HERO — split left/right
          ══════════════════════════════════════ */}
      <section className={`hp-hero ${heroVisible ? 'vis' : ''}`}>

        {/* Background layers */}
        <div className="hp-hero-bg">
          <div className="hp-bg-mesh" />
          <div className="hp-orb hp-orb-a" />
          <div className="hp-orb hp-orb-b" />
          <div className="hp-orb hp-orb-c" />
          <div className="hp-grid-lines" />
          <div className="hp-noise" />
        </div>

        {/* ── LEFT COLUMN ── */}
        <div className="hp-hero-left">

          {/* Pill badge */}
          <div className="hp-hero-badge">
            <span className="hp-badge-dot" />
            <Star size={11} />
            <span>Community Travel Journal · Est. 2024</span>
          </div>

          {/* Big headline */}
          <h1 className="hp-hero-h1">
            <span className="hp-line hp-line-1">Where Every</span>
            <span className="hp-line hp-line-accent">Journey</span>
            <span className="hp-line hp-line-3">Becomes a</span>
            <span className="hp-line hp-line-4">Story.</span>
          </h1>

          <p className="hp-hero-desc">
            Alishagram is a living journal of human connection — 
            a community of explorers capturing the world one frame at a time.
          </p>

          {/* Search */}
          <form className="hp-hero-search" onSubmit={handleSearch}>
            <Search size={18} className="hp-si" />
            <input
              id="homepage-search"
              className="hp-hero-input"
              type="text"
              placeholder={typed + '|'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" id="homepage-search-submit" className="hp-hero-btn">
              <span>Search</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Trending chips */}
          <div className="hp-trending">
            <span className="hp-trend-label">
              <TrendingUp size={13} /> Trending
            </span>
            {['Santorini', 'Patagonia', 'Kyoto', 'Iceland', 'Bali'].map(t => (
              <button key={t} className="hp-chip" onClick={() => navigate(`/search?q=${t}`)}>
                {t}
              </button>
            ))}
          </div>

          {/* Hero inline stats */}
          <div className="hp-hero-stats">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="hp-hstat">
                <Icon size={16} className="hp-hstat-icon" />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN — photo mosaic ── */}
        <div className="hp-hero-right">
          <div className="hp-mosaic">
            {/* top row: 1 tall + 1 short */}
            <div className="hp-mosaic-col hp-mosaic-col-a">
              <div className="hp-mosaic-item hp-mi-tall">
                <img src={MOSAIC_IMGS[0]} alt="Mountain" loading="lazy"/>
                <div className="hp-mi-overlay">
                  <MapPin size={12}/> Dolomites, Italy
                </div>
              </div>
              <div className="hp-mosaic-item hp-mi-short">
                <img src={MOSAIC_IMGS[1]} alt="Lake" loading="lazy"/>
                <div className="hp-mi-overlay">
                  <MapPin size={12}/> Banff, Canada
                </div>
              </div>
            </div>

            {/* middle col: short top + tall bottom */}
            <div className="hp-mosaic-col hp-mosaic-col-b">
              <div className="hp-mosaic-item hp-mi-short">
                <img src={MOSAIC_IMGS[2]} alt="Beach" loading="lazy"/>
                <div className="hp-mi-overlay">
                  <MapPin size={12}/> Maldives
                </div>
              </div>
              <div className="hp-mosaic-item hp-mi-tall">
                <img src={MOSAIC_IMGS[3]} alt="City" loading="lazy"/>
                <div className="hp-mi-overlay">
                  <MapPin size={12}/> Tokyo, Japan
                </div>
              </div>
            </div>

            {/* right col: full-height single */}
            <div className="hp-mosaic-col hp-mosaic-col-c">
              <div className="hp-mosaic-item hp-mi-full">
                <img src={MOSAIC_IMGS[4]} alt="Peak" loading="lazy"/>
                <div className="hp-mi-overlay">
                  <MapPin size={12}/> Everest Base, Nepal
                </div>
              </div>
            </div>

            {/* Floating decorative cards */}
            <div className="hp-float-card hp-fc-1">
              <Camera size={14} />
              <div>
                <strong>12 new stories</strong>
                <span>just uploaded</span>
              </div>
            </div>

            <div className="hp-float-card hp-fc-2">
              <Upload size={14} />
              <div>
                <strong>Share yours</strong>
                <span>Join 50K+ explorers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          className="hp-scroll-cue"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          aria-label="Scroll down"
        >
          <div className="hp-scroll-mouse">
            <div className="hp-scroll-dot" />
          </div>
        </button>
      </section>

      {/* ══════════════════════════════════════
          CATEGORY CARDS
          ══════════════════════════════════════ */}
      <section className="hp-categories">
        <div className="hp-section-header">
          <div>
            <p className="hp-eyebrow">Browse by Theme</p>
            <h2 className="hp-section-title">Explore Collections</h2>
          </div>
          <button className="hp-text-btn" onClick={() => navigate('/search')} id="explore-all-btn">
            View all <ArrowRight size={15} />
          </button>
        </div>
        <div className="hp-cat-grid">
          {CATEGORIES.map(({ label, icon: Icon, color }) => (
            <button
              key={label}
              className={`hp-cat-card ${activeCategory === label ? 'cat-on' : ''}`}
              onClick={() => setActiveCategory(activeCategory === label ? null : label)}
              style={{ '--cc': color }}
            >
              <div className="hp-cat-icon"><Icon size={22} /></div>
              <span className="hp-cat-label">{label}</span>
              {activeCategory === label && <div className="hp-cat-pip" />}
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          RECOMMENDATIONS
          ══════════════════════════════════════ */}
      <section className="hp-reco">
        <div className="hp-section-header">
          <div>
            <p className="hp-eyebrow">Curated for You</p>
            <h2 className="hp-section-title">Recommended Destinations</h2>
          </div>
          <button className="hp-text-btn" onClick={() => navigate('/search')} id="reco-all-btn">
            See all <ArrowRight size={15} />
          </button>
        </div>
        <div className="hp-reco-grid">
          {RECOMMENDED.map(({ name, tag, location, img }) => (
            <div
              key={name}
              className="hp-reco-card"
              onClick={() => navigate(`/search?q=${encodeURIComponent(name)}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(`/search?q=${encodeURIComponent(name)}`)}
              aria-label={`Explore ${name}`}
            >
              <img src={img} alt={name} className="hp-reco-img" loading="lazy" />
              <div className="hp-reco-overlay">
                <span className="hp-reco-tag">{tag}</span>
                <div className="hp-reco-name">{name}</div>
                <div className="hp-reco-meta">
                  <MapPin size={11} /> {location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          GALLERY
          ══════════════════════════════════════ */}
      <section className="hp-gallery">
        <div className="hp-section-header">
          <div>
            <p className="hp-eyebrow">Community Picks</p>
            <h2 className="hp-section-title">
              {activeCategory ? `${activeCategory} Stories` : 'Featured Stories'}
            </h2>
          </div>
          <div className="hp-toggle-wrap">
            <button id="view-gallery-btn" className={`hp-tog ${viewMode==='gallery'?'tog-on':''}`} onClick={() => setViewMode('gallery')}>
              <Camera size={15} /> Grid
            </button>
            <button id="view-map-btn" className={`hp-tog ${viewMode==='map'?'tog-on':''}`} onClick={() => setViewMode('map')}>
              <Globe size={15} /> Map
            </button>
          </div>
        </div>

        {loading ? (
          <div className="hp-skel-grid">
            {[...Array(6)].map((_,i) => <div key={i} className="hp-skel" style={{'--d':`${i*0.1}s`}} />)}
          </div>
        ) : viewMode === 'gallery' ? (
          filteredPhotos.length > 0 ? (
            <Masonry breakpointCols={{default:3,1200:2,700:1}} className="hp-masonry" columnClassName="hp-masonry-col">
              {filteredPhotos.map(p => <PhotoCard key={p._id} photo={p} />)}
            </Masonry>
          ) : (
            <div className="hp-empty">
              <Compass size={44} className="hp-empty-ico" />
              <p>No stories yet for "{activeCategory}"</p>
              <button className="hp-clear-btn" onClick={() => setActiveCategory(null)}>Clear Filter</button>
            </div>
          )
        ) : (
          <div className="hp-map-wrap"><MapView photos={filteredPhotos} /></div>
        )}

        {!loading && viewMode==='gallery' && filteredPhotos.length>0 && (
          <div className="hp-more-wrap">
            <button className="hp-more-btn" onClick={() => navigate('/search')} id="load-more-btn">
              Explore More <ArrowRight size={15}/>
            </button>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          CTA
          ══════════════════════════════════════ */}
      <section className="hp-cta">
        <div className="hp-cta-glow" />
        <div className="hp-cta-inner">
          <TrendingUp size={30} className="hp-cta-icon" />
          <h2 className="hp-cta-title">Ready to share your story?</h2>
          <p className="hp-cta-sub">
            Join thousands of explorers documenting their journey.
            Upload your travel moments and inspire the world.
          </p>
          <div className="hp-cta-btns">
            <button className="hp-cta-prim" onClick={() => navigate('/upload')} id="cta-upload-btn">Start Sharing</button>
            <button className="hp-cta-out"  onClick={() => navigate('/register')} id="cta-join-btn">Join the Community</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
