import uvicorn
from fastapi import FastAPI, HTTPException, status, Response, Request, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
import shutil
from typing import Optional

# Import the specific collection type for better code completion and type checking
from motor.motor_asyncio import AsyncIOMotorCollection
from passlib.context import CryptContext

# --- Local Imports ---
from db_connections import get_user_collection
from utils.file_functions import generate_formatted_name
from models import RegisterRequest, LoginRequest, User, ChatRequest

# --- FastAPI App Configuration ---
# Create the FastAPI app instance
app = FastAPI()

# --- Database Variable ---
# We declare the variable here, but it will be initialized during the app's startup event.
# Using Optional and AsyncIOMotorCollection provides proper type hinting.
user_collection: Optional[AsyncIOMotorCollection] = None

# --- Lifespan Events for DB Connection ---
@app.on_event("startup")
async def startup_db_client():
    """
    This function runs when the FastAPI application starts.
    It establishes the database connection and assigns the collection object.
    """
    # Use 'global' to modify the variable defined in the outer scope
    global user_collection
    MONGO_DATABASE_URL = "mongodb://localhost:27017" # It's good practice to keep the URL here or load from env
    print("Application startup: Initializing database connection...")
    user_collection = await get_user_collection(MONGO_DATABASE_URL)
    
    if user_collection is None:
        # If the connection fails, the app should not start.
        # This provides a clear failure signal.
        raise Exception("Fatal: Could not connect to the database. Application shutting down.")
    print("Application startup: Database connection successful.")


# --- Password Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)


# --- Middleware ---
origins = ["http://localhost:3090"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- API Routes ---
# All routes below will now work correctly because `user_collection` is a
# valid AsyncIOMotorCollection object, initialized during startup.

@app.post("/api/auth/register")
async def register(register_data: RegisterRequest):
    """
    Handles user registration.
    """
    existing_user = await user_collection.find_one({"email": register_data.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A user with this email already exists.")
    
    hashed_password = get_password_hash(register_data.password)
    user_id = str(uuid.uuid4())
    
    folder_name_for_user = generate_formatted_name(register_data.name)
    new_user = {
        "_id": user_id,
        "name": register_data.name,
        "email": register_data.email,
        "password": hashed_password,
        "role": "USER",
        "user_dedicated_folder": folder_name_for_user,
        "audio_files_name": [],
        "chat_history": [],
        "file_name": [],
    }
    
    await user_collection.insert_one(new_user)
    return {"message": "User registered successfully"}


@app.post("/api/auth/login")
async def login(login_data: LoginRequest, response: Response):
    user = await user_collection.find_one({"email": login_data.email})
    
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # NOTE: It's better practice to use a real JWT library for tokens.
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
    
    # SECURITY NOTE: This logic is insecure. You should parse the token to get the user ID
    # and then query the database for that specific user.
    # e.g., user_id = parse_token(token) -> user = await user_collection.find_one({"_id": user_id})
    user = await user_collection.find_one() # This just gets an arbitrary user from the DB.
    if user:
        return {"user": User(**user)}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session.")


@app.get("/api/user")
async def get_user(request: Request):
    """
    Checks for a session cookie and returns the user if found.
    """
    token = request.cookies.get("token")
    if not token:
        return None # No cookie, so no user logged in.
    
    # Same security note as /api/auth/refresh applies here.
    user = await user_collection.find_one()
    if user:
        return User(**user)
    
    return None


@app.get("/api/config")
async def get_config():
    """Provides the frontend with app configuration, including available models."""
    return {
        "appTitle": "LibreChat",
        "endpoints": {
            "openAI": { "apiKey": "user_provided", "models": ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"], "titleConvo": True, "titleModel": "gpt-3.5-turbo" },
            "google": { "apiKey": "user_provided", "models": ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-pro"], "titleConvo": True, "titleModel": "gemini-pro" },
            "anthropic": { "apiKey": "user_provided", "models": ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"], "titleConvo": True, "titleModel": "claude-3-haiku-20240307" },
            "groq": { "apiKey": "user_provided", "models": ["compound", "llama3-70b-8192", "mixtral-8x7b-32768"], "titleConvo": True, "titleModel": "llama3-8b-8192" }
        },
        "registration": { "allowRegistration": True },
        "user": None,
        "serverVersion": "0.0.6-py-mongo",
    }
    
@app.post("/api/chat/invoke")
async def handle_chat(chat_request: ChatRequest):
    """
    Handles an incoming chat message from the user.
    """
    print(f"--- Received Chat Request from {chat_request.user_email} for model {chat_request.user_model} ---")
    print(f"Message: {chat_request.human_text}")
    print("--------------------------------------------------------------------------")

    response_data = {
        "user_query": chat_request.human_text,
        "ai_response": f"This is a hardcoded AI response to your message: {chat_request.human_text}",
        "additional_message": ""
        
    }
    print(response_data)
    return response_data

@app.post("/api/chat/invoke_with_image")
async def handle_chat_with_image(
    user_email: str = Form(...),
    model_name: str = Form(...),
    user_message: str = Form(...),
    image_file: UploadFile = File(...)
):
    """
    Handles a chat message that includes an image upload.
    """
    user = await user_collection.find_one({"email": user_email})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user_folder_name = user.get("user_dedicated_folder")
    if not user_folder_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User folder configuration is missing.")

    base_image_dir = "images"
    user_specific_dir = os.path.join(base_image_dir, user_folder_name)
    os.makedirs(user_specific_dir, exist_ok=True)

    file_path = os.path.join(user_specific_dir, image_file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image_file.file, buffer)

    return {
        "message": "Image uploaded successfully",
        "image_path_on_server": file_path,
        "user_query": user_message,
        "ai_response": f"I have received your image '{image_file.filename}'. What would you like to know about it?"
    }

@app.post("/api/chat/invoke_with_text_file")
async def handle_chat_with_text_file(
    user_email: str = Form(...),
    model_name: str = Form(...),
    user_message: str = Form(...),
    text_file: UploadFile = File(...)
):
    user = await user_collection.find_one({"email": user_email})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user_folder_name = user.get("user_dedicated_folder")
    if not user_folder_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User folder configuration is missing.")

    base_text_dir = "text_files"
    user_specific_dir = os.path.join(base_text_dir, user_folder_name)
    os.makedirs(user_specific_dir, exist_ok=True)

    file_path = os.path.join(user_specific_dir, text_file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(text_file.file, buffer)

    return {
        "message": "Text file uploaded successfully",
        "file_path_on_server": file_path,
        "user_query": user_message,
        "ai_response": f"I have received your file '{text_file.filename}'. How can I help you with it?"
    }

# --- Main entry point for running the app ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)