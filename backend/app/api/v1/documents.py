"""Documents API router."""
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List
import json
from pathlib import Path
from datetime import datetime
import uuid

from app.models.document import Document, DocumentAnalysis
from app.services.nlp_service import NLPService

router = APIRouter(prefix="/documents", tags=["documents"])
nlp_service = NLPService()

# Load documents from JSON file
def _load_documents() -> List[dict]:
    """Load documents from JSON file."""
    data_path = Path(__file__).parent.parent.parent / "data" / "sample_documents.json"
    if data_path.exists():
        with open(data_path, "r") as f:
            return json.load(f)
    return []

def _save_documents(documents: List[dict]):
    """Save documents to JSON file."""
    data_path = Path(__file__).parent.parent.parent / "data" / "sample_documents.json"
    with open(data_path, "w") as f:
        json.dump(documents, f, indent=2)


@router.get("/")
async def get_documents():
    """Get all documents."""
    documents = _load_documents()
    result = []
    for doc in documents:
        document = Document(**doc, created_at=datetime.now())
        result.append(document.to_dict())
    return result


@router.get("/{document_id}")
async def get_document(document_id: str):
    """Get a specific document by ID."""
    documents = _load_documents()
    document = next((doc for doc in documents if doc["id"] == document_id), None)
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc_obj = Document(**document, created_at=datetime.now())
    return doc_obj.to_dict()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = None,
    category: str = "Regulatory"
):
    """Upload and process a document file."""
    try:
        # Read file content
        content = await file.read()
        text_content = content.decode('utf-8')
        
        # Generate document ID
        doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
        
        # Use filename as title if not provided
        if not title:
            title = file.filename or "Uploaded Document"
        
        # Create document
        document_data = {
            "id": doc_id,
            "title": title,
            "body": text_content,
            "category": category,
            "published_at": datetime.now().strftime("%Y-%m-%d")
        }
        
        # Load existing documents
        documents = _load_documents()
        
        # Add new document
        documents.append(document_data)
        
        # Save documents
        _save_documents(documents)
        
        # Analyze the document
        analysis = nlp_service.analyze_document(
            document_id=doc_id,
            text=text_content,
            category=category
        )
        
        return {
            "success": True,
            "document": Document(**document_data, created_at=datetime.now()).to_dict(),
            "analysis": analysis.to_dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading document: {str(e)}")


@router.post("/analyze")
async def analyze_document(document_id: str = None):
    """Analyze a document using NLP."""
    if not document_id:
        raise HTTPException(status_code=400, detail="document_id parameter is required")
    
    documents = _load_documents()
    document = next((doc for doc in documents if doc["id"] == document_id), None)
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    analysis = nlp_service.analyze_document(
        document_id=document_id,
        text=document["body"],
        category=document["category"]
    )
    
    return analysis.to_dict()

