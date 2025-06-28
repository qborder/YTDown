import { useEffect } from 'react';

type AnimateOnScrollOptions = IntersectionObserverInit & {
  once?: boolean;
};

export function useAnimateOnScroll<T extends HTMLElement>(ref: React.RefObject<T>, options?: AnimateOnScrollOptions) {
  const { once = true, ...observerOptions } = options || {};

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          element.classList.remove('is-visible');
        }
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1,
        ...observerOptions,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, once, observerOptions]);
}
