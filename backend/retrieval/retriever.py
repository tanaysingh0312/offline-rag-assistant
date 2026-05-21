from store.chroma_store import get_vectorstore
from langchain_core.documents import Document

def retrieve_context(query: str) -> list[Document]:
    vectorstore = get_vectorstore()
    
    # Fix from bug challenge: Retrieve k=5 chunks, apply MMR to reduce redundancy
    retriever = vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 5, "fetch_k": 20}
    )
    
    try:
        docs = retriever.invoke(query)
        return docs
    except Exception as e:
        print(f"Error retrieving context: {e}")
        return []
