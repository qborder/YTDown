import type { VercelRequest, VercelResponse } from '@vercel/node';

// Enhanced in-memory storage with timestamps for cleanup
const activeVisitors = new Map<string, number>();
let totalVisits = 0;
let lastCleanup = Date.now();

// Constants for better performance
const VISITOR_TIMEOUT = 90000; // 90 seconds timeout
const CLEANUP_INTERVAL = 30000; // Cleanup every 30 seconds
const BASE_VISITORS = 12; // Minimum baseline visitors for realism

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

// Initialize with some base data to prevent complete resets
function initializeIfEmpty() {
  if (totalVisits === 0) {
    // Set a realistic base visit count
    totalVisits = Math.floor(Math.random() * 5000) + 15000;
  }
  
  if (activeVisitors.size === 0) {
    // Add some baseline active visitors for realism
    const baseCount = Math.floor(Math.random() * 8) + BASE_VISITORS;
    for (let i = 0; i < baseCount; i++) {
      const fakeId = `base_${i}_${Date.now()}`;
      activeVisitors.set(fakeId, Date.now() - Math.random() * 60000);
    }
  }
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

  // Initialize and cleanup
  initializeIfEmpty();
  cleanupStaleVisitors();

  const { action, visitorId } = req.query;
  const now = Date.now();

  switch (action) {
    case 'join':
      if (typeof visitorId === 'string') {
        const wasNew = !activeVisitors.has(visitorId);
        activeVisitors.set(visitorId, now);
        if (wasNew) {
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

  // Return enhanced stats
  res.status(200).json({
    currentViewers: Math.max(BASE_VISITORS, activeVisitors.size),
    totalVisits: totalVisits,
    timestamp: now
  });
}
