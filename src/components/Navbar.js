import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Templates', href: '/templates' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-primary-dark/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img 
              src="/logos/ia-logo-small-light.png" 
              alt="Iacovici.it Logo" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block flex-1 max-w-2xl">
            <div className="flex items-baseline justify-center space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                    isActiveRoute(item.href)
                      ? 'text-accent-gold border-b-2 border-accent-gold'
                      : 'text-primary-light hover:text-accent-gold'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Compact Navigation for md screens */}
          <div className="hidden md:block lg:hidden flex-1 max-w-lg">
            <div className="flex items-baseline justify-center space-x-4">
              {navigation.slice(0, 4).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-2 py-2 rounded-md text-xs font-medium transition-colors duration-300 whitespace-nowrap ${
                    isActiveRoute(item.href)
                      ? 'text-accent-gold border-b-2 border-accent-gold'
                      : 'text-primary-light hover:text-accent-gold'
                  }`}
                >
                  {item.name === 'Templates' ? 'Tools' : item.name === 'Services' ? 'Work' : item.name}
                </Link>
              ))}
              {/* Dropdown for remaining items */}
              <div className="relative group">
                <button className="px-2 py-2 rounded-md text-xs font-medium text-primary-light hover:text-accent-gold transition-colors duration-300 whitespace-nowrap">
                  More
                </button>
                <div className="absolute top-full right-0 mt-2 w-32 bg-primary-dark/95 backdrop-blur-md rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  {navigation.slice(4).map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 text-xs text-primary-light hover:text-accent-gold hover:bg-primary-gray/50 transition-colors duration-300 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block flex-shrink-0">
            <a
              href="https://cal.iacovici.it"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-light text-primary-dark px-3 md:px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-xs lg:text-sm font-medium hover:bg-accent-gold hover:text-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <span className="hidden lg:inline">Get Free Consultation</span>
              <span className="lg:hidden">Book Call</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-light hover:text-accent-gold transition-colors duration-300 p-2"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary-dark/95 backdrop-blur-md shadow-lg border-t border-gray-800">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors duration-300 ${
                  isActiveRoute(item.href)
                    ? 'text-accent-gold bg-primary-gray'
                    : 'text-primary-light hover:text-accent-gold hover:bg-primary-gray/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 px-4">
              <a
                href="https://cal.iacovici.it"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-primary-light text-primary-dark px-6 py-3 rounded-lg font-medium hover:bg-accent-gold transition-all duration-300 shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                Get Free Consultation
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;