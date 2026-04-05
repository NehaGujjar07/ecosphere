import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_sustainable_recipe(inventory: dict) -> dict:
    """
    Uses Google Gemini AI to generate a personalized, sustainable recipe
    based on the user's household inventory.
    """
    prompt = f"""
You are a sustainable cooking AI for the EcoSphere app. Your goal is to help users 
cook meals that minimize food waste, use local and seasonal ingredients, and reduce 
carbon footprint.

User Kitchen Inventory:
- Cooking for: {inventory.get('persons', '2')} person(s)
- Duration: {inventory.get('days', '1')} day(s) of meals
- Preferred Cuisine/Dish Type: {inventory.get('dishType', 'Any')}
- Available Ingredients at Home: {inventory.get('ingredients', 'Not specified')}

Generate a sustainable, zero-waste recipe that:
1. Uses primarily the ingredients they already have (avoid waste!)
2. Matches the cuisine preference if specified
3. Scales appropriately for the number of people
4. Is genuinely healthy and nutritious

Respond with ONLY valid JSON (no markdown, no extra text) in this exact structure:
{{
  "title": "<Creative, appealing recipe name>",
  "description": "<2-3 sentence description of the dish>",
  "match_percentage": "<percentage like 87% showing how well it uses their ingredients>",
  "carbon_impact": "<2-3 sentences explaining specifically WHY this recipe is sustainable - mention their specific ingredients>",
  "health_benefits": "<2-3 sentences on nutrition and health benefits of this specific meal>",
  "ingredients_with_proportions": [
    "<ingredient 1, e.g., 200g Spinach>",
    "<ingredient 2, e.g., 2 medium Potatoes>"
  ],
  "instructions": [
    "<step 1>",
    "<step 2>",
    "<step 3>"
  ]
}}
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=prompt
        )
        raw = response.text.strip()
        raw = re.sub(r"```json|```", "", raw).strip()
        recipe = json.loads(raw)

        return {
            "success": True,
            "recipe": {
                "title": recipe.get("title", "Sustainable Recipe"),
                "description": recipe.get("description", ""),
                "match_percentage": str(recipe.get("match_percentage", "80%")),
                "carbon_impact": recipe.get("carbon_impact", ""),
                "health_benefits": recipe.get("health_benefits", ""),
                "proportions": recipe.get("ingredients_with_proportions", []),
                "instructions": recipe.get("instructions", [])
            }
        }

    except json.JSONDecodeError:
        return {"success": False, "error": "Gemini returned an unexpected format. Please try again."}
    except Exception as e:
        return {"success": False, "error": f"Gemini AI Error: {str(e)}"}
