import React from 'react';
import { FileText, Trash2, Zap, Upload, Layers, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ documents, onDelete, onOpenUpload }) {
  return (
    <div className="w-80 glass-panel border-r-0 border-y-0 h-screen flex flex-col flex-shrink-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      {/* Abstract top glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none"></div>

      <div className="p-7 relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center">
              <Zap className="text-cyan-400" size={24} fill="currentColor" fillOpacity={0.2} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-['Outfit'] text-gradient tracking-tight">
              DocMind AI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold mt-0.5">Neural Engine</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenUpload}
          className="w-full relative group overflow-hidden rounded-xl p-[1px]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-[#0f0f16] hover:bg-[#13131c] transition-colors duration-300 w-full h-full rounded-xl py-3 px-4 flex items-center justify-center gap-2">
            <Upload size={18} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span className="font-semibold text-gray-100 text-sm">Upload Context</span>
          </div>
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5 custom-scrollbar relative z-10">
        <div className="flex items-center justify-between mb-4 mt-2 px-2">
          <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Layers size={12} /> Data Corpus
          </h2>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
            {documents.length} FILES
          </span>
        </div>

        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {documents.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]"
              >
                <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="text-gray-500" size={20} />
                </div>
                <p className="text-sm font-medium text-gray-300 font-['Outfit']">Empty Corpus</p>
                <p className="text-xs text-gray-500 mt-1">Ingest documents to begin semantic search.</p>
              </motion.div>
            ) : (
              documents.map((doc, i) => (
                <motion.div
                  key={doc.filename}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-3 flex items-center gap-3 border border-white/[0.05] hover:border-cyan-500/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <FileText size={14} />
                  </div>
                  
                  <div className="flex-1 min-w-0 z-10">
                    <p className="text-sm font-medium text-gray-200 truncate font-['Outfit']" title={doc.filename}>
                      {doc.filename}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.8)] animate-pulse"></span>
                        {doc.chunks} vectors
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDelete(doc.filename)}
                    className="flex-shrink-0 z-10 text-gray-600 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 duration-200"
                    title="Delete document"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Bottom status bar */}
      <div className="p-4 border-t border-white/[0.05] bg-black/20 text-[10px] text-gray-500 font-mono flex justify-between items-center z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> System Online
        </span>
        <span>v2.0.0-PRO</span>
      </div>
    </div>
  );
}
