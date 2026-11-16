import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Building, RefreshCw, Home as HomeIcon, LogOut, Plus, CheckCircle2, XCircle,
  Users, Loader2, Trash2, Pencil, Save, X as XIcon, AlertCircle, Calendar,
  Inbox,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Programme {
  id: string;
  slug: string;
  title: string;
  default_capacity: number | null;
  price_cents: number | null;
}

interface Slot {
  id: string;
  programme_id: string;
  starts_at: string;
  ends_at: string;
  status: "open" | "closed" | "full";
  capacity_override: number | null;
  notes: string | null;
  effective_capacity: number | null;
  booking_count_paid: number;
  booking_count_pending: number;
  programmes: {
    id: string;
    slug: string;
    title: string;
    default_capacity: number | null;
    price_cents: number | null;
  } | null;
}

const STATUS_STYLES: Record<Slot["status"], string> = {
  open: "bg-emerald-100 text-emerald-900 border-emerald-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
  full: "bg-amber-100 text-amber-900 border-amber-200",
};

export default function AdminSchedulePage() {
  const [, navigate] = useLocation();

  const [programmes, setProgrammes] = useState<Programme[] | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState("");

  const [programmeFilter, setProgrammeFilter] = useState("all");
  const [rangeDays, setRangeDays] = useState(90);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingOpen, setAddingOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Schedule · Admin · Brick Engaged";
    loadAll();
  }, [rangeDays]);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/account/login?return=/admin/schedule");
        return;
      }
      setAdminEmail(session.user?.email ?? "");

      const from = new Date().toISOString();
      const to = new Date(Date.now() + rangeDays * 24 * 60 * 60 * 1000).toISOString();
      const params = new URLSearchParams({ from, to });

      const [pRes, sRes] = await Promise.all([
        fetch("/api/admin/programmes", { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch(`/api/admin/slots?${params}`, { headers: { Authorization: `Bearer ${session.access_token}` } }),
      ]);

      if (pRes.status === 403 || sRes.status === 403) {
        setError("Your account doesn't have admin access.");
        return;
      }
      if (pRes.status === 401 || sRes.status === 401) {
        navigate("/account/login?return=/admin/schedule");
        return;
      }
      if (!pRes.ok || !sRes.ok) {
        const bad = pRes.ok ? sRes : pRes;
        const body = await bad.json().catch(() => ({}));
        throw new Error(body.detail ?? body.error ?? `HTTP ${bad.status}`);
      }

      const pJson = await pRes.json();
      const sJson = await sRes.json();
      setProgrammes(pJson.programmes ?? []);
      setSlots(sJson.slots ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/account/login");
  }

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  }

  async function authed(path: string, method: "POST" | "PATCH" | "DELETE", body: unknown) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not signed in");
    return fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });
  }

  async function toggleStatus(slot: Slot) {
    const next = slot.status === "open" ? "closed" : "open";
    setBusyId(slot.id);
    try {
      const res = await authed("/api/admin/slots", "PATCH", { id: slot.id, status: next });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? `HTTP ${res.status}`);
      showToast(`Marked ${next}.`);
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function saveEdits(slot: Slot, patch: { capacity_override?: number | null; notes?: string | null; starts_at?: string; ends_at?: string }) {
    setBusyId(slot.id);
    try {
      const res = await authed("/api/admin/slots", "PATCH", { id: slot.id, ...patch });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? `HTTP ${res.status}`);
      showToast("Saved.");
      setEditingId(null);
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteSlot(slot: Slot) {
    const bookedCount = slot.booking_count_paid + slot.booking_count_pending;
    const warn = bookedCount > 0
      ? `This slot has ${bookedCount} booking${bookedCount === 1 ? "" : "s"}. Deleting the slot leaves those bookings orphaned (they'll show "—" for the date). Continue?`
      : `Delete this slot? This can't be undone.`;
    if (!window.confirm(warn)) return;

    setBusyId(slot.id);
    try {
      const res = await authed("/api/admin/slots", "DELETE", { id: slot.id });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? `HTTP ${res.status}`);
      showToast("Deleted.");
      await loadAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const filtered = useMemo(() => {
    if (!slots) return [];
    return slots.filter((s) => {
      if (programmeFilter !== "all" && s.programmes?.slug !== programmeFilter) return false;
      return true;
    });
  }, [slots, programmeFilter]);

  const grouped = useMemo(() => {
    const byDay = new Map<string, Slot[]>();
    for (const s of filtered) {
      const day = new Date(s.starts_at).toDateString();
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day)!.push(s);
    }
    return [...byDay.entries()];
  }, [filtered]);

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
            <Link href="/admin/bookings">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                <Inbox size={13} /> Bookings
              </span>
            </Link>
            <Link href="/">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-colors">
                <HomeIcon size={13} /> Site
              </span>
            </Link>
            <button onClick={handleSignOut} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Admin</p>
            <h1 className="text-3xl md:text-4xl font-black text-charcoal tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              Schedule
            </h1>
            {adminEmail && <p className="text-sm font-medium text-slate-500 mt-1">Signed in as {adminEmail}</p>}
          </div>
          <button
            onClick={() => setAddingOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lego-orange text-charcoal font-black text-sm hover:bg-lego-orange/90 transition-colors"
          >
            <Plus size={16} /> Add a date
          </button>
        </div>

        {/* Filters */}
        {!error && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,180px,auto] gap-3 items-center">
              <select
                value={programmeFilter}
                onChange={(e) => setProgrammeFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
              >
                <option value="all">All programmes</option>
                {(programmes ?? []).map((p) => (
                  <option key={p.slug} value={p.slug}>{p.title}</option>
                ))}
              </select>
              <select
                value={String(rangeDays)}
                onChange={(e) => setRangeDays(Number(e.target.value))}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
              >
                <option value="30">Next 30 days</option>
                <option value="90">Next 90 days</option>
                <option value="180">Next 6 months</option>
                <option value="365">Next 12 months</option>
              </select>
              <button
                onClick={loadAll}
                className="h-10 inline-flex items-center justify-center gap-2 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-charcoal transition-colors"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span className="hidden md:inline">Reload</span>
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
                <h3 className="text-sm font-black text-red-900 mb-1">Couldn't load schedule</h3>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Grouped list */}
        {!error && (
          <>
            {loading && slots === null ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm font-medium text-slate-500 shadow-sm">
                Loading schedule…
              </div>
            ) : grouped.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm font-medium text-slate-500 shadow-sm">
                No slots in this window. Click <strong>Add a date</strong> above.
              </div>
            ) : (
              <div className="space-y-6">
                {grouped.map(([day, list]) => (
                  <div key={day}>
                    <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500 mb-3 flex items-center gap-2">
                      <Calendar size={14} className="text-charcoal/60" />
                      {formatLongDate(day)}
                    </h2>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {list.map((slot) => (
                        <SlotRow
                          key={slot.id}
                          slot={slot}
                          busy={busyId === slot.id}
                          editing={editingId === slot.id}
                          onEdit={() => setEditingId(slot.id)}
                          onCancelEdit={() => setEditingId(null)}
                          onSave={(patch) => saveEdits(slot, patch)}
                          onToggle={() => toggleStatus(slot)}
                          onDelete={() => deleteSlot(slot)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <p className="text-xs text-slate-400 font-medium mt-6 text-center">
          {filtered.length} slot{filtered.length === 1 ? "" : "s"} in this window · click <strong>Add a date</strong> for a new one.
        </p>
      </div>

      {/* Add-slot modal */}
      {addingOpen && (
        <AddSlotModal
          programmes={programmes ?? []}
          onClose={() => setAddingOpen(false)}
          onCreated={() => {
            setAddingOpen(false);
            showToast("Slot added.");
            void loadAll();
          }}
          onError={(msg) => showToast(msg)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-charcoal text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-bold">
          {toast}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------- Row ----- */

function SlotRow({
  slot, busy, editing, onEdit, onCancelEdit, onSave, onToggle, onDelete,
}: {
  slot: Slot;
  busy: boolean;
  editing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (patch: { capacity_override?: number | null; notes?: string | null; starts_at?: string; ends_at?: string }) => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [capacity, setCapacity] = useState(String(slot.capacity_override ?? ""));
  const [notes, setNotes] = useState(slot.notes ?? "");

  useEffect(() => {
    if (editing) {
      setCapacity(String(slot.capacity_override ?? ""));
      setNotes(slot.notes ?? "");
    }
  }, [editing, slot]);

  const capacityText = slot.effective_capacity ?? "∞";
  const booked = slot.booking_count_paid;
  const pending = slot.booking_count_pending;

  return (
    <div className="border-b border-slate-100 last:border-b-0 p-4 md:p-5 hover:bg-slate-50/60 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-charcoal">
              {formatTime(slot.starts_at)}–{formatTime(slot.ends_at)}
            </span>
            <span className="text-xs font-medium text-slate-500">·</span>
            <span className="text-sm font-black text-charcoal">
              {slot.programmes?.title ?? "—"}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border ${STATUS_STYLES[slot.status]}`}>
              {slot.status === "open" && <CheckCircle2 size={11} />}
              {slot.status === "closed" && <XCircle size={11} />}
              {slot.status === "full" && <Users size={11} />}
              {slot.status}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-4 flex-wrap text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1"><Users size={12} /> {booked} of {capacityText} booked{pending > 0 ? ` · ${pending} pending` : ""}</span>
            {editing ? (
              <>
                <label className="inline-flex items-center gap-1.5">
                  <span>Capacity</span>
                  <input
                    type="number"
                    min={0}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder={String(slot.programmes?.default_capacity ?? "auto")}
                    className="h-7 w-20 rounded border border-slate-200 px-2 text-xs font-medium text-charcoal focus:border-lego-orange focus:outline-none"
                  />
                </label>
                <label className="inline-flex items-center gap-1.5 flex-1 min-w-[150px]">
                  <span>Notes</span>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional"
                    className="h-7 flex-1 rounded border border-slate-200 px-2 text-xs font-medium text-charcoal focus:border-lego-orange focus:outline-none"
                  />
                </label>
              </>
            ) : (
              <>
                {slot.capacity_override !== null && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Custom capacity</span>
                )}
                {slot.notes && <span className="italic text-slate-500 truncate max-w-[280px]">"{slot.notes}"</span>}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 justify-end">
          {busy && <Loader2 size={14} className="animate-spin text-slate-400" />}
          {!busy && editing && (
            <>
              <button
                onClick={() => onSave({
                  capacity_override: capacity === "" ? null : Math.max(0, Number(capacity)),
                  notes: notes.trim() === "" ? null : notes.trim(),
                })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                <Save size={12} /> Save
              </button>
              <button onClick={onCancelEdit} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-charcoal font-bold text-xs hover:bg-slate-100 transition-colors">
                <XIcon size={12} /> Cancel
              </button>
            </>
          )}
          {!busy && !editing && (
            <>
              <button
                onClick={onToggle}
                title={slot.status === "open" ? "Close bookings for this slot" : "Reopen bookings for this slot"}
                className="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {slot.status === "open" ? <XCircle size={14} /> : <CheckCircle2 size={14} className="text-emerald-600" />}
              </button>
              <button onClick={onEdit} title="Edit capacity / notes" className="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={onDelete} title="Delete slot" className="p-2 rounded-md text-rose-700 hover:bg-rose-50 transition-colors">
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------- Add-slot modal - */

function AddSlotModal({
  programmes,
  onClose,
  onCreated,
  onError,
}: {
  programmes: Programme[];
  onClose: () => void;
  onCreated: () => void;
  onError: (msg: string) => void;
}) {
  const [programmeId, setProgrammeId] = useState(programmes[0]?.id ?? "");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("16:00");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!programmeId || !date || !startTime || !endTime) {
      onError("Fill programme, date, and both times.");
      return;
    }
    setSaving(true);
    try {
      // Build ISO strings in the user's local timezone — the browser handles the offset.
      const startsAt = new Date(`${date}T${startTime}:00`).toISOString();
      const endsAt = new Date(`${date}T${endTime}:00`).toISOString();

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({
          programme_id: programmeId,
          starts_at: startsAt,
          ends_at: endsAt,
          capacity_override: capacity === "" ? null : Math.max(0, Number(capacity)),
          notes: notes.trim() === "" ? null : notes.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? body.error ?? `HTTP ${res.status}`);
      }
      onCreated();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-black text-charcoal">Add a booking date</h3>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100">
            <XIcon size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <Field label="Programme">
            <select
              value={programmeId}
              onChange={(e) => setProgrammeId(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
            >
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </Field>

          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start time">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
              />
            </Field>
            <Field label="End time">
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
              />
            </Field>
          </div>

          <Field label="Capacity override (optional)">
            <input
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Leave blank to use the programme default"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
            />
          </Field>

          <Field label="Notes (optional)">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra staff on this day"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
            />
          </Field>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-charcoal font-bold text-sm hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lego-orange text-charcoal font-black text-sm hover:bg-lego-orange/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {saving && <Loader2 size={13} className="animate-spin" />}
              Add slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

/* ------------------------------------------------------- format ---- */

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" });
}
