import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hi! I'm your village guide. Ask me anything!", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [hasUnread, setHasUnread] = useState(true);
  
  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Proactive random messages
  useEffect(() => {
    const proactiveMessages = [
      "How was your day?",
      "Wanna know legal ways to earn money?",
      "Explore how stocks are issued?",
      "Have you checked your daily quests?",
      "Did you know compounding can double your wealth?",
    ];
    
    const interval = setInterval(() => {
      // Only send a proactive message randomly (e.g., 30% chance every 30 seconds)
      if (Math.random() > 0.7) {
        const randomMsg = proactiveMessages[Math.floor(Math.random() * proactiveMessages.length)];
        const newMsg: Message = { id: Date.now().toString(), text: randomMsg, sender: 'ai' };
        setMessages(prev => [...prev, newMsg]);
        if (!isOpen) setHasUnread(true);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3000/api/guide/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const data = await response.json();
      const aiMsg: Message = { id: (Date.now() + 1).toString(), text: data.reply, sender: 'ai' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      const fallbackMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: error.message || "Sorry, I'm having trouble right now — try again in a moment.", 
        sender: 'ai' 
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[380px] sm:w-[500px] h-[600px] max-h-[85vh] bg-[#F2F2F7] rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                  <img 
                    src="/ai-avatar.png" 
                    alt="AI Assistant" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Bot className="w-6 h-6 m-2 text-slate-400 hidden" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-none mb-1">Village Guide</h3>
                  <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-widest">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 shrink-0 border border-slate-200 bg-white">
                      <img 
                        src="/ai-avatar.png" 
                        alt="AI" 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                      />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[75%] px-4 py-2.5 rounded-[20px] text-[15px] leading-relaxed shadow-sm
                      ${msg.sender === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-sm' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 shrink-0 border border-slate-200 bg-white">
                     <img src="/ai-avatar.png" alt="AI" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-[20px] rounded-bl-sm flex space-x-1 shadow-sm">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-slate-200">
              <div className="flex items-center bg-[#F2F2F7] rounded-full px-4 py-2 border border-slate-300 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me a question..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-500 text-[15px] py-1"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 ml-2 transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-xl border-[4px] border-[#8D6E63] overflow-hidden flex items-center justify-center relative group"
      >
        <img 
          src="/ai-avatar.png" 
          alt="AI Assistant" 
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
        <MessageSquare className="w-8 h-8 text-[#8D6E63] hidden" />
        
        {/* Notification dot */}
        {(!isOpen && hasUnread) && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </motion.button>

    </div>
  );
}
