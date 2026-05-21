import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export function useDocMind() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents`);
      setDocuments(response.data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    }
  }, []);

  const uploadDocument = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      await fetchDocuments();
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (filename) => {
    try {
      await axios.delete(`${API_BASE_URL}/documents/${filename}`);
      await fetchDocuments();
    } catch (err) {
      console.error('Failed to delete document', err);
      throw err;
    }
  };

  const queryDocuments = async (query) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/query`, { query });
      return response.data;
    } catch (err) {
      console.error('Failed to query documents', err);
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    queryDocuments,
  };
}
