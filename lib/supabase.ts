import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://joainipjlpujuoerbjcj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema for visitor tracking
export interface VisitorStats {
  id?: number;
  total_visits: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActiveVisitor {
  id?: number;
  visitor_id: string;
  last_seen: string;
  created_at?: string;
}

// Helper functions for database operations
export async function getTotalVisits(): Promise<number> {
  const { data, error } = await supabase
    .from('visitor_stats')
    .select('total_visits')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching total visits:', error);
    return 0;
  }

  return data?.total_visits || 0;
}

export async function incrementTotalVisits(): Promise<number> {
  // First, try to get current count
  const currentCount = await getTotalVisits();
  const newCount = currentCount + 1;

  // Upsert the new count
  const { data, error } = await supabase
    .from('visitor_stats')
    .upsert({ 
      id: 1, 
      total_visits: newCount,
      updated_at: new Date().toISOString()
    })
    .select('total_visits')
    .single();

  if (error) {
    console.error('Error incrementing visits:', error);
    return currentCount;
  }

  return data?.total_visits || newCount;
}

export async function addActiveVisitor(visitorId: string): Promise<void> {
  const { error } = await supabase
    .from('active_visitors')
    .upsert({
      visitor_id: visitorId,
      last_seen: new Date().toISOString()
    });

  if (error) {
    console.error('Error adding active visitor:', error);
  }
}

export async function removeActiveVisitor(visitorId: string): Promise<void> {
  const { error } = await supabase
    .from('active_visitors')
    .delete()
    .eq('visitor_id', visitorId);

  if (error) {
    console.error('Error removing active visitor:', error);
  }
}

export async function updateVisitorLastSeen(visitorId: string): Promise<void> {
  const { error } = await supabase
    .from('active_visitors')
    .update({ last_seen: new Date().toISOString() })
    .eq('visitor_id', visitorId);

  if (error) {
    console.error('Error updating visitor last seen:', error);
  }
}

export async function getActiveVisitorCount(): Promise<number> {
  // Remove stale visitors (older than 2 minutes)
  const twoMinutesAgo = new Date(Date.now() - 120000).toISOString();
  
  await supabase
    .from('active_visitors')
    .delete()
    .lt('last_seen', twoMinutesAgo);

  // Count current active visitors
  const { count, error } = await supabase
    .from('active_visitors')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error getting active visitor count:', error);
    return 0;
  }

  return count || 0;
}
