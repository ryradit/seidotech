-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread', -- 'unread', 'read', 'replied'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create replies table
CREATE TABLE IF NOT EXISTS replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON contact_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for all users" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON contact_messages
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable all for authenticated users" ON replies
  FOR ALL TO authenticated USING (true);

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE replies;
