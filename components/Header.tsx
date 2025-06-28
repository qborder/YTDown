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

  const handleNav = () => {
    // Scroll spy for active link
    const sections = NAV_LINKS.map(link => document.getElementById(link.href.substring(1)));
    const scrollPosition = window.scrollY + 150;

    for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
            setActiveLink(`#${section.id}`);
            break;
        }
    }

    // Header background on scroll
    setIsScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    handleNav(); // Set initial state
    window.addEventListener('scroll', handleNav);
    return () => window.removeEventListener('scroll', handleNav);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-primary/90 backdrop-blur-lg border-b border-card-border' : 'border-b border-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="site-title">
          <a href="#" className="text-2xl font-semibold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
            ytdown.app
          </a>
        </div>

        <button
          className="md:hidden z-[1001] text-2xl text-text-primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="primary-navigation"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Menu</span>
          {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
        </button>

        <nav
          className={`site-navbar ${
            isOpen
              ? 'transform-none'
              : 'translate-x-full'
          } transition-transform duration-300 ease-in-out fixed inset-y-0 right-0 w-3/4 max-w-xs bg-bg-secondary p-8 pt-24 md:p-0 md:static md:w-auto md:max-w-none md:bg-transparent md:transform-none md:translate-x-0 md:flex md:items-center md:gap-6`}
          id="primary-navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`block text-center text-lg md:text-base font-medium text-text-secondary hover:text-text-primary my-4 md:my-0 py-2 relative transition-colors duration-300
              after:content-[''] after:absolute after:w-full after:h-0.5 after:bottom-0 after:left-0 after:bg-accent after:transition-transform after:duration-300 after:origin-center
              ${activeLink === link.href ? 'text-text-primary after:scale-x-100' : 'after:scale-x-0' }
              hover:after:scale-x-100`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}