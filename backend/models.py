# models.py
from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class ChatRequest(BaseModel):
    human_text: str
    user_email: str # This field is now mandatory
    user_model: str
    
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

