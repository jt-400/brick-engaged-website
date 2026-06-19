import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { User, Plus, Trash2, Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { LegoButton } from "@/components/LegoButton";

type Profile = {
  id: string;
  email: string;
  caregiver_name: string | null;
  caregiver_phone: string | null;
};

type Child = {
  id: string;
  name: string;
  age: number | null;
};

const profileSchema = z.object({
  caregiver_name: z.string().min(2, "Name is required"),
  caregiver_phone: z.string().optional(),
});

const childSchema = z.object({
  name: z.string().min(2, "Child's name is required"),
  age: z.coerce.number().min(3).max(99).optional().or(z.literal("")),
});

export default function Profile() {
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addingChild, setAddingChild] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { caregiver_name: "", caregiver_phone: "" },
  });

  const childForm = useForm<z.infer<typeof childSchema>>({
    resolver: zodResolver(childSchema),
    defaultValues: { name: "", age: "" },
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      if (!u) { navigate("/account/login"); return; }

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.id)
        .single();
      if (p) {
        setProfile(p);
        form.reset({ caregiver_name: p.caregiver_name ?? "", caregiver_phone: p.caregiver_phone ?? "" });
      }

      const { data: c } = await supabase
        .from("children")
        .select("*")
        .eq("profile_id", u.id);
      setChildren(c ?? []);
      setLoading(false);
    });
  }, []);

  async function onSave(values: z.infer<typeof profileSchema>) {
    if (!profile) return;
    setSaving(true);
    setSaved(false);
    await supabase
      .from("profiles")
      .update({ caregiver_name: values.caregiver_name, caregiver_phone: values.phone || values.caregiver_phone || null })
      .eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function onAddChild(values: z.infer<typeof childSchema>) {
    if (!profile) return;
    const { data } = await supabase
      .from("children")
      .insert({ profile_id: profile.id, name: values.name, age: values.age ? Number(values.age) : null })
      .select()
      .single();
    if (data) {
      setChildren([...children, data]);
      childForm.reset({ name: "", age: "" });
      setAddingChild(false);
    }
  }

  async function deleteChild(id: string) {
    await supabase.from("children").delete().eq("id", id);
    setChildren(children.filter((c) => c.id !== id));
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
            <Link href="/account">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-white/70 hover:text-white cursor-pointer mb-4">
                ← Back to dashboard
              </span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>
              My Profile
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 py-10 md:py-16 flex-1">
        <div className="container mx-auto max-w-3xl px-4 space-y-8">
          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-lg font-black text-charcoal mb-6 flex items-center gap-2">
              <User size={18} className="text-lego-orange" /> Contact details
            </h2>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1.5">Your name</label>
                <input
                  {...form.register("caregiver_name")}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
                />
                {form.formState.errors.caregiver_name && (
                  <p className="text-xs text-red-600 mt-1">{form.formState.errors.caregiver_name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1.5">Phone (optional)</label>
                <input
                  {...form.register("caregiver_phone")}
                  placeholder="021 234 5678"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-charcoal focus:border-lego-orange focus:outline-none focus:ring-2 focus:ring-lego-orange/20"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 rounded-xl bg-lego-orange px-6 font-black text-charcoal text-sm uppercase tracking-wider flex items-center gap-2 hover:bg-lego-orange/90 disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save
                </button>
                {saved && <span className="text-xs font-bold text-green-600">Saved!</span>}
              </div>
            </form>
          </motion.div>

          {/* Children */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm"
          >
            <h2 className="text-lg font-black text-charcoal mb-4">My children</h2>

            {children.length > 0 && (
              <div className="space-y-3 mb-6">
                {children.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <div>
                      <p className="font-bold text-charcoal text-sm">{c.name}</p>
                      {c.age && <p className="text-xs text-slate-500">Age {c.age}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteChild(c.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {addingChild ? (
              <form onSubmit={childForm.handleSubmit(onAddChild)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Child's name</label>
                    <input
                      {...childForm.register("name")}
                      placeholder="e.g. Jamie"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-lego-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">Age</label>
                    <input
                      {...childForm.register("age")}
                      type="number"
                      placeholder="8"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm focus:border-lego-orange focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="h-9 rounded-lg bg-lego-orange px-4 font-black text-charcoal text-xs uppercase tracking-wider hover:bg-lego-orange/90 transition-all"
                  >
                    Add child
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingChild(false)}
                    className="text-xs font-bold text-slate-500 hover:text-charcoal"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAddingChild(true)}
                className="flex items-center gap-2 text-sm font-bold text-lego-orange hover:underline"
              >
                <Plus size={14} /> Add a child
              </button>
            )}
          </motion.div>

          {/* Sign out */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => { supabase.auth.signOut(); navigate("/"); }}
              className="text-sm font-bold text-slate-400 hover:text-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
