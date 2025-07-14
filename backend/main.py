import uvicorn
from fastapi import FastAPI, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# --- Database Configuration ---
MONGO_DATABASE_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_DATABASE_URL)
database = client.librechat_db
user_collection = database.get_collection("users")

# --- Password Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- FastAPI App Configuration ---
app = FastAPI()

origins = ["http://localhost:3090"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    avatar: Optional[str] = None
    role: str = "USER"
    class Config:
        populate_by_name = True

# --- API Endpoints ---

@app.post("/api/auth/register")
async def register(register_data: RegisterRequest):
    """
    Handles user registration.
    Checks for existing users, hashes the password, and creates a new user
    document with additional empty collections for user-specific data.
    """
    # --- Existing Logic ---
    existing_user = await user_collection.find_one({"email": register_data.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A user with this email already exists.")
    
    hashed_password = get_password_hash(register_data.password)
    user_id = str(uuid.uuid4())
    
    # --- Modified User Document ---
    new_user = {
        "_id": user_id,
        "name": register_data.name,
        "email": register_data.email,
        "password": hashed_password,
        "role": "USER",
        # --- New Changes: Added empty collections for user properties ---
        "audio_files_name": [],
        "chat_history": [],
        "file_name": [],
    }
    
    # --- Existing Logic ---
    await user_collection.insert_one(new_user)
    return {"message": "User registered successfully"}


@app.post("/api/auth/login")
async def login(login_data: LoginRequest, response: Response):
    user = await user_collection.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    response.set_cookie(key="token", value=f"fake-jwt-for-{user['_id']}", httponly=True)
    return {"user": User(**user)}

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out successfully"}

@app.post("/api/auth/refresh")
async def refresh_token(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired.")
    user = await user_collection.find_one()
    if user:
        return {"user": User(**user)}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session.")


@app.get("/api/user")
async def get_user(request: Request):
    """
    Checks for a session cookie and returns the user if found.
    This is critical for the frontend to know if a user is already logged in.
    """
    token = request.cookies.get("token")
    if not token:
        return None # No cookie, so no user logged in.
    
    # In a real app, you'd decode the token to get the user ID.
    # Here, we'll just find the first user as a demonstration.
    user = await user_collection.find_one()
    if user:
        return User(**user)
    
    return None


@app.get("/api/config")
async def get_config():
    """Provides the frontend with app configuration, including available models."""
    print("Serving /api/config with model data")
    return {
        "appTitle": "LibreChat",
        "endpoints": {
            "openAI": {
                "apiKey": "user_provided",
                "models": ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
                "titleConvo": True,
                "titleModel": "gpt-3.5-turbo",
            },
            "google": {
                "apiKey": "user_provided",
                "models": ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-pro"],
                 "titleConvo": True,
                "titleModel": "gemini-pro",
            },
            "anthropic": {
                 "apiKey": "user_provided",
                 "models": ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
                 "titleConvo": True,
                 "titleModel": "claude-3-haiku-20240307",
            },
            "groq": {
                "apiKey": "user_provided",
                "models": ["compound", "llama3-70b-8192", "mixtral-8x7b-32768"],
                "titleConvo": True,
                "titleModel": "llama3-8b-8192",
            }
        },
        "registration": { "allowRegistration": True },
        "user": None,
        "serverVersion": "0.0.6-py-mongo",
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
