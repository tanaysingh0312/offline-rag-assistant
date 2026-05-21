from langchain_community.chat_models import ChatOllama
from langchain_core.documents import Document

def generate_answer(query: str, retrieved_docs: list[Document]) -> str:
    # Use local Ollama model qwen3
    llm = ChatOllama(
        model="qwen3",
        temperature=0.0
    )
    
    # Construct context from chunks
    context_parts = []
    for doc in retrieved_docs:
        filename = doc.metadata.get('filename', 'Unknown')
        chunk_id = doc.metadata.get('chunk_id', '0')
        context_parts.append(f"[Source: {filename}, Chunk: {chunk_id}]\n{doc.page_content}\n")
        
    context_str = "\n".join(context_parts)
    
    system_prompt = (
        "You are a helpful assistant. Answer the question using ONLY the provided context. "
        "If the context does not fully answer the question, say what you found and clearly state what is missing. "
        "Always cite the source document and chunk."
    )
    
    prompt = f"{system_prompt}\n\nContext:\n{context_str}\n\nQuestion: {query}"
    
    try:
        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        return f"Error generating answer: {str(e)}"
