"""Processing API router for synthetic data generation and AI analysis."""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Optional
from datetime import datetime
from app.services.processing_pipeline import ProcessingPipeline

router = APIRouter(prefix="/processing", tags=["processing"])
pipeline = ProcessingPipeline()


@router.post("/generate-data")
async def generate_synthetic_data(
    document_count: int = 10,
    log_count: int = 50,
    replace_existing: bool = False
):
    """Generate synthetic compliance documents and operational logs."""
    try:
        from pathlib import Path
        import json
        
        # If replace_existing is False, load existing documents and append
        if not replace_existing:
            data_path = Path(__file__).parent.parent.parent / "data" / "sample_documents.json"
            if data_path.exists():
                with open(data_path, "r") as f:
                    existing_docs = json.load(f)
                # Only generate new documents if we need more
                if len(existing_docs) >= document_count:
                    return {
                        "success": True,
                        "message": f"Using existing {len(existing_docs)} documents. Set replace_existing=true to regenerate.",
                        "documents_generated": len(existing_docs),
                        "logs_generated": 0,
                        "timestamp": datetime.now().isoformat()
                    }
        
        result = pipeline.generate_synthetic_data(document_count, log_count)
        return {
            "success": True,
            "message": f"Generated {result['documents_generated']} documents and {result['logs_generated']} operational logs",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating data: {str(e)}")


@router.post("/analyze-documents")
async def analyze_all_documents():
    """Process all documents through AI analysis."""
    try:
        analyses = pipeline.process_all_documents()
        return {
            "success": True,
            "message": f"Analyzed {len(analyses)} documents",
            "count": len(analyses),
            "analyses": [a.to_dict() for a in analyses]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing documents: {str(e)}")


@router.post("/generate-alerts")
async def generate_alerts_from_logs():
    """Generate alerts from operational logs."""
    try:
        alerts = pipeline.generate_alerts_from_logs()
        return {
            "success": True,
            "message": f"Generated {len(alerts)} alerts",
            "count": len(alerts),
            "alerts": [a.to_dict() for a in alerts]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating alerts: {str(e)}")


@router.post("/initialize-samples")
async def initialize_sample_documents(
    document_count: int = 20
):
    """Initialize the application with sample documents (uses synthetic data generator, not hardcoded)."""
    try:
        from app.services.synthetic_data_generator import SyntheticDataGenerator
        generator = SyntheticDataGenerator()
        
        # Generate diverse sample documents
        documents = generator.generate_documents(
            count=document_count,
            categories=["Environmental", "Safety", "Data Privacy", "Financial", "Quality", "Health", "Security", "Regulatory"]
        )
        
        # Save documents
        from pathlib import Path
        data_dir = Path(__file__).parent.parent.parent / "data"
        data_dir.mkdir(exist_ok=True)
        generator.save_documents(documents, data_dir / "sample_documents.json")
        
        # Analyze all documents
        analyses = pipeline.process_all_documents()
        
        return {
            "success": True,
            "message": f"Initialized with {len(documents)} sample documents",
            "documents_generated": len(documents),
            "documents_analyzed": len(analyses),
            "categories": {doc["category"] for doc in documents},
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing samples: {str(e)}")


@router.post("/run-pipeline")
async def run_full_pipeline(
    generate_new_data: bool = False,
    document_count: int = 10,
    log_count: int = 50
):
    """Run the complete processing pipeline."""
    try:
        result = pipeline.run_full_pipeline(
            generate_new_data=generate_new_data,
            document_count=document_count,
            log_count=log_count
        )
        return {
            "success": True,
            "message": "Pipeline completed successfully",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running pipeline: {str(e)}")

