import React, { useState, useEffect } from 'react';

interface HeroProps {
  onSubmit: (url: string) => void;
  error: string;
  setError: (message: string) => void;
  isProcessing: boolean;
}

export function Hero({ onSubmit, error, setError, isProcessing }: HeroProps): React.ReactNode {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (error) {
      const inputElement = document.getElementById('videoLinkInput');
      if (inputElement) {
        inputElement.classList.add('animate-shake');
        const timer = setTimeout(() => {
            inputElement.classList.remove('animate-shake');
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      setError('');
    }
  };
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError(''); // Clear any previous errors on successful paste
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      // Show a user-facing error message
      setError('Could not paste from clipboard. Please paste manually.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url);
  };

  return (
    <section className="text-center pt-20 pb-12 px-5 my-8" aria-labelledby="downloader-heading">
      <h1 id="downloader-heading" className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent animate-fade-in-down" style={{ animationDuration: '0.6s' }}>
        YouTube Video Downloader
      </h1>
      <p className="text-lg text-text-secondary mb-10 animate-fade-in-down" style={{ animationDuration: '0.6s', animationDelay: '0.2s' }}>
        High quality video downloads up to 4K resolution for free
      </p>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDuration: '0.6s', animationDelay: '0.4s' }}>
        <div className="relative w-full">
          <div className={`relative flex items-center w-full bg-bg-secondary border ${error ? 'border-error' : 'border-card-border'} rounded-lg shadow-lg focus-within:ring-2 focus-within:ring-accent focus-within:shadow-md focus-within:shadow-accent/20 transition-all duration-300`}>
              <button
                type="button"
                onClick={handlePaste}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 px-3 text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
                aria-label="Paste from clipboard"
              >
                  <i className="far fa-clipboard"></i>
                  <span className="text-sm font-medium hidden sm:inline">Paste</span>
              </button>
              <input
                  id="videoLinkInput"
                  type="url"
                  value={url}
                  onChange={handleChange}
                  placeholder="Paste YouTube video link here"
                  aria-label="YouTube video link"
                  aria-describedby="inputErrorMsg"
                  disabled={isProcessing}
                  className="w-full h-14 pl-[90px] sm:pl-28 pr-16 sm:pr-36 text-base bg-transparent focus:outline-none text-text-primary disabled:opacity-60"
              />
              <button
                  type="submit"
                  disabled={isProcessing || !url}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-4 sm:px-6 font-semibold text-white bg-accent hover:bg-accent-hover rounded-md cursor-pointer disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center transform hover:scale-105 hover:shadow-lg hover:shadow-accent/30"
                  aria-label="Download or process video link"
              >
                  {isProcessing ? (
                      <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                      <>
                          <i className="fas fa-download sm:mr-2" aria-hidden="true"></i>
                          <span className="hidden sm:inline">Download</span>
                      </>
                  )}
              </button>
          </div>
        </div>
        {error && (
            <div id="inputErrorMsg" className="w-full text-center text-error text-sm mt-3" role="alert" aria-live="assertive">
              {error}
            </div>
        )}
      </form>
    </section>
  );
}