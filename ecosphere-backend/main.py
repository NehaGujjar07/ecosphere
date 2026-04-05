from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import scanner, food, auth, gamification
import database
import uvicorn

app = FastAPI(title="EcoSphere API", version="2.0.0")

# Initialize DB on startup
database.init_db()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the EcoSphere API v2"}

# Feature routers
app.include_router(scanner.router,      prefix="/api",       tags=["Scanner"])
app.include_router(food.router,         prefix="/api/food",  tags=["Food"])
app.include_router(auth.router,         prefix="/api/auth",  tags=["Auth"])
app.include_router(gamification.router, prefix="/api/game",  tags=["Gamification"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
