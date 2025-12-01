"""Script to generate initial sample documents using the synthetic data generator."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.synthetic_data_generator import SyntheticDataGenerator

def generate_initial_documents():
    """Generate initial sample documents for the application."""
    generator = SyntheticDataGenerator()
    
    # Generate diverse sample documents across different categories
    documents = generator.generate_documents(
        count=15,
        categories=["Environmental", "Safety", "Data Privacy", "Financial", "Quality", "Health", "Security"]
    )
    
    # Save to the data directory
    data_dir = Path(__file__).parent.parent / "app" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = data_dir / "sample_documents.json"
    generator.save_documents(documents, output_path)
    
    print(f"✅ Generated {len(documents)} sample documents")
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
    generate_initial_documents()

