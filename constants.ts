import { FeatureItem, StepItem, FAQItem } from './types';

export const FEATURES: FeatureItem[] = [
  { icon: "fas fa-highlighter", title: "High-Quality Downloads", description: "Download videos in their original quality, including 1080p, 2K, and 4K, ensuring crystal-clear visuals." },
  { icon: "fas fa-layer-group", title: "Versatile Formats", description: "Choose from a wide range of formats like MP4 for video or MP3 for audio to suit any device or purpose." },
  { icon: "fas fa-bolt", title: "Fast & Secure", description: "Experience swift downloads in a secure, browser-based environment without needing to install any software." },
  { icon: "fas fa-globe", title: "Multi-Platform Support", description: "Download content not just from YouTube, but also from Facebook, TikTok, Twitch, Vimeo, and more.", subIcons: ['fab fa-youtube text-red-500', 'fab fa-facebook text-blue-500', 'fab fa-tiktok', 'fab fa-twitch text-purple-500', 'fab fa-vimeo text-cyan-400'] },
  { icon: "fas fa-user-check", title: "No Registration Needed", description: "Enjoy unlimited downloads without the hassle of creating an account. Just paste the link and go." },
  { icon: "fas fa-mobile-alt", title: "Completely Cross-Platform", description: "Use our downloader on any device with a web browser, including desktops, tablets, and all mobile phones." },
];

export const STEPS: StepItem[] = [
  { title: "Paste the YouTube Video Link", description: "Copy the video link from YouTube and paste it into the input field. Click the first 'Download' button to retrieve video details." },
  { title: "Select the Format and Start Converting", description: "Once the video card appears, select your preferred format from the drop-down menu and click the second 'Download' button." },
  { title: "Download Your YouTube Video", description: "After conversion, the final 'Download' button will appear. Click it to save the video file to your device and enjoy offline." },
];

export const FAQS: FAQItem[] = [
  { q: "Can I download unlimited videos?", a: "Yes, you can download unlimited videos. There are no restrictions on the number of videos you can save for offline viewing." },
  { q: "Can I download videos in 4K resolution?", a: "Yes, you can download videos in stunning 4K resolution for a crisp and ultra-high-definition (UHD) viewing experience." },
  { q: "Can I convert videos to audio files?", a: "Yes, you can. Our tool allows you to convert your video to multiple audio formats, including MP3, FLAC, WAV, and more." },
  { q: "Is YTDown safe to use?", a: "Yes, YTDown is completely safe. It's a web-based tool that doesn't require software installation, eliminating malware risks. We don't store your data." },
  { q: "Does YTDown work on mobile devices?", a: "Absolutely! YTDown works perfectly on both Android and iOS devices. You can use it on any device with a web browser." },
];