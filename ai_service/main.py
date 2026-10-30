import os
import shutil
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from rag_engine import CampusIQRAGEngine

load_dotenv()

app = FastAPI(
    title="CampusIQ AI & RAG Engine",
    description="Intelligent Knowledge Retrieval & RAG Service for CampusIQ Platform",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Engine
rag_engine = CampusIQRAGEngine()

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 4

class RetrieveRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

@app.get("/")
def root():
    return {
        "service": "CampusIQ AI & RAG Engine",
        "status": "operational",
        "total_documents": len(rag_engine.documents),
        "docs_url": "/docs"
    }

@app.get("/api/rag/status")
def get_status():
    categories = {}
    for doc in rag_engine.documents:
        categories[doc.category] = categories.get(doc.category, 0) + 1

    llm_provider = "Synthesized RAG Fallback (Local Verified)"
    if os.getenv("GROQ_API_KEY"):
        llm_provider = "Groq"
    elif os.getenv("OPENAI_API_KEY"):
        llm_provider = "OpenAI"
    elif os.getenv("GEMINI_API_KEY"):
        llm_provider = "Gemini"

    return {
        "status": "healthy",
        "total_chunks": len(rag_engine.documents),
        "vector_index_active": rag_engine.vectorizer is not None,
        "categories": categories,
        "llm_provider": llm_provider
    }

@app.post("/api/rag/query")
def rag_query(request: QueryRequest):
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = rag_engine.generate_answer(request.query)
    return result

@app.post("/api/rag/retrieve")
def semantic_retrieve(request: RetrieveRequest):
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    docs = rag_engine.retrieve(request.query, top_k=request.top_k)
    return {"query": request.query, "results_count": len(docs), "documents": docs}

@app.get("/api/rag/documents")
def list_documents():
    return [
        {
            "doc_id": d.doc_id,
            "title": d.title,
            "category": d.category,
            "source": d.source,
            "page": d.page,
            "content_preview": d.content[:150] + "..." if len(d.content) > 150 else d.content
        }
        for d in rag_engine.documents
    ]

@app.post("/api/rag/ingest")
async def ingest_document(
    file: UploadFile = File(...),
    category: str = Form("Academic Document")
):
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    temp_path = os.path.join(upload_dir, file.filename)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        if file.filename.lower().endswith(".pdf"):
            added_chunks = rag_engine.ingest_pdf(temp_path, file.filename, category=category)
        else:
            with open(temp_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            doc_id = f"DOC_{len(rag_engine.documents)+1}"
            from rag_engine import RAGDocument
            rag_engine.documents.append(RAGDocument(
                doc_id=doc_id,
                title=file.filename,
                category=category,
                content=content,
                source=file.filename,
                page=1,
                metadata={"filename": file.filename}
            ))
            rag_engine.rebuild_vector_index()
            added_chunks = 1

        return {
            "success": True,
            "message": f"Successfully ingested {file.filename}",
            "chunks_added": added_chunks,
            "total_chunks_now": len(rag_engine.documents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
