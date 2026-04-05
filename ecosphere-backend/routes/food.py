from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.recipe_engine import generate_sustainable_recipe

router = APIRouter()

class FoodInventoryRequest(BaseModel):
    persons: str
    days: str
    dishType: str
    ingredients: str

@router.post("/curate")
def curate_recipe(request: FoodInventoryRequest):
    # Pass inventory dictionary
    inventory = {
        "persons": request.persons,
        "days": request.days,
        "dishType": request.dishType,
        "ingredients": request.ingredients
    }
    
    result = generate_sustainable_recipe(inventory)
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail="Could not generate recipe")
        
    return result
