import type { VercelRequest, VercelResponse } from '@vercel/node';

// Real visitor tracking with timestamps
const activeVisitors = new Map<string, number>();

// Use environment variables for persistence across cold starts
// In production, this could be replaced with a database
let totalVisits = parseInt(process.env.TOTAL_VISITS || '0') || 0;
let lastCleanup = Date.now();

// Constants
const VISITOR_TIMEOUT = 120000; // 2 minutes timeout for real users
const CLEANUP_INTERVAL = 60000; // Cleanup every minute

// Cleanup stale visitors
function cleanupStaleVisitors() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  const cutoff = now - VISITOR_TIMEOUT;
  for (const [visitorId, timestamp] of activeVisitors.entries()) {
    if (timestamp < cutoff) {
      activeVisitors.delete(visitorId);
    }
  }
  lastCleanup = now;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS with better headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Cleanup stale visitors
  cleanupStaleVisitors();

  const { action, visitorId, isPageLoad } = req.query;
  const now = Date.now();

  switch (action) {
    case 'join':
      if (typeof visitorId === 'string') {
        const wasNew = !activeVisitors.has(visitorId);
        activeVisitors.set(visitorId, now);
        
        // Only count as a visit if it's a real page load (not tab switch)
        if (wasNew && isPageLoad === 'true') {
          totalVisits++;
        }
      }
      break;

    case 'leave':
      if (typeof visitorId === 'string') {
        activeVisitors.delete(visitorId);
      }
      break;

    case 'ping':
      // Update timestamp to keep visitor alive
      if (typeof visitorId === 'string') {
        activeVisitors.set(visitorId, now);
      }
      break;

    case 'stats':
    default:
      // Just return current stats
      break;
  }

  // Return real stats only
  res.status(200).json({
    currentViewers: activeVisitors.size, // Real count only
    totalVisits: totalVisits,
    timestamp: now
  });
}
