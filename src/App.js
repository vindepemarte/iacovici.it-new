import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SiteSettingsProvider } from './hooks/useSiteSettings';
import { RuntimeConfigProvider, ConfigLoader, useRuntimeConfig } from './hooks/useRuntimeConfig';
import { setRuntimeApiUrl } from './utils/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EnvironmentDebug from './components/EnvironmentDebug';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import TemplatesPage from './pages/TemplatesPage';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiesPolicy from './pages/CookiesPolicy';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import CheckoutPage from './pages/CheckoutPage';

// Simple component to protect admin routes
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // In a real application, you would also verify the token validity
  return token ? children : <AdminLogin />;
};

// Main app content component
const AppContent = () => {
  const { apiBaseUrl } = useRuntimeConfig();
  
  // Update the API utility with the discovered URL
  useEffect(() => {
    if (apiBaseUrl) {
      setRuntimeApiUrl(apiBaseUrl);
    }
  }, [apiBaseUrl]);

  return (
    <Router>
      <div className="App min-h-screen bg-primary-dark">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookies-policy" element={<CookiesPolicy />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </main>
        <Footer />
        {/* Temporary debug component - remove after fixing environment issues */}
        <EnvironmentDebug />
      </div>
    </Router>
  );
};

function App() {
  return (
    <HelmetProvider>
      <RuntimeConfigProvider>
        <ConfigLoader>
          <SiteSettingsProvider>
            <AppContent />
          </SiteSettingsProvider>
        </ConfigLoader>
      </RuntimeConfigProvider>
    </HelmetProvider>
  );
}

export default App;