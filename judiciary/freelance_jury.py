import json
from genlayer import *


@gl.contract
class FreelanceJury:
    cases: TreeMap[str, str]
    case_count: u256

    def __init__(self):
        self.case_count = u256(0)

    @gl.public.write
    def open_case(
        self,
        agreement: str,
        deliverable_url: str,
        client_complaint: str,
        freelancer_defense: str,
    ) -> str:
        deliverable_content = gl.get_webpage(deliverable_url, "Return the full page content")

        prompt = (
            "You are a neutral arbitrator for freelancer-client disputes.\n"
            f"AGREEMENT:\n{agreement}\n\n"
            f"DELIVERABLE (fetched from {deliverable_url}):\n{deliverable_content}\n\n"
            f"CLIENT COMPLAINT:\n{client_complaint}\n\n"
            f"FREELANCER DEFENSE:\n{freelancer_defense}\n\n"
            "Based on the agreement terms, the actual deliverable, and both arguments, "
            "produce a JSON verdict with exactly these fields:\n"
            '- ruling: "client" or "freelancer" or "split"\n'
            "- client_pct: integer 0-100 (percentage of escrowed funds client receives)\n"
            "- reasoning: brief explanation\n"
            "Respond ONLY with valid JSON."
        )

        result = gl.exec_prompt(prompt)
        verdict = json.loads(result)

        self.case_count = u256(int(self.case_count) + 1)
        key = str(self.case_count)

        case_data = {
            "agreement": agreement,
            "deliverable_url": deliverable_url,
            "client_complaint": client_complaint,
            "freelancer_defense": freelancer_defense,
            "verdict": verdict,
        }
        self.cases[key] = json.dumps(case_data)
        return key

    @gl.public.view
    def get_case(self, key: str) -> str:
        return self.cases[key]

    @gl.public.view
    def read_verdict(self, key: str) -> str:
        case_data = json.loads(self.cases[key])
        return json.dumps(case_data["verdict"])

    @gl.public.view
    def stats(self) -> str:
        return json.dumps({"total_cases": int(self.case_count)})
