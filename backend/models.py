# models.py
from pydantic import BaseModel, Field
from typing import Dict, List, Optional


import uuid


class Message(BaseModel):
    role: str  # "user" or "ai"
    content: str
    image_path: Optional[str] = None
    # Add a field to store the filename when RAG is used
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


"""
class Message(BaseModel):
    role: str  # "user" or "ai"
    content: str
    image_path: Optional[str] = None 

"""

"""
class Conversation(BaseModel):
    # A unique ID for each conversation thread
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str # The first message from the user
    messages: List[Message] = []
"""
class ChatRequest(BaseModel):
    user_email: str
    user_model: str # You can decide if you need this per message
    human_text: str
    # Add conversation_id to handle existing chats
    conversation_id: Optional[str] = None

class User(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    chat_history: List[Conversation] = [] # Use the new Conversation model
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class DeleteChatRequest(BaseModel):
    user_email: str


# models.py

from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

# ... (keep your other models like User, RegisterRequest, etc.) ...
