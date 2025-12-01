"""Enhanced NLP service using Groq API for real AI-powered document analysis."""
import os
from typing import List, Optional
from datetime import datetime
from app.models.document import DocumentAnalysis
from app.core.config import settings

# Optional Groq import - fallback to pattern matching if not available
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    Groq = None


class NLPService:
    """NLP service for compliance document analysis using Groq AI."""
    
    def __init__(self):
        """Initialize Groq client."""
        self.client = None
        if GROQ_AVAILABLE and settings.groq_api_key:
            try:
                self.client = Groq(api_key=settings.groq_api_key)
            except Exception as e:
                print(f"Warning: Could not initialize Groq client: {e}")
                self.client = None
        elif not GROQ_AVAILABLE:
            print("Info: Groq library not installed. Using fallback pattern matching for document analysis.")
    
    def _extract_rules_with_ai(self, text: str, category: str) -> List[str]:
        """Extract compliance rules using Groq AI."""
        if not self.client:
            return self._fallback_extract_rules(text)
        
        try:
            prompt = f"""Analyze the following {category} compliance document and extract all compliance rules and requirements. 
Return only a JSON array of strings, each string being a specific compliance rule or requirement.

Document text:
{text}

Return format: ["rule 1", "rule 2", "rule 3", ...]
Maximum 8 rules. Be specific and concise."""

            response = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are a compliance analysis expert. Extract compliance rules from documents. Always return valid JSON arrays only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            content = response.choices[0].message.content.strip()
            # Try to parse JSON from response
            import json
            import re
            
            # Extract JSON array from response
            json_match = re.search(r'\[.*?\]', content, re.DOTALL)
            if json_match:
                rules = json.loads(json_match.group())
                return [str(rule) for rule in rules[:8]]
            
            # Fallback: split by lines if JSON parsing fails
            lines = [line.strip() for line in content.split('\n') if line.strip()]
            return lines[:8]
            
        except Exception as e:
            print(f"Error in AI rule extraction: {e}")
            return self._fallback_extract_rules(text)
    
    def _detect_inconsistencies_with_ai(self, text: str, category: str) -> List[str]:
        """Detect inconsistencies using Groq AI."""
        if not self.client:
            return self._fallback_detect_inconsistencies(text, category)
        
        try:
            prompt = f"""Analyze this {category} compliance document for inconsistencies, ambiguities, or potential compliance issues.

Document text:
{text}

Return a JSON array of strings, each describing a specific inconsistency or issue found. If no issues are found, return an empty array.

Return format: ["issue 1", "issue 2", ...]
Maximum 5 issues."""

            response = self.client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {"role": "system", "content": "You are a compliance auditor. Identify inconsistencies and compliance issues. Always return valid JSON arrays only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=400
            )
            
            content = response.choices[0].message.content.strip()
            import json
            import re
            
            json_match = re.search(r'\[.*?\]', content, re.DOTALL)
            if json_match:
                issues = json.loads(json_match.group())
                return [str(issue) for issue in issues[:5]]
            
            return []
            
        except Exception as e:
            print(f"Error in AI inconsistency detection: {e}")
            return self._fallback_detect_inconsistencies(text, category)
    
    def _calculate_compliance_score(self, text: str, inconsistencies: List[str], rules: List[str]) -> float:
        """Calculate compliance score based on analysis."""
        base_score = 90.0
        
        # Reduce score for inconsistencies
        score_reduction = len(inconsistencies) * 8.0
        
        # Bonus for having clear rules
        rules_bonus = min(len(rules) * 2.0, 10.0)
        
        # Bonus for document detail (length)
        length_bonus = min(len(text) / 150, 5.0)
        
        # Penalty if no rules extracted
        if not rules:
            score_reduction += 15.0
        
        final_score = base_score - score_reduction + rules_bonus + length_bonus
        return max(0.0, min(100.0, round(final_score, 2)))
    
    def _fallback_extract_rules(self, text: str) -> List[str]:
        """Fallback rule extraction using regex patterns."""
        import re
        rules = []
        
        patterns = [
            r"must (?:maintain|keep|ensure|comply with|not exceed) ([^\.]+)",
            r"required to ([^\.]+)",
            r"must be ([^\.]+)",
            r"shall ([^\.]+)",
            r"mandatory ([^\.]+)",
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            rules.extend(matches)
        
        if not rules:
            rules = [
                "Maintain operational standards",
                "Conduct regular inspections",
                "Document all activities"
            ]
        
        return list(set(rules))[:8]
    
    def _fallback_detect_inconsistencies(self, text: str, category: str) -> List[str]:
        """Fallback inconsistency detection."""
        inconsistencies = []
        
        if "must" in text.lower() and "should" in text.lower():
            inconsistencies.append("Mixed use of mandatory ('must') and advisory ('should') language")
        
        if len(text) < 100:
            inconsistencies.append("Document may lack sufficient detail for compliance requirements")
        
        if category == "Environmental" and "emissions" not in text.lower() and "discharge" not in text.lower():
            inconsistencies.append("Environmental document may be missing key environmental metrics")
        
        return inconsistencies
    
    def analyze_document(self, document_id: str, text: str, category: str) -> DocumentAnalysis:
        """Analyze a document using AI-powered NLP."""
        # Extract rules using AI
        extracted_rules = self._extract_rules_with_ai(text, category)
        
        # Detect inconsistencies using AI
        inconsistencies = self._detect_inconsistencies_with_ai(text, category)
        
        # Calculate compliance score
        compliance_score = self._calculate_compliance_score(text, inconsistencies, extracted_rules)
        
        # Determine risk level
        risk_level = self._determine_risk_level(compliance_score, inconsistencies)
        
        return DocumentAnalysis(
            document_id=document_id,
            extracted_rules=extracted_rules,
            inconsistencies=inconsistencies,
            compliance_score=compliance_score,
            risk_level=risk_level,
            analyzed_at=datetime.now()
        )
    
    def _determine_risk_level(self, score: float, inconsistencies: List[str]) -> str:
        """Determine risk level based on score and inconsistencies."""
        if score < 50 or len(inconsistencies) > 3:
            return "HIGH"
        elif score < 75 or len(inconsistencies) > 1:
            return "MEDIUM"
        else:
            return "LOW"
