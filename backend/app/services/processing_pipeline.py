"""Processing pipeline for automated compliance analysis."""
import json
from datetime import datetime, timedelta
from typing import List, Dict
from pathlib import Path

from app.services.nlp_service import NLPService
from app.services.synthetic_data_generator import SyntheticDataGenerator
from app.models.alert import Alert
from app.models.document import Document, DocumentAnalysis


class ProcessingPipeline:
    """Automated processing pipeline for compliance monitoring."""
    
    def __init__(self):
        self.nlp_service = NLPService()
        self.data_generator = SyntheticDataGenerator()
    
    def generate_synthetic_data(self, document_count: int = 10, log_count: int = 50) -> Dict:
        """Generate synthetic documents and operational logs."""
        documents = self.data_generator.generate_documents(document_count)
        logs = self.data_generator.generate_operational_logs(log_count)
        
        # Save to files
        data_dir = Path(__file__).parent.parent / "data"
        data_dir.mkdir(exist_ok=True)
        
        self.data_generator.save_documents(documents, data_dir / "sample_documents.json")
        self.data_generator.save_operational_logs(logs, data_dir / "operational_logs.json")
        
        return {
            "documents_generated": len(documents),
            "logs_generated": len(logs),
            "timestamp": datetime.now().isoformat()
        }
    
    def process_all_documents(self) -> List[DocumentAnalysis]:
        """Process all documents through NLP analysis."""
        data_path = Path(__file__).parent.parent / "data" / "sample_documents.json"
        
        if not data_path.exists():
            return []
        
        with open(data_path, "r") as f:
            documents_data = json.load(f)
        
        analyses = []
        for doc_data in documents_data:
            analysis = self.nlp_service.analyze_document(
                document_id=doc_data["id"],
                text=doc_data["body"],
                category=doc_data["category"]
            )
            analyses.append(analysis)
        
        return analyses
    
    def generate_alerts_from_logs(self) -> List[Alert]:
        """Generate alerts from operational logs that exceed thresholds."""
        logs_path = Path(__file__).parent.parent / "data" / "operational_logs.json"
        
        if not logs_path.exists():
            return []
        
        with open(logs_path, "r") as f:
            logs = json.load(f)
        
        alerts = []
        for log in logs:
            if log.get("status") == "EXCEEDED" or log.get("value", 0) > log.get("threshold", 0):
                # Determine severity
                exceedance_percent = ((log["value"] - log["threshold"]) / log["threshold"]) * 100
                if exceedance_percent > 30:
                    severity = "HIGH"
                elif exceedance_percent > 15:
                    severity = "MEDIUM"
                else:
                    severity = "LOW"
                
                # Parse timestamp string to datetime
                timestamp_str = log["timestamp"]
                if isinstance(timestamp_str, str):
                    # Remove 'Z' and parse ISO format
                    timestamp_str = timestamp_str.replace("Z", "+00:00")
                    timestamp = datetime.fromisoformat(timestamp_str)
                else:
                    timestamp = datetime.now()
                
                alert = Alert(
                    alert_id=f"ALERT-{len(alerts) + 1}",
                    type="ThresholdExceeded",
                    message=f"{log['metric']} exceeded threshold at {log['facility']}. Value: {log['value']} {log['unit']}, Threshold: {log['threshold']} {log['unit']}",
                    severity=severity,
                    timestamp=timestamp,
                    facility=log.get("facility", "Unknown"),
                    metric=log.get("metric", "Unknown")
                )
                alerts.append(alert)
        
        return alerts
    
    def run_full_pipeline(self, generate_new_data: bool = False, document_count: int = 10, log_count: int = 50) -> Dict:
        """Run the complete processing pipeline."""
        results = {
            "timestamp": datetime.now().isoformat(),
            "data_generation": None,
            "documents_analyzed": 0,
            "alerts_generated": 0,
            "analyses": [],
            "alerts": []
        }
        
        # Step 1: Generate synthetic data if requested
        if generate_new_data:
            results["data_generation"] = self.generate_synthetic_data(document_count, log_count)
        
        # Step 2: Process all documents
        analyses = self.process_all_documents()
        results["documents_analyzed"] = len(analyses)
        results["analyses"] = [a.to_dict() for a in analyses]
        
        # Step 3: Generate alerts from logs
        alerts = self.generate_alerts_from_logs()
        results["alerts_generated"] = len(alerts)
        results["alerts"] = [a.to_dict() for a in alerts]
        
        return results

