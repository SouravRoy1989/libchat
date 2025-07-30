

import os
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader # For PDFs

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings

# It's recommended to load the API key from environment variables
OPENAI_API_KEY = ""


def recreate_user_vector_store(rag_files_dir: str, vector_store_path: str):
    """
    Scans a directory for files, processes them, and recreates a FAISS
    vector store at the specified path.

    Args:
        rag_files_dir (str): The directory containing the source files (e.g., PDFs).
        vector_store_path (str): The path where the new FAISS index will be saved.
    """
    print(f"Starting vector store recreation for directory: {rag_files_dir}")
    
    # Scan the directory for all supported files
    all_file_paths = []
    for filename in os.listdir(rag_files_dir):
        # This example only processes PDFs, but you can add more extensions
        if filename.lower().endswith('.pdf'):
            all_file_paths.append(os.path.join(rag_files_dir, filename))
            
    if not all_file_paths:
        print("No files found to process. Aborting vector store creation.")
        return

    # process all documents from the files
    all_docs = []
    for path in all_file_paths:
        try:
            # Using PyPDFLoader for PDF files
            loader = PyPDFLoader(path)
            documents = loader.load()
            all_docs.extend(documents)
        except Exception as e:
            print(f"Error loading or processing {path}: {e}")

    if not all_docs:
        print("No documents were successfully loaded. Aborting.")
        return

    # Split documents to chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    doc_chunks = text_splitter.split_documents(all_docs)
    print(f"Created {len(doc_chunks)} chunks from {len(all_docs)} documents.")

    # Generate embeddings
    try:
        
        embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY) 
        vector_store = FAISS.from_documents(doc_chunks, embeddings)
        
        # Save the recreated vector store to the user's dedicated path
        vector_store.save_local(vector_store_path)
        print(f"Successfully recreated and saved vector store at: {vector_store_path}")
    except Exception as e:
        print(f"An error occurred during vector store creation: {e}")