"""
Gemini Service: Use Google Gemini API to structure OCR text and generate AI recommendations.
"""

import google.generativeai as genai
from typing import Dict, Any, List
import json
import logging
import re

logger = logging.getLogger(__name__)


def extract_json(text: str) -> Dict:
    """
    Extract JSON object from Gemini response text.
    Handles markdown blocks and extra text.
    """
    try:
        # Remove markdown formatting
        text = text.replace("```json", "").replace("```", "")

        # Extract JSON object
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            json_str = match.group(0)
            return json.loads(json_str)
    except Exception as e:
        logger.error(f"JSON extraction error: {str(e)}")

    return {}


class GeminiService:
    """Service for interacting with Google Gemini API."""

    def __init__(self, api_key: str):
        try:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel("gemini-2.5-flash")
            logger.info("Gemini service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini service: {str(e)}")
            raise Exception(f"Gemini initialization failed: {str(e)}")

    # ===============================
    # STRUCTURE MEDICAL DATA
    # ===============================
    def structure_medical_data(self, ocr_text: str) -> Dict[str, Any]:
        prompt = f"""
Return ONLY valid JSON.
Do NOT include explanations or markdown.

Extract medical parameters from this OCR text.

JSON format:
{{
  "hemoglobin": null,
  "wbc": null,
  "rbc": null,
  "platelets": null,
  "glucose_fasting": null,
  "hba1c": null,
  "ldl": null,
  "hdl": null,
  "triglycerides": null,
  "mcv": null,
  "systolic_bp": null,
  "diastolic_bp": null
}}

OCR TEXT:
{ocr_text}
"""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            logger.info("Gemini structuring response received")
            structured_data = extract_json(response_text)

            return structured_data
        except Exception as e:
            logger.error(f"Gemini structure_medical_data failed: {str(e)}")
            return {}

    # ===============================
    # AI SUMMARY
    # ===============================
    def generate_ai_summary(self, structured_data: Dict[str, Any], risk_scores: Dict[str, int]) -> Dict[str, Any]:
        data_str = json.dumps(structured_data, indent=2)
        scores_str = json.dumps(risk_scores, indent=2)

        prompt = f"""
Return ONLY valid JSON.

JSON format:
{{
  "summary": "2-3 sentence health summary",
  "root_causes": ["cause1", "cause2"],
  "recommendations": ["recommendation1", "recommendation2"]
}}

Medical Data:
{data_str}

Risk Scores:
{scores_str}
"""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            result = extract_json(response_text)
            return result if result else {
                "summary": "Unable to generate summary.",
                "root_causes": [],
                "recommendations": []
            }

        except Exception as e:
            logger.error(f"Gemini generate_ai_summary failed: {str(e)}")
            return {
                "summary": "Unable to generate summary.",
                "root_causes": [],
                "recommendations": []
            }

    # ===============================
    # DIET PLAN
    # ===============================
    def generate_diet_plan(self, structured_data: Dict[str, Any], key_findings: List[str]) -> Dict[str, Any]:
        data_str = json.dumps(structured_data, indent=2)
        findings_str = json.dumps(key_findings, indent=2)

        prompt = f"""
Return ONLY valid JSON.

JSON format:
{{
  "calories": 1800,
  "protein": 100,
  "carbs": 200,
  "fiber": 30,
  "meals": {{
    "breakfast": "meal",
    "lunch": "meal",
    "dinner": "meal"
  }}
}}

Medical Data:
{data_str}

Key Findings:
{findings_str}
"""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            diet_plan = extract_json(response_text)
            return diet_plan if diet_plan else {
                "calories": 1800,
                "protein": 100,
                "carbs": 200,
                "fiber": 30,
                "meals": {
                    "breakfast": "Oatmeal with fruits",
                    "lunch": "Brown rice with vegetables",
                    "dinner": "Grilled chicken with salad"
                }
            }

        except Exception as e:
            logger.error(f"Gemini generate_diet_plan failed: {str(e)}")
            return {
                "calories": 1800,
                "protein": 100,
                "carbs": 200,
                "fiber": 30,
                "meals": {
                    "breakfast": "Oatmeal with fruits",
                    "lunch": "Brown rice with vegetables",
                    "dinner": "Grilled chicken with salad"
                }
            }

    # ===============================
    # RECOMMENDATIONS
    # ===============================
    def generate_recommendations(self, structured_data: Dict[str, Any], key_findings: List[str]) -> Dict[str, Any]:
        data_str = json.dumps(structured_data, indent=2)
        findings_str = json.dumps(key_findings, indent=2)

        prompt = f"""
Return ONLY valid JSON.

JSON format:
{{
  "home_remedies": [
    {{"name": "remedy", "priority": "High"}}
  ],
  "medications": [
    {{"name": "medicine", "priority": "Medium"}}
  ],
  "lifestyle_changes": ["change1", "change2"]
}}

Medical Data:
{data_str}

Key Findings:
{findings_str}
"""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            recommendations = extract_json(response_text)
            return recommendations if recommendations else {
                "home_remedies": [],
                "medications": [],
                "lifestyle_changes": ["Consult doctor"]
            }

        except Exception as e:
            logger.error(f"Gemini generate_recommendations failed: {str(e)}")
            return {
                "home_remedies": [],
                "medications": [],
                "lifestyle_changes": ["Consult doctor"]
            }