"""Analytics service for compliance monitoring."""
from datetime import datetime, timedelta
from typing import List, Dict, Any
import json
import os
from pathlib import Path
from collections import defaultdict

from app.services.nlp_service import NLPService


class AnalyticsService:
    """Analytics service for compliance monitoring."""
    
    def __init__(self):
        """Initialize analytics service."""
        self.logs_path = Path(__file__).parent.parent / "data" / "operational_logs.json"
        self.documents_path = Path(__file__).parent.parent / "data" / "sample_documents.json"
        self.nlp_service = NLPService()
    
    def _load_logs(self) -> List[Dict[str, Any]]:
        """Load operational logs from JSON file."""
        if self.logs_path.exists():
            with open(self.logs_path, "r") as f:
                return json.load(f)
        return []
    
    def _load_documents(self) -> List[Dict[str, Any]]:
        """Load documents from JSON file."""
        if self.documents_path.exists():
            with open(self.documents_path, "r") as f:
                return json.load(f)
        return []
    
    def _analyze_all_documents(self) -> List[Dict[str, Any]]:
        """Analyze all documents and return analysis results."""
        documents = self._load_documents()
        analyses = []
        
        for doc in documents:
            analysis = self.nlp_service.analyze_document(
                document_id=doc["id"],
                text=doc["body"],
                category=doc["category"]
            )
            analyses.append({
                "document_id": doc["id"],
                "category": doc["category"],
                "compliance_score": analysis.compliance_score,
                "risk_level": analysis.risk_level,
                "inconsistencies_count": len(analysis.inconsistencies),
                "published_at": doc.get("published_at", datetime.now().strftime("%Y-%m-%d"))
            })
        
        return analyses
    
    def calculate_historical_average(self, metric: str, days: int = 30) -> float:
        """Calculate historical average for a metric (mocked)."""
        logs = self._load_logs()
        metric_logs = [log for log in logs if log.get("metric") == metric]
        
        if not metric_logs:
            # Return mock average
            return 15.5
        
        values = [log["value"] for log in metric_logs]
        return sum(values) / len(values) if values else 0.0
    
    def detect_threshold_deviations(self) -> List[Dict[str, Any]]:
        """Detect threshold deviations from operational logs."""
        logs = self._load_logs()
        deviations = []
        
        for log in logs:
            value = log.get("value", 0)
            threshold = log.get("threshold", 0)
            
            if value > threshold:
                deviations.append({
                    "metric": log.get("metric"),
                    "value": value,
                    "threshold": threshold,
                    "deviation": value - threshold,
                    "percentage": ((value - threshold) / threshold) * 100,
                    "timestamp": log.get("timestamp"),
                    "facility": log.get("facility")
                })
        
        return deviations
    
    def generate_compliance_trends(self, days: int = 30) -> Dict[str, Any]:
        """Generate compliance trends over time from actual document analyses only.
        
        This method analyzes ALL uploaded documents and calculates real violations
        from inconsistencies detected by AI. No mock or hardcoded data is used.
        """
        # Always reload documents fresh (no caching)
        documents = self._load_documents()
        
        if not documents:
            # Return empty trends if no documents
            return {
                "trends": [],
                "violations_by_category": {},
                "total_violations": 0,
                "average_compliance": 0
            }
        
        # Analyze all documents to get real data
        analyses = self._analyze_all_documents()
        
        # Group analyses by date (published_at)
        trends_by_date = defaultdict(lambda: {
            "scores": [],
            "violations": 0,
            "inspections": 0
        })
        
        # Calculate violations by category from inconsistencies
        violations_by_category = defaultdict(int)
        
        # Get date range for filtering
        base_date = datetime.now() - timedelta(days=days)
        
        for analysis in analyses:
            date_str = analysis["published_at"]
            
            try:
                doc_date = datetime.strptime(date_str, "%Y-%m-%d")
                # Only include documents within the date range
                if doc_date < base_date:
                    continue
            except ValueError:
                # If date parsing fails, use today's date
                date_str = datetime.now().strftime("%Y-%m-%d")
            
            # Add compliance score
            trends_by_date[date_str]["scores"].append(analysis["compliance_score"])
            
            # Count violations from actual document inconsistencies detected by AI
            # Each inconsistency found in a document = 1 violation
            violations_count = analysis["inconsistencies_count"]
            trends_by_date[date_str]["violations"] += violations_count
            
            # Count violations by category
            if violations_count > 0:
                violations_by_category[analysis["category"]] += violations_count
            
            # Count inspections (documents analyzed)
            trends_by_date[date_str]["inspections"] += 1
        
        # Only include dates that have actual document data - NO interpolation
        trends = []
        for date_str, data in sorted(trends_by_date.items()):
            if data["scores"]:  # Only include dates with actual documents
                avg_score = sum(data["scores"]) / len(data["scores"])
                trends.append({
                    "date": date_str,
                    "compliance_percentage": round(avg_score, 2),
                    "violations": data["violations"],
                    "inspections": data["inspections"]
                })
        
        # Calculate total violations (only from actual data)
        total_violations = sum(t["violations"] for t in trends)
        
        # Calculate average compliance (only from actual data)
        all_compliance = [t["compliance_percentage"] for t in trends]
        average_compliance = sum(all_compliance) / len(all_compliance) if all_compliance else 0
        
        return {
            "trends": trends,
            "violations_by_category": dict(violations_by_category),
            "total_violations": total_violations,
            "average_compliance": round(average_compliance, 2)
        }
    
    def calculate_safety_metrics(self) -> Dict[str, Any]:
        """Calculate safety metrics (mocked)."""
        logs = self._load_logs()
        
        total_metrics = len(logs)
        threshold_exceeded = sum(1 for log in logs if log.get("value", 0) > log.get("threshold", 0))
        
        return {
            "total_metrics_tracked": total_metrics,
            "threshold_exceeded_count": threshold_exceeded,
            "compliance_rate": ((total_metrics - threshold_exceeded) / total_metrics * 100) if total_metrics > 0 else 100.0,
            "average_deviation": sum(
                max(0, log.get("value", 0) - log.get("threshold", 0))
                for log in logs
            ) / total_metrics if total_metrics > 0 else 0.0
        }

