import React from 'react';

export function Footer(): React.ReactNode {
  return (
    <footer className="border-t border-card-border py-8 text-center mt-24">
      <div className="container mx-auto px-5 text-text-secondary">
        <p className="text-sm">&copy; {new Date().getFullYear()} YTDown.app. All Rights Reserved.</p>
        <div className="mt-3 text-sm">
            <a href="#" className="mx-2 hover:text-text-primary transition-colors">Terms of Service</a>
            <span className='opacity-50'>|</span>
            <a href="#" className="mx-2 hover:text-text-primary transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}