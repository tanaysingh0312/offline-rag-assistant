from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def chunk_text(documents: list[Document]) -> list[Document]:
    # Fix from bug challenge: chunk_overlap < chunk_size
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=50
    )
    
    chunks = splitter.split_documents(documents)
    
    # Assign unique chunk IDs per file
    file_chunk_counts = {}
    for chunk in chunks:
        filename = chunk.metadata.get("filename", "unknown")
        if filename not in file_chunk_counts:
            file_chunk_counts[filename] = 0
        file_chunk_counts[filename] += 1
        chunk.metadata["chunk_id"] = str(file_chunk_counts[filename])
        
    return chunks
