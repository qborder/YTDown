import React, { useEffect, useRef } from 'react';
import { FeatureItem } from '../types';

interface FeatureCardProps {
  feature: FeatureItem;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };
    card.addEventListener('mousemove', handleMouseMove);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div ref={cardRef} className="spotlight-card feature group text-center bg-bg-secondary rounded-xl p-6 border border-card-border shadow-lg shadow-black/30 transition-all duration-300 hover:border-accent/50 hover:bg-black hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20">
      <i className={`${feature.icon} text-accent text-3xl mb-4 transition-transform duration-300 group-hover:scale-110`}></i>
      <h3 className="text-lg font-semibold mb-2 text-text-primary">{feature.title}</h3>
      <p className="text-text-secondary leading-relaxed text-sm">{feature.description}</p>
    </div>
  );
};

interface FeaturesProps {
    features: FeatureItem[];
}

export function Features({ features }: FeaturesProps): React.ReactNode {
  return (
    <section id="features" className="content-section my-24" aria-labelledby="features-heading" tabIndex={-1}>
      <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
        Why Choose Us?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} delay={index * 100} />
        ))}
      </div>
    </section>
  );
}