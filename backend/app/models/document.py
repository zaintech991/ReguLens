"""Document models."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Document:
    """Document model."""
    id: str
    title: str
    body: str
    category: str
    published_at: str
    created_at: Optional[datetime] = None
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "category": self.category,
            "published_at": self.published_at,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


@dataclass
class DocumentAnalysis:
    """Document analysis result."""
    document_id: str
    extracted_rules: list[str] = field(default_factory=list)
    inconsistencies: list[str] = field(default_factory=list)
    compliance_score: float = 0.0
    risk_level: str = "LOW"
    analyzed_at: datetime = field(default_factory=datetime.now)
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            "document_id": self.document_id,
            "extracted_rules": self.extracted_rules,
            "inconsistencies": self.inconsistencies,
            "compliance_score": self.compliance_score,
            "risk_level": self.risk_level,
            "analyzed_at": self.analyzed_at.isoformat()
        }

