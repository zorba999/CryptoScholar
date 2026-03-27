# 🎓 Crypto Scholar Quiz AI

A simple decentralized dApp that uses the OpenGradient Verifiable LLM to teach Web3 topics and verify users' answers before minting a "Web3 Diploma" NFT.

## Architecture

1. **Frontend / User**: The user wants to learn about "Zero-Knowledge Proofs". 
2. **Backend Engine (`main.py`)**: 
   - Uses `client.llm.chat()` to generate a lesson and a multiple-choice question.
   - When the user answers, it runs the `verify_answer` endpoint.
   - Importantly, `verify_answer` sets `settlement_mode="BATCH_HASHED"`. This runs the Model fully verifiable.
   - If the AI evaluates the answer as CORRECT, it securely communicates with the Smart Contract.
3. **Smart Contract (`CryptoScholar.sol`)**:
   - Written in Solidity.
   - Exposes `mintDiploma(...)` protected by `onlyOwner`. The backend is the owner.
   - The contract explicitly stores `string memory ogTxHash` inside the mapping so on-chain observers can verify the AI genuinely approved the answer.

## Setup

1. `cd backend`
2. `python -m venv venv`
3. `source venv/bin/activate` or `.\venv\Scripts\activate` on Windows
4. `pip install -r requirements.txt`
5. Create a `.env` file:
    ```env
    OPENGRADIENT_EMAIL=...
    OPENGRADIENT_PRIVATE_KEY=...
    ```
6. Run: `uvicorn main:app --reload`
