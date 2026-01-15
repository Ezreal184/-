import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message, ChatContact } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getChatContacts, getMessages, sendMessage } from '../services/chatService';

const MOCK_CONTACTS: ChatContact[] = [
  { id: 'ai-basecamp', name: 'Basecamp AI', avatar: 'https://images.unsplash.com/photo-1675429159040-34825946c77a?auto=format&fit=crop&q=80&w=200', lastMessage: '你好，我是你的探险助手。', status: 'online', isAI: true },
  { id: 'climber-1', name: 'Alex Honnold', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', lastMessage: '那段路线的摩擦力怎么样？', status: 'climbing' },
  { id: 'climber-2', name: 'Jimmy Chin', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', lastMessage: '照片已上传到 Journal。', status: 'online' },
  { id: 'climber-3', name: 'Nimsdai Purja', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', lastMessage: '冲顶窗口已开启。', status: 'offline' },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'ai-basecamp': [
    { id: '1', senderId: 'ai-basecamp', text: '你好！欢迎来到大本营通信频道。我可以为你分析地形、预测天气或提供装备建议。', timestamp: '10:00 AM', isAI: true }
  ],
  'climber-1': [
    { id: '2', senderId: 'climber-1', text: '嘿，你看到那张关于酋长岩北壁的新照片了吗？', timestamp: '昨天', isAI: false }
  ]
};

const ChatView: React.FC = () => {
  const { user } = useAuth();
  const [activeContactId, setActiveContactId] = useState(MOCK_CONTACTS[0].id);
  const [contacts, setContacts] = useState<ChatContact[]>(MOCK_CONTACTS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find(c => c.id === activeContactId)!;
  const currentMessages = messages[activeContactId] || [];

  // 加载联系人和消息
  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  useEffect(() => {
    if (activeContactId && user) {
      loadMessages(activeContactId);
    }
  }, [activeContactId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isMobileChatActive]);

  const loadContacts = async () => {
    if (!user) return;
    
    try {
      const realContacts = await getChatContacts(user.id);
      // 合并真实联系人和模拟联系人
      setContacts([...MOCK_CONTACTS, ...realContacts]);
    } catch (error) {
      console.error('加载联系人失败:', error);
      // 使用模拟数据作为后备
    }
  };

  const loadMessages = async (contactId: string) => {
    if (!user || MOCK_CONTACTS.some(c => c.id === contactId)) {
      // 对于模拟联系人，使用初始消息
      return;
    }

    try {
      setLoading(true);
      const realMessages = await getMessages(contactId);
      setMessages(prev => ({
        ...prev,
        [contactId]: realMessages
      }));
    } catch (error) {
      console.error('加载消息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    setIsMobileChatActive(true);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), userMsg]
    }));
    setInputText('');

    // 如果是真实联系人，发送到数据库
    if (user && !MOCK_CONTACTS.some(c => c.id === activeContactId)) {
      try {
        await sendMessage(user.id, activeContactId, inputText);
      } catch (error) {
        console.error('发送消息失败:', error);
      }
    }

    // AI 响应逻辑
    if (activeContact.isAI) {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: `作为一个登山大本营的AI助手，回答登山者的咨询：${inputText}`,
        });
        
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: activeContact.id,
          text: response.text || '信号中断，请稍后再试。',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAI: true
        };

        setMessages(prev => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), aiMsg]
        }));
      } catch (err) {
        console.error('AI响应失败:', err);
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: activeContact.id,
          text: '抱歉，AI助手暂时不可用。请稍后再试。',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAI: true
        };
        setMessages(prev => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), errorMsg]
        }));
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] max-w-[1600px] mx-auto p-4 md:p-12 flex gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 overflow-hidden">
      
      {/* 左侧：联系人列表 - 在移动端激活聊天时隐藏 */}
      <div className={`
        w-full lg:w-[400px] flex flex-col bg-zinc-900/50 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl transition-all duration-500
        ${isMobileChatActive ? 'hidden lg:flex' : 'flex'}
      `}>
        <div className="p-8 md:p-10 border-b border-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-[1em] text-accent mb-4 md:mb-6">Expedition Base</h3>
          <h2 className="text-2xl md:text-3xl font-black font-display italic uppercase tracking-tighter text-white leading-none">Radio Channels</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 md:py-6">
          {contacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact.id)}
              className={`w-full flex items-center gap-4 md:gap-6 px-6 md:px-10 py-6 md:py-8 transition-all relative group
                ${activeContactId === contact.id ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}
            >
              <div className="relative shrink-0">
                <div className={`size-12 md:size-16 rounded-2xl overflow-hidden border-2 transition-all ${activeContactId === contact.id ? 'border-accent shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'border-white/10 group-hover:border-white/30'}`}>
                  <img src={contact.avatar} className="w-full h-full object-cover" />
                </div>
                <div className={`absolute -bottom-1 -right-1 size-3 md:size-4 rounded-full border-2 border-black
                  ${contact.status === 'online' ? 'bg-green-500' : contact.status === 'climbing' ? 'bg-accent animate-pulse' : 'bg-zinc-600'}`} 
                />
              </div>
              
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-widest truncate">{contact.name}</h4>
                  {contact.isAI && <span className="text-[7px] md:text-[8px] bg-accent/20 text-accent px-1.5 md:px-2 py-0.5 rounded font-black uppercase tracking-tighter">AI</span>}
                </div>
                <p className="text-[10px] md:text-[11px] text-zinc-500 font-medium truncate group-hover:text-zinc-400 transition-colors italic">
                  {contact.lastMessage}
                </p>
              </div>

              {activeContactId === contact.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-[0_0_10px_#22d3ee] hidden lg:block" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 右侧：聊天主界面 - 在移动端未激活聊天时隐藏 */}
      <div className={`
        flex-1 flex flex-col bg-zinc-900/40 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative transition-all duration-500
        ${isMobileChatActive ? 'flex animate-in slide-in-from-right-4' : 'hidden lg:flex'}
      `}>
        
        {/* 对话框头部 */}
        <div className="p-6 md:px-12 md:py-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-4 md:gap-6">
            {/* 移动端专用返回按钮 */}
            <button 
              onClick={() => setIsMobileChatActive(false)}
              className="lg:hidden size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <div className="size-10 md:size-14 rounded-2xl overflow-hidden border border-white/10 shrink-0">
              <img src={activeContact.avatar} className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm md:text-xl font-black text-white uppercase tracking-widest truncate">{activeContact.name}</h3>
              <p className="text-[8px] md:text-[9px] font-bold text-accent uppercase tracking-[0.2em] md:tracking-[0.4em] flex items-center gap-2">
                <span className={`size-1 md:size-1.5 rounded-full ${activeContact.status === 'online' ? 'bg-green-500' : 'bg-accent animate-pulse'}`} />
                {activeContact.status === 'online' ? 'Connected' : activeContact.status === 'climbing' ? 'On Ascent' : 'Encrypted'}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex gap-4">
            <button className="size-10 md:size-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg md:text-xl">encrypted</span>
            </button>
            <button className="size-10 md:size-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg md:text-xl">settings</span>
            </button>
          </div>
        </div>

        {/* 消息展示流 */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-16 space-y-8 md:space-y-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-500`}
              >
                <div 
                  className={`max-w-[85%] md:max-w-[60%] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-base md:text-lg font-light leading-relaxed italic
                    ${msg.senderId === 'me' 
                      ? 'bg-accent/10 border border-accent/30 text-white rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none'}`}
                >
                  {msg.text}
                </div>
                <span className="mt-3 text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{msg.timestamp}</span>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex flex-col items-start animate-pulse">
              <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] md:rounded-[2rem] rounded-tl-none flex gap-2">
                <div className="size-1 md:size-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="size-1 md:size-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="size-1 md:size-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 底部输入框 */}
        <div className="p-4 md:p-12 md:pt-0 relative z-10">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 md:gap-6 glass-premium px-6 md:px-10 py-4 md:py-6 rounded-full border border-white/10 group focus-within:border-accent/50 transition-all shadow-2xl"
          >
            <button type="button" className="text-zinc-500 hover:text-white transition-colors shrink-0">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Transmit signal..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-lg font-light italic placeholder:text-zinc-700 text-white"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="size-10 md:size-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-accent transition-all disabled:opacity-20 shadow-xl active:scale-90 shrink-0"
            >
              <span className="material-symbols-outlined text-xl md:text-2xl">send</span>
            </button>
          </form>
        </div>

        {/* 背景氛围纹理 - 在移动端缩小以免干扰阅读 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] md:opacity-[0.03] select-none">
          <span className="material-symbols-outlined text-[20rem] md:text-[40rem] absolute -bottom-20 md:-bottom-40 -right-20 md:-right-40">radio</span>
        </div>
      </div>
    </div>
  );
};

export default ChatView;