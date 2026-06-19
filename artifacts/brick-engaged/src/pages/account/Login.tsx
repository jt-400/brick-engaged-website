import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Mail, ArrowRight, CheckCircle2, Home } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    try {
      const { error: authErr } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (authErr) throw authErr;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col w-full">
      <section className="bg-charcoal text-white relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none" />
        <div className="container relative z-10 mx-auto max-w-lg px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link href="/">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-white/60 hover:text-white cursor-pointer mb-6">
                <Home size={14} /> Back to home
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3" style={{ letterSpacing: "-0.02em" }}>
              My Account
            </h1>
            <p className="text-white/70 font-medium">
              Enter your email and we'll send you a magic link to sign in.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {sent ? (
              <div className="rounded-3xl bg-white p-8 md:p-10 text-center shadow-2xl">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-black text-charcoal mb-2">Magic link sent!</h2>
                <p className="text-slate-500 font-medium text-sm mb-6">
                  Check your inbox at <strong className="text-charcoal">{email}</strong> for the sign-in link.
                </p>
                <p className="text-xs text-slate-400">
                  Didn't get it? Check your spam folder, or{" "}
                  <button
                    type="button"
                    onClick={() => { setSent(false); setEmail(""); }}
                    className="text-lego-orange font-bold underline hover:no-underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-8 md:p-10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-charcoal mb-2">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-charcoal placeholder:text-slate-400 focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-800">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending || !email.trim()}
                    className="h-12 w-full rounded-xl bg-lego-orange font-black text-charcoal tracking-wider uppercase text-sm flex items-center justify-center gap-2 hover:bg-lego-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send magic link <ArrowRight size={16} />
                      </span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
