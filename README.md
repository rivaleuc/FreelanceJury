# FreelanceJury

Decentralized freelance dispute resolution. AI validators read the agreement, fetch the deliverable, and rule by consensus.

## Why This Exists

Freelance disputes are expensive and slow. Platforms take 20% and still can't fairly resolve "the work wasn't what I asked for." FreelanceJury puts dispute resolution on-chain — AI validators read the original agreement, fetch the actual deliverable, and rule on whether the work meets the terms.

## Why GenLayer

- **Fetches real deliverables** — Validators don't just read claims. They fetch the actual work product (live URLs, documents, repos) and inspect it against the agreement.
- **Reads and interprets agreements** — "Build a responsive landing page" means something specific. AI validators understand scope, quality expectations, and deliverable completeness.
- **Weighs competing narratives** — Both parties tell their story. Validators assess credibility, evidence, and whether the work objectively meets the stated requirements.
- **Judgment, not computation** — "Is this website complete?" cannot be answered by a deterministic VM. It requires looking at the site, checking functionality, and comparing against specs.
- **Escrow integration** — Ruling triggers automatic fund release or refund. No human arbitrator needed, no weeks of back-and-forth.

## Structure

```
FreelanceJury/
├── judiciary/      # GenLayer contract — dispute resolution logic
├── escrow/         # Foundry Solidity — fund escrow + release
├── portal/         # Vanilla HTML + htmx — dispute filing UI
└── README.md
```

## Test Results

```
Input:  Agreement: "Deliver a working portfolio site with 5 pages"
        Deliverable URL: [fetched by validators]
Result: RULING — Client wins (100% refund)
        Reason: Deliverable had broken links, only 3 pages, incomplete styling
```

## Deployment

- **Network:** GenLayer Testnet
- **Contract:** `0xd8933a6440530a871f93110bF35102db37528787`

## Quick Start

```bash
cd portal && open index.html
# File a dispute: paste agreement + deliverable URL
# Validators fetch, inspect, and rule
```
