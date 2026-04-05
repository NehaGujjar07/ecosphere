from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import database

router = APIRouter()

POINTS_PER_PURCHASE = 5  # 5 points per item purchased

class PurchaseRequest(BaseModel):
    user_id: int
    items_count: int  # total number of items in the cart

@router.post("/purchase")
def record_purchase(req: PurchaseRequest):
    """Called after checkout. Awards 5 points per item purchased."""
    if req.items_count <= 0:
        raise HTTPException(status_code=400, detail="No items in purchase.")
    
    points = req.items_count * POINTS_PER_PURCHASE

    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO purchases (user_id, items_count, points_awarded) VALUES (?, ?, ?)",
        (req.user_id, req.items_count, points)
    )
    conn.commit()
    conn.close()

    # Return updated profile
    total_points = database.get_user_points(req.user_id)
    level_info = database.get_level_info(total_points)
    badges = database.get_earned_badges(total_points)

    return {
        "success": True,
        "points_awarded": points,
        "total_points": total_points,
        "level": level_info,
        "badges": badges,
        "new_badges": [b for b in badges if total_points - points < b["points_required"] <= total_points]
    }

@router.get("/profile/{user_id}")
def get_profile(user_id: int):
    """Fetch full gamification profile for a user."""
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, name FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    total_points = database.get_user_points(user_id)
    level_info = database.get_level_info(total_points)
    badges = database.get_earned_badges(total_points)

    return {
        "user_id": user_id,
        "email": user["email"],
        "name": user["name"],
        "total_points": total_points,
        "level": level_info,
        "badges": badges,
        "all_badges": database.BADGES,  # For showing locked/unlocked badges on dashboard
    }
