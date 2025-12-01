"""Initialize application with sample documents."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.synthetic_data_generator import SyntheticDataGenerator

def initialize_sample_documents():
    """Initialize the application with diverse sample documents."""
    generator = SyntheticDataGenerator()
    
    # Generate diverse sample documents across different categories
    # Use more documents to have better data for charts
    documents = generator.generate_documents(
        count=20,
        categories=["Environmental", "Safety", "Data Privacy", "Financial", "Quality", "Health", "Security", "Regulatory"]
    )
    
    # Save to the data directory
    data_dir = Path(__file__).parent.parent / "app" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = data_dir / "sample_documents.json"
    generator.save_documents(documents, output_path)
    
    print(f"✅ Initialized with {len(documents)} sample documents")
    print(f"📁 Saved to: {output_path}")
    
    # Print summary
    categories = {}
    for doc in documents:
        cat = doc["category"]
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n📊 Document breakdown by category:")
    for cat, count in sorted(categories.items()):
        print(f"   {cat}: {count} documents")
    
    return documents

if __name__ == "__main__":
    initialize_sample_documents()

