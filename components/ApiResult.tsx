import React, { useEffect, useRef, useState } from 'react';

interface ApiResultProps {
  submittedUrl: string;
  isLoading: boolean;
}

const LoadingAnimation: React.FC = () => (
  <div className="flex items-center justify-center p-8 h-full" aria-live="assertive">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-accent rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 bg-accent rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Two different API sources for more download options
const API_SOURCE_1 = atob("aHR0cHM6Ly9wLm9jZWFuc2F2ZXIuaW4vYXBpL2NhcmQyLz91cmw9"); // card2
const API_SOURCE_2 = atob("aHR0cHM6Ly9wLm9jZWFuc2F2ZXIuaW4vYXBpL2NhcmQvP3VybD0="); // card (v1)

export function ApiResult({ submittedUrl, isLoading }: ApiResultProps): React.ReactNode {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIframeLoaded, setIframeLoaded] = useState(false);
  const [activeSource, setActiveSource] = useState(1);

  const currentApiUrl = activeSource === 1 ? API_SOURCE_1 : API_SOURCE_2;
  
  useEffect(() => {
    // Reset iframe loaded state when loading starts, URL changes, or source changes
    setIframeLoaded(false);
    
    if (submittedUrl && !isLoading) {
      if (containerRef.current) {
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 70;
        const scrollTarget = containerRef.current.getBoundingClientRect().top + window.scrollY - (headerHeight + 20);
        window.scrollTo({ top: scrollTarget, behavior: "smooth" });
      }
    }
  }, [submittedUrl, isLoading, activeSource]);
  
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

  const handleSourceChange = (source: number) => {
    if (source !== activeSource) {
      setActiveSource(source);
    }
  };

  return (
    <section 
      ref={containerRef}
      className="api-container max-w-3xl mx-auto my-8"
      aria-live="polite"
    >
      {!isLoading && submittedUrl && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4" role="tablist" aria-label="Download Sources">
          <button
            onClick={() => handleSourceChange(1)}
            role="tab"
            aria-selected={activeSource === 1}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-accent/50 ${
              activeSource === 1
                ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105'
                : 'bg-bg-secondary border border-card-border text-text-secondary hover:bg-white/5 hover:text-text-primary hover:border-white/20'
            }`}
          >
            Source 1
          </button>
          <button
            onClick={() => handleSourceChange(2)}
            role="tab"
            aria-selected={activeSource === 2}
            className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-accent/50 ${
              activeSource === 2
                ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105'
                : 'bg-bg-secondary border border-card-border text-text-secondary hover:bg-white/5 hover:text-text-primary hover:border-white/20'
            }`}
          >
            Source 2
          </button>
        </div>
      )}
      
      <div className="min-h-[150px] bg-bg-secondary rounded-2xl border border-card-border shadow-lg shadow-black/30 overflow-hidden flex justify-center items-center transition-all duration-500 ease-in-out">
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          submittedUrl && (
            <iframe
              ref={iframeRef}
              key={activeSource}
              id="api-iframe"
              scrolling="no"
              allowTransparency={true}
              src={`${currentApiUrl}${encodeURIComponent(submittedUrl)}`}
              title="Video Download Options"
              onLoad={handleIframeLoad}
              onError={() => console.error("Failed to load iframe content.")}
              className={`w-full min-h-[300px] block border-none transition-opacity duration-700 ease-in-out ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
            ></iframe>
          )
        )}
      </div>
    </section>
  );
}