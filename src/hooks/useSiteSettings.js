import { useState, useEffect, useContext, createContext } from 'react';
import { getPublicSettings } from '../utils/api';

// Create a context for site settings
const SiteSettingsContext = createContext({
  settings: {},
  loading: true,
  error: null,
  refreshSettings: () => {}
});

// Provider component
export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err.message);
      // Set default values as fallback
      setSettings({
        company_name: 'Iacovici.it',
        company_tagline: 'AI & Automation Solutions for Business Growth',
        contact_email: 'admin@iacovici.it',
        contact_phone: '+39 378 0875700',
        whatsapp_number: '+393780875700',
        social_github: 'https://github.com/iacovici',
        social_linkedin: 'https://linkedin.com/in/iacovici',
        social_telegram: 'https://t.me/iacovici',
        site_url: 'https://iacovici.it',
        calendar_booking_url: 'https://cal.iacovici.it',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = () => {
    fetchSettings();
  };

  return (
    <SiteSettingsContext.Provider value={{
      settings,
      loading,
      error,
      refreshSettings
    }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

// Custom hook to use site settings
export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

// Helper functions to get specific setting values with defaults
export const useCompanyInfo = () => {
  const { settings } = useSiteSettings();
  return {
    name: settings.company_name || 'Iacovici.it',
    tagline: settings.company_tagline || 'AI & Automation Solutions for Business Growth',
    description: settings.company_description || 'Transform your business with intelligent automation, AI integration, and modern web solutions.',
  };
};

export const useContactInfo = () => {
  const { settings } = useSiteSettings();
  return {
    email: settings.contact_email || 'admin@iacovici.it',
    phone: settings.contact_phone || '+39 378 0875700',
    whatsapp: settings.whatsapp_number || '+393780875700',
    address: settings.company_address || {
      street: 'Via Roma 123',
      city: 'Milan',
      country: 'Italy',
      zip: '20100'
    },
  };
};

export const useSocialLinks = () => {
  const { settings } = useSiteSettings();
  return {
    github: settings.social_github || 'https://github.com/iacovici',
    linkedin: settings.social_linkedin || 'https://linkedin.com/in/iacovici',
    telegram: settings.social_telegram || 'https://t.me/iacovici',
    twitter: settings.social_twitter || '',
  };
};

export const useSiteUrls = () => {
  const { settings } = useSiteSettings();
  return {
    main: settings.site_url || 'https://iacovici.it',
    calendar: settings.calendar_booking_url || 'https://cal.iacovici.it',
  };
};

export const useBusinessInfo = () => {
  const { settings } = useSiteSettings();
  return {
    hours: settings.business_hours || {
      monday: '9:00-18:00',
      tuesday: '9:00-18:00',
      wednesday: '9:00-18:00',
      thursday: '9:00-18:00',
      friday: '9:00-18:00',
      saturday: 'closed',
      sunday: 'closed'
    },
    vatNumber: settings.vat_number || 'IT12345678901',
    taxCode: settings.tax_code || 'CVCDNL85R15F205X',
  };
};