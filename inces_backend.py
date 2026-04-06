import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

# Backend AI Integration layer for Sustainability Extension
app = FastAPI(title="Ecosphere Intelligence Backend")

# Allow Chrome Extension to hit this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq (Ensure GROQ_API_KEY is in your environment variables before running)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

class AnalyzeRequest(BaseModel):
    title: str
    fullText: str
    category: str
    material: str

class AnalyzeResponse(BaseModel):
    material: str
    alternative: str
    alt_reason: str
    impact_reason: str

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_product(req: AnalyzeRequest):
    if not client:
        print("WARNING: No GROQ_API_KEY set. Returning fallback data (Mock Rules).")
        return AnalyzeResponse(
            material=req.material if req.material != "unknown" else "synthetic",
            alternative="eco-friendly alternative",
            alt_reason="This choice reduces long-term carbon emissions in its category.",
            impact_reason="Unknown material configuration. Assumed moderate to high impact."
        )
        
    prompt = f"""
    You are an eco-sustainability AI engine.
    Analyze the following E-commerce product:
    Title: {req.title}
    Text Sample: {req.fullText[:600]}
    Current Material Guess: {req.material}
    Current Category Guess: {req.category}
    
    Tasks:
    1. Extract the actual primary material from the text. Allowed tags: plastic, synthetic, cotton, steel, wood, leather, organic, unknown.
    2. Suggest a much more sustainable alternative product of the SAME category (e.g. if plastic furniture -> wooden furniture).
    3. Explain the environmental impact of the extracted material in 1-2 lines.
    4. Explain why the alternative is better in 1-2 lines.

    You MUST return ONLY valid JSON matching this schema exactly (do not wrap in markdown tags):
    {{
      "material": "...",
      "alternative": "...",
      "alt_reason": "...",
      "impact_reason": "..."
    }}
    """
    
    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an API that only returns valid JSON objects."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        raw_out = completion.choices[0].message.content
        print("Raw Groq Output:", raw_out)
        data = json.loads(raw_out)
        
        return AnalyzeResponse(
            material=data.get("material", req.material),
            alternative=data.get("alternative", "sustainable alternative"),
            alt_reason=data.get("alt_reason", "This choice lowers carbon footprint significantly."),
            impact_reason=data.get("impact_reason", "This material contributes heavily to landfills and emissions.")
        )
    except Exception as e:
        print(f"Groq API Error or Parsing Failed: {e}")
        # Soft-fallback on failure to maintain UX
        return AnalyzeResponse(
            material=req.material if req.material != 'unknown' else 'synthetic',
            alternative="sustainable choice",
            alt_reason="AI evaluation failed, but better alternatives exist.",
            impact_reason="Could not deduce AI-impact. Proceed with caution."
        )

if __name__ == "__main__":
    import uvicorn
    # Run with: uvicorn main:app --reload
    uvicorn.run(app, host="0.0.0.0", port=8000)
