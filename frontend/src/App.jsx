import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import PhotoDetailsPage from './pages/PhotoDetailsPage';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photo/:id" element={<PhotoDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </main>
    </Router>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
