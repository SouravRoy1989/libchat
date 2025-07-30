# models.py
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union
from datetime import datetime


import uuid

# --- NEW Models for RAG ---
class RagSource(BaseModel):
    """Defines the structure for a single source document."""
    name: str
    path: str

class RagResponse(BaseModel):
    """Defines the structure for the entire RAG response object."""
    content: str
    sources: List[RagSource]

class Message(BaseModel):
    
    role: str
    # This Union is the key fix. It allows content to be one of several types.
    content: Union[str, RagResponse]
    
    # Optional fields from your other endpoints
    image_path: Optional[str] = None
    file_name: Optional[str] = None

class Conversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    # Add a flag to identify conversations that used RAG
    rag_mode: int = 0  # 0 for normal, 1 for RAG
    messages: List[Message] = []

class RegisterRequest(BaseModel):
    
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str




class ChatRequest(BaseModel):
    user_email: str
    user_model: str 
    human_text: str
    # Add conversation_id to handle existing chats
    conversation_id: Optional[str] = None

class User(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    chat_history: List[Conversation] = [] 
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class DeleteChatRequest(BaseModel):
    user_email: str

class VectorFile(BaseModel):
    """
    Model for storing metadata about uploaded files for RAG.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_email: str
    file_name: str
    file_path: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    
    
class DeleteFileRequest(BaseModel):
    user_email: str
    file_id: str
    
