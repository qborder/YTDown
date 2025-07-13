import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple key-value storage using Vercel's file system
// In production, you'd want to use a proper database
let storage: Record<string, any> = {};

export function getStorage(key: string): any {
  return storage[key];
}

export function setStorage(key: string, value: any): void {
  storage[key] = value;
}

// Initialize with some persistent data
storage['totalVisits'] = storage['totalVisits'] || 0;

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { action, key, value } = req.query;

  switch (action) {
    case 'get':
      res.status(200).json({ value: getStorage(key as string) });
      break;
    
    case 'set':
      if (key && value !== undefined) {
        setStorage(key as string, value);
      }
      res.status(200).json({ success: true });
      break;
    
    default:
      res.status(400).json({ error: 'Invalid action' });
  }
}
