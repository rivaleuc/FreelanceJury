# FreelanceJury

AI-powered freelancer vs client dispute resolution. An AI arbitrator reads the agreement, fetches the deliverable, weighs both sides, and issues a binding verdict.

## Structure

- **judiciary/** — GenLayer intelligent contract that acts as the AI judge
- **escrow/** — Solidity escrow contract (Foundry) that splits funds based on ruling
- **portal/** — Vanilla HTML + htmx frontend for submitting disputes

## How It Works

1. Client deposits funds into `DisputeEscrow.sol`
2. Either party opens a case via `FreelanceJury` GenLayer contract
3. AI reads the agreement, fetches the deliverable URL, and evaluates both arguments
4. Verdict is returned: `client`, `freelancer`, or `split` with a percentage
5. Resolver calls `DisputeEscrow.resolve()` to distribute funds accordingly

## Verdict Format

```json
{"ruling": "client|freelancer|split", "client_pct": 0-100, "reasoning": "..."}
```

## Deploy

```bash
genlayer deploy --contract judiciary/freelance_jury.py
```

## Test

```bash
genlayer call --method open_case \
  --args '{"agreement":"Build a 5-page responsive website per provided mockups","deliverable_url":"https://example.com/project","client_complaint":"Design looks nothing like mockups, ugly and unresponsive","freelancer_defense":"Followed mockups closely, client changed requirements mid-project without updating agreement"}'
```
