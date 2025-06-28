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

  const encodedAPIURL = "aHR0cHM6Ly9wLm9jZWFuc2F2ZXIuaW4vYXBpL2NhcmQyLz91cmw9";
  const apiURL = atob(encodedAPIURL);

  return (
    <section 
      ref={containerRef}
      className="api-container max-w-3xl min-h-[150px] mx-auto my-8 bg-bg-secondary rounded-2xl border border-card-border shadow-lg shadow-black/30 overflow-hidden flex justify-center items-center transition-all duration-500 ease-in-out"
      aria-live="polite"
    >
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <iframe
          ref={iframeRef}
          id="api-iframe"
          scrolling="no"
          allowTransparency={true}
          src={`${apiURL}${encodeURIComponent(submittedUrl)}`}
          title="Video Download Options"
          onLoad={handleIframeLoad}
          onError={() => console.error("Failed to load iframe content.")}
          className={`w-full min-h-[300px] block border-none transition-opacity duration-700 ease-in-out ${isIframeLoaded ? 'opacity-100' : 'opacity-0'}`}
        ></iframe>
      )}
    </section>
  );
}