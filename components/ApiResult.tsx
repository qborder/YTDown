import React, { useEffect, useRef, useState } from 'react';

interface ApiResultProps {
  submittedUrl: string;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="w-full p-6 animate-pulse" role="status">
    <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
      <div className="bg-slate-700/50 rounded-lg w-full sm:w-40 h-24 sm:h-[90px] flex-shrink-0"></div>
      <div className="w-full pt-2">
        <div className="h-5 bg-slate-700/50 rounded-full w-full mb-3"></div>
        <div className="h-5 bg-slate-700/50 rounded-full w-3/4"></div>
      </div>
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-700/50 rounded-lg w-full"></div>
      ))}
    </div>
    <span className="sr-only">Loading results...</span>
  </div>
);

export function ApiResult({ submittedUrl, isLoading }: ApiResultProps): React.ReactNode {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Reset iframe loaded state when loading starts or URL changes
    if (isLoading || !submittedUrl) {
      setIframeLoaded(false);
    }
    
    if (submittedUrl && !isLoading) {
      if (containerRef.current) {
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 70;
        const scrollTarget = containerRef.current.getBoundingClientRect().top + window.scrollY - (headerHeight + 20);
        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
      }
    }
  }, [submittedUrl, isLoading]);
  
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    try {
      if (iframeRef.current && typeof window.iFrameResize !== "undefined") {
        window.iFrameResize({ log: false, checkOrigin: false }, '#api-iframe');
      }
    } catch (error) {
      console.error("Error resizing iframe:", error);
    }
  };
  
  const buildIframeSrc = () => {
    if (!submittedUrl) return '';

    const customCSS = `
      /* General styling */
      html, body {
        font-family: 'Inter', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Arial', 'sans-serif';
        background: transparent !important;
        color: #F5F5F5;
        margin: 0;
      }
      
      body {
        padding: 1rem;
      }
      
      /* Hide unwanted elements */
      .logo, .footer, h1, h2, p.text-center, #result > .text-center {
          display: none !important;
      }
      
      /* The main container should be transparent */
      #card, .card {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        box-shadow: none !important;
      }

      /* Video details section styling */
      .media {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      @media (min-width: 640px) {
        .media {
          flex-direction: row;
          text-align: left;
          align-items: flex-start;
        }
      }
      
      .media img {
        border-radius: 8px !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        max-width: 160px !important;
        object-fit: cover;
        flex-shrink: 0;
      }
      
      .media-body h3, .media-body .h5 {
        color: #F5F5F5 !important;
        font-size: 1.1rem !important;
        line-height: 1.4 !important;
        font-weight: 600 !important;
        margin: 0 !important;
      }
      .media-body p {
        color: #A3A3A3 !important;
        font-size: 0.9rem !important;
        margin-top: 0.25rem;
      }

      /* Table for formats styling */
      table {
        width: 100% !important;
        border-collapse: separate !important;
        border-spacing: 0 0.5rem !important;
      }
      
      thead {
        display: none !important;
      }
      
      tbody tr {
        background-color: #171717 !important;
        transition: all 0.2s ease-in-out;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 8px !important;
      }
      
      tbody tr:hover {
        background-color: #272727 !important;
        transform: translateY(-2px);
        border-color: rgba(0, 169, 255, 0.3) !important;
      }

      td {
        padding: 0.75rem 1rem !important;
        vertical-align: middle !important;
        color: #A3A3A3 !important;
        border: none !important;
      }
      
      td:first-child {
        border-top-left-radius: 8px !important;
        border-bottom-left-radius: 8px !important;
        color: #F5F5F5 !important;
        font-weight: 500;
      }
      td:last-child {
        border-top-right-radius: 8px !important;
        border-bottom-right-radius: 8px !important;
        text-align: right !important;
      }
      
      /* Download button inside table */
      td .btn, td a[download] {
        display: inline-block !important;
        padding: 0.6rem 1.1rem !important;
        font-size: 0.9rem !important;
        font-weight: 600 !important;
        color: #ffffff !important;
        background-color: #00A9FF !important;
        border: none !important;
        border-radius: 6px !important;
        text-decoration: none !important;
        transition: all 0.2s ease !important;
      }

      td .btn:hover, td a[download]:hover {
        background-color: #0087CC !important;
        transform: scale(1.05);
      }
    `;

    // Minify, Base64 encode, and create a data URI.
    const minifiedCss = customCSS
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/[\r\n\t]/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s*([:;{}])\s*/g, '$1')
      .trim();
    
    const base64Css = btoa(minifiedCss);
    const cssDataUri = `data:text/css;base64,${base64Css}`;

    // Manually build the URL with encodeURIComponent to correctly handle special chars.
    const baseURL = "https://p.oceansaver.in/api/card2/";
    const adUrl = 'https://ytdown.app';
    const params = `url=${encodeURIComponent(submittedUrl)}&adUrl=${encodeURIComponent(adUrl)}&css=${encodeURIComponent(cssDataUri)}`;

    return `${baseURL}?${params}`;
  };

  const iframeSrc = buildIframeSrc();

  return (
    <section 
      ref={containerRef}
      className="api-container max-w-3xl min-h-[260px] mx-auto my-8 bg-bg-secondary rounded-2xl border border-card-border shadow-lg shadow-black/30 overflow-hidden flex justify-center items-center transition-all duration-500 ease-in-out"
      aria-live="polite"
    >
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        submittedUrl && <iframe
          ref={iframeRef}
          id="api-iframe"
          scrolling="no"
          allowTransparency={true}
          src={iframeSrc}
          title="Video Download Options"
          onLoad={handleIframeLoad}
          onError={() => console.error("Failed to load iframe content.")}
          className={`w-full min-h-[300px] block border-none transition-opacity duration-700 ease-in-out ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
        ></iframe>
      )}
    </section>
  );
}