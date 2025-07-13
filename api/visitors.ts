import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  getTotalVisits, 
  incrementTotalVisits, 
  addActiveVisitor, 
  removeActiveVisitor, 
  updateVisitorLastSeen, 
  getActiveVisitorCount 
} from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS with better headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, visitorId, isPageLoad } = req.query;
  const now = Date.now();

  try {
    switch (action) {
      case 'join':
        if (typeof visitorId === 'string') {
          await addActiveVisitor(visitorId);
          
          // Only count as a visit if it's a real page load (not tab switch)
          if (isPageLoad === 'true') {
            await incrementTotalVisits();
          }
        }
        break;

      case 'leave':
        if (typeof visitorId === 'string') {
          await removeActiveVisitor(visitorId);
        }
        break;

      case 'ping':
        // Update timestamp to keep visitor alive
        if (typeof visitorId === 'string') {
          await updateVisitorLastSeen(visitorId);
        }
        break;

      case 'stats':
      default:
        // Just return current stats
        break;
    }

    // Get current stats from database
    const [currentViewers, totalVisits] = await Promise.all([
      getActiveVisitorCount(),
      getTotalVisits()
    ]);

    // Return real stats from database
    res.status(200).json({
      currentViewers,
      totalVisits,
      timestamp: now
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Database error',
      currentViewers: 0,
      totalVisits: 0,
      timestamp: now
    });
  }
}
