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
  child_name: z.string().min(2, "Child's name is required"),
  child_age: z
    .union([z.string().regex(/^\d+$/, "Numbers only"), z.literal("")])
    .optional()
    .transform((v) => (v && v !== "" ? Number(v) : undefined))
    .refine((v) => v === undefined || (v >= 4 && v <= 18), "Age must be between 4 and 18"),
  caregiver_name: z.string().min(2, "Your name is required"),
  caregiver_email: z.string().email("Invalid email"),
  caregiver_phone: z.string().optional(),
  notes: z.string().max(1000).optional(),
  consent_medical: z.boolean().refine((v) => v === true, {
    message: "Please confirm medical / dietary acknowledgement",
  }),
  consent_photos: z.boolean().optional(),
});

type FormValues = z.input<typeof schema>;

interface BookingFormProps {
  slot: AvailabilitySlot;
  slotLabel: string;
  programmeTitle: string;
  priceCents: number;
  onCancel: () => void;
}

export function BookingForm({
  slot,
  slotLabel,
  programmeTitle,
  priceCents,
  onCancel,
}: BookingFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      child_name: "",
      child_age: "",
      caregiver_name: "",
      caregiver_email: "",
      caregiver_phone: "",
      notes: "",
      consent_medical: false,
      consent_photos: false,
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
          child_name: values.child_name,
          child_age: values.child_age,
          caregiver_name: values.caregiver_name,
          caregiver_email: values.caregiver_email,
          caregiver_phone: values.caregiver_phone || undefined,
          notes: values.notes || undefined,
          consent: {
            medical_acknowledged: values.consent_medical,
            photos_allowed: !!values.consent_photos,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 409 && (body.error === "slot_full" || body.error === "slot_unavailable")) {
          setError("Sorry — this day just filled up. Please pick another date.");
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
      console.error("[BookingForm] submit failed", err);
      setError("Something went wrong. Please try again, or call Dan on 021 270 0301.");
      setSubmitting(false);
    }
  }

  const price = `$${(priceCents / 100).toFixed(0)}`;

  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            You're booking
          </p>
          <h3
            className="mt-1 text-2xl font-black tracking-tight text-charcoal"
            style={{ letterSpacing: "-0.02em" }}
          >
            {programmeTitle}
          </h3>
          <p className="mt-1 text-sm font-bold text-charcoal/70">{slotLabel}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-lego-orange px-4 py-2.5 text-center font-black text-charcoal shadow-md">
          <div className="text-xl leading-none">{price}</div>
          <div className="mt-1 text-[10px] uppercase tracking-wider opacity-75">per day</div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <fieldset className="space-y-4" disabled={submitting}>
            <legend className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              About the child
            </legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
              <FormField
                control={form.control}
                name="child_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-charcoal">Child's full name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Alex Smith"
                        className="h-12 rounded-lg border-slate-200 bg-slate-50 focus:border-lego-orange"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-charcoal">Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={4}
                        max={18}
                        placeholder="9"
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

          <fieldset className="space-y-4" disabled={submitting}>
            <legend className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              Caregiver contact
            </legend>
            <FormField
              control={form.control}
              name="caregiver_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-charcoal">Your name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Parent or caregiver"
                      className="h-12 rounded-lg border-slate-200 bg-slate-50"
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
                name="caregiver_email"
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
                name="caregiver_phone"
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
                  Anything Dan should know? (allergies, sensitivities, support needs)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Optional — we keep this confidential and only Dan sees it."
                    className="min-h-[90px] rounded-lg border-slate-200 bg-slate-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <FormField
              control={form.control}
              name="consent_medical"
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
                      I confirm dietary / medical info above is accurate
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consent_photos"
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
                  <FormLabel className="text-sm font-bold leading-snug text-charcoal">
                    I'm happy for photos taken at the session to be used on Brick Engaged social media{" "}
                    <span className="font-normal text-slate-500">(optional)</span>
                  </FormLabel>
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

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <LegoButton
              variant="orange"
              type="submit"
              disabled={submitting}
              data-testid="booking-submit"
            >
              <span className="flex items-center gap-2">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                {submitting ? "Redirecting…" : `Pay ${price} & confirm`}
              </span>
            </LegoButton>
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="text-sm font-bold text-charcoal/70 hover:text-charcoal disabled:opacity-50"
            >
              ← Pick a different day
            </button>
          </div>

          <p className="text-xs leading-relaxed text-slate-500">
            Payment is processed securely by Stripe. We never store card details. If the session is
            cancelled by us you'll be fully refunded.
          </p>
        </form>
      </Form>
    </div>
  );
}
