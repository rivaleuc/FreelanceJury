import { useState } from 'react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'

const CONTRACT = '0xd8933a6440530a871f93110bF35102db37528787'

type Ruling = 'client' | 'freelancer' | 'split'

interface Verdict {
  ruling: Ruling
  clientPct: number
  reasoning: string
  caseTitle: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

const steps = [
  {
    n: '01',
    title: 'File the Case',
    body: 'Submit the original agreement, the deliverable URL, and both sides of the story — client complaint and freelancer defense.',
  },
  {
    n: '02',
    title: 'AI Arbitration',
    body: 'A non-deterministic AI arbitrator fetches the deliverable, reads the contract terms, and weighs the evidence against what was promised.',
  },
  {
    n: '03',
    title: 'On-Chain Verdict',
    body: 'Validators reach consensus on the ruling. The verdict and proportional split are written immutably to the escrow contract.',
  },
]

const features = [
  {
    icon: '⚖️',
    title: 'Impartial by Design',
    body: 'No human bias, no favoritism. The arbitrator judges strictly against the written agreement.',
  },
  {
    icon: '🔗',
    title: 'Deliverable Forensics',
    body: 'The AI actually fetches and inspects the deliverable URL — broken links and missing scope are caught.',
  },
  {
    icon: '📜',
    title: 'Proportional Rulings',
    body: 'Disputes are rarely black and white. Verdicts can award a precise split between both parties.',
  },
  {
    icon: '🛡️',
    title: 'Escrow-Backed',
    body: 'Funds are held in a smart-contract escrow and released automatically the moment the verdict lands.',
  },
  {
    icon: '🧾',
    title: 'Immutable Record',
    body: 'Every case file, ruling, and reasoning is permanently recorded on-chain for full auditability.',
  },
  {
    icon: '⏱️',
    title: 'Resolution in Minutes',
    body: 'Skip the months-long mediation. Most cases reach a binding verdict in a single block window.',
  },
]

function rulingLabel(r: Ruling) {
  if (r === 'client') return 'CLIENT WINS'
  if (r === 'freelancer') return 'FREELANCER WINS'
  return 'SPLIT RULING'
}

export default function App() {
  const [agreement, setAgreement] = useState('')
  const [deliverable, setDeliverable] = useState('')
  const [complaint, setComplaint] = useState('')
  const [defense, setDefense] = useState('')
  const [loading, setLoading] = useState(false)
  const [verdict, setVerdict] = useState<Verdict | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreement.trim()) {
      toast.error('An agreement is required to open a case.')
      return
    }
    setLoading(true)
    setVerdict(null)
    toast.loading('The jury is deliberating…', { id: 'jury' })

    setTimeout(() => {
      // Simulated arbitration outcome
      const clientPct = 65
      const v: Verdict = {
        ruling: 'split',
        clientPct,
        caseTitle: 'Marketing Site Rebuild — Scope Dispute',
        reasoning:
          'The freelancer delivered a functional site, but two contracted pages (pricing, careers) were missing and the responsive breakpoints specified in the agreement were not met. Partial value was delivered, so a majority refund is awarded to the client.',
      }
      setVerdict(v)
      setLoading(false)
      toast.success('Verdict delivered — case closed.', { id: 'jury' })
    }, 3000)
  }

  const clientPct = verdict ? verdict.clientPct : 0
  const freelancerPct = 100 - clientPct

  return (
    <div className="min-h-screen bg-[#131A2E] text-slate-200 antialiased selection:bg-[#B8860B]/30">
      <Toaster theme="dark" position="top-center" richColors />

      {/* subtle texture / glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(184,134,11,0.10),transparent_55%)]" />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-[#B8860B]/20 bg-[#131A2E]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-[#B8860B]/40 bg-[#0e1424] text-xl text-[#B8860B] shadow-inner">
              ⚖
            </span>
            <span className="font-serif text-xl tracking-wide text-slate-100">
              Freelance<span className="text-[#B8860B]">Jury</span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#how" className="transition hover:text-[#B8860B]">How it Works</a>
            <a href="#features" className="transition hover:text-[#B8860B]">The Docket</a>
            <a href="#demo" className="transition hover:text-[#B8860B]">File a Case</a>
          </div>
          <a
            href="#demo"
            className="rounded-md border border-[#B8860B]/50 bg-[#B8860B]/10 px-4 py-2 text-sm font-medium text-[#E3B23C] transition hover:bg-[#B8860B]/20"
          >
            Open Court
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-xs uppercase tracking-[0.35em] text-[#B8860B]"
        >
          Decentralized Arbitration
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-5xl leading-tight text-slate-50 md:text-6xl"
        >
          Justice for every<br />
          <span className="text-[#B8860B]">freelance dispute.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-400"
        >
          When a project goes wrong, FreelanceJury convenes an impartial AI arbitrator that reads
          the agreement, inspects the deliverable, and renders a binding, on-chain verdict — client,
          freelancer, or a fair split.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#demo"
            className="rounded-md bg-[#B8860B] px-7 py-3 font-semibold text-[#131A2E] shadow-lg shadow-[#B8860B]/20 transition hover:bg-[#d29c1e]"
          >
            File a Case →
          </a>
          <a
            href="#how"
            className="rounded-md border border-slate-700 px-7 py-3 font-medium text-slate-300 transition hover:border-[#B8860B]/50 hover:text-[#B8860B]"
          >
            See the Process
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#B8860B]/20 bg-[#0e1424] px-4 py-1.5 font-mono text-xs text-slate-500"
        >
          <span className="h-2 w-2 rounded-full bg-[#B8860B]" />
          Verdict Contract
          <span className="text-[#E3B23C]">{CONTRACT.slice(0, 10)}…{CONTRACT.slice(-6)}</span>
        </motion.div>
      </header>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-serif text-3xl text-slate-50 md:text-4xl"
        >
          How the Court Convenes
        </motion.h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="relative rounded-xl border border-[#B8860B]/20 bg-[#0e1424] p-7"
            >
              <span className="font-serif text-4xl text-[#B8860B]/40">{s.n}</span>
              <h3 className="mt-3 font-serif text-xl text-slate-100">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-y border-[#B8860B]/10 bg-[#0e1424]/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center font-serif text-3xl text-slate-50 md:text-4xl"
          >
            Why the Bench Holds Up
          </motion.h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-xl border border-slate-800 bg-[#131A2E] p-6 transition hover:border-[#B8860B]/40"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg border border-[#B8860B]/30 bg-[#0e1424] text-xl">
                  {f.icon}
                </div>
                <h3 className="font-serif text-lg text-slate-100">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="mx-auto max-w-5xl px-6 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl text-slate-50 md:text-4xl">Open a Dispute Case</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Present the facts. The arbitrator will return a ruling and a proportional split of the
            escrowed funds.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* FORM */}
          <motion.form
            onSubmit={submit}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#B8860B]/20 bg-[#0e1424] p-7"
          >
            <label className="mb-1.5 block font-serif text-sm text-[#E3B23C]">Agreement Terms</label>
            <textarea
              value={agreement}
              onChange={(e) => setAgreement(e.target.value)}
              rows={3}
              placeholder="What was promised? Scope, milestones, acceptance criteria…"
              className="mb-4 w-full resize-none rounded-lg border border-slate-700 bg-[#131A2E] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#B8860B]/60"
            />

            <label className="mb-1.5 block font-serif text-sm text-[#E3B23C]">Deliverable URL</label>
            <input
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
              placeholder="https://github.com/… or Figma / staging link"
              className="mb-4 w-full rounded-lg border border-slate-700 bg-[#131A2E] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#B8860B]/60"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-serif text-sm text-[#E3B23C]">Client Complaint</label>
                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  rows={3}
                  placeholder="What's wrong with the work…"
                  className="w-full resize-none rounded-lg border border-slate-700 bg-[#131A2E] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#B8860B]/60"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-serif text-sm text-[#E3B23C]">Freelancer Defense</label>
                <textarea
                  value={defense}
                  onChange={(e) => setDefense(e.target.value)}
                  rows={3}
                  placeholder="Why the work meets the terms…"
                  className="w-full resize-none rounded-lg border border-slate-700 bg-[#131A2E] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#B8860B]/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-[#B8860B] py-3 font-semibold text-[#131A2E] shadow-lg shadow-[#B8860B]/20 transition hover:bg-[#d29c1e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Jury Deliberating…' : '⚖ Submit for Arbitration'}
            </button>
          </motion.form>

          {/* CASE FILE / VERDICT */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-[#B8860B]/30 bg-gradient-to-b from-[#11182b] to-[#0e1424] p-7"
          >
            <div className="flex items-center justify-between border-b border-dashed border-[#B8860B]/30 pb-4">
              <span className="font-serif text-sm uppercase tracking-widest text-[#B8860B]">
                Case File
              </span>
              <span className="font-mono text-xs text-slate-500">No. 0001</span>
            </div>

            {!verdict && !loading && (
              <div className="flex h-72 flex-col items-center justify-center text-center text-slate-500">
                <span className="text-5xl opacity-40">⚖</span>
                <p className="mt-4 text-sm">The bench is empty.<br />Submit a case to hear the ruling.</p>
              </div>
            )}

            {loading && (
              <div className="flex h-72 flex-col items-center justify-center text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#B8860B]/30 border-t-[#B8860B]" />
                <p className="mt-5 font-serif text-slate-300">The jury is deliberating…</p>
                <p className="mt-1 text-xs text-slate-500">Fetching deliverable · weighing the agreement</p>
              </div>
            )}

            {verdict && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-5"
              >
                <h3 className="font-serif text-lg text-slate-100">{verdict.caseTitle}</h3>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                    verdict.ruling === 'client'
                      ? 'bg-rose-500/15 text-rose-300'
                      : verdict.ruling === 'freelancer'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-[#B8860B]/15 text-[#E3B23C]'
                  }`}
                >
                  {rulingLabel(verdict.ruling)}
                </span>

                {/* PROPORTIONAL SPLIT BAR */}
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs font-medium">
                    <span className="text-rose-300">Client {clientPct}%</span>
                    <span className="text-emerald-300">Freelancer {freelancerPct}%</span>
                  </div>
                  <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${clientPct}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="h-full bg-rose-500"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freelancerPct}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-[#B8860B]/20 bg-[#131A2E] p-4">
                  <p className="font-serif text-xs uppercase tracking-widest text-[#B8860B]">
                    Reasoning
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{verdict.reasoning}</p>
                </div>

                <p className="mt-4 text-center font-mono text-[11px] text-slate-600">
                  Recorded on-chain · {CONTRACT.slice(0, 12)}…{CONTRACT.slice(-8)}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#B8860B]/15 bg-[#0e1424]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-[#B8860B]/40 text-[#B8860B]">
              ⚖
            </span>
            <div>
              <p className="font-serif text-slate-200">
                Freelance<span className="text-[#B8860B]">Jury</span>
              </p>
              <p className="text-xs text-slate-500">Impartial arbitration, on-chain.</p>
            </div>
          </div>
          <p className="font-mono text-xs text-slate-600">
            Verdict contract {CONTRACT.slice(0, 8)}…{CONTRACT.slice(-6)}
          </p>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} FreelanceJury</p>
        </div>
      </footer>
    </div>
  )
}
