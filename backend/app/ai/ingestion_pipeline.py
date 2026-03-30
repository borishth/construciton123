import os
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
DOCS_PATH = "docs"
PERSIST_DIRECTORY = "db/chroma_db"
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

def get_embedding_model():
    """Initialize and return the local HuggingFace embedding model"""
    print(f"--- Initializing local embeddings ({EMBEDDING_MODEL_NAME}) ---")
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)

def load_documents(docs_path=DOCS_PATH):
    """Load all text files from the docs directory"""
    print(f"Loading documents from {docs_path}...")
    
    if not os.path.exists(docs_path):
        os.makedirs(docs_path)
        print(f"Created {docs_path} directory. Please add your .txt files there.")
        return []
    
    loader = DirectoryLoader(
        path=docs_path,
        glob="*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"}
    )
    
    documents = loader.load()
    print(f"Loaded {len(documents)} documents.")
    return documents

def split_documents(documents, chunk_size=1000, chunk_overlap=100):
    """Split documents into smaller chunks smartly using multiple separators"""
    print("Splitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        separators=["\n\n", "\n", ". ", " ", ""],
        chunk_size=chunk_size, 
        chunk_overlap=chunk_overlap
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")
    return chunks

def create_vector_store(chunks, persist_directory=PERSIST_DIRECTORY):
    """Create and persist ChromaDB vector store using local embeddings"""
    embedding_model = get_embedding_model()
    
    print(f"--- Creating vector store in {persist_directory} ---")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=persist_directory,
        collection_metadata={"hnsw:space": "cosine"}
    )
    print("--- Finished creating vector store ---")
    return vectorstore

def main():
    """Main ingestion pipeline"""
    print("=== RAG Document Ingestion Pipeline (Local Embeddings) ===\n")
    
    # Check if vector store already exists
    if os.path.exists(PERSIST_DIRECTORY):
        print(f"✅ Vector store already exists at {PERSIST_DIRECTORY}. Skipping ingestion.")
        print("To re-process, delete the directory and run this script again.")
        return
    
    # Step 1: Load documents
    documents = load_documents(DOCS_PATH)  
    if not documents:
        print("❌ No documents found. Please add .txt files to the docs/ folder.")
        return

    # Step 2: Split into chunks
    chunks = split_documents(documents)
    
    # Step 3: Create vector store
    create_vector_store(chunks, PERSIST_DIRECTORY)
    
    print("\n✅ Ingestion complete! Data is stored locally and ready for RAG.")

if __name__ == "__main__":
    main()





# documents = [
#    Document(
#        page_content="Google LLC is an American multinational corporation and technology company focusing on online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, consumer electronics, and artificial intelligence (AI).",
#        metadata={'source': 'docs/google.txt'}
#    ),
#    Document(
#        page_content="Microsoft Corporation is an American multinational corporation and technology conglomerate headquartered in Redmond, Washington.",
#        metadata={'source': 'docs/microsoft.txt'}
#    ),
#    Document(
#        page_content="Nvidia Corporation is an American technology company headquartered in Santa Clara, California.",
#        metadata={'source': 'docs/nvidia.txt'}
#    ),
#    Document(
#        page_content="Space Exploration Technologies Corp., commonly referred to as SpaceX, is an American space technology company headquartered at the Starbase development site in Starbase, Texas.",
#        metadata={'source': 'docs/spacex.txt'}
#    ),
#    Document(
#        page_content="Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas.",
#        metadata={'source': 'docs/tesla.txt'}
#    )
# ]

