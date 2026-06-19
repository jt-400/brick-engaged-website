import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Calendar, ArrowRight, User, List, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LegoButton } from "@/components/LegoButton";
import type { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  email: string;
  caregiver_name: string | null;
  caregiver_phone: string | null;
};

type Booking = {
  id: string;
  child_name: string;
  amount_cents: number;
  status: string;
  created_at: string;
  slot: { starts_at: string; ends_at: string } | null;
};

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (!u) { navigate("/account/login"); return; }
      setUser(u);

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.id)
        .single();
      setProfile(p);

      const { data: b } = await supabase
        .from("bookings")
        .select("*, slot:slot_id(starts_at, ends_at)")
        .eq("profile_id", u.id)
        .in("status", ["paid", "pending"])
        .order("created_at", { ascending: false });
      setBookings(b ?? []);
      setLoading(false);
    });
  }, []);

  const upcoming = bookings.filter((b) => {
    if (!b.slot) return false;
    return new Date(b.slot.starts_at) > new Date();
  });

  const nextBooking = upcoming[0];

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NZ", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "Pacific/Auckland",
    });
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NZ", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Pacific/Auckland",
    });
  }

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
            <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Welcome back{profile?.caregiver_name ? `, ${profile.caregiver_name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="mt-2 text-white/70 font-medium">{profile?.email}</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-10 md:py-16 flex-1">
        <div className="container mx-auto max-w-4xl px-4 space-y-8">
          {/* Next session card */}
          {nextBooking ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white border-2 border-lego-orange/30 p-6 md:p-8 shadow-sm"
            >
              <p className="text-xs font-black uppercase tracking-[0.12em] text-lego-orange mb-2">
                Next session
              </p>
              <h2 className="text-2xl font-black text-charcoal mb-1">
                {nextBooking.slot ? formatDate(nextBooking.slot.starts_at) : "Upcoming"}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {nextBooking.slot
                  ? `${formatTime(nextBooking.slot.starts_at)} – ${formatTime(nextBooking.slot.ends_at)}`
                  : "Full day"} · {nextBooking.child_name}
              </p>
              <Link href="/account/bookings">
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-lego-orange hover:underline cursor-pointer">
                  View all bookings <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl bg-white border-2 border-slate-200 p-6 md:p-8 shadow-sm text-center"
            >
              <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
              <h2 className="text-xl font-black text-charcoal mb-1">No upcoming sessions</h2>
              <p className="text-sm text-slate-500 mb-4">Book a holiday day to get started.</p>
              <Link href="/book/holiday">
                <LegoButton variant="orange">Book a day</LegoButton>
              </Link>
            </motion.div>
          )}

          {/* Upcoming list */}
          {upcoming.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-black text-charcoal mb-4">Upcoming sessions</h3>
              <div className="space-y-3">
                {upcoming.slice(1).map((b) => (
                  <div key={b.id} className="rounded-2xl bg-white border border-slate-200 p-4 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-bold text-charcoal">
                        {b.slot ? formatDate(b.slot.starts_at) : "Date TBC"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{b.child_name}</p>
                    </div>
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      b.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Link href="/book/holiday">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:border-lego-orange/50 cursor-pointer transition-all text-center">
                <Calendar size={24} className="mx-auto text-lego-orange mb-2" />
                <p className="font-bold text-charcoal text-sm">Book another day</p>
              </div>
            </Link>
            <Link href="/account/bookings">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:border-lego-orange/50 cursor-pointer transition-all text-center">
                <List size={24} className="mx-auto text-lego-orange mb-2" />
                <p className="font-bold text-charcoal text-sm">View all bookings</p>
              </div>
            </Link>
            <Link href="/account/profile">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:border-lego-orange/50 cursor-pointer transition-all text-center">
                <User size={24} className="mx-auto text-lego-orange mb-2" />
                <p className="font-bold text-charcoal text-sm">Edit profile</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
