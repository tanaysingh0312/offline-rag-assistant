import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import UploadModal from './components/UploadModal';
import { useDocMind } from './hooks/useDocMind';

function App() {
  const { 
    documents, 
    fetchDocuments, 
    uploadDocument, 
    deleteDocument, 
    queryDocuments 
  } = useDocMind();
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isQuerying, setIsQuerying] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleQuery = async (query) => {
    const userMsg = { role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setIsQuerying(true);

    try {
      const response = await queryDocuments(query);
      
      const aiMsg = { 
        role: 'assistant', 
        content: response.answer,
        sources: response.sources
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error communicating with the neural engine." 
      }]);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f] text-gray-200 selection:bg-cyan-500/30 font-['Inter']">
      <Sidebar 
        documents={documents} 
        onDelete={deleteDocument}
        onOpenUpload={() => setIsUploadModalOpen(true)} 
      />
      
      <ChatWindow 
        messages={messages} 
        onQuery={handleQuery}
        isQuerying={isQuerying}
      />
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={uploadDocument}
      />
    </div>
  );
}

export default App;
