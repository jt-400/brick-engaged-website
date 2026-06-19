import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Calendar, ChevronRight, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  child_name: string;
  child_age: number | null;
  amount_cents: number;
  status: "paid" | "pending" | "cancelled" | "refunded";
  created_at: string;
  slot: { starts_at: string; ends_at: string } | null;
};

export default function Bookings() {
  const [, navigate] = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (!u) { navigate("/account/login"); return; }

      const { data: b } = await supabase
        .from("bookings")
        .select("*, slot:slot_id(starts_at, ends_at)")
        .eq("profile_id", u.id)
        .order("created_at", { ascending: false });

      setBookings(b ?? []);
      setLoading(false);
    });
  }, []);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NZ", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Pacific/Auckland",
    });
  }

  const statusStyles: Record<string, string> = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-amber-100 text-amber-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-slate-100 text-slate-600",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
        <Loader2 className="animate-spin text-charcoal/40" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <section className="bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none" />
        <div className="container relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/account">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-white/70 hover:text-white cursor-pointer mb-4">
                ← Back to dashboard
              </span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              My Bookings
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-10 md:py-16 flex-1">
        <div className="container mx-auto max-w-4xl px-4">
          {bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white p-10 shadow-sm text-center"
            >
              <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
              <h2 className="text-xl font-black text-charcoal mb-2">No bookings yet</h2>
              <p className="text-sm text-slate-500 mb-6">
                Book a holiday session to get started.
              </p>
              <Link href="/book/holiday">
                <span className="inline-block rounded-xl bg-lego-orange px-6 py-3 font-black text-charcoal text-sm uppercase tracking-wider hover:bg-lego-orange/90 transition-all">
                  Book a day
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Calendar size={14} className="text-lego-orange shrink-0" />
                        <p className="font-bold text-charcoal">
                          {b.slot ? formatDate(b.slot.starts_at) : "Date TBC"}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {b.child_name}
                        </span>
                        <span>${(b.amount_cents / 100).toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${statusStyles[b.status] ?? "bg-slate-100 text-slate-600"}`}>
                        {b.status}
                      </span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
