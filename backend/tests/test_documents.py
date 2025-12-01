"""Tests for documents API."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_documents():
    """Test getting all documents."""
    response = client.get("/api/v1/documents/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0


def test_get_document_by_id():
    """Test getting a specific document."""
    response = client.get("/api/v1/documents/DOC-1001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "DOC-1001"
    assert "title" in data
    assert "body" in data


def test_get_nonexistent_document():
    """Test getting a non-existent document."""
    response = client.get("/api/v1/documents/DOC-9999")
    assert response.status_code == 404


def test_analyze_document():
    """Test document analysis."""
    response = client.post("/api/v1/documents/analyze?document_id=DOC-1001")
    assert response.status_code == 200
    data = response.json()
    assert "document_id" in data
    assert "extracted_rules" in data
    assert "compliance_score" in data
    assert "risk_level" in data
    assert 0 <= data["compliance_score"] <= 100

