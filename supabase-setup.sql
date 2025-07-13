-- Create visitor_stats table to store total visit count
CREATE TABLE IF NOT EXISTS visitor_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_visits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row
INSERT INTO visitor_stats (id, total_visits) 
VALUES (1, 0) 
ON CONFLICT (id) DO NOTHING;

-- Create active_visitors table to track current online users
CREATE TABLE IF NOT EXISTS active_visitors (
  id SERIAL PRIMARY KEY,
  visitor_id TEXT UNIQUE NOT NULL,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen ON active_visitors(last_seen);
CREATE INDEX IF NOT EXISTS idx_active_visitors_visitor_id ON active_visitors(visitor_id);

-- Enable Row Level Security (optional, for better security)
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_visitors ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (adjust as needed)
CREATE POLICY "Allow public read access" ON visitor_stats FOR SELECT USING (true);
CREATE POLICY "Allow public update access" ON visitor_stats FOR UPDATE USING (true);
CREATE POLICY "Allow public insert access" ON visitor_stats FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON active_visitors FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON active_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON active_visitors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON active_visitors FOR DELETE USING (true);
