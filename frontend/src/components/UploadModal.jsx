import React, { useState, useRef } from 'react';
import { UploadCloud, X, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const isExtensionValid = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
    
    if (validTypes.includes(selectedFile.type) || isExtensionValid) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Invalid format. Please upload a PDF, DOCX, or TXT file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    
    try {
      await onUpload(file);
      setFile(null);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => !isUploading && onClose()}
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          className="glass-panel w-full max-w-lg rounded-3xl p-1 relative overflow-hidden z-10"
        >
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
          
          <div className="bg-[#0a0a0f] rounded-[22px] p-8 relative h-full">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              disabled={isUploading}
            >
              <X size={18} />
            </button>
            
            <h2 className="text-2xl font-bold font-['Outfit'] mb-2 text-white">Upload Knowledge</h2>
            <p className="text-sm text-gray-400 mb-8 font-['Inter']">Add data to the AI's semantic search corpus.</p>
            
            <div 
              className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${
                dragActive ? 'border-cyan-500 bg-cyan-500/5 scale-[1.02]' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              } ${file ? 'border-green-500/50 bg-green-500/5' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !file && inputRef.current?.click()}
            >
              <input 
                ref={inputRef}
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.txt"
                onChange={handleChange}
                disabled={isUploading}
              />
              
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div 
                    key="file"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                        <FileText size={36} strokeWidth={1.5} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white border-4 border-[#0a0a0f]">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                    <p className="text-base font-medium text-white break-all mb-1 font-['Outfit']">{file.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    
                    {!isUploading && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="mt-5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl"
                      >
                        Remove file
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center pointer-events-none"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 text-cyan-400 rounded-full flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(6,182,212,0.1)] group-hover:scale-110 transition-transform duration-500">
                      <UploadCloud size={36} strokeWidth={1.5} />
                    </div>
                    <p className="text-base font-medium text-gray-200 mb-2 font-['Outfit']">Drag & drop your document</p>
                    <p className="text-xs text-gray-500 px-4 leading-relaxed">
                      Supported formats: PDF, DOCX, TXT.<br/>Maximum file size: 10MB.
                    </p>
                    
                    <div className="mt-6 px-6 py-2.5 rounded-xl bg-white/5 text-sm font-medium text-white border border-white/10 pointer-events-auto hover:bg-white/10 transition-colors">
                      Browse Files
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}
            
            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                disabled={!file || isUploading}
                className={`relative overflow-hidden px-8 py-3 rounded-xl text-sm font-bold flex items-center justify-center min-w-[140px] transition-all duration-300 ${
                  !file || isUploading 
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
                    : 'bg-white text-black hover:bg-gray-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : 'Upload to Corpus'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
