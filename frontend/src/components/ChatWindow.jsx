import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Loader2, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWindow({ messages, onQuery, isQuerying }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isQuerying]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isQuerying) return;
    
    onQuery(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-float" style={{ animationDuration: '10s' }}></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none animate-float" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
      
      {/* Header */}
      <header className="px-8 py-5 border-b border-white/[0.05] bg-black/40 backdrop-blur-xl z-20 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-['Outfit'] text-white flex items-center gap-2">
            Workspace
            <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-cyan-400 border border-white/10 font-mono flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
               LOCAL QWEN-3
            </span>
          </h2>
          <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase mt-1">Intelligent semantic retrieval system</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar z-10 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="relative w-24 h-24 mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative w-full h-full glass-panel rounded-3xl flex items-center justify-center border-white/20">
                <Sparkles className="text-cyan-400" size={40} strokeWidth={1.5} />
              </div>
            </motion.div>
            
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold font-['Outfit'] text-white mb-3"
            >
              How can I assist?
            </motion.h3>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-base leading-relaxed"
            >
              Upload documents using the sidebar. I will analyze their semantic contents and answer your questions with precise citations.
            </motion.p>
          </div>
        ) : (
          <div className="space-y-10 pb-10">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            {isQuerying && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-5 max-w-4xl mx-auto w-full"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)] flex-shrink-0 mt-1">
                  <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center">
                    <Loader2 size={18} className="text-cyan-400 animate-spin" />
                  </div>
                </div>
                
                <div className="px-6 py-4 glass-panel rounded-3xl rounded-tl-sm flex items-center gap-3">
                  <span className="flex space-x-1.5">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></motion.span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></motion.span>
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></motion.span>
                  </span>
                  <span className="text-sm text-cyan-100/70 font-medium tracking-wide">Synthesizing semantic answer...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 pt-10 relative z-20">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent pointer-events-none"></div>
        
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group z-10"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-sm opacity-30 group-focus-within:opacity-60 transition duration-500"></div>
          
          <div className="relative glass-input rounded-2xl p-2 flex items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Query the knowledge base..."
              className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 max-h-32 min-h-[56px] resize-none focus:outline-none custom-scrollbar text-[15px] font-['Inter']"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isQuerying}
              className={`p-3.5 rounded-xl flex items-center justify-center m-1 transition-all duration-300 flex-shrink-0 ${
                !input.trim() || isQuerying
                  ? 'bg-white/5 text-gray-600'
                  : 'bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              }`}
            >
              <Send size={18} className={input.trim() && !isQuerying ? 'translate-x-[1px] -translate-y-[1px]' : ''} />
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
              AI generations can be inaccurate. Verify sources.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
