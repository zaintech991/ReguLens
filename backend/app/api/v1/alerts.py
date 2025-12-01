"""Alerts API router."""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta
import json
from pathlib import Path

from app.models.alert import Alert, AlertGenerationRequest
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/alerts", tags=["alerts"])
analytics_service = AnalyticsService()

# In-memory alerts storage
_alerts_storage: List[dict] = []

def _initialize_alerts():
    """Initialize with some sample alerts."""
    if not _alerts_storage:
        _alerts_storage.extend([
            {
                "alert_id": "ALERT-52",
                "type": "ThresholdExceeded",
                "message": "Air emissions exceeded safe limits. Current: 27 ppm, Threshold: 20 ppm",
                "severity": "HIGH",
                "timestamp": "2024-04-12T13:22:00Z",
                "resolved": False
            },
            {
                "alert_id": "ALERT-53",
                "type": "ThresholdExceeded",
                "message": "Water quality pH level exceeded threshold. Current: 11.5, Threshold: 10",
                "severity": "MEDIUM",
                "timestamp": "2024-04-13T11:40:00Z",
                "resolved": False
            },
            {
                "alert_id": "ALERT-54",
                "type": "ThresholdExceeded",
                "message": "Temperature exceeded safe operating range. Current: 95°F, Threshold: 90°F",
                "severity": "HIGH",
                "timestamp": "2024-04-12T16:45:00Z",
                "resolved": False
            },
            {
                "alert_id": "ALERT-55",
                "type": "ThresholdExceeded",
                "message": "Pressure reading above normal. Current: 120 psi, Threshold: 100 psi",
                "severity": "MEDIUM",
                "timestamp": "2024-04-13T10:25:00Z",
                "resolved": False
            },
            {
                "alert_id": "ALERT-56",
                "type": "ComplianceViolation",
                "message": "Missing weekly inspection report for Plant A",
                "severity": "LOW",
                "timestamp": "2024-04-14T09:15:00Z",
                "resolved": False
            }
        ])

# Initialize alerts on module load
_initialize_alerts()


@router.get("/")
async def get_alerts():
    """Get all alerts."""
    result = []
    for alert in _alerts_storage:
        alert_obj = Alert(
            alert_id=alert["alert_id"],
            type=alert["type"],
            message=alert["message"],
            severity=alert["severity"],
            timestamp=datetime.fromisoformat(alert["timestamp"].replace("Z", "+00:00")),
            resolved=alert.get("resolved", False),
            resolved_at=datetime.fromisoformat(alert["resolved_at"].replace("Z", "+00:00")) if alert.get("resolved_at") else None
        )
        result.append(alert_obj.to_dict())
    return result


@router.post("/generate")
async def generate_alerts(
    analyze_operational_logs: bool = True,
    check_thresholds: bool = True,
    include_historical: bool = True
):
    """Generate alerts based on operational logs and analytics."""
    request = AlertGenerationRequest(
        analyze_operational_logs=analyze_operational_logs,
        check_thresholds=check_thresholds,
        include_historical=include_historical
    )
    
    new_alerts = []
    
    if request.analyze_operational_logs:
        # Get threshold deviations
        deviations = analytics_service.detect_threshold_deviations()
        
        for deviation in deviations:
            # Check if alert already exists
            existing = any(
                a.get("message", "").startswith(f"{deviation['metric']} exceeded")
                for a in _alerts_storage
            )
            
            if not existing:
                severity = "HIGH" if deviation["percentage"] > 20 else "MEDIUM"
                alert_id = f"ALERT-{len(_alerts_storage) + len(new_alerts) + 1}"
                
                alert_data = {
                    "alert_id": alert_id,
                    "type": "ThresholdExceeded",
                    "message": f"{deviation['metric']} exceeded threshold. Current: {deviation['value']} {deviation.get('unit', '')}, Threshold: {deviation['threshold']} {deviation.get('unit', '')}",
                    "severity": severity,
                    "timestamp": datetime.now().isoformat() + "Z",
                    "resolved": False
                }
                
                _alerts_storage.append(alert_data)
                new_alerts.append(alert_data)
    
    if request.include_historical:
        # Generate mock historical alerts
        historical_avg = analytics_service.calculate_historical_average("Air Emissions")
        if historical_avg > 18:
            alert_id = f"ALERT-{len(_alerts_storage) + len(new_alerts) + 1}"
            alert_data = {
                "alert_id": alert_id,
                "type": "TrendAnalysis",
                "message": f"Historical average for Air Emissions ({historical_avg:.1f} ppm) is approaching threshold",
                "severity": "LOW",
                "timestamp": datetime.now().isoformat() + "Z",
                "resolved": False
            }
            _alerts_storage.append(alert_data)
            new_alerts.append(alert_data)
    
    result = []
    for alert in new_alerts:
        alert_obj = Alert(
            alert_id=alert["alert_id"],
            type=alert["type"],
            message=alert["message"],
            severity=alert["severity"],
            timestamp=datetime.fromisoformat(alert["timestamp"].replace("Z", "+00:00")),
            resolved=alert.get("resolved", False)
        )
        result.append(alert_obj.to_dict())
    return result

