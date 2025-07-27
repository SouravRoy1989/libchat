import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# --- Configuration ---
# It's recommended to set your OpenAI API key in your environment variables
# for security. If not set, you can pass it directly when initializing embeddings:
# OpenAIEmbeddings(openai_api_key="YOUR_API_KEY")
# os.environ["OPENAI_API_KEY"] = "YOUR_API_KEY" 

FAISS_INDEX_PATH = "faiss_index"
api_key=""
        
def process_and_store_pdfs(pdf_file_paths: list[str], chunk_size: int = 1000, chunk_overlap: int = 200):
    """
    Processes a list of PDF files, splits them into chunks, generates embeddings,
    and stores them in a local FAISS vector store.

    Args:
        pdf_file_paths (list[str]): A list of paths to the PDF files.
        chunk_size (int): The number of characters in each document chunk.
        chunk_overlap (int): The number of characters to overlap between chunks.
    
    Returns:
        FAISS: The FAISS vector store object.
        None: If an error occurs or no documents are processed.
    """
    if not pdf_file_paths:
        print("Error: No PDF file paths provided.")
        return None

    print(f"Loading {len(pdf_file_paths)} PDF(s)...")
    
    all_docs = []
    for path in pdf_file_paths:
        if not os.path.exists(path):
            print(f"Warning: File not found at '{path}'. Skipping.")
            continue
        try:
            # Load the PDF document
            loader = PyPDFLoader(path)
            documents = loader.load()
            
            # Add the source file path and name to each document's metadata
            for doc in documents:
                doc.metadata['source_path'] = path
                doc.metadata['source_name'] = os.path.basename(path)
            
            all_docs.extend(documents)
        except Exception as e:
            print(f"Error loading or processing {path}: {e}")

    if not all_docs:
        print("No documents were successfully loaded. Aborting.")
        return None

    print("Splitting documents into chunks...")
    # Use a recursive character text splitter for effective chunking
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len
    )
    doc_chunks = text_splitter.split_documents(all_docs)

    if not doc_chunks:
        print("Failed to create document chunks. Aborting.")
        return None

    print(f"Created {len(doc_chunks)} document chunks.")
    print("Generating embeddings and creating FAISS index...")

    try:
        
        embeddings = OpenAIEmbeddings(api_key)
        
        
        vector_store = FAISS.from_documents(doc_chunks, embeddings)
        
        
        vector_store.save_local(FAISS_INDEX_PATH)
        
        print(f"FAISS index created and saved at '{FAISS_INDEX_PATH}'")
        return vector_store
    except Exception as e:
        print(f"An error occurred during embedding or FAISS creation: {e}")
        # Check if the OpenAI API key is missing, which is a common issue.
        if "api_key" in str(e).lower():
            print("Please make sure your OPENAI_API_KEY environment variable is set.")
        return None


#the_path = ["C:/libra_dev/pytthon_api/anather_sample.pdf"]

#process_and_store_pdfs(the_path)




def query_vector_store(query: str, k: int = 4):
    """
    Loads a local FAISS index and performs a sim
    ilarity search to retrieve
    document chunks relevant to the user's query.

    Args:
        query (str): The user's query.
        k (int): The number of relevant chunks to retrieve.

    Returns:
        list[dict]: A list of dictionaries, where each dictionary contains
                    the retrieved content, source name, and source path.
                    Returns an empty list if the index doesn't exist or an error occurs.
    """
    if not os.path.exists(FAISS_INDEX_PATH):
        print(f"Error: FAISS index not found at '{FAISS_INDEX_PATH}'.")
        print("Please run the 'process_and_store_pdfs' function first.")
        return []

    try:
        print("Loading FAISS index...")

        embeddings = OpenAIEmbeddings(api_key = api_key)
        

        vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)

        print(f"Searching for chunks relevant to: '{query}'")
        retrieved_docs = vector_store.similarity_search(query, k=k)

        results = []
        for doc in retrieved_docs:
            results.append({
                "content": doc.page_content,
                "source_name": doc.metadata.get('source_name', 'Unknown'),
                "source_path": doc.metadata.get('source_path', 'Unknown')
            })
        
        return results
    except Exception as e:
        print(f"An error occurred during query: {e}")
        return []

query = " how to start a blog? "
out = query_vector_store(query)

print("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", out)
print(type(out))

