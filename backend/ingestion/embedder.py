from langchain_openai import OpenAIEmbeddings
import os

def get_embedder():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your_openai_api_key_here":
        # Fallback to local if no API key is provided for easier testing
        from langchain_community.embeddings import HuggingFaceEmbeddings
        return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    # Fix from bug challenge: Embeddings model must be an embedding model, not a chat model
    return OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=api_key)

# The actual embedding is implicitly handled by Chroma when we pass the embedder
