from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import hashlib
import database

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/register")
def register(req: RegisterRequest):
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    conn = database.get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)",
            (req.email.lower().strip(), req.name.strip(), hash_password(req.password))
        )
        conn.commit()
        user_id = cur.lastrowid
        conn.close()
        return {"success": True, "user": {"id": user_id, "email": req.email.lower().strip(), "name": req.name.strip()}}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

@router.post("/login")
def login(req: LoginRequest):
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    conn = database.get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, email, name FROM users WHERE email = ? AND password_hash = ?",
        (req.email.lower().strip(), hash_password(req.password))
    )
    user = cur.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    return {"success": True, "user": {"id": user["id"], "email": user["email"], "name": user["name"]}}
