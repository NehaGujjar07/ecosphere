import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def calculate_sustainability_score(product_data: dict) -> dict:
    """
    Uses Google Gemini AI to analyze product data and generate a
    rich sustainability score and breakdown.
    """
    if not product_data.get("found"):
        return {"score": 0.0, "breakdown": {}, "error": product_data.get("error")}

    prompt = f"""
You are an expert environmental sustainability AI analyst for the EcoSphere app.
Analyze the following product data and provide a structured sustainability assessment.

Product Data:
- Name: {product_data.get('product_name', 'Unknown')}
- Brand: {product_data.get('brands', 'Unknown')}
- Packaging: {product_data.get('packaging', 'Not specified')}
- Ingredients: {product_data.get('ingredients_text', 'Not specified')[:500]}
- European Ecoscore Grade (A=best, E=worst): {product_data.get('ecoscore_grade', 'unknown')}
- Carbon Footprint Data: {product_data.get('carbon_footprint_percent', 'Not available')}

Based on this data, provide a JSON response ONLY (no extra text, no markdown code fences) with this exact structure:
{{
  "score": <number from 0.0 to 10.0, one decimal place>,
  "carbon_impact": "<one of: Very Low (Excellent), Low (Good), Moderate, High (Poor), Very High (Very Poor)>",
  "material_impact": "<short description of packaging assessment>",
  "risk_indicators": ["<risk 1>", "<risk 2>"],
  "suggestions": ["<actionable eco-friendly suggestion 1>", "<actionable eco-friendly suggestion 2>"]
}}

Scoring guidelines:
- 8-10: Excellent (organic, minimal packaging, plant-based, local)
- 6-7.9: Good (eco-friendly packaging, low carbon)
- 4-5.9: Average (standard products with some concerns)
- 2-3.9: Poor (plastic heavy, palm oil, high carbon)
- 0-1.9: Very Poor (multiple severe environmental risks)
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )
        raw = response.text.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        ai_result = json.loads(raw)

        return {
            "product_name": product_data.get("product_name"),
            "brand": product_data.get("brands"),
            "image_url": product_data.get("image_url"),
            "score": float(ai_result.get("score", 5.0)),
            "breakdown": {
                "carbon_impact": ai_result.get("carbon_impact", "Unknown"),
                "material_impact": ai_result.get("material_impact", "Unknown"),
                "risk_indicators": ai_result.get("risk_indicators", []),
                "suggestions": ai_result.get("suggestions", [])
            }
        }

    except json.JSONDecodeError as e:
        return {
            "product_name": product_data.get("product_name"),
            "brand": product_data.get("brands"),
            "image_url": product_data.get("image_url"),
            "score": 5.0,
            "breakdown": {
                "carbon_impact": "AI parse error - try again",
                "material_impact": "Unknown",
                "risk_indicators": [],
                "suggestions": []
            }
        }
    except Exception as e:
        return {"score": 0.0, "breakdown": {}, "error": f"Gemini AI Error: {str(e)}"}
