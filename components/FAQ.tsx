import React, { useState, useRef, useEffect } from 'react';
import { FAQItem } from '../types';
import { useAnimateOnScroll } from '../useAnimateOnScroll';

interface FaqItemComponentProps {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

const FaqItemComponent: React.FC<FaqItemComponentProps> = ({ item, isOpen, onClick, index }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const itemRef = useRef<HTMLDivElement>(null);
    useAnimateOnScroll(itemRef);
    const maxHeight = isOpen ? `${contentRef.current?.scrollHeight}px` : '0px';

    useEffect(() => {
        const itemEl = itemRef.current;
        if (!itemEl) return;
    
        const handleMouseMove = (e: MouseEvent) => {
            const rect = itemEl.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            itemEl.style.setProperty('--mouse-x', `${x}px`);
            itemEl.style.setProperty('--mouse-y', `${y}px`);
        };
        itemEl.addEventListener('mousemove', handleMouseMove);

        return () => {
            if (itemEl) {
              itemEl.removeEventListener('mousemove', handleMouseMove);
            }
        }
      }, []);

    return (
        <div 
            ref={itemRef} 
            className="spotlight-card faq-item bg-bg-secondary rounded-xl border border-card-border shadow-lg shadow-black/30 overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/20 animate-on-scroll"
            style={{ '--animation-delay': `${index * 100}ms` } as React.CSSProperties}
        >
            <h2>
                <button
                    onClick={onClick}
                    className="w-full text-left p-5 text-lg font-medium flex justify-between items-center text-text-primary hover:bg-white/5 transition-colors"
                    aria-expanded={isOpen}
                >
                    <span className="flex-1 pr-4">{item.q}</span>
                    <i className={`fas fa-chevron-down text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                </button>
            </h2>
            <div
                style={{ maxHeight }}
                className="overflow-hidden transition-all duration-500 ease-in-out"
            >
                <div ref={contentRef} className="px-5 pb-5 pt-1">
                    <p className="text-text-secondary leading-relaxed">
                        {item.a}
                    </p>
                </div>
            </div>
        </div>
    );
};


interface FAQProps {
    faqs: FAQItem[];
}

export function FAQ({ faqs }: FAQProps): React.ReactNode {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useAnimateOnScroll(sectionRef);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} id="faq" className="faq-section max-w-3xl mx-auto my-24 px-5 animate-on-scroll" aria-labelledby="faq-heading" tabIndex={-1}>
      <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FaqItemComponent key={index} item={faq} isOpen={openIndex === index} onClick={() => handleClick(index)} index={index} />
        ))}
      </div>
    </section>
  );
}
