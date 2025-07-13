import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for active visitors (resets on function cold start)
let activeVisitors = new Set<string>();
let totalVisits = 0;

// Simple storage using Vercel KV would be better for production
// For now, we'll use a simple approach that works locally and on Vercel

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, visitorId } = req.query;

  switch (action) {
    case 'join':
      if (typeof visitorId === 'string' && !activeVisitors.has(visitorId)) {
        activeVisitors.add(visitorId);
        totalVisits++;
      }
      break;

    case 'leave':
      if (typeof visitorId === 'string') {
        activeVisitors.delete(visitorId);
      }
      break;

    case 'ping':
      // Keep visitor alive (refresh their presence)
      if (typeof visitorId === 'string') {
        activeVisitors.add(visitorId);
      }
      break;

    case 'stats':
    default:
      // Return current stats
      break;
  }

  res.status(200).json({
    currentViewers: activeVisitors.size,
    totalVisits: totalVisits
  });
}
