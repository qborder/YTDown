import React, { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: "#how-to-use", label: "How to use" },
  { href: "#features", label: "Features" },
  { href: "#faq", label: "FAQ" },
];

export function Header(): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  // Effect to handle scroll-based behaviors
  useEffect(() => {
    const handleScroll = () => {
      // Header background on scroll
      setIsScrolled(window.scrollY > 10);

      // Scroll spy for active link
      let currentActive = '';
      const headerOffset = 150; // Offset to activate link a bit before section top
      const scrollPosition = window.scrollY + headerOffset;
      
      for (const link of NAV_LINKS) {
          const section = document.getElementById(link.href.substring(1));
          if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
              currentActive = link.href;
          }
      }
      setActiveLink(currentActive);
    };

    handleScroll(); // Set initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to manage body scroll lock when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveLink('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile menu */}
      <div 
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-label="Close menu"
      ></div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-primary/90 backdrop-blur-lg border-b border-card-border' : 'border-b border-transparent'}`}>
        <div className="container mx-auto flex justify-between items-center p-4">
          <a href="#" onClick={handleLogoClick} className="text-2xl font-semibold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent hover:brightness-110 transition-all duration-300">
            ytdown.app
          </a>

          {/* Mobile menu button */}
          <button
            className="md:hidden z-50 text-2xl text-text-primary w-8 h-8 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="primary-navigation"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Menu</span>
            <div className="relative w-6 h-6">
              <i className={`fas fa-bars absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}></i>
              <i className={`fas fa-times absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}></i>
            </div>
          </button>

          {/* Navigation */}
          <nav
            className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-bg-secondary p-8 pt-24 shadow-2xl shadow-black/40
                       transition-transform duration-300 ease-in-out md:p-0 md:static md:h-auto md:w-auto md:max-w-none md:bg-transparent md:shadow-none
                       md:transform-none md:flex md:items-center md:gap-2
                       ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            id="primary-navigation"
            aria-label="Main Navigation"
          >
            <ul className="flex flex-col gap-2 md:flex-row md:items-center">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`block w-full text-left p-3 rounded-lg text-lg transition-colors duration-300 md:px-4 md:py-2 md:text-sm md:font-medium md:text-center
                    ${activeLink === link.href 
                      ? 'text-text-primary bg-white/10 md:bg-accent md:text-white' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/10'}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
