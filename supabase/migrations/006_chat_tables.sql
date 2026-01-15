-- ============================================
-- 迁移 006: 创建聊天系统表
-- chat_contacts, messages
-- ============================================

-- 聊天联系人表
CREATE TABLE IF NOT EXISTS chat_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_avatar TEXT,
  last_message TEXT,
  last_message_time TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'climbing')),
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES chat_contacts(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 索引
-- ============================================

CREATE INDEX IF NOT EXISTS idx_chat_contacts_user_id ON chat_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_contacts_contact_id ON chat_contacts(contact_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_contact_id ON messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ============================================
-- 触发器：更新 chat_contacts 的 updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_chat_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_contacts_updated_at
  BEFORE UPDATE ON chat_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_contacts_updated_at();

-- ============================================
-- 触发器：更新最后消息时间
-- ============================================

CREATE OR REPLACE FUNCTION update_last_message_time()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_contacts 
  SET 
    last_message = NEW.text,
    last_message_time = NEW.created_at,
    updated_at = NOW()
  WHERE id = NEW.contact_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_message_time
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_message_time();