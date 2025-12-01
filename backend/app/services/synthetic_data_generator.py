"""Synthetic data generator for compliance documents and operational logs."""
import random
import json
from datetime import datetime, timedelta
from typing import List, Dict
from pathlib import Path


class SyntheticDataGenerator:
    """Generate realistic synthetic compliance data."""
    
    COMPLIANCE_CATEGORIES = [
        "Environmental", "Safety", "Data Privacy", "Financial", 
        "Quality", "Health", "Security", "Regulatory"
    ]
    
    ENVIRONMENTAL_TEMPLATES = [
        {
            "title": "Air Quality Standards Compliance",
            "body": "All facilities must maintain air emissions below {threshold} ppm for particulate matter. Continuous monitoring systems must be operational 24/7. Weekly calibration of monitoring equipment is mandatory. Exceedance reports must be submitted to regulatory authorities within 48 hours. Annual third-party audits are required to verify compliance.",
            "thresholds": [15, 20, 25, 30]
        },
        {
            "title": "Wastewater Discharge Regulations",
            "body": "Industrial wastewater discharge must not exceed {threshold} mg/L for chemical oxygen demand (COD). Daily sampling and testing is required. Treatment systems must be maintained according to manufacturer specifications. Discharge permits must be renewed every 3 years. Non-compliance triggers immediate shutdown procedures.",
            "thresholds": [50, 75, 100, 150]
        },
        {
            "title": "Hazardous Material Storage Protocol",
            "body": "Hazardous materials must be stored in certified containers rated for {threshold} years of service life. Storage areas must have secondary containment capable of holding 110% of the largest container. Monthly inspections are mandatory. Material Safety Data Sheets (MSDS) must be accessible within 30 seconds of any storage location.",
            "thresholds": [5, 10, 15, 20]
        }
    ]
    
    SAFETY_TEMPLATES = [
        {
            "title": "Personal Protective Equipment Requirements",
            "body": "All personnel must wear approved PPE in designated zones. Safety equipment must meet ANSI/OSHA standards. Equipment inspections must occur before each shift. Defective equipment must be removed from service immediately. Training certifications must be renewed every {threshold} months.",
            "thresholds": [6, 12, 18, 24]
        },
        {
            "title": "Emergency Response Procedures",
            "body": "Emergency evacuation drills must be conducted every {threshold} months. All exits must remain unobstructed at all times. Fire suppression systems must be tested quarterly. Emergency contact information must be posted in all work areas. Incident response teams must be available 24/7.",
            "thresholds": [1, 3, 6, 12]
        }
    ]
    
    DATA_PRIVACY_TEMPLATES = [
        {
            "title": "Data Encryption Standards",
            "body": "All sensitive data must be encrypted using AES-256 or equivalent. Encryption keys must be rotated every {threshold} days. Access logs must be maintained for 7 years. Data breach notifications must be sent within 72 hours of discovery. Regular security audits are mandatory.",
            "thresholds": [30, 60, 90, 180]
        }
    ]
    
    FINANCIAL_TEMPLATES = [
        {
            "title": "Transaction Reporting Thresholds",
            "body": "All financial transactions exceeding ${threshold} must be reported to compliance officers within 24 hours. Audit trails must be maintained for all transactions. Quarterly financial reviews are required. Suspicious activity reports must be filed immediately.",
            "thresholds": [5000, 10000, 25000, 50000]
        }
    ]
    
    @staticmethod
    def generate_document(category: str, doc_id: str = None) -> Dict:
        """Generate a synthetic compliance document."""
        if doc_id is None:
            doc_id = f"DOC-{random.randint(1000, 9999)}"
        
        templates = []
        if category == "Environmental":
            templates = SyntheticDataGenerator.ENVIRONMENTAL_TEMPLATES
        elif category == "Safety":
            templates = SyntheticDataGenerator.SAFETY_TEMPLATES
        elif category == "Data Privacy":
            templates = SyntheticDataGenerator.DATA_PRIVACY_TEMPLATES
        elif category == "Financial":
            templates = SyntheticDataGenerator.FINANCIAL_TEMPLATES
        else:
            # Generic template
            templates = [{
                "title": f"{category} Compliance Standard",
                "body": f"All operations must comply with {category} regulations. Regular audits are required. Documentation must be maintained for a minimum of 5 years. Non-compliance may result in penalties.",
                "thresholds": [1]
            }]
        
        template = random.choice(templates)
        threshold = random.choice(template["thresholds"])
        body = template["body"].format(threshold=threshold)
        
        # Add some variation
        variations = [
            " Compliance with these standards is mandatory and non-negotiable.",
            " Failure to comply may result in regulatory action.",
            " All personnel must be trained on these requirements annually.",
            " Documentation must be available for inspection at all times."
        ]
        body += random.choice(variations)
        
        days_ago = random.randint(1, 180)
        published_at = (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")
        
        return {
            "id": doc_id,
            "title": template["title"],
            "body": body,
            "category": category,
            "published_at": published_at
        }
    
    @staticmethod
    def generate_operational_log(facility: str = None, metric: str = None) -> Dict:
        """Generate a synthetic operational log entry."""
        if facility is None:
            facility = random.choice(["Plant A", "Plant B", "Plant C", "Warehouse 1", "Office Complex"])
        
        metrics = {
            "Air Emissions": {"unit": "ppm", "normal_range": (10, 25), "threshold": 20},
            "Water Quality": {"unit": "mg/L", "normal_range": (30, 70), "threshold": 75},
            "Temperature": {"unit": "°C", "normal_range": (18, 24), "threshold": 25},
            "Pressure": {"unit": "psi", "normal_range": (40, 60), "threshold": 65},
            "Vibration": {"unit": "mm/s", "normal_range": (2, 8), "threshold": 10},
            "Noise Level": {"unit": "dB", "normal_range": (50, 70), "threshold": 75},
        }
        
        if metric is None:
            metric = random.choice(list(metrics.keys()))
        
        metric_info = metrics[metric]
        
        # Generate value - sometimes exceed threshold for realism
        if random.random() < 0.15:  # 15% chance of exceeding
            value = random.uniform(metric_info["threshold"] * 1.05, metric_info["threshold"] * 1.3)
        else:
            value = random.uniform(*metric_info["normal_range"])
        
        hours_ago = random.randint(0, 72)
        timestamp = (datetime.now() - timedelta(hours=hours_ago)).isoformat() + "Z"
        
        return {
            "id": f"LOG-{random.randint(100, 999)}",
            "facility": facility,
            "metric": metric,
            "value": round(value, 2),
            "unit": metric_info["unit"],
            "threshold": metric_info["threshold"],
            "timestamp": timestamp,
            "status": "EXCEEDED" if value > metric_info["threshold"] else "NORMAL"
        }
    
    @staticmethod
    def generate_documents(count: int = 10, categories: List[str] = None) -> List[Dict]:
        """Generate multiple synthetic documents."""
        if categories is None:
            categories = SyntheticDataGenerator.COMPLIANCE_CATEGORIES
        
        documents = []
        for i in range(count):
            category = random.choice(categories)
            doc_id = f"DOC-{1000 + i}"
            documents.append(SyntheticDataGenerator.generate_document(category, doc_id))
        
        return documents
    
    @staticmethod
    def generate_operational_logs(count: int = 50) -> List[Dict]:
        """Generate multiple operational log entries."""
        logs = []
        for _ in range(count):
            logs.append(SyntheticDataGenerator.generate_operational_log())
        return logs
    
    @staticmethod
    def save_documents(documents: List[Dict], filepath: Path = None):
        """Save documents to JSON file."""
        if filepath is None:
            filepath = Path(__file__).parent.parent / "data" / "sample_documents.json"
        
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w") as f:
            json.dump(documents, f, indent=2)
    
    @staticmethod
    def save_operational_logs(logs: List[Dict], filepath: Path = None):
        """Save operational logs to JSON file."""
        if filepath is None:
            filepath = Path(__file__).parent.parent / "data" / "operational_logs.json"
        
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w") as f:
            json.dump(logs, f, indent=2)

