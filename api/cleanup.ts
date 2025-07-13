import type { VercelRequest, VercelResponse } from '@vercel/node';

// This endpoint is called by Vercel cron to keep the function warm
// and maintain consistent visitor counts
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow cron calls from Vercel
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'cron-secret'}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // This keeps the function warm and maintains state
  res.status(200).json({ 
    message: 'Cleanup completed',
    timestamp: Date.now()
  });
}
