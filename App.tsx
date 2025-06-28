import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ApiResult } from './components/ApiResult';
import { Features } from './components/Features';
import { HowToUse } from './components/HowToUse';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { BackToTopButton } from './components/BackToTopButton';
import { GlowEffect } from './components/GlowEffect';
import { FAQS, FEATURES, STEPS } from './constants';
import { useAnimateOnScroll } from './useAnimateOnScroll';

function MainDescription() {
  const sectionRef = useRef<HTMLElement>(null);
  useAnimateOnScroll(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-3xl mx-auto my-24 px-5 text-center animate-on-scroll" aria-label="About YTDown">
      <p className="mb-4 text-lg leading-relaxed text-text-secondary">
        YTDown simplifies saving online videos. Paste a link to get started.
      </p>
      <p className="text-lg leading-relaxed text-text-secondary">
        Enjoy high-quality, offline access to your favorite content on any device, with no software installation required.
      </p>
    </section>
  );
}

function App(): React.ReactNode {
  const [submittedUrl, setSubmittedUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleUrlSubmit = useCallback((url: string) => {
    if (!url) {
      setError('Please paste a video link first.');
      return;
    }
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      setError('Please enter a valid video URL (e.g., https://...).');
      return;
    }

    setError('');
    setIsLoading(true);
    setSubmittedUrl(''); // Clear previous result
    
    // Simulate processing delay and then set URL
    setTimeout(() => {
        setSubmittedUrl(url);
        setIsLoading(false);
    }, 800);
  }, []);

  return (
    <>
      <GlowEffect />
      <Header />
      <main role="main" className="container mx-auto px-5">
        <Hero onSubmit={handleUrlSubmit} error={error} setError={setError} isProcessing={isLoading} />
        
        {(isLoading || submittedUrl) && (
          <ApiResult submittedUrl={submittedUrl} isLoading={isLoading} />
        )}

        <MainDescription />
        <Features features={FEATURES} />
        <HowToUse steps={STEPS} />
        <FAQ faqs={FAQS} />
      </main>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export default App;
