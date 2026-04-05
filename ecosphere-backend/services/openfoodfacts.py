import requests

OPEN_FOOD_FACTS_API_URL = "https://world.openfoodfacts.org/api/v0/product/{}.json"

def fetch_product_data(barcode: str):
    """
    Fetches raw product data from the Open Food Facts API using a barcode.
    """
    headers = {
        "User-Agent": "EcoSphereApp - Android - Version 1.0 - www.test.com"
    }
    try:
        response = requests.get(OPEN_FOOD_FACTS_API_URL.format(barcode), headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:
                product = data.get("product", {})
                
                # Extract relevant fields for our Rule-Based AI Engine
                return {
                    "found": True,
                    "product_name": product.get("product_name", "Unknown"),
                    "brands": product.get("brands", "Unknown"),
                    "ecoscore_grade": product.get("ecoscore_grade", "unknown"),
                    "nutriscore_grade": product.get("nutriscore_grade", "unknown"),
                    "packaging": product.get("packaging", ""),
                    "ingredients_text": product.get("ingredients_text", ""),
                    "image_url": product.get("image_url", ""),
                    "carbon_footprint_percent": product.get("ecoscore_data", {}).get("agribalyse", {}).get("co2_total", None)
                }
            else:
                return {"found": False, "error": "Product not found in Open Food Facts DB."}
        else:
            return {"found": False, "error": "Failed to connect to Open Food Facts API."}
    except Exception as e:
        return {"found": False, "error": str(e)}
