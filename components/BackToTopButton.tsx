import React, { useState, useEffect } from 'react';

export function BackToTopButton(): React.ReactNode {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 w-12 h-12 rounded-lg bg-accent hover:bg-accent-hover text-white text-xl flex items-center justify-center shadow-lg shadow-accent/20 transition-all duration-300
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'}
      hover:-translate-y-1 hover:scale-110 hover:shadow-xl hover:shadow-accent/30 focus:outline-none focus:ring-4 focus:ring-accent/50`}
      title="Go to top"
      aria-label="Back to top"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}