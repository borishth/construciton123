import os
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration (must match ingestion_pipeline.py)
PERSIST_DIRECTORY = "db/chroma_db"
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def get_vectorstore():
    """
    Load the existing ChromaDB vector store.
    """
    if not os.path.exists(PERSIST_DIRECTORY):
        raise FileNotFoundError(
            f"Vector store not found at {PERSIST_DIRECTORY}. Please run ingestion_pipeline.py first."
        )

    print(f"\n--- Loading vector store from {PERSIST_DIRECTORY} ---")

    embedding_model = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)

    vectorstore = Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embedding_model
    )

    return vectorstore


def get_retriever():
    """
    Return retriever (used later for RAG pipeline)
    """
    vectorstore = get_vectorstore()
    return vectorstore.as_retriever(search_kwargs={"k": 3})


def retrieve_context(query: str):
    """
    Combine retrieved chunks into a single context string (used for LLM)
    """
    retriever = get_retriever()
    docs = retriever.invoke(query)

    context = "\n\n".join([doc.page_content for doc in docs])
    return context


def debug_retrieval(query: str, k: int = 3):
    """
    Debug mode: print top-k results with score and metadata
    """
    vectorstore = get_vectorstore()
    results = vectorstore.similarity_search_with_score(query, k=1)

    if not results:
        print("❌ No matching chunks found.")
        return

    print(f"\nTop {k} results for query: {query}")
    print("=" * 70)

    for i, (doc, score) in enumerate(results, 1):
        print(f"\nResult {i}")
        print(f"Score : {score}")
        print(f"Source: {doc.metadata.get('source', 'Unknown')}")
        print("Content:")
        print(doc.page_content)
        print("-" * 70)


if __name__ == "__main__":
    try:
        print("=== DigiQC Retrieval Test Mode ===")

        while True:
            query = input("\nEnter your query (type 'exit' to quit): ").strip()

            if query.lower() == "exit":
                print("Exiting retrieval test.")
                break

            if not query:
                print("⚠️ Please enter a valid query.")
                continue

            debug_retrieval(query, k=3)

    except Exception as e:
        print(f"❌ Error: {e}")