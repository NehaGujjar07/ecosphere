import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "ecosphere.db")

BADGES = [
    {"id": "eco_warrior",        "name": "Eco Warrior",        "icon": "🛡️", "points_required": 40, "description": "Earned 40 EcoPoints from sustainable shopping"},
    {"id": "sustainability_pro", "name": "Sustainability Pro", "icon": "🌟", "points_required": 80, "description": "Earned 80 EcoPoints from sustainable shopping"},
    {"id": "planet_hero",        "name": "Planet Hero",        "icon": "💎", "points_required": 120, "description": "Earned 120 EcoPoints from sustainable shopping"},
]

LEVELS = [
    {"level": 1, "title": "🌱 Eco Starter",          "min": 0},
    {"level": 2, "title": "🛡️ Eco Warrior",          "min": 40},
    {"level": 3, "title": "🌟 Sustainability Pro",   "min": 80},
    {"level": 4, "title": "💎 Planet Hero",          "min": 120},
    {"level": 5, "title": "🏆 Eco Champion",         "min": 200},
]

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            items_count INTEGER NOT NULL,
            points_awarded INTEGER NOT NULL,
            co2_saved REAL DEFAULT 0,
            waste_avoided REAL DEFAULT 0,
            purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # ALTER statements to add columns to existing table if they don't exist
    try:
        cur.execute("ALTER TABLE purchases ADD COLUMN co2_saved REAL DEFAULT 0")
    except sqlite3.OperationalError: pass
    try:
        cur.execute("ALTER TABLE purchases ADD COLUMN waste_avoided REAL DEFAULT 0")
    except sqlite3.OperationalError: pass

    conn.commit()
    conn.close()

def get_user_points(user_id: int) -> int:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT COALESCE(SUM(points_awarded), 0) FROM purchases WHERE user_id = ?", (user_id,))
    total = cur.fetchone()[0]
    conn.close()
    return total

def get_level_info(points: int) -> dict:
    current_level = LEVELS[0]
    next_level = None
    for i, lvl in enumerate(LEVELS):
        if points >= lvl["min"]:
            current_level = lvl
            next_level = LEVELS[i + 1] if i + 1 < len(LEVELS) else None
    
    if next_level:
        progress = points - current_level["min"]
        needed = next_level["min"] - current_level["min"]
        percent = min(100, int((progress / needed) * 100))
        pts_to_next = next_level["min"] - points
    else:
        percent = 100
        pts_to_next = 0

    return {
        "level": current_level["level"],
        "title": current_level["title"],
        "progress_percent": percent,
        "pts_to_next_level": pts_to_next,
        "next_level_title": next_level["title"] if next_level else "Max Level Reached"
    }

def get_earned_badges(points: int) -> list:
    return [b for b in BADGES if points >= b["points_required"]]

def get_user_savings(user_id: int) -> dict:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT 
            COALESCE(SUM(co2_saved), 0) as total_co2, 
            COALESCE(SUM(waste_avoided), 0) as total_waste 
        FROM purchases 
        WHERE user_id = ?
    """, (user_id,))
    row = cur.fetchone()
    conn.close()
    return {
        "co2_saved": round(row["total_co2"], 2),
        "waste_avoided": round(row["total_waste"], 2)
    }
