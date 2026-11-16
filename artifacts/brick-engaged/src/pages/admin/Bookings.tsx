import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Building, Search, Filter, RefreshCw, ExternalLink,
  CheckCircle2, AlertCircle, XCircle, Clock, Home as HomeIcon, LogOut,
  Trash2, Ban, CheckCheck, Sparkles, Loader2, Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProgrammeInfo {
  slug: string;
  title: string;
  price_cents: number;
}

interface SlotInfo {
  starts_at: string;
  ends_at: string;
  programme?: ProgrammeInfo | null;
}

interface AdminBooking {
  id: string;
  created_at: string;
  status: "paid" | "pending" | "cancelled" | "refunded";
  amount_cents: number;
  caregiver_email: string | null;
  caregiver_name: string | null;
  caregiver_phone: string | null;
  child_name: string | null;
  child_age: number | null;
  notes: string | null;
  stripe_session_id: string | null;
  slot_id: string | null;
  slot?: SlotInfo | null;
}

type Status = AdminBooking["status"];

const STATUS_LABEL: Record<Status, string> = {
  paid: "Paid",
  pending: "Pending",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const STATUS_STYLES: Record<Status, string> = {
  paid: "bg-emerald-100 text-emerald-900 border-emerald-200",
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  refunded: "bg-rose-100 text-rose-900 border-rose-200",
};

const STATUS_ICON: Record<Status, React.ComponentType<{ size?: number }>> = {
  paid: CheckCircle2,
  pending: Clock,
  cancelled: XCircle,
  refunded: RefreshCw,
};

export default function AdminBookingsPage() {
  const [, navigate] = useLocation();
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [programmeFilter, setProgrammeFilter] = useState<string>("all");

  const [actioningId, setActioningId] = useState<string | null>(null);
  const [reaping, setReaping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Bookings · Admin · Brick Engaged";
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/account/login?return=/admin/bookings");
        return;
      }
      setAdminEmail(session.user?.email ?? "");

      const res = await fetch("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.status === 401) {
        navigate("/account/login?return=/admin/bookings");
        return;
      }
      if (res.status === 403) {
        setError("Your account doesn't have admin access. Ask Jordan to add your email to the ADMIN_EMAILS list.");
        setBookings([]);
        return;
      }
      if (!res.ok) {
        let detail = `${res.status}`;
        try {
          const body = await res.json();
          detail += `: ${body.error ?? "unknown"}${body.detail ? ` — ${body.detail}` : ""}`;
        } catch {
          detail += `: ${await res.text()}`;
        }
        throw new Error(detail);
      }
      const json = await res.json();
      setBookings(json.bookings ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/account/login");
  }

  async function authedFetch(path: string, body: unknown) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not signed in");
    return fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3500);
  }

  async function runAction(id: string, action: "delete" | "mark_paid" | "cancel", label: string) {
    const confirmMsg =
      action === "delete"
        ? "Delete this booking? This can't be undone — use for test data only."
        : action === "cancel"
          ? "Cancel this booking? The slot will be freed."
          : "Mark this booking as paid manually? Do this only if Stripe already charged them.";
    if (!window.confirm(confirmMsg)) return;

    setActioningId(id);
    try {
      const res = await authedFetch("/api/admin/booking-actions", { id, action });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? body.error ?? `HTTP ${res.status}`);
      }
      showToast(`${label} — done.`);
      await loadBookings();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActioningId(null);
    }
  }

  async function reapStalePending() {
    if (!window.confirm("Cancel every booking that's been pending for over 30 minutes? These are almost certainly abandoned checkouts.")) return;
    setReaping(true);
    try {
      const res = await authedFetch("/api/admin/reap-pending", {});
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? body.error ?? `HTTP ${res.status}`);
      }
      const body = await res.json();
      showToast(`Cancelled ${body.cancelled ?? 0} stale pending booking${body.cancelled === 1 ? "" : "s"}.`);
      await loadBookings();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Reap failed");
    } finally {
      setReaping(false);
    }
  }

  const programmes = useMemo(() => {
    if (!bookings) return [];
    const set = new Set<string>();
    bookings.forEach((b) => {
      const title = b.slot?.programme?.title ?? b.slot?.programme?.slug;
      if (title) set.add(title);
    });
    return [...set].sort();
  }, [bookings]);

  const filtered = useMemo(() => {
    if (!bookings) return [];
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (programmeFilter !== "all") {
        const title = b.slot?.programme?.title ?? b.slot?.programme?.slug;
        if (title !== programmeFilter) return false;
      }
      if (q) {
        const hay = `${b.caregiver_name ?? ""} ${b.caregiver_email ?? ""} ${b.child_name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [bookings, search, statusFilter, programmeFilter]);

  const counts = useMemo(() => {
    if (!bookings) return { total: 0, paid: 0, pending: 0, refunded: 0, revenue: 0 };
    return bookings.reduce(
      (acc, b) => {
        acc.total++;
        if (b.status === "paid") acc.paid++;
        if (b.status === "pending") acc.pending++;
        if (b.status === "refunded") acc.refunded++;
        if (b.status === "paid") acc.revenue += b.amount_cents ?? 0;
        return acc;
      },
      { total: 0, paid: 0, pending: 0, refunded: 0, revenue: 0 },
    );
  }, [bookings]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-charcoal text-white border-b border-white/10 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm font-bold">
            <Building size={16} className="text-lego-orange" />
            <span>Brick Engaged · Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/schedule">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                <Calendar size={13} /> Schedule
              </span>
            </Link>
            <Link href="/">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                <HomeIcon size={13} /> Site
              </span>
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Admin</p>
          <h1 className="text-3xl md:text-4xl font-black text-charcoal tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Bookings
          </h1>
          {adminEmail && (
            <p className="text-sm font-medium text-slate-500 mt-1">Signed in as {adminEmail}</p>
          )}
        </div>

        {/* Stats */}
        {!error && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <StatCard label="Total" value={String(counts.total)} />
            <StatCard label="Paid" value={String(counts.paid)} accent="emerald" />
            <StatCard label="Pending" value={String(counts.pending)} accent="amber" />
            <StatCard label="Refunded" value={String(counts.refunded)} accent="rose" />
            <StatCard label="Revenue (paid)" value={formatNzd(counts.revenue)} accent="charcoal" />
          </div>
        )}

        {/* Filters */}
        {!error && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,180px,180px,auto] gap-3 items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm font-medium text-charcoal placeholder:text-slate-400 focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
                />
              </div>
              <SelectFilter
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as Status | "all")}
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "paid", label: "Paid" },
                  { value: "pending", label: "Pending" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "refunded", label: "Refunded" },
                ]}
              />
              <SelectFilter
                value={programmeFilter}
                onChange={setProgrammeFilter}
                options={[
                  { value: "all", label: "All programmes" },
                  ...programmes.map((p) => ({ value: p, label: p })),
                ]}
              />
              <button
                onClick={loadBookings}
                className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-charcoal transition-colors"
                title="Reload"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span className="hidden md:inline">Reload</span>
              </button>
            </div>
            {/* Bulk action row */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs font-medium text-slate-500">
                Abandoned checkouts pile up as "pending". Sweep them any time.
              </p>
              <button
                onClick={reapStalePending}
                disabled={reaping}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal text-white font-bold text-xs hover:bg-charcoal/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {reaping ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                Clean pendings older than 30 min
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-black text-red-900 mb-1">Couldn't load bookings</h3>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {!error && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading && bookings === null ? (
              <div className="p-12 text-center text-sm font-medium text-slate-500">Loading bookings…</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-sm font-medium text-slate-500">
                {bookings && bookings.length === 0 ? "No bookings yet." : "No bookings match these filters."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-left">
                      <Th>When</Th>
                      <Th>Customer</Th>
                      <Th>Child</Th>
                      <Th>Programme · slot</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Stripe</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        busy={actioningId === b.id}
                        onAction={(action, label) => runAction(b.id, action, label)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 font-medium mt-6 text-center">
          Newest 500 bookings · refresh to update · click Stripe column to open the payment.
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-bold">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bits                                                                */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, accent }: { label: string; value: string; accent?: "emerald" | "amber" | "rose" | "charcoal" }) {
  const bg = accent === "emerald" ? "bg-emerald-50 border-emerald-200"
    : accent === "amber" ? "bg-amber-50 border-amber-200"
    : accent === "rose" ? "bg-rose-50 border-rose-200"
    : accent === "charcoal" ? "bg-charcoal text-white border-charcoal"
    : "bg-white border-slate-200";
  const textColor = accent === "charcoal" ? "text-white/70" : "text-slate-500";
  return (
    <div className={`rounded-xl border p-3 md:p-4 ${bg}`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${textColor} mb-1`}>{label}</p>
      <p className={accent === "charcoal" ? "text-2xl font-black tracking-tight" : "text-2xl font-black text-charcoal tracking-tight"}>
        {value}
      </p>
    </div>
  );
}

function SelectFilter({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <div className="relative">
      <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
      {children}
    </th>
  );
}

function BookingRow({
  booking,
  busy,
  onAction,
}: {
  booking: AdminBooking;
  busy: boolean;
  onAction: (action: "delete" | "mark_paid" | "cancel", label: string) => void;
}) {
  const StatusIcon = STATUS_ICON[booking.status];
  const stripeUrl = booking.stripe_session_id
    ? `https://dashboard.stripe.com/payments/${encodeURIComponent(booking.stripe_session_id)}`
    : null;

  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3 align-top whitespace-nowrap">
        <div className="text-sm font-bold text-charcoal">{formatDate(booking.created_at)}</div>
        <div className="text-xs text-slate-400">{formatTime(booking.created_at)}</div>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="text-sm font-bold text-charcoal">{booking.caregiver_name ?? "—"}</div>
        <div className="text-xs text-slate-500">{booking.caregiver_email ?? "—"}</div>
        {booking.caregiver_phone && (
          <div className="text-xs text-slate-400">{booking.caregiver_phone}</div>
        )}
      </td>
      <td className="px-4 py-3 align-top">
        {booking.child_name ? (
          <>
            <div className="text-sm font-medium text-charcoal">{booking.child_name}</div>
            {booking.child_age !== null && (
              <div className="text-xs text-slate-400">age {booking.child_age}</div>
            )}
          </>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="text-sm font-bold text-charcoal">
          {booking.slot?.programme?.title ?? booking.slot?.programme?.slug ?? "—"}
        </div>
        {booking.slot && (
          <div className="text-xs text-slate-500">{formatSlot(booking.slot.starts_at, booking.slot.ends_at)}</div>
        )}
      </td>
      <td className="px-4 py-3 align-top whitespace-nowrap text-sm font-bold text-charcoal">
        {formatNzd(booking.amount_cents ?? 0)}
      </td>
      <td className="px-4 py-3 align-top">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${STATUS_STYLES[booking.status]}`}>
          <StatusIcon size={12} />
          {STATUS_LABEL[booking.status]}
        </span>
      </td>
      <td className="px-4 py-3 align-top">
        {stripeUrl ? (
          <a
            href={stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-charcoal hover:text-lego-orange transition-colors"
            title="Open in Stripe"
          >
            View <ExternalLink size={11} />
          </a>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-1">
          {busy && <Loader2 size={13} className="animate-spin text-slate-400" />}
          {!busy && booking.status === "pending" && (
            <button
              onClick={() => onAction("mark_paid", "Marked as paid")}
              title="Mark as paid manually (use only if Stripe already charged them)"
              className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <CheckCheck size={14} />
            </button>
          )}
          {!busy && (booking.status === "pending" || booking.status === "paid") && (
            <button
              onClick={() => onAction("cancel", "Cancelled")}
              title="Cancel booking (frees the slot)"
              className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Ban size={14} />
            </button>
          )}
          {!busy && (
            <button
              onClick={() => onAction("delete", "Deleted")}
              title="Delete booking (test data only)"
              className="p-1.5 rounded-md text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* Format helpers                                                     */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "2-digit" });
}
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" });
}
function formatSlot(starts: string, ends: string): string {
  const s = new Date(starts);
  const e = new Date(ends);
  const sameDay = s.toDateString() === e.toDateString();
  if (sameDay) {
    return `${s.toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "short" })} · ${s.toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" })}–${e.toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return `${s.toLocaleDateString("en-NZ", { day: "numeric", month: "short" })} → ${e.toLocaleDateString("en-NZ", { day: "numeric", month: "short" })}`;
}
function formatNzd(cents: number): string {
  if (cents === 0) return "$0";
  return `$${(cents / 100).toLocaleString("en-NZ", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
