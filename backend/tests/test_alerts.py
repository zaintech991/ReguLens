"""Tests for alerts API."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_alerts():
    """Test getting all alerts."""
    response = client.get("/api/v1/alerts/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0


def test_generate_alerts():
    """Test generating alerts."""
    response = client.post("/api/v1/alerts/generate")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

