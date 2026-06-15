# FreelanceJury

**On-chain arbitration for freelance disputes — AI validators read the agreement, fetch the actual deliverable, and rule by consensus.**

FreelanceJury settles "did the freelancer deliver what was promised?" without a human arbitrator, an escrow agent, or a trusted backend. The contract takes the agreement, the client's complaint, and the freelancer's defense, then a network of validators independently fetches the deliverable from its URL and judges the dispute against the agreement terms. The verdict — `client`, `freelancer`, or `split` with a precise refund percentage — is the value the network agrees on, stored permanently on chain.

- **Contract (Bradbury, chain 4221):** `0xd8933a6440530a871f93110bF35102db37528787`
- **Explorer:** https://explorer-bradbury.genlayer.com/contract/0xd8933a6440530a871f93110bF35102db37528787
- **Live app:** https://freelancejury.pages.dev

## What it does

The lifecycle is a single intelligent transaction plus cheap reads:

1. **`open_case(agreement, deliverable_url, client_complaint, freelancer_defense)`** — a `@gl.public.write` method. It validates the agreement is non-empty, runs the dispute through the validator network, stores the verdict in the `cases` `TreeMap[str, str]` keyed by an incrementing `case_count`, and returns the case key.
2. Inside `open_case`, the private `_judge_dispute(...)` builds a non-deterministic block:
   - **Validators crawl the deliverable.** `leader_fn` calls `gl.nondet.web.get(deliverable_url)` and decodes the first 3000 bytes of the body, so each validator examines the *real* work product rather than a claim about it.
   - **An LLM acts as arbitrator.** `gl.nondet.exec_prompt(prompt, response_format="json")` is handed the agreement, the fetched deliverable, the client complaint and the freelancer defense, and must reply with `{"ruling": "client"/"freelancer"/"split", "client_pct": <0-100>, "reasoning": "..."}`.
   - **Consensus via `gl.vm.run_nondet_unsafe(leader_fn, validator_fn)`.** The leader proposes a verdict; every validator runs `validator_fn`, which checks the result is a `gl.vm.Return`, that `ruling` is one of the three allowed values, and that `client_pct` is an `int` in `[0, 100]`. Validators agree on the *shape and legality* of the ruling, not on byte-identical LLM text.
3. **Reads** are free `@gl.public.view` calls: `get_case(key)` returns the full record, `read_verdict(key)` returns `{resolved, ruling, client_pct}` for downstream automation (e.g. an escrow release), and `stats()` returns `{total_cases}`.

State lives entirely in the `cases` `TreeMap`; each entry is a JSON record holding the opener address, an agreement preview, the deliverable URL, the ruling, the client percentage, and the reasoning.

## Why GenLayer

A deterministic EVM cannot do this. Deciding whether "build a responsive landing page" was actually fulfilled is an act of interpretation — there is no hash to compare, no on-chain oracle that returns "yes, it's responsive." Pulling the live deliverable from an arbitrary URL is non-deterministic by nature; two nodes calling the same URL can see different bytes, which would break EVM consensus instantly.

GenLayer's **Optimistic Democracy** is built for exactly this. Validators are allowed to do non-deterministic work (web fetches, LLM reasoning) and then *vote* on whether the leader's outcome is acceptable. The contract encodes the rules of arbitration; the validators supply the judgment.

Use FreelanceJury when the dispute hinges on reading and interpreting unstructured work against a written agreement. Use a plain backend when the rule is mechanical and verifiable on chain (a hash match, a numeric threshold, a signature) — that does not need a validator network.

## Architecture

| GenLayer contract | Frontend dir | EVM / off-chain |
| --- | --- | --- |
| `judiciary/freelance_jury.py` | `portal/` (React + Vite) | `escrow/src/DisputeEscrow.sol` (Foundry escrow that can act on `read_verdict`) |

## Tech

- **GenVM Python**, pinned to `py-genlayer:1jb45aa8…jpz09h6` via the `# { "Depends": ... }` header. State uses typed storage: `TreeMap[str, str]` and `u256` counters.
- **`genlayer-js`** drives all reads (`client.readContract`) against `testnetBradbury`. Writes go through **MetaMask with no Snap required** — the app talks to `window.ethereum` directly, ensures the wallet is on **chain 4221** (`0x107d`, adding the Bradbury network if missing), and submits via `client.writeContract`, then waits for `FINALIZED`.
- **App-specific UI:** a React 19 + Vite portal styled with Tailwind v4, `framer-motion` transitions, and `sonner` toasts — a case-filing form (agreement / deliverable URL / both sides' statements) and a verdict view showing ruling and the client/freelancer split.

## Project structure

```
FreelanceJury/
├── judiciary/
│   └── freelance_jury.py        ← GenLayer contract (arbitration logic)
├── escrow/
│   ├── foundry.toml
│   ├── src/DisputeEscrow.sol     ← EVM escrow, settles on the verdict
│   └── test/
├── portal/                       ← frontend (Cloudflare Pages root)
│   ├── src/
│   │   ├── App.tsx               ← case-filing + verdict UI
│   │   ├── genlayer.ts           ← client, wallet, read/write helpers
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Develop

```bash
cd portal
npm install
npm run dev      # local dev server (Vite)
npm run build    # type-check + production build to dist/
```

## Deploy the frontend

Cloudflare Pages:

- **Root directory:** `portal`
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:** `NODE_VERSION=20`

## Why GenLayer (engineering notes)

Real gotchas learned building this:

- **Integers, not floats.** `client_pct` is an `int` in `[0, 100]` and `validator_fn` rejects anything else. Percentages and money are integer basis points — never floats — so validators reach byte-stable agreement.
- **Validate structure, not exact LLM output.** `validator_fn` checks the *schema* (`ruling` in the allowed set, `client_pct` an int in range) and never compares the leader's reasoning string. Demanding identical LLM text would make consensus impossible.
- **ACCEPTED ≠ executed.** A transaction reaching consensus means validators accepted the ruling's validity, not that any payout happened. The EVM escrow must read `read_verdict` and act on it as a separate step.
- **Optimistic finality has an appeal window.** A verdict is provisional until the appeal window passes; the frontend waits for `FINALIZED` before treating a ruling as settled.
- **Evidence is untrusted (greybox).** The deliverable is fetched from a user-supplied URL. The prompt treats fetched content as adversarial input — a deliverable page cannot be allowed to "instruct" the arbitrator — and fetch failures degrade gracefully to `(fetch failed)` rather than crashing the case.

## License

MIT
