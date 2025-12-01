"""Analytics API router."""
from fastapi import APIRouter
from typing import Dict, Any
from datetime import datetime, timedelta

from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["analytics"])
analytics_service = AnalyticsService()


@router.get("/trends")
async def get_compliance_trends(days: int = 30) -> Dict[str, Any]:
    """Get compliance trends over time from actual document analyses."""
    trends_data = analytics_service.generate_compliance_trends(days=days)
    
    # Trends are already formatted as a list from the service
    # Just ensure they're sorted by date
    formatted_trends = sorted(trends_data["trends"], key=lambda x: x["date"])
    
    return {
        "trends": formatted_trends,
        "violations_by_category": trends_data["violations_by_category"],
        "total_violations": trends_data["total_violations"],
        "average_compliance": round(trends_data["average_compliance"], 2),
        "safety_metrics": analytics_service.calculate_safety_metrics()
    }


@router.get("/facility-risks")
async def get_facility_risks() -> Dict[str, Any]:
    """Get facility risk data from actual documents and logs."""
    risk_data = analytics_service.get_facility_risk_data()
    return {
        "facilities": risk_data
    }


@router.get("/recent-activity")
async def get_recent_activity(limit: int = 5) -> Dict[str, Any]:
    """Get recent activity from documents and alerts."""
    activities = analytics_service.get_recent_activity(limit=limit)
    return {
        "activities": activities
    }

