from langchain_community.vectorstores import Chroma
from ingestion.embedder import get_embedder
from langchain_core.documents import Document
import os

persist_directory = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

def get_vectorstore():
    embedder = get_embedder()
    return Chroma(
        collection_name="docmind_collection",
        embedding_function=embedder,
        persist_directory=persist_directory
    )

def add_chunks(chunks: list[Document]):
    vectorstore = get_vectorstore()
    vectorstore.add_documents(chunks)
    # Chroma in modern versions auto-persists, but good practice if needed

def list_documents():
    vectorstore = get_vectorstore()
    # To list documents, we'll extract unique filenames from the metadata
    try:
        collection = vectorstore._collection
        results = collection.get(include=['metadatas'])
        metadatas = results.get('metadatas', [])
        
        docs = {}
        for meta in metadatas:
            if not meta: continue
            filename = meta.get("filename")
            if not filename: continue
            
            if filename not in docs:
                docs[filename] = {"filename": filename, "chunks": 0}
            docs[filename]["chunks"] += 1
            
        return list(docs.values())
    except Exception as e:
        print(f"Error listing documents: {e}")
        return []

def delete_document_by_id(filename: str):
    vectorstore = get_vectorstore()
    collection = vectorstore._collection
    
    # Get IDs of all chunks for this filename
    results = collection.get(
        where={"filename": filename},
        include=["metadatas"]
    )
    
    ids_to_delete = results.get("ids", [])
    if ids_to_delete:
        collection.delete(ids=ids_to_delete)
