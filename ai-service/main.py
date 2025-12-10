"""
HostAI AI Service - FastAPI service for generating listing descriptions using Gemini API
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai
from typing import Dict, Any

app = FastAPI(title="HostAI AI Service", version="1.0.0")

# CORS middleware to allow frontend and Go backend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required")

genai.configure(api_key=GEMINI_API_KEY)

# Cache the model to avoid re-initialization
_model_cache = None
_available_models = None

def get_available_models():
    """List and cache available models"""
    global _available_models
    if _available_models is not None:
        return _available_models
    
    _available_models = []
    try:
        print("\nDiscovering available Gemini models...")
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                # Extract just the model name (e.g., "models/gemini-pro" -> "gemini-pro")
                model_name = model.name.split('/')[-1] if '/' in model.name else model.name
                _available_models.append(model_name)
                print(f"  ✓ Available: {model_name}")
        
        if not _available_models:
            print("  ⚠ No models with generateContent support found")
        else:
            print(f"\nFound {len(_available_models)} available model(s)")
    except Exception as e:
        print(f"⚠ Could not list models: {e}")
        # Fallback to common model names if listing fails
        _available_models = ['gemini-pro', 'gemini-1.5-pro', 'gemini-1.5-flash']
    
    return _available_models

# Function to get the model (lazy initialization with fallback)
def get_model():
    """Get Gemini model with fallback to available models"""
    global _model_cache
    
    # Return cached model if available
    if _model_cache is not None:
        return _model_cache
    
    # Get list of available models
    available_models = get_available_models()
    
    if not available_models:
        raise RuntimeError("No Gemini models available. Please check your API key permissions.")
    
    # Try each available model
    last_error = None
    for model_name in available_models:
        try:
            model = genai.GenerativeModel(model_name)
            _model_cache = model
            print(f"✓ Using model: {model_name}")
            return model
        except Exception as e:
            last_error = e
            print(f"✗ Failed to load model {model_name}: {e}")
            continue
    
    raise RuntimeError(f"Could not initialize any Gemini model. Last error: {last_error}")


class GenerateDescriptionRequest(BaseModel):
    host_input_facts: Dict[str, Any]


class GenerateDescriptionResponse(BaseModel):
    description: str


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-service"}


@app.post("/generate_description", response_model=GenerateDescriptionResponse)
async def generate_description(request: GenerateDescriptionRequest):
    """
    Generate an engaging Airbnb listing description based on host input facts.
    
    Takes host input facts (location, amenities, vibe, capacity, etc.) and
    generates a compelling 3-paragraph listing description using Gemini AI.
    """
    try:
        # Extract facts from the request
        facts = request.host_input_facts
        
        # Debug: Log the received facts - FULL DETAILED OUTPUT
        print(f"\n{'='*60}")
        print(f"📝 RECEIVED HOST INPUT FACTS (RAW):")
        print(f"{'='*60}")
        import json
        print(json.dumps(facts, indent=2))
        print(f"{'='*60}")
        print(f"📝 PARSED FACTS:")
        print(f"  Location: '{facts.get('location', 'NOT PROVIDED')}'")
        print(f"  Amenities: '{facts.get('amenities', 'NOT PROVIDED')}'")
        print(f"  Vibe: '{facts.get('vibe', 'NOT PROVIDED')}'")
        print(f"  Capacity: '{facts.get('capacity', 'NOT PROVIDED')}'")
        print(f"  Additional: '{facts.get('additional_details', 'NOT PROVIDED')}'")
        print(f"{'='*60}\n")
        
        # Build a prompt for Gemini with strict instructions to use only provided facts
        location = facts.get('location', '').strip()
        amenities = facts.get('amenities', '').strip()
        vibe = facts.get('vibe', '').strip()
        capacity = facts.get('capacity', '').strip()
        additional = facts.get('additional_details', '').strip()
        
        # DEBUG: Print the exact prompt being sent
        print(f"\n🔍 PROMPT BEING SENT TO AI:")
        print(f"Location extracted: '{location}'")
        print(f"Amenities extracted: '{amenities}'")
        print(f"Vibe extracted: '{vibe}'")
        print(f"Capacity extracted: '{capacity}'")
        print(f"Additional extracted: '{additional}'")
        
        prompt = f"""You are writing an Airbnb listing description. CRITICAL: Use ONLY the information provided below. Do NOT invent, add, or assume any details that are not explicitly stated.

PROPERTY INFORMATION (USE ONLY THESE FACTS):
- Location: {location if location else 'Not specified'}
- Amenities: {amenities if amenities else 'Not specified'}
- Vibe/Style: {vibe if vibe else 'Not specified'}
- Capacity: {capacity if capacity else 'Not specified'}
- Additional Details: {additional if additional else 'None provided'}

INSTRUCTIONS:
1. Write a 3-paragraph description using ONLY the facts provided above
2. Do NOT add amenities, features, or details that are not listed
3. Do NOT make assumptions about the property beyond what is stated
4. If something is "Not specified", do NOT invent details for it
5. Stay true to the exact location, amenities, vibe, and capacity provided
6. Make it warm, professional, and enticing while being 100% accurate to the provided information

Paragraph 1: Introduce the property and location using the exact location provided
Paragraph 2: Describe the amenities and features using ONLY what is listed in the amenities field
Paragraph 3: Conclude with the vibe/style and what makes it special, using the vibe and additional details provided

Remember: Accuracy is more important than creativity. Use only the provided facts."""

        # Generate description using Gemini
        # Try to get model, and if generation fails, try other available models
        model = get_model()
        response = None
        last_error = None
        
        # DEBUG: Print the full prompt before sending
        print(f"\n📤 FULL PROMPT BEING SENT TO GEMINI:")
        print(f"{'='*60}")
        print(prompt)
        print(f"{'='*60}\n")
        
        # Try the cached model first
        try:
            response = model.generate_content(prompt)
        except Exception as e:
            last_error = e
            error_msg = str(e)
            # If model not found, try other available models
            if "not found" in error_msg.lower() or "404" in error_msg or "NotFound" in str(type(e).__name__):
                print(f"Model failed, trying other available models... Error: {e}")
                # Clear cache and try other available models
                global _model_cache, _available_models
                _model_cache = None
                _available_models = None  # Force re-discovery
                
                available_models = get_available_models()
                for model_name in available_models:
                    try:
                        print(f"Trying model: {model_name}")
                        model = genai.GenerativeModel(model_name)
                        response = model.generate_content(prompt)
                        _model_cache = model  # Cache the working model
                        print(f"✓ Successfully used {model_name}")
                        break
                    except Exception as fallback_error:
                        print(f"✗ {model_name} failed: {fallback_error}")
                        continue
                
                if response is None:
                    raise HTTPException(
                        status_code=500,
                        detail=f"Could not generate description with any available model. Please check your API key has access to Gemini models. Available models: {available_models}"
                    )
            else:
                # Re-raise if it's not a model-not-found error
                raise
        
        # Handle different response formats from Gemini API
        # The response object should have a .text attribute in newer versions
        if hasattr(response, 'text') and response.text:
            description = response.text.strip()
        elif hasattr(response, 'candidates') and len(response.candidates) > 0:
            # Alternative format: access through candidates
            candidate = response.candidates[0]
            if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                description = candidate.content.parts[0].text.strip()
            elif hasattr(candidate, 'text'):
                description = candidate.text.strip()
            else:
                raise ValueError("Unexpected response format from Gemini API")
        else:
            # Last resort: convert to string
            description = str(response).strip()
            if not description or description.startswith('<'):
                raise ValueError("Could not extract text from Gemini API response")
        
        if not description:
            raise ValueError("Empty response from Gemini API")
        
        return GenerateDescriptionResponse(description=description)
    
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        error_msg = str(e)
        # Check for API key errors and provide helpful message
        if "API key" in error_msg or "API_KEY" in error_msg or "invalid" in error_msg.lower():
            raise HTTPException(
                status_code=401,
                detail="Invalid or missing Gemini API key. Please set a valid GEMINI_API_KEY environment variable. Get your API key at: https://makersuite.google.com/app/apikey"
            )
        # Check for model not found errors
        if "not found" in error_msg.lower() or "404" in error_msg or "NotFound" in str(type(e).__name__):
            raise HTTPException(
                status_code=500,
                detail="Gemini model not available. The API key may not have access to the requested model. Try using 'gemini-pro' model or check your API key permissions."
            )
        import traceback
        error_details = traceback.format_exc()
        # Log full error for debugging (check your terminal/console)
        print(f"Full error traceback:\n{error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating description: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

