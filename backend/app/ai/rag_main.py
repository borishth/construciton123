import sys
import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama

# Add the project root (backend/) to sys.path
sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(os.path.abspath(__file__))
        )
    )
)

from app.ai.retriever import retrieve_context

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()

# -----------------------------
# Ollama configuration
# -----------------------------
client = ChatOllama(model="llama3.2")
MODEL_NAME = "llama3.2"


def generate_answer(query: str, context: str) -> str:
    """
    Send retrieved context + user query to Ollama llama3.2 and return the final answer.
    """
    prompt = f"""
You are a strict AI assistant.

You MUST answer ONLY using the information provided in the context below.

STRICT RULES:
1. Do NOT use any outside knowledge.
2. Do NOT guess or assume anything.
3. If the answer is not clearly found in the context, respond EXACTLY with:
   "I could not find the answer in the provided documents."
4. Keep the answer clear, concise, and professional.
5. If the context contains relevant details, summarize them directly.

----- CONTEXT -----
{context}

----- QUESTION -----
{query}

----- ANSWER -----
"""

    try:
        response = client.invoke(prompt)
        return response.content.strip() if response.content else "No response returned."
    except Exception as e:
        return f"Error generating answer: {str(e)}"


def run_rag_query(query: str) -> str:
    """
    Full RAG flow:
    1. User Question
    2. Retrieval
    3. Context
    4. Gemini LLM
    5. Final Answer
    """
    print(f"\n--- USER QUESTION: {query} ---")

    context = retrieve_context(query)

    if not context or not context.strip():
        print("⚠️ No relevant context found in the database.")
        context = "No context available."

    print("\n--- RETRIEVED CONTEXT ---")
    print(context[:2000])

    answer = generate_answer(query, context)

    print("\n--- OLLAMA ANSWER ---")
    print(answer)

    return answer


if __name__ == "__main__":
    print("=== Cost-Efficient Local RAG System ===")

    while True:
        query = input("\nEnter your query (type 'exit' to quit): ").strip()

        if query.lower() == "exit":
            print("Exiting RAG system.")
            break

        answer = run_rag_query(query)
        print("-" * 60)
