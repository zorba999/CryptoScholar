import os
import random
import opengradient as og
from openai import OpenAI
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Crypto Scholar Quiz AI", description="Verifiable Web3 Education via OpenGradient")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenGradient LLM Client (TEE)
private_key = os.environ.get("OPENGRADIENT_PRIVATE_KEY", "")
og_client = None
if private_key and private_key != "YOUR_OPENGRADIENT_PRIVATE_KEY":
    try:
        og_client = og.LLM(private_key=private_key)
        og_client.ensure_opg_approval(min_allowance=5)
        print("OpenGradient TEE client ready.")
    except Exception as e:
        print(f"Warning: OG TEE init failed ({e}). Will use fallback OpenAI.")

# Fallback: Direct OpenAI client (same key works differently)
openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "no-key"))

# Question styles so every run is different
QUESTION_STYLES = [
    "Write a tricky misconception-based question where one wrong answer sounds convincing.",
    "Write an analogy-based question that tests deep understanding.",
    "Write a 'what would happen if' scenario question.",
    "Write a definition-matching question with 3 plausible options.",
    "Write a practical application question about real-world use.",
]

class QuizRequest(BaseModel):
    topic: str

class AnswerRequest(BaseModel):
    topic: str
    question: str
    user_answer: str

async def call_llm(messages: list, max_tokens: int = 600) -> tuple[str, str]:
    """Try OpenGradient TEE first, fallback to direct OpenAI. Returns (content, tx_hash)."""
    # Try OG TEE first
    if og_client:
        try:
            response = await og_client.chat(
                model=og.TEE_LLM.CLAUDE_SONNET_4_6,
                messages=messages,
                max_tokens=max_tokens
            )
            chat_dict = getattr(response, "chat_output", {}) or {}
            content = chat_dict.get("content", "")
            tx_hash = getattr(response, "transaction_hash", "external")
            if content:
                return content, tx_hash
        except Exception as e:
            print(f"OG TEE failed, using fallback: {e}")

    # Fallback to direct OpenAI (still real AI, just not TEE-verified)
    try:
        resp = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=max_tokens,
        )
        content = resp.choices[0].message.content or ""
        return content, "0xFALLBACK_NOT_TEE_VERIFIED"
    except Exception as e:
        return f"Error: {e}", "N/A"

@app.post("/generate_lesson")
async def generate_lesson(req: QuizRequest):
    style = random.choice(QUESTION_STYLES)
    seed = random.randint(1000, 9999)
    correct_option = random.choice(["A", "B", "C"])

    print(f"DEBUG: Generating lesson for {req.topic}. Mandated correct option: {correct_option}")

    prompt = f"""[SYSTEM: CRITICAL RANDOMIZATION RULE]
The correct answer for the multiple-choice question below MUST be option **{correct_option})**. 
Randomize your options A, B, and C so that the correct fact is at {correct_option}. Do NOT default to B.

[USER REQUEST]
Explain the Web3 concept '{req.topic}' simply in 1 clear paragraph. Use a relatable analogy.

IMPORTANT: After the explanation, you MUST write "🎯 **Quiz Question:**" followed by exactly 1 multiple-choice question with options **A)**, **B)**, and **C)**. 

Question style: {style}
Variation seed: {seed}
Make it fresh and different from previous responses."""

    content, _ = await call_llm([{"role": "user", "content": prompt}], max_tokens=700)
    return {"lesson_data": content}

@app.post("/verify_answer")
async def verify_answer(req: AnswerRequest):
    prompt = f"""The user is answering a quiz about '{req.topic}'.
Question: {req.question}
User's Answer: {req.user_answer}

Is the user's answer correct based on the question above?
Reply with ONLY the word 'CORRECT' or 'WRONG'. Nothing else."""

    evaluation, og_tx_hash = await call_llm([{"role": "user", "content": prompt}], max_tokens=10)

    is_correct = "CORRECT" in evaluation.upper()

    if is_correct and private_key:
        try:
            from web3 import Web3
            import json

            w3 = Web3(Web3.HTTPProvider('https://sepolia.base.org'))
            
            # Define paths relative to the current script
            current_dir = os.path.dirname(os.path.abspath(__file__))
            address_path = os.path.join(current_dir, "contract_address.txt")
            abi_path = os.path.join(current_dir, "contract_abi.json")

            with open(address_path, "r") as f:
                address = f.read().strip()
            with open(abi_path, "r") as f:
                with open(abi_path, "r") as f_abi:
                    abi = json.load(f_abi)

            contract = w3.eth.contract(address=address, abi=abi)
            account = w3.eth.account.from_key(private_key)

            txn = contract.functions.mintDiploma(
                account.address,
                "ipfs://QmMOCK_DIPLOMA_URI",
                req.topic,
                og_tx_hash
            ).build_transaction({
                'from': account.address,
                'nonce': w3.eth.get_transaction_count(account.address),
                'gas': 300000
            })

            signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
            tx_mint_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            mint_hash_hex = w3.to_hex(tx_mint_hash)

            return {
                "is_correct": True,
                "ai_evaluation": evaluation,
                "verifiable_og_transaction_hash": og_tx_hash,
                "nft_mint_tx": mint_hash_hex,
                "message": f"🎓 NFT Diploma minted! Tx: {mint_hash_hex}"
            }
        except Exception as e:
            return {
                "is_correct": True,
                "ai_evaluation": evaluation,
                "verifiable_og_transaction_hash": og_tx_hash,
                "nft_mint_tx": None,
                "message": f"✅ Correct! (NFT mint failed: {e})"
            }

    return {
        "is_correct": is_correct,
        "ai_evaluation": evaluation,
        "verifiable_og_transaction_hash": og_tx_hash,
        "message": "❌ Wrong answer, try again!" if not is_correct else "✅ Correct!"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
