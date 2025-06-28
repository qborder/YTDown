
export interface FAQItem {
  q: string;
  a: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  subIcons?: string[];
}

export interface StepItem {
  title: string;
  description: string;
}

declare global {
  interface Window {
    iFrameResize: (options: { log?: boolean; checkOrigin?: boolean }, selector: string) => void;
  }
}