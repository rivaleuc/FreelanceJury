# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
import json
from genlayer import *

# A claimant-favoring share >=67 rules for the client, <=33 for the freelancer,
# anything in between is a proportional split. The ruling is derived deterministically
# from client_pct so heterogeneous validators converge on the same label.
def _ruling_for(pct: int) -> str:
    if pct >= 67:
        return "client"
    if pct <= 33:
        return "freelancer"
    return "split"

def _normalize_ruling(parsed: dict) -> dict:
    raw = parsed.get("client_pct", 50)
    try:
        pct = int(round(float(raw)))
    except (TypeError, ValueError):
        pct = 50
    pct = max(0, min(100, pct))
    reasoning = str(parsed.get("reasoning", "")).strip()[:600] or "No rationale provided."
    return {"ruling": _ruling_for(pct), "client_pct": pct, "reasoning": reasoning}


class FreelanceJury(gl.Contract):
    cases: TreeMap[str, str]
    case_count: u256

    def __init__(self):
        self.case_count = u256(0)

    @gl.public.write
    def open_case(self, agreement: str, deliverable_url: str, client_complaint: str, freelancer_defense: str) -> str:
        agreement = str(agreement).strip()
        if not agreement:
            raise Exception("agreement required")

        verdict = self._judge_dispute(agreement, deliverable_url, client_complaint, freelancer_defense)
        key = str(int(self.case_count))
        record = {
            "opener": str(gl.message.sender_address),
            "agreement_preview": agreement[:300],
            "deliverable_url": str(deliverable_url).strip(),
            "ruling": verdict["ruling"],
            "client_pct": verdict["client_pct"],
            "reasoning": verdict["reasoning"],
        }
        self.cases[key] = json.dumps(record)
        self.case_count += u256(1)
        return key

    def _judge_dispute(self, agreement: str, deliverable_url: str, complaint: str, defense: str) -> dict:
        def leader_fn() -> str:
            deliverable = "(not fetched)"
            if deliverable_url and str(deliverable_url).startswith("http"):
                try:
                    raw = gl.nondet.web.get(str(deliverable_url))
                    deliverable = raw.body.decode("utf-8")[:3000]
                except Exception:
                    deliverable = "(fetch failed)"

            prompt = f"""You are an arbitrator for a freelance dispute.

AGREEMENT:
{agreement[:2000]}

DELIVERABLE (fetched):
{deliverable}

CLIENT COMPLAINT: {str(complaint)[:500]}
FREELANCER DEFENSE: {str(defense)[:500]}

RULES:
1. Judge based on the agreement terms. Did the freelancer deliver what was promised?
2. Assign client_pct (0-100): how much of the escrow returns to the client.
3. Briefly justify the split.

Reply ONLY valid JSON:
{{"client_pct": <0-100>, "reasoning": "<brief>"}}"""
            raw = gl.nondet.exec_prompt(prompt, response_format="json")
            parsed = raw if isinstance(raw, dict) else json.loads(str(raw).strip())
            return json.dumps(_normalize_ruling(parsed))

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            try:
                data = json.loads(leader_result.calldata)
            except Exception:
                return False
            pct = data.get("client_pct")
            if isinstance(pct, bool) or not isinstance(pct, int) or pct < 0 or pct > 100:
                return False
            if not isinstance(data.get("reasoning"), str) or not data["reasoning"].strip():
                return False
            # deterministic anchor: ruling must follow the client_pct band
            if data.get("ruling") != _ruling_for(pct):
                return False
            return True

        return json.loads(gl.vm.run_nondet_unsafe(leader_fn, validator_fn))

    @gl.public.view
    def get_case(self, key: str) -> dict:
        key = str(key)
        if key not in self.cases:
            return {"exists": False}
        return json.loads(self.cases[key])

    @gl.public.view
    def read_verdict(self, key: str) -> dict:
        key = str(key)
        if key not in self.cases:
            return {"resolved": False}
        c = json.loads(self.cases[key])
        return {"resolved": True, "ruling": c["ruling"], "client_pct": c["client_pct"]}

    @gl.public.view
    def stats(self) -> dict:
        return {"total_cases": int(self.case_count)}
