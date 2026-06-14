# FreelanceJury

Decentralized freelance dispute resolution. AI validators read the agreement, fetch the deliverable, and rule by consensus.

## Why GenLayer

Freelance disputes are judgment problems:

- **Reading a contract and deciding if it was fulfilled requires interpretation.** "Build a responsive landing page" — did they? That's not a yes/no a computer can answer by checking a hash.
- **Validators fetch the actual deliverable.** Using `gl.nondet.web.get`, they pull the work product from the URL and examine it against the agreement terms. No trust required.
- **Both sides get heard.** The contract weighs client complaint against freelancer defense — like a real arbitrator, not a coin flip.
- **Proportional rulings.** Not just "client wins" or "freelancer wins" — the AI can rule a split (e.g., 70% to client if work was partially done).
- **Instant and cheap.** Traditional arbitration costs thousands and takes weeks. This settles in minutes.

## Deployed

**GenLayer (Bradbury):** `0xd8933a6440530a871f93110bF35102db37528787`

## Structure

```
FreelanceJury/
├── judiciary/
│   └── freelance_jury.py    ← GenLayer contract
├── escrow/
│   └── src/DisputeEscrow.sol ← Foundry escrow
├── portal/
│   └── index.html           ← htmx frontend
└── README.md
```
