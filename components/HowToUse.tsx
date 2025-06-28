import React, { useEffect, useRef } from 'react';
import { StepItem } from '../types';
import { useAnimateOnScroll } from '../useAnimateOnScroll';

interface StepCardProps {
  step: StepItem;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useAnimateOnScroll(cardRef);

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
        if (card) {
            card.removeEventListener('mousemove', handleMouseMove);
        }
    }
  }, []);

  return (
    <div 
      ref={cardRef} 
      className="spotlight-card step-card flex flex-col bg-bg-secondary rounded-xl p-6 border border-card-border shadow-lg shadow-black/30 transition-all duration-300 hover:border-accent/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20 animate-on-scroll"
      style={{ '--animation-delay': `${index * 150}ms` } as React.CSSProperties}
    >
      <div className="step-header flex items-center mb-4">
        <div className="step-number w-10 h-10 mr-4 flex items-center justify-center bg-accent text-white text-lg font-bold rounded-full shadow-md shadow-accent/20">
          {index + 1}
        </div>
        <h3 className="text-lg font-semibold text-text-primary">{step.title}</h3>
      </div>
      <p className="text-text-secondary leading-relaxed">{step.description}</p>
    </div>
  );
};


interface HowToUseProps {
    steps: StepItem[];
}

export function HowToUse({ steps }: HowToUseProps): React.ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  useAnimateOnScroll(sectionRef);

  return (
    <section ref={sectionRef} id="how-to-use" className="steps-section max-w-3xl mx-auto my-24 px-5 animate-on-scroll" aria-labelledby="how-to-use-heading" tabIndex={-1}>
      <h2 id="how-to-use-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
        How to Download Videos?
      </h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
