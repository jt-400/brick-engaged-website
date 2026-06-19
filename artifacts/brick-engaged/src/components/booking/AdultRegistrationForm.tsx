import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LegoButton } from "@/components/LegoButton";
import type { AvailabilitySlot } from "./CalendarGrid";

const schema = z.object({
  attendee_name: z.string().min(2, "Your name is required"),
  attendee_email: z.string().email("Invalid email"),
  attendee_phone: z.string().optional(),
  notes: z.string().max(1000).optional(),
  consent_confidentiality: z.boolean().refine((v) => v === true, {
    message: "Please acknowledge the confidentiality note",
  }),
});

type FormValues = z.input<typeof schema>;

interface AdultRegistrationFormProps {
  slot: AvailabilitySlot;
  slotLabel: string;
  programmeTitle: string;
  /** Suggested koha — shown to the user, but not collected here. Pay in person. */
  koha?: string;
  onCancel: () => void;
}

/**
 * Adult-only $0 registration form for Peer-to-Peer (and similar).
 * No payment, no child fields. Koha is collected in person on the night.
 */
export function AdultRegistrationForm({
  slot,
  slotLabel,
  programmeTitle,
  koha,
  onCancel,
}: AdultRegistrationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      attendee_name: "",
      attendee_email: "",
      attendee_phone: "",
      notes: "",
      consent_confidentiality: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: slot.slot_id,
          // Adult-only programmes still write to child_name/caregiver_name to
          // keep the data model consistent. Both fields are set to the
          // attendee.
          child_name: values.attendee_name,
          caregiver_name: values.attendee_name,
          caregiver_email: values.attendee_email,
          caregiver_phone: values.attendee_phone || undefined,
          notes: values.notes || undefined,
          consent: {
            confidentiality_acknowledged: values.consent_confidentiality,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 409 && (body.error === "slot_full" || body.error === "slot_unavailable")) {
          setError("Sorry — this session just filled up. Please pick another night.");
        } else {
          setError("Something went wrong. Please try again, or call Dan on 021 270 0301.");
        }
        setSubmitting(false);
        return;
      }

      const { checkout_url } = (await res.json()) as { checkout_url: string };
      if (!checkout_url) throw new Error("missing checkout_url");
      window.location.href = checkout_url;
    } catch (err) {
      console.error("[AdultRegistrationForm] submit failed", err);
      setError("Something went wrong. Please try again, or call Dan on 021 270 0301.");
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Reserve your spot
          </p>
          <h3
            className="mt-1 text-2xl font-black tracking-tight text-charcoal"
            style={{ letterSpacing: "-0.02em" }}
          >
            {programmeTitle}
          </h3>
          <p className="mt-1 text-sm font-bold text-charcoal/70">{slotLabel}</p>
        </div>
        {koha && (
          <div className="shrink-0 rounded-2xl bg-slate-100 px-4 py-2.5 text-center font-black text-charcoal">
            <div className="text-base leading-none">{koha}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider opacity-75">koha · in person</div>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset className="space-y-4" disabled={submitting}>
            <legend className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              Your details
            </legend>
            <FormField
              control={form.control}
              name="attendee_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-charcoal">Your name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First and last name"
                      className="h-12 rounded-lg border-slate-200 bg-slate-50 focus:border-lego-orange"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="attendee_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-charcoal">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="h-12 rounded-lg border-slate-200 bg-slate-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="attendee_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-charcoal">Phone (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        placeholder="021 234 5678"
                        className="h-12 rounded-lg border-slate-200 bg-slate-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-charcoal">
                  Anything Dan should know? (accessibility, dietary, support needs)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional — we keep this confidential and only Dan sees it."
                    className="min-h-[80px] rounded-lg border-slate-200 bg-slate-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <FormField
              control={form.control}
              name="consent_confidentiality"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-slate-300 accent-charcoal"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-sm font-bold leading-snug text-charcoal">
                      I understand sessions are confidential — anything shared stays in the room.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800"
            >
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <LegoButton
              variant="orange"
              type="submit"
              disabled={submitting}
              data-testid="adult-register-submit"
            >
              <span className="flex items-center gap-2">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                {submitting ? "Reserving…" : "Reserve my spot"}
              </span>
            </LegoButton>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="text-sm font-bold text-charcoal/70 hover:text-charcoal disabled:opacity-50"
            >
              ← Pick a different night
            </button>
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            No payment required to register. {koha ? `${koha} suggested koha is paid in person on the night, tap-to-pay or cash.` : "Koha (donation) is paid in person on the night."}
          </p>
        </form>
      </Form>
    </div>
  );
}
