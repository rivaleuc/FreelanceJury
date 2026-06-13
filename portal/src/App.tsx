import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'

const CONTRACT = '0xd8933a6440530a871f93110bF35102db37528787'

type Verdict = {
  ruling: 'FOR CLAIMANT' | 'FOR RESPONDENT' | 'SPLIT AWARD'
  claimantPct: number
  rationale: string
  caseNo: string
}

export default function App() {
  const [agreement, setAgreement] = useState(
    'Respondent shall deliver a production-ready landing page (responsive, < 2s load, deployed to the provided host) by the agreed date. Full payment of 3.5 ETH is released on acceptance.',
  )
  const [deliverable, setDeliverable] = useState('https://staging.acme.xyz/preview')
  const [claimant, setClaimant] = useState(
    'The delivered site fails on mobile, takes 6s to load, and was never deployed to our host. We request a full refund of escrowed funds.',
  )
  const [respondent, setRespondent] = useState(
    'The work was delivered on time. Mobile issues stem from the client changing requirements mid-project. Staging link was provided as agreed; production deploy was blocked by missing client credentials.',
  )
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [deliberating, setDeliberating] = useState(false)

  const wordBalance = useMemo(() => {
    const c = claimant.trim().split(/\s+/).filter(Boolean).length
    const r = respondent.trim().split(/\s+/).filter(Boolean).length
    return { c, r }
  }, [claimant, respondent])

  function deliberate() {
    if (!agreement.trim() || !claimant.trim() || !respondent.trim()) {
      toast.error('All sections of the case file must be completed before ruling.')
      return
    }
    setDeliberating(true)
    setVerdict(null)
    toast('The jury is deliberating…', { icon: '⚖️' })

    setTimeout(() => {
      // Deterministic-ish heuristic blend for a believable split
      const seed = (agreement.length * 7 + claimant.length * 3 + respondent.length * 5) % 100
      const claimantPct = Math.max(15, Math.min(85, 40 + ((seed % 50) - 25)))
      let ruling: Verdict['ruling'] = 'SPLIT AWARD'
      if (claimantPct >= 70) ruling = 'FOR CLAIMANT'
      else if (claimantPct <= 30) ruling = 'FOR RESPONDENT'

      const caseNo = `FJ-${new Date().getFullYear()}-${String(1000 + (seed % 9000)).padStart(4, '0')}`
      const rationale =
        ruling === 'FOR CLAIMANT'
          ? 'The panel finds the deliverable materially failed the agreed acceptance criteria. The burden of deployment rested with the respondent. Escrow is awarded predominantly to the claimant.'
          : ruling === 'FOR RESPONDENT'
            ? 'The panel finds the respondent substantially performed. Documented mid-project scope changes by the claimant shift responsibility. Escrow is released predominantly to the respondent.'
            : 'The panel finds fault on both sides: the deliverable fell short on performance, yet the claimant withheld credentials needed for production deployment. Escrow is divided proportionally.'

      setVerdict({ ruling, claimantPct, rationale, caseNo })
      setDeliberating(false)
      toast.success(`Verdict entered · ${caseNo}`)
    }, 1400)
  }

  return (
    <div className="min-h-screen bg-[#0c1020] py-8 font-serif text-[#1a1f33]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <Toaster position="top-center" theme="dark" richColors />

      {/* The dossier sheet */}
      <div className="mx-auto max-w-3xl bg-[#f7f3e8] shadow-[0_0_60px_rgba(0,0,0,0.6)]" style={{ backgroundImage: 'linear-gradient(rgba(184,134,11,0.04) 1px, transparent 1px)', backgroundSize: '100% 28px' }}>
        {/* Letterhead */}
        <header className="relative border-b-4 border-double border-[#B8860B] px-10 pt-8 pb-5 text-center">
          <div className="absolute right-8 top-6 rotate-[8deg] rounded-full border-2 border-[#B8860B]/60 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-[#B8860B]/70">
            On-Chain<br />Escrow
          </div>
          <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border-4 border-[#B8860B] text-[#B8860B]">
            <span className="text-3xl">⚖</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-[0.3em] text-[#131A2E]">FreelanceJury</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#B8860B]">Decentralized Arbitration Tribunal</p>
          <p className="mt-2 text-[11px] italic text-[#5a5440]">In the matter of escrowed engagement disputes · Binding on-chain ruling</p>
          <div className="mt-3 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-[#6b6450]">
            <span>Docket: {verdict?.caseNo ?? 'PENDING'}</span>
            <span>Registry: {CONTRACT.slice(0, 8)}…{CONTRACT.slice(-6)}</span>
          </div>
        </header>

        {/* Case file body */}
        <div className="px-10 py-8">
          {/* Article I — Agreement */}
          <section className="mb-7">
            <div className="mb-2 flex items-baseline gap-3 border-b border-[#B8860B]/40 pb-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">Article I</span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#131A2E]">Terms of Engagement</span>
            </div>
            <textarea
              value={agreement}
              onChange={(e) => setAgreement(e.target.value)}
              rows={3}
              className="w-full resize-none border-none bg-transparent text-sm leading-7 text-[#1a1f33] outline-none"
            />
          </section>

          {/* Article II — Deliverable */}
          <section className="mb-7">
            <div className="mb-2 flex items-baseline gap-3 border-b border-[#B8860B]/40 pb-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">Article II</span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#131A2E]">Exhibit A · Deliverable</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6b6450]">URL:</span>
              <input
                value={deliverable}
                onChange={(e) => setDeliverable(e.target.value)}
                className="flex-1 border-b border-dotted border-[#6b6450] bg-transparent py-1 text-sm italic text-[#0a3a6b] underline outline-none"
              />
            </div>
          </section>

          {/* Article III — Statements, two columns */}
          <section className="mb-8">
            <div className="mb-3 flex items-baseline gap-3 border-b border-[#B8860B]/40 pb-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">Article III</span>
              <span className="text-sm font-bold uppercase tracking-wider text-[#131A2E]">Statements of the Parties</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="border-l-2 border-[#131A2E] pl-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#131A2E]">Claimant</span>
                  <span className="text-[10px] text-[#9a9070]">{wordBalance.c} words</span>
                </div>
                <textarea
                  value={claimant}
                  onChange={(e) => setClaimant(e.target.value)}
                  rows={6}
                  className="w-full resize-none border-none bg-[#fffdf6] p-2 text-[13px] leading-6 text-[#1a1f33] shadow-inner outline-none"
                />
              </div>
              <div className="border-l-2 border-[#B8860B] pl-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B]">Respondent</span>
                  <span className="text-[10px] text-[#9a9070]">{wordBalance.r} words</span>
                </div>
                <textarea
                  value={respondent}
                  onChange={(e) => setRespondent(e.target.value)}
                  rows={6}
                  className="w-full resize-none border-none bg-[#fffdf6] p-2 text-[13px] leading-6 text-[#1a1f33] shadow-inner outline-none"
                />
              </div>
            </div>
          </section>

          {/* Convene button */}
          <div className="text-center">
            <button
              onClick={deliberate}
              disabled={deliberating}
              className="rounded-sm border-2 border-[#B8860B] bg-[#131A2E] px-8 py-3 text-xs font-bold uppercase tracking-[0.3em] text-[#B8860B] transition hover:bg-[#1d2640] disabled:opacity-60"
            >
              {deliberating ? '⚖ Deliberating…' : '⚖ Convene the Jury'}
            </button>
          </div>
        </div>

        {/* Verdict — stamped ruling */}
        <AnimatePresence>
          {verdict && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden border-t-4 border-double border-[#B8860B] bg-[#131A2E] px-10 py-8 text-[#f7f3e8]"
            >
              <div className="relative">
                {/* stamp */}
                <motion.div
                  initial={{ scale: 2.4, opacity: 0, rotate: -24 }}
                  animate={{ scale: 1, opacity: 1, rotate: -14 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.3 }}
                  className="absolute -top-2 right-0 grid h-28 w-28 place-items-center rounded-full border-4 border-[#B8860B] text-center"
                  style={{ boxShadow: 'inset 0 0 0 2px rgba(184,134,11,0.4)' }}
                >
                  <div className="text-[9px] font-bold uppercase leading-tight tracking-widest text-[#B8860B]">
                    Ruling
                    <br />
                    Entered
                    <br />
                    <span className="text-[8px]">{verdict.caseNo}</span>
                  </div>
                </motion.div>

                <h2 className="mb-1 text-xs uppercase tracking-[0.4em] text-[#B8860B]">In re Disposition</h2>
                <p className="mb-5 text-3xl font-bold uppercase tracking-wider">{verdict.ruling}</p>

                {/* proportional split bar */}
                <div className="mb-2 flex justify-between text-[11px] uppercase tracking-widest">
                  <span>Claimant · {verdict.claimantPct}%</span>
                  <span>Respondent · {100 - verdict.claimantPct}%</span>
                </div>
                <div className="mb-6 flex h-7 w-full overflow-hidden rounded-sm border border-[#B8860B]/50">
                  <motion.div
                    className="flex items-center justify-center bg-[#f7f3e8] text-[10px] font-bold text-[#131A2E]"
                    initial={{ width: '50%' }}
                    animate={{ width: `${verdict.claimantPct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    {verdict.claimantPct}%
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-center bg-[#B8860B] text-[10px] font-bold text-[#131A2E]"
                    initial={{ width: '50%' }}
                    animate={{ width: `${100 - verdict.claimantPct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    {100 - verdict.claimantPct}%
                  </motion.div>
                </div>

                <p className="max-w-xl text-sm italic leading-7 text-[#d8d2bf]">"{verdict.rationale}"</p>
                <p className="mt-5 border-t border-[#B8860B]/30 pt-3 text-[10px] uppercase tracking-widest text-[#8b8369]">
                  Funds disbursed automatically from escrow {CONTRACT} · This ruling is final and binding on-chain.
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <footer className="border-t border-[#B8860B]/30 px-10 py-3 text-center text-[10px] uppercase tracking-[0.3em] text-[#9a9070]">
          FreelanceJury Tribunal · Sealed &amp; Recorded On-Chain
        </footer>
      </div>
    </div>
  )
}
