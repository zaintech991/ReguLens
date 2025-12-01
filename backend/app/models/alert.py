"""Alert models."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Alert:
    """Alert model."""
    alert_id: str
    type: str
    message: str
    severity: str
    timestamp: datetime
    resolved: bool = False
    resolved_at: Optional[datetime] = None
    facility: Optional[str] = None
    metric: Optional[str] = None
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            "alert_id": self.alert_id,
            "type": self.type,
            "message": self.message,
            "severity": self.severity,
            "timestamp": self.timestamp.isoformat(),
            "resolved": self.resolved,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
            "facility": self.facility,
            "metric": self.metric
        }


@dataclass
class AlertGenerationRequest:
    """Request model for generating alerts."""
    analyze_operational_logs: bool = True
    check_thresholds: bool = True
    include_historical: bool = True

