from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.openfoodfacts import fetch_product_data
from services.scoring_engine import calculate_sustainability_score

router = APIRouter()

class ScanRequest(BaseModel):
    barcode: str

@router.post("/scan")
def scan_product(request: ScanRequest):
    barcode = request.barcode
    if not barcode:
        raise HTTPException(status_code=400, detail="Barcode is required")
        
    # 1. Fetch from OFF
    raw_data = fetch_product_data(barcode)
    
    # 2. Score the product
    result = calculate_sustainability_score(raw_data)
    
    return result
