import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Get API key from environment
api_key = os.getenv("GEMINI_API_KEY")
MODEL_NAME = "gemini-2.0-flash"


# Initialize Gemini Client
genai.configure(api_key=api_key)


def generate_answer(query: str, context: str):
    """
    Combines the user query and retrieved context into a strict prompt
    and generates a final answer using the Gemini API.
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

    print(f"--- Generating answer using {MODEL_NAME} ---")

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        return f"Error communicating with Gemini: {e}"


if __name__ == "__main__":
    # Test generation
    sample_context = "Google LLC is an American multinational technology company."
    sample_query = "What is Google LLC?"
    print(generate_answer(sample_query, sample_context))