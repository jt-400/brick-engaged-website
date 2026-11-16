import { useState, useEffect } from "react";
import {
  Lock, Download, ExternalLink, Mail,
  Database, Code as CodeIcon, CreditCard, Calendar,
  Building, Server, Globe, Inbox, DollarSign,
  AlertCircle, ShieldCheck, MessageCircle, RefreshCw,
  CheckCircle2, BookOpen, Send, Pencil,
} from "lucide-react";

const HANDOVER_PASSWORD = "engaged2026";
const VERSION = "v1.1";
const DATE_PREPARED = "24 June 2026";

export default function Handover() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("handover-unlocked") === "true") setUnlocked(true);
    document.title = "Brick Engaged · Handover Document";
  }, []);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (password === HANDOVER_PASSWORD) {
      sessionStorage.setItem("handover-unlocked", "true");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .print-shadow { box-shadow: none !important; border: 1px solid #e5e7eb; }
        }
      `}</style>

      {!unlocked ? (
        <PasswordGate
          password={password}
          setPassword={setPassword}
          error={error}
          onSubmit={handleUnlock}
        />
      ) : (
        <HandoverContent />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Password gate                                                       */
/* ------------------------------------------------------------------ */

interface GateProps {
  password: string;
  setPassword: (v: string) => void;
  error: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

function PasswordGate({ password, setPassword, error, onSubmit }: GateProps) {
  return (
    <div className="min-h-screen bg-charcoal text-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lego-orange mb-5 shadow-2xl">
            <Lock size={28} className="text-charcoal" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Handover Document
          </h1>
          <p className="text-white/60 font-medium mt-2 text-sm">
            Brick Engaged · Internal access only
          </p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-3xl p-8 shadow-2xl">
          <label className="block text-sm font-bold text-charcoal mb-2 tracking-tight">
            Access password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            placeholder="Enter password"
            className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-charcoal placeholder:text-slate-400 focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
          />
          {error && (
            <p className="mt-3 text-sm font-bold text-red-600">Incorrect password.</p>
          )}
          <button
            type="submit"
            className="mt-5 h-12 w-full rounded-xl bg-lego-orange font-black text-charcoal tracking-wider uppercase text-sm hover:bg-lego-orange/90 transition-all"
          >
            Unlock
          </button>
          <p className="mt-4 text-xs text-slate-400 text-center">
            Password from Jordan (Sidekick) — keep it private.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

function HandoverContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top action bar */}
      <div className="no-print sticky top-0 z-40 bg-charcoal text-white border-b border-white/10 shadow-lg">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-bold">
            <Building size={16} className="text-lego-orange" />
            <span>Brick Engaged · Handover Document</span>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lego-orange text-charcoal font-black text-xs uppercase tracking-wider hover:bg-lego-orange/90 transition-colors"
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none" />
        <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20 relative z-10">
          <span className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-6 tracking-widest uppercase">
            {VERSION} · {DATE_PREPARED}
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            How Brick Engaged runs.
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Everything Dan, the team, and any future developer needs to keep the
            website running, bookings flowing, and emails landing.
          </p>
        </div>
      </section>

      {/* Body */}
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-12">
        <TableOfContents />
        <SectionAtAGlance />
        <SectionForTeam />
        <SectionForDevs />
        <SectionAccessAccounts />
        <SectionHealthMonitoring />
        <SectionSupport />
        <Footer />
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable pieces                                                     */
/* ------------------------------------------------------------------ */

function SectionHeading({
  num, title, subtitle, icon: Icon,
}: { num: string; title: string; subtitle: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <header className="mb-6 md:mb-8 flex items-start gap-4">
      <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-lego-orange text-charcoal shadow-md">
        <Icon size={22} />
      </div>
      <div>
        <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
          {num}
        </span>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-charcoal" style={{ letterSpacing: "-0.02em" }}>
          {title}
        </h2>
        <p className="text-slate-500 font-medium text-sm md:text-base mt-1">{subtitle}</p>
      </div>
    </header>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-md print-shadow ${className}`}>
      {children}
    </div>
  );
}

function TaskRow({
  step, title, body,
}: { step: string; title: string; body: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-4 border-b border-slate-100 last:border-b-0">
      <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-charcoal text-white text-xs font-black">
        {step}
      </span>
      <div>
        <h4 className="text-sm md:text-base font-black text-charcoal tracking-tight mb-1">{title}</h4>
        <div className="text-sm text-slate-600 font-medium leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function KV({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 py-2 border-b border-slate-100 last:border-b-0">
      <dt className="text-xs font-black uppercase tracking-widest text-slate-400 md:w-44 shrink-0">{label}</dt>
      <dd className={`text-sm font-medium text-charcoal ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-slate-100 text-charcoal font-mono text-[0.875em]">
      {children}
    </code>
  );
}

function ExternalUrl({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-charcoal font-bold underline decoration-[3px] decoration-[#ffe527] underline-offset-[3px] hover:decoration-charcoal transition-colors break-all"
    >
      {label} <ExternalLink size={12} className="shrink-0" />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function TableOfContents() {
  const items = [
    { num: "01", title: "At a glance" },
    { num: "02", title: "For the Brick Engaged team" },
    { num: "03", title: "For developers" },
    { num: "04", title: "Account access" },
    { num: "05", title: "Health & monitoring" },
    { num: "06", title: "Support & contacts" },
  ];
  return (
    <Card className="no-print">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Contents</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((i) => (
          <div key={i.num} className="flex items-baseline gap-2">
            <span className="text-xs font-mono text-slate-400">{i.num}</span>
            <span className="text-sm font-bold text-charcoal">{i.title}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SectionAtAGlance() {
  return (
    <section className="page-break">
      <SectionHeading
        num="01"
        title="At a glance"
        subtitle="The 30-second snapshot of how Brick Engaged works online."
        icon={CheckCircle2}
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Public URLs</h3>
          <dl>
            <KV label="Website" value={<ExternalUrl href="https://brickengaged.org" label="brickengaged.org" />} />
            <KV label="Booking" value={<ExternalUrl href="https://brickengaged.org/sessions" label="brickengaged.org/sessions" />} />
            <KV label="My Account" value={<ExternalUrl href="https://brickengaged.org/account" label="brickengaged.org/account" />} />
            <KV label="Studio (CMS)" value={<ExternalUrl href="https://brickengaged.org/studio" label="brickengaged.org/studio" />} />
            <KV label="Contact" value={<ExternalUrl href="mailto:info@brickengaged.org" label="info@brickengaged.org" />} />
          </dl>
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">What runs the site</h3>
          <dl>
            <KV label="Frontend" value="React + Vite, hosted on Vercel" />
            <KV label="Backend" value="Vercel serverless functions" />
            <KV label="Database" value="Supabase (Postgres)" />
            <KV label="Auth" value="Supabase magic-link login" />
            <KV label="Payments" value="Stripe Checkout" />
            <KV label="Email" value="Brevo (transactional)" />
            <KV label="Domain" value="brickengaged.org via Wix" />
          </dl>
        </Card>
      </div>
    </section>
  );
}

function SectionForTeam() {
  return (
    <section className="page-break">
      <SectionHeading
        num="02"
        title="For the Brick Engaged team"
        subtitle="The most common things Dan or staff will need to do — no coding required."
        icon={Inbox}
      />

      <div className="space-y-5">
        <Card className="border-2 border-lego-orange/60">
          <h3 className="text-base font-black text-charcoal tracking-tight mb-2 flex items-center gap-2">
            <Pencil size={18} className="text-charcoal/70" /> Edit page content (via Sanity Studio)
          </h3>
          <p className="text-sm text-slate-500 mb-3 font-medium">
            Hero headings, programme blurbs, trust-strip stats, footer info, contact details — all editable yourself. No code, no deploys, no waiting on Jordan. Changes go live within ~30 seconds.
          </p>
          <TaskRow step="1" title="Open Sanity Studio" body={<>Go to <ExternalUrl href="https://brickengaged.org/studio" label="brickengaged.org/studio" />. Sign in with the Sanity account (Google login works).</>} />
          <TaskRow step="2" title="Pick a page from the left sidebar" body={<>You'll see: <Code>Site settings</Code>, <Code>Home page</Code>, <Code>Sessions hub</Code>, <Code>Foundation</Code>, <Code>Holiday</Code>, <Code>About</Code>, <Code>Contact</Code>, plus the four programme pages under <Code>Programme pages</Code>.</>} />
          <TaskRow step="3" title="Edit the field you want to change" body={<>Each field has a label (e.g. "Hero title", "Trust strip stats"). Click into it and type. You can also rearrange items in lists (drag the handle).</>} />
          <TaskRow step="4" title="Hit Publish (bottom-right of the editor)" body={<>The blue <strong>Publish</strong> button saves it and sends it live. If you only see <strong>Save</strong>, that's a draft — you still need to publish.</>} />
          <TaskRow step="5" title="Refresh the live site" body={<>Open <ExternalUrl href="https://brickengaged.org" label="brickengaged.org" /> in a new tab → hard-refresh (Cmd+Shift+R). Your change should be there.</>} />
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-900 mb-2">Heads-up — not everything is editable yet</p>
            <p className="text-sm font-medium text-amber-950 leading-relaxed">
              First migration covered all page <strong>hero sections</strong>, the home <strong>trust strip</strong>, the home <strong>pathway tiles</strong>, the <strong>sessions hub</strong> cards, and <strong>site settings</strong>. Deeper body content (FAQs, About Dan's bio paragraphs, programme rhythm cards, "How it works" steps on Foundation) is still in code — send those to Jordan and they'll either migrate them into Studio or just push the text change.
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-black text-charcoal tracking-tight mb-2 flex items-center gap-2">
            <Inbox size={18} className="text-charcoal/70" /> See incoming bookings
          </h3>
          <p className="text-sm text-slate-500 mb-3 font-medium">
            Every paid or free booking lands in Supabase. You'll get email copies from Brevo too.
          </p>
          <TaskRow step="1" title="Open the Supabase dashboard" body={<>Go to <ExternalUrl href="https://supabase.com/dashboard" label="supabase.com/dashboard" /> and sign in.</>} />
          <TaskRow step="2" title="Pick the brick-engaged project" body={<>Project name: <Code>brick-engaged</Code>. Then click <strong>Table Editor</strong> in the left sidebar.</>} />
          <TaskRow step="3" title="Open the bookings table" body={<>Scroll to <Code>bookings</Code>. Each row is one paid (or free) booking. Sort by <Code>created_at</Code> to see the newest first.</>} />
          <TaskRow step="4" title="Look up a specific person" body={<>Use the filter bar (top of table) → filter by <Code>email</Code> contains the address you're looking for.</>} />
        </Card>

        <Card>
          <h3 className="text-base font-black text-charcoal tracking-tight mb-2 flex items-center gap-2">
            <Calendar size={18} className="text-charcoal/70" /> Add new holiday dates
          </h3>
          <p className="text-sm text-slate-500 mb-3 font-medium">
            The holiday programme calendar is driven by rows in the <Code>availability_slots</Code> table.
          </p>
          <TaskRow step="1" title="Easiest — send the dates to Jordan" body="Email or text Jordan the dates + times + capacity per slot. They'll seed them in 5 minutes." />
          <TaskRow step="2" title="DIY — Supabase Table Editor" body={<>Supabase → Table Editor → <Code>availability_slots</Code> → <strong>Insert row</strong>. Required fields: <Code>start_at</Code>, <Code>end_at</Code>, <Code>capacity</Code>, <Code>price_cents</Code>, <Code>kind</Code> (use <Code>holiday</Code>), <Code>label</Code>.</>} />
          <TaskRow step="3" title="Check it appears" body={<>Visit <ExternalUrl href="https://brickengaged.org/holiday" label="brickengaged.org/holiday" /> — the new date should show up on the calendar within seconds.</>} />
        </Card>

        <Card>
          <h3 className="text-base font-black text-charcoal tracking-tight mb-2 flex items-center gap-2">
            <DollarSign size={18} className="text-charcoal/70" /> Change a programme price
          </h3>
          <TaskRow step="1" title="Find the slot row" body={<>Supabase → Table Editor → <Code>availability_slots</Code> → search by <Code>label</Code> or filter by <Code>kind</Code>.</>} />
          <TaskRow step="2" title="Edit price_cents" body={<>Click the cell, type the new price in cents. <Code>4500</Code> = $45.00. Press Enter to save.</>} />
          <TaskRow step="3" title="One-to-one is locked at $45/hr" body={<>If you want to change the standard one-to-one rate, update every row where <Code>kind = 'one_to_one'</Code>. Or ping Jordan and they'll do it in one query.</>} />
        </Card>

        <Card>
          <h3 className="text-base font-black text-charcoal tracking-tight mb-2 flex items-center gap-2">
            <RefreshCw size={18} className="text-charcoal/70" /> Refund a customer
          </h3>
          <TaskRow step="1" title="Open Stripe" body={<><ExternalUrl href="https://dashboard.stripe.com" label="dashboard.stripe.com" /> → sign in.</>} />
          <TaskRow step="2" title="Find the payment" body="Payments → search by customer email or amount." />
          <TaskRow step="3" title="Refund" body={<>Click the payment → <strong>Refund</strong> button (top right) → choose full or partial → confirm.</>} />
          <TaskRow step="4" title="Free up their slot" body={<>Supabase → <Code>bookings</Code> table → find their booking → change <Code>status</Code> to <Code>refunded</Code>. This returns their slot to availability.</>} />
        </Card>

        <Card>
          <h3 className="text-base font-black text-charcoal tracking-tight mb-2 flex items-center gap-2">
            <Send size={18} className="text-charcoal/70" /> Email parents (group message)
          </h3>
          <TaskRow step="1" title="Pull the email list" body={<>Supabase → <Code>bookings</Code> → filter by programme + date range → copy the <Code>email</Code> column.</>} />
          <TaskRow step="2" title="Send via Brevo" body={<><ExternalUrl href="https://app.brevo.com" label="app.brevo.com" /> → Campaigns → New Campaign → paste the list → write the email → send. Sends from <Code>noreply@brickengaged.org</Code>.</>} />
          <TaskRow step="3" title="Or just use BCC in your normal email" body="If it's a small list (under 20), easiest is to send from your own email with everyone in BCC." />
        </Card>

        <Card>
          <h3 className="text-base font-black text-charcoal tracking-tight mb-2 flex items-center gap-2">
            <BookOpen size={18} className="text-charcoal/70" /> Update code-only content (not yet in Sanity)
          </h3>
          <p className="text-sm text-slate-500 mb-3 font-medium">
            For sections that aren't editable in Studio yet — programme deep content (FAQs, outcome grids), About Dan's bio, Foundation steps, the "Who can benefit" cards on home — copy still lives in React files.
          </p>
          <TaskRow step="1" title="Send the new copy to Jordan" body="Email Jordan with the page name and section (e.g. 'Brick Club page — FAQ #3 answer') and the new text." />
          <TaskRow step="2" title="Jordan pushes the change" body="Edit + push → Vercel auto-deploys in ~60 seconds. Or Jordan can migrate that section into Sanity so you can edit it yourself next time." />
        </Card>
      </div>
    </section>
  );
}

function SectionForDevs() {
  return (
    <section className="page-break">
      <SectionHeading
        num="03"
        title="For developers"
        subtitle="Architecture, repo, deploy flow, env vars, and where the bodies are buried."
        icon={CodeIcon}
      />

      <div className="space-y-5">
        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Tech stack</h3>
          <dl>
            <KV label="Frontend" value="React 18 + Vite + TypeScript + Tailwind + wouter + framer-motion" />
            <KV label="UI primitives" value="shadcn/ui (Radix), lucide-react icons" />
            <KV label="Backend" value="Vercel serverless functions (Node 22)" />
            <KV label="Database" value="Supabase Postgres (project ref: snqgkxadkramdlqhokrd)" />
            <KV label="Auth" value="Supabase Auth (magic-link OTP via Brevo SMTP relay)" />
            <KV label="Payments" value="Stripe Checkout + webhooks" />
            <KV label="Email — transactional" value="Brevo HTTP API (api.brevo.com/v3/smtp/email)" />
            <KV label="Email — magic links" value="Brevo SMTP (smtp-relay.brevo.com:587)" />
            <KV label="CMS" value="Sanity (project 1hlznrcy, dataset production) — embedded Studio at /studio" />
            <KV label="Hosting" value="Vercel (production: brickengaged.org)" />
            <KV label="Domain registrar" value="Wix (renews Sep 6, 2026)" />
            <KV label="DNS" value="Wix nameservers — Brevo records added for email auth" />
          </dl>
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Repo structure</h3>
          <pre className="text-xs font-mono text-slate-700 bg-slate-50 rounded-lg p-4 overflow-x-auto leading-relaxed">{`brick-engaged-website/
├── api/                          # Vercel serverless functions
│   ├── _lib/
│   │   ├── email.ts              # Brevo HTTP send helper
│   │   ├── stripe.ts             # Stripe checkout session creator
│   │   └── supabase.ts           # Service-role Supabase client
│   ├── availability.ts           # GET — calendar feed
│   ├── bookings/
│   │   └── hold.ts               # POST — reserve slots + create checkout
│   └── stripe/
│       └── webhook.ts            # POST — Stripe webhook (paid → email)
├── artifacts/brick-engaged/
│   ├── src/
│   │   ├── pages/                # Route components (Home, Sessions, etc.)
│   │   ├── components/           # Layout, CalendarGrid, BookingForm…
│   │   └── lib/supabase.ts       # Public anon client
│   └── db/migrations/            # Supabase SQL migrations
├── package.json                  # pnpm workspace root
├── vercel.json                   # Build + routing config
└── tsconfig.json`}</pre>
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Deploy flow</h3>
          <ol className="space-y-2 text-sm text-slate-700 font-medium leading-relaxed">
            <li><strong>1.</strong> Push to <Code>main</Code> on GitHub → Vercel build kicks off automatically.</li>
            <li><strong>2.</strong> Build runs <Code>pnpm install</Code> then <Code>vite build</Code> for the frontend; <Code>/api</Code> functions are auto-detected.</li>
            <li><strong>3.</strong> Deployment goes live within 60–90 seconds, aliased to brickengaged.org.</li>
            <li><strong>4.</strong> Rollback: Vercel dashboard → Deployments → "Promote to Production" on any prior build.</li>
          </ol>
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Environment variables (Vercel — Production)</h3>
          <dl>
            <KV label="STRIPE_SECRET_KEY" value="Live mode key (sk_live_…). Used by /api/bookings/hold." mono />
            <KV label="STRIPE_WEBHOOK_SECRET" value="Validates /api/stripe/webhook signature." mono />
            <KV label="SUPABASE_URL" value="https://snqgkxadkramdlqhokrd.supabase.co" mono />
            <KV label="SUPABASE_SERVICE_ROLE_KEY" value="Server-side full-access key. Never expose in frontend." mono />
            <KV label="VITE_SUPABASE_URL" value="Same URL, exposed to frontend bundle." mono />
            <KV label="VITE_SUPABASE_ANON_KEY" value="Public anon key (RLS-protected) for browser." mono />
            <KV label="BREVO_API_KEY" value="xkeysib-… for HTTP API (booking emails)." mono />
            <KV label="BREVO_FROM_EMAIL" value="noreply@brickengaged.org" mono />
            <KV label="BREVO_FROM_NAME" value="Brick Engaged" mono />
            <KV label="BREVO_SMTP_USER" value="af8651001@smtp-brevo.com (Supabase SMTP — informational)" mono />
            <KV label="BREVO_SMTP_KEY" value="xsmtpsib-… (Supabase SMTP — informational)" mono />
            <KV label="PUBLIC_SITE_URL" value="https://brickengaged.org" mono />
            <KV label="VITE_SANITY_PROJECT_ID" value="1hlznrcy" mono />
            <KV label="VITE_SANITY_DATASET" value="production" mono />
            <KV label="SANITY_API_TOKEN" value="Only used by the one-off content seed script. Safe to revoke after migrations." mono />
          </dl>
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Database schema (essentials)</h3>
          <dl>
            <KV label="availability_slots" value="One row per bookable timeslot. Fields: start_at, end_at, capacity, capacity_used, price_cents, kind (holiday | brick_club | home_schoolers | peer_to_peer | one_to_one), label, notes." />
            <KV label="bookings" value="One row per attendee booking. Fields: customer email/name, slot_id, status (pending | paid | refunded | cancelled), stripe_session_id, amount_cents, created_at." />
            <KV label="booking_slots" value="Join table for multi-slot bookings (e.g. multi-day holiday bookings)." />
            <KV label="auth.users" value="Supabase-managed. Created when someone uses magic-link login." />
          </dl>
          <p className="text-xs text-slate-400 mt-4 font-medium">
            Atomic multi-slot reservation uses the <Code>book_slots()</Code> Postgres RPC — see <Code>db/migrations/0004_*.sql</Code>.
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Key API endpoints</h3>
          <dl>
            <KV label="GET /api/availability" value="Returns open slots, grouped by kind. Powers calendar UIs." mono />
            <KV label="POST /api/bookings/hold" value="Reserves one or more slots, creates a Stripe Checkout session, returns the URL. Free ($0) bookings skip Stripe and create a paid row directly." mono />
            <KV label="POST /api/stripe/webhook" value="Stripe → webhook on payment_intent.succeeded. Marks booking paid, sends confirmation email via Brevo." mono />
          </dl>
        </Card>
      </div>
    </section>
  );
}

function SectionAccessAccounts() {
  const services: Array<{
    name: string; icon: React.ComponentType<{ size?: number; className?: string }>;
    url: string; owner: string; notes: string;
  }> = [
    { name: "Vercel", icon: Server, url: "https://vercel.com/dashboard", owner: "Jordan (Sidekick) — invite Dan as team member", notes: "Hosting, env vars, deploys, logs." },
    { name: "Supabase", icon: Database, url: "https://supabase.com/dashboard", owner: "Jordan (Sidekick) — invite Dan as project member", notes: "Database, auth, table editor." },
    { name: "Brevo", icon: Mail, url: "https://app.brevo.com", owner: "Daniel Mulholland", notes: "Email sending (booking confirmations + magic links)." },
    { name: "Stripe", icon: CreditCard, url: "https://dashboard.stripe.com", owner: "Daniel Mulholland", notes: "Payments + refunds. Live mode active." },
    { name: "Wix", icon: Globe, url: "https://manage.wix.com", owner: "Daniel Mulholland", notes: "Domain registrar + DNS for brickengaged.org." },
    { name: "GitHub", icon: CodeIcon, url: "https://github.com", owner: "Jordan (Sidekick)", notes: "Source code. Pushes trigger Vercel deploys." },
    { name: "Sanity (CMS)", icon: Pencil, url: "https://brickengaged.org/studio", owner: "Daniel Mulholland", notes: "Edit page content. Sign in with the Sanity account (Google login)." },
  ];
  return (
    <section className="page-break">
      <SectionHeading
        num="04"
        title="Account access"
        subtitle="Who owns what and where to log in. Request access from Jordan if needed."
        icon={Key}
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b-2 border-charcoal">
                <th className="pb-3 pr-4 text-xs font-black uppercase tracking-widest text-slate-400">Service</th>
                <th className="pb-3 pr-4 text-xs font-black uppercase tracking-widest text-slate-400">URL</th>
                <th className="pb-3 pr-4 text-xs font-black uppercase tracking-widest text-slate-400">Account holder</th>
                <th className="pb-3 text-xs font-black uppercase tracking-widest text-slate-400">Notes</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.name} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-3 pr-4 align-top">
                    <span className="inline-flex items-center gap-2 font-black text-charcoal">
                      <s.icon size={16} className="text-charcoal/70" /> {s.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <ExternalUrl href={s.url} label={s.url.replace(/^https?:\/\//, "")} />
                  </td>
                  <td className="py-3 pr-4 align-top text-charcoal font-medium">{s.owner}</td>
                  <td className="py-3 align-top text-slate-500 font-medium">{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

function Key({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3 2-2-3-3" />
    </svg>
  );
}

function SectionHealthMonitoring() {
  return (
    <section className="page-break">
      <SectionHeading
        num="05"
        title="Health & monitoring"
        subtitle="Quick checks to confirm everything's running, and where to look when it isn't."
        icon={ShieldCheck}
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Daily smoke test (30s)</h3>
          <ol className="space-y-2 text-sm text-slate-700 font-medium leading-relaxed">
            <li><strong>1.</strong> Visit <ExternalUrl href="https://brickengaged.org" label="brickengaged.org" /> — confirm it loads.</li>
            <li><strong>2.</strong> Open <Code>/sessions</Code> — the 4 programme cards should render.</li>
            <li><strong>3.</strong> Open <Code>/holiday</Code> — the calendar should show upcoming dates.</li>
          </ol>
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Where to look when something breaks</h3>
          <dl>
            <KV label="Site won't load" value={<>Vercel → Deployments → check latest build. Domain → DNS check (<Code>dig brickengaged.org</Code>).</>} />
            <KV label="Bookings stuck pending" value={<>Stripe webhook may be failing. Stripe → Developers → Webhooks → inspect events. Vercel → Functions → logs for <Code>/api/stripe/webhook</Code>.</>} />
            <KV label="Confirmation emails not arriving" value={<>Brevo → Transactional → Logs. Check for blocks/bounces.</>} />
            <KV label="Magic-link login fails" value={<>Supabase → Logs → Auth Logs. Common: SMTP auth fail → regenerate Brevo SMTP key.</>} />
            <KV label="Calendar showing wrong dates" value={<>Supabase → <Code>availability_slots</Code> → verify <Code>start_at</Code> timestamps + <Code>capacity</Code>.</>} />
            <KV label="Studio (/studio) won't load" value={<>Sanity dashboard → API → CORS origins → ensure <Code>https://brickengaged.org</Code> is listed (Allow credentials ON).</>} />
            <KV label="Sanity edit not appearing on site" value={<>Confirm you clicked <strong>Publish</strong> (not just Save). Hard-refresh the live page (Cmd+Shift+R). 5-min cache may apply on first load.</>} />
          </dl>
        </Card>
      </div>

      <Card className="mt-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3 flex items-center gap-2">
          <AlertCircle size={16} /> Things that need rotating periodically
        </h3>
        <dl>
          <KV label="Brevo API key" value="Rotate annually, or immediately if exposed." />
          <KV label="Brevo SMTP key" value="Rotate annually, or immediately if exposed. Must also update Supabase SMTP config when rotated." />
          <KV label="Stripe webhook secret" value="Auto-rotates if the webhook endpoint is recreated. Update Vercel env if changed." />
          <KV label="Supabase service-role key" value="Stable. Only rotate if compromised — touches every API function." />
          <KV label="Sanity API token" value="Only used by the one-off content seed script. Can be revoked any time after a migration — Studio uses interactive auth, not this token." />
          <KV label="Domain renewal" value="brickengaged.org — Sep 6, 2026 via Wix. Auto-renew should be on." />
        </dl>
      </Card>
    </section>
  );
}

function SectionSupport() {
  return (
    <section className="page-break">
      <SectionHeading
        num="06"
        title="Support & contacts"
        subtitle="Who to talk to, in what order, when something needs hands."
        icon={MessageCircle}
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Primary technical contact</h3>
          <h4 className="text-xl font-black text-charcoal tracking-tight">Jordan Tuhura</h4>
          <p className="text-sm text-slate-500 font-medium mb-4">Sidekick — site build &amp; maintenance</p>
          <dl>
            <KV label="Email" value={<a href="mailto:jt@tuatahi.art" className="text-charcoal font-bold underline decoration-[3px] decoration-[#ffe527] underline-offset-[3px] hover:decoration-charcoal transition-colors">jt@tuatahi.art</a>} />
          </dl>
        </Card>

        <Card>
          <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Brick Engaged</h3>
          <h4 className="text-xl font-black text-charcoal tracking-tight">Daniel Mulholland</h4>
          <p className="text-sm text-slate-500 font-medium mb-4">Facilitator · Owner</p>
          <dl>
            <KV label="Email" value={<a href="mailto:info@brickengaged.org" className="text-charcoal font-bold underline decoration-[3px] decoration-[#ffe527] underline-offset-[3px] hover:decoration-charcoal transition-colors">info@brickengaged.org</a>} />
            <KV label="Phone" value={<a href="tel:0212700301" className="text-charcoal font-bold hover:underline">021 270 0301</a>} />
          </dl>
        </Card>
      </div>

      <Card className="mt-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-charcoal/60 mb-3">Service-specific support</h3>
        <dl>
          <KV label="Vercel" value={<ExternalUrl href="https://vercel.com/help" label="vercel.com/help" />} />
          <KV label="Supabase" value={<ExternalUrl href="https://supabase.com/support" label="supabase.com/support" />} />
          <KV label="Stripe" value={<ExternalUrl href="https://support.stripe.com" label="support.stripe.com" />} />
          <KV label="Brevo" value={<ExternalUrl href="https://help.brevo.com" label="help.brevo.com" />} />
          <KV label="Wix" value={<ExternalUrl href="https://support.wix.com" label="support.wix.com" />} />
        </dl>
      </Card>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-center text-xs text-slate-400 font-medium pt-8 border-t border-slate-200">
      <p>Brick Engaged Handover · {VERSION} · Prepared {DATE_PREPARED} by Sidekick.</p>
      <p className="mt-1">This document contains operational information — treat as confidential.</p>
    </footer>
  );
}
