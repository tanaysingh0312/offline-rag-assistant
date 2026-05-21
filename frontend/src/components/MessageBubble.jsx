import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Zap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex gap-5 max-w-4xl mx-auto w-full group ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 z-10 ${
        isUser 
          ? 'bg-gradient-to-br from-white/20 to-white/5 border border-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
          : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)]'
      }`}>
        {!isUser ? (
          <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center">
             <Zap size={18} className="text-cyan-400" fill="currentColor" fillOpacity={0.2} />
          </div>
        ) : (
          <User size={18} />
        )}
      </div>
      
      <div className={`flex flex-col gap-2.5 max-w-[85%] relative ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-6 py-4 rounded-3xl backdrop-blur-md text-[15px] leading-relaxed shadow-lg ${
          isUser 
            ? 'bg-white/10 text-white rounded-tr-sm border border-white/10' 
            : 'bg-white/[0.03] text-gray-200 rounded-tl-sm border border-white/[0.05] relative overflow-hidden'
        }`}>
          {!isUser && (
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none"></div>
          )}
          
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl max-w-none relative z-10 font-['Inter']">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-1 w-full">
            <button 
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-cyan-400 transition-colors bg-white/[0.02] hover:bg-white/[0.05] px-4 py-2 rounded-full border border-white/[0.05]"
            >
              <BookOpen size={14} className={showSources ? "text-cyan-400" : ""} />
              <span className="tracking-wide">{message.sources.length} {message.sources.length === 1 ? 'CITATION' : 'CITATIONS'}</span>
              <motion.div animate={{ rotate: showSources ? 180 : 0 }}>
                <ChevronDown size={14} />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {showSources && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 flex flex-col gap-2 pt-1 pb-2">
                    {message.sources.map((source, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx} 
                        className="flex items-center justify-between bg-black/40 border border-white/5 px-4 py-3 rounded-xl group hover:border-cyan-500/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                             <FileText size={14} className="text-cyan-400" />
                          </div>
                          <span className="font-semibold text-sm text-gray-300 font-['Outfit']">{source.filename}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400/70 bg-cyan-400/10 px-2 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest border border-cyan-400/20">
                            PG {source.page}
                          </span>
                          <span className="text-purple-400/70 bg-purple-400/10 px-2 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest border border-purple-400/20">
                            CHUNK {source.chunk_id}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Need to import FileText since I used it inside the component mapping
import { FileText } from 'lucide-react';
