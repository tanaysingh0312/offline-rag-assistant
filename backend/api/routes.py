import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List

from ingestion.parser import parse_document
from ingestion.chunker import chunk_text
from ingestion.embedder import get_embedder
from store.chroma_store import add_chunks, list_documents, delete_document_by_id
from retrieval.retriever import retrieve_context
from retrieval.llm import generate_answer

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[dict]

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
        
    try:
        # Parse
        docs = parse_document(file_path, file.filename)
        # Chunk
        chunks = chunk_text(docs)
        # Embed and Store
        add_chunks(chunks)
        
        return {"filename": file.filename, "chunks_processed": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@router.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    try:
        # Retrieve context
        retrieved = retrieve_context(request.query)
        if not retrieved:
            return QueryResponse(
                answer="I couldn't find any relevant information in the uploaded documents.", 
                sources=[]
            )
            
        # Generate Answer
        answer = generate_answer(request.query, retrieved)
        
        sources = [
            {
                "filename": doc.metadata.get("filename", "Unknown"),
                "chunk_id": doc.metadata.get("chunk_id", "0"),
                "page": doc.metadata.get("page_number", 1)
            }
            for doc in retrieved
        ]
        
        # Deduplicate sources based on filename and chunk_id
        unique_sources = []
        seen = set()
        for s in sources:
            key = (s["filename"], s["chunk_id"])
            if key not in seen:
                seen.add(key)
                unique_sources.append(s)
                
        return QueryResponse(answer=answer, sources=unique_sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.get("/documents")
async def get_documents():
    try:
        docs = list_documents()
        return {"documents": docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    try:
        delete_document_by_id(doc_id)
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
