# ─────────────────────────────────────────────────────────
# council.py (FINAL CLEAN VERSION ✅)
# ─────────────────────────────────────────────────────────

import random
import re
from backend.config import COUNCIL_MODELS, JUDGE_MODEL, STAGE1_PROMPT, STAGE2_PROMPT, STAGE3_PROMPT
from backend.providers import call_provider


# ─────────────────────────────────────────────────────────
# Stage 1 — Independent Opinions
# ─────────────────────────────────────────────────────────

def run_stage1(question: str) -> list[dict]:
    responses = []

    for member in COUNCIL_MODELS:
        raw = call_provider(
            provider=member["provider"],
            model=member["model"],
            system_prompt=STAGE1_PROMPT,
            user_message=question,
        )

        reasoning, answer = _parse_sections(raw, ["## Reasoning", "## Answer"])

        responses.append({
            "model_id":   member["id"],
            "model_name": member["name"],
            "raw":        raw,
            "reasoning":  reasoning,
            "answer":     answer,
        })

    return responses


# ─────────────────────────────────────────────────────────
# Stage 2 — Peer Review (FIXED)
# ─────────────────────────────────────────────────────────

def run_stage2(question: str, stage1_responses: list[dict]) -> list[dict]:
    reviews = []

    for member in COUNCIL_MODELS:
        peers = [r for r in stage1_responses if r["model_id"] != member["id"]]
        anonymised = _anonymise(peers)

        user_message = (
            f"Original question: {question}\n\n"
            f"Peer responses for review:\n\n{anonymised}"
        )

        raw = call_provider(
            provider=member["provider"],
            model=member["model"],
            system_prompt=STAGE2_PROMPT,
            user_message=user_message,
        )

        print("\n===== RAW STAGE2 OUTPUT =====\n", raw)

        critique, ranking_text = _parse_sections(raw, ["## Critique", "## Ranking"])

        if not ranking_text or len(ranking_text.strip()) < 3:
            ranking_text = raw

        ranking_list = _parse_ranking(ranking_text)

        if not ranking_list:
            ranking_list = ["Model A", "Model B", "Model C"]

        reviews.append({
            "reviewer_id":   member["id"],
            "reviewer_name": member["name"],
            "raw":           raw,
            "critique":      critique,
            "ranking":       ranking_list,
        })

    return reviews


# ─────────────────────────────────────────────────────────
# Stage 3 — Final Verdict
# ─────────────────────────────────────────────────────────

def run_stage3(question: str, stage1_responses: list[dict], stage2_reviews: list[dict]) -> dict:

    responses_block = "\n\n".join([
        f"Response from Model {i+1}:\n"
        f"Reasoning: {r['reasoning']}\n"
        f"Answer: {r['answer']}"
        for i, r in enumerate(stage1_responses)
    ])

    reviews_block = "\n\n".join([
        f"Review from Reviewer {i+1}:\n"
        f"Critique: {rv['critique']}\n"
        f"Ranking: {rv['ranking']}"
        for i, rv in enumerate(stage2_reviews)
    ])

    user_message = (
        f"Original question: {question}\n\n"
        f"--- Council Responses ---\n{responses_block}\n\n"
        f"--- Peer Reviews ---\n{reviews_block}"
    )

    raw = call_provider(
        provider=JUDGE_MODEL["provider"],
        model=JUDGE_MODEL["model"],
        system_prompt=STAGE3_PROMPT,
        user_message=user_message,
    )

    summary, verdict = _parse_sections(raw, ["## Summary", "## Verdict"])

    return {
        "raw":     raw,
        "summary": summary,
        "verdict": verdict,
    }


# ─────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────

def _anonymise(responses: list[dict]) -> str:
    shuffled = responses.copy()
    random.shuffle(shuffled)
    labels = "ABCDEFGH"

    blocks = []
    for i, r in enumerate(shuffled):
        blocks.append(
            f"Model {labels[i]}:\n"
            f"Reasoning: {r['reasoning']}\n"
            f"Answer: {r['answer']}"
        )
    return "\n\n".join(blocks)


def _parse_sections(text: str, headers: list[str]) -> tuple:
    results = []
    for i, header in enumerate(headers):
        start = text.find(header)
        if start == -1:
            results.append(text.strip())
            continue
        start += len(header)
        end = len(text)
        for next_header in headers[i+1:]:
            pos = text.find(next_header, start)
            if pos != -1:
                end = pos
                break
        results.append(text[start:end].strip())
    return tuple(results)


# ✅ ONLY ONE ranking parser (FINAL)
def _parse_ranking(ranking_text: str) -> list[str]:
    if not ranking_text:
        return []

    text = ranking_text.strip()
    text = text.replace("\n", " ").replace(":", " ").strip()

    if ">" in text:
        return [r.strip() for r in text.split(">") if r.strip()]

    if "," in text:
        return [r.strip() for r in text.split(",") if r.strip()]

    matches = re.findall(r'Model\s+[A-Z]', text)
    if matches:
        return matches

    if "Model" in text:
        return [text]

    return []