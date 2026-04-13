import os
from langchain_ollama import ChatOllama
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MODEL_NAME = "llama3.2"
OLLAMA_LLM_BASE_URL = os.getenv("OLLAMA_LLM_BASE_URL")

# Initialize Ollama Client
client = ChatOllama(
    model=MODEL_NAME,
    base_url=OLLAMA_LLM_BASE_URL,
    temperature=0,
)


def generate_answer(query: str, context: str):
    """
    Combines the user query and retrieved context into a strict prompt
    and generates a final answer using the local Ollama llama3.2 model.
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
----- END CONTEXT -----

USER QUESTION:
{query}

FINAL ANSWER (based ONLY on context):
"""

    print(f"--- Generating answer using {MODEL_NAME} (Ollama) ---")

    try:
        response = client.invoke(prompt)
        return response.content.strip()
    except Exception as e:
        return f"Error communicating with Ollama: {e}"


if __name__ == "__main__":
    # Test generation
    sample_context = "Google LLC is an American multinational technology company."
    sample_query = "What is Google LLC?"
    print(generate_answer(sample_query, sample_context))
