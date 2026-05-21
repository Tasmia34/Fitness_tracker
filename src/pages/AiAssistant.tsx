import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/Appcontext';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const AiAssistant = () => {
  const { user } = useAppContext() as any;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.trim().split(' ')[0];

  // initial welcome message when chat is opened
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Hey ${firstName}! 👋 I am your personal AI Health Assistant. How can I help you with your health goals and analytics today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [firstName]);

  // scroll chat history to the bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: currentTime
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
  };

  return (
    // main container: light mode fresh high-contrast look, dark mode deep vibrant space blue
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-gradient-to-b from-white to-slate-50 dark:from-[#0b1120] dark:to-[#070a13] text-slate-900 dark:text-white p-4 md:p-6 rounded-[2.5rem] border-2 border-cyan-500/30 dark:border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden transition-all duration-300">
      
      {/* Chat Header Section */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-cyan-500/20 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {/*glowing niyon gradient icon button   */}
          <div className="flex items-center justify-center w-11 h-11 shadow-lg rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-cyan-500/30 animate-pulse">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">Aura AI</h2>
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-100 animate-ping bg-emerald-400"></span>
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"></span>
              </span>
            </div>
            <p className="text-xs font-bold text-indigo-500 dark:text-cyan-400/80">Ready for Backend Integration</p>
          </div>
        </div>
        
        {/* vibrant niyon badge */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/40 dark:border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-black text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <Sparkles size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span className="uppercase tracking-wider">UI Sandbox</span>
        </div>
      </div>

      {/* Chat Message Window (Scrollable Box) */}
      <div className="flex-1 py-6 pr-2 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/40 dark:scrollbar-thumb-cyan-500/20">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border-2 shadow-md transition-all ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500 text-blue-600 dark:text-cyan-400 shadow-blue-500/10' 
                : 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-indigo-400 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-indigo-500/10'
            }`}>
              {msg.sender === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
            </div>

            {/* Message Bubble */}
            <div className="space-y-1">
              <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed transition-all shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-600/20'
                  : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5 dark:from-slate-900 dark:to-slate-900 text-slate-800 dark:text-slate-200 border-2 border-cyan-500/20 dark:border-slate-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <p className={`text-[10px] font-bold text-slate-400 dark:text-slate-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* AI Typing Progress Indicator */}
        {isTyping && (
          <div className="flex gap-4 max-w-[70%] mr-auto">
            <div className="flex items-center justify-center flex-shrink-0 w-9 h-9 border-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-indigo-400 dark:border-indigo-500 text-indigo-500">
              <Bot size={18} />
            </div>
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 dark:bg-slate-900 border-2 border-cyan-500/20 dark:border-slate-800 p-4 rounded-3xl rounded-tl-none flex items-center gap-2 px-6 shadow-md">
              <span className="w-2.5 h-2.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2.5 h-2.5 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2.5 h-2.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Message Input Bar */}
      <form onSubmit={handleSend} className="pt-4 mt-4 border-t-2 border-cyan-500/10 dark:border-slate-800">
        {/*      bright highlighted niyon input field */}
        <div className="relative flex items-center bg-white dark:bg-[#111827] border-2 border-cyan-500/30 dark:border-slate-800 rounded-2xl focus-within:border-cyan-500 dark:focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all px-4 py-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message to AI Assistant..."
            className="w-full py-2 pr-12 text-sm font-medium text-slate-800 dark:text-white bg-transparent outline-none placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-3 p-2.5 rounded-xl transition-all ${
              input.trim() 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-95' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </form>

    </div>
  );
};

export default AiAssistant;