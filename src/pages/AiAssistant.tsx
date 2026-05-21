
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
    
    // user message push directly in the frontend state
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: currentTime
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    //ai typing indicator just for ui/uxpurpose,to be replaced by actual api call and response handling logic in the future
    setIsTyping(true);

    // axios.post('/api/ai', { message: input })  place this call in the future
    // and update setIsTyping(false) after receiving the response.
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-[#0b1120] text-white p-4 md:p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Chat Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-blue-500/20">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight"> AI Assistant</h2>
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-400">Ready for Backend Integration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-400">
          <Sparkles size={14} />
          <span>UI Interface Sandbox</span>
        </div>
      </div>

      {/* Chat Message Window (Scrollable Box) */}
      <div className="flex-1 py-6 pr-2 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
              msg.sender === 'user' 
                ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              {msg.sender === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
            </div>

            {/* Message Bubble */}
            <div className="space-y-1">
              <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
                  : 'bg-[#111827] text-slate-200 border border-slate-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <p className={`text-[10px] text-slate-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* AI Typing Progress Indicator */}
        {isTyping && (
          <div className="flex gap-4 max-w-[70%] mr-auto">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 border rounded-full bg-slate-800 border-slate-700 text-slate-300">
              <Bot size={16} />
            </div>
            <div className="bg-[#111827] border border-slate-800 p-4 rounded-3xl rounded-tl-none flex items-center gap-1.5 px-5">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Message Input Bar */}
      <form onSubmit={handleSend} className="pt-4 mt-4 border-t border-slate-800">
        <div className="relative flex items-center bg-[#111827] border border-slate-800 rounded-2xl focus-within:border-blue-500/50 transition-all px-4 py-2 shadow-inner">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message to AI Assistant..."
            className="w-full py-2 pr-12 text-sm text-white bg-transparent outline-none placeholder-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-3 p-2.5 rounded-xl transition-all ${
              input.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 active:scale-95' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </form>

    </div>
  );
};

export default AiAssistant