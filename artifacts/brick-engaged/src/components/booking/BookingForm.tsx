import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LegoButton } from "@/components/LegoButton";
import { Loader2 } from "lucide-react";

const bookingSchema = z.object({
  child_name: z.string().min(1, "Child's name is required"),
  child_age: z.coerce.number().min(3).max(99).optional().or(z.literal("")),
  caregiver_name: z.string().min(1, "Your name is required"),
  caregiver_email: z.string().email("Valid email required"),
  caregiver_phone: z.string().optional(),
  consent_medical: z
    .literal(true, {
      errorMap: () => ({ message: "You must consent to proceed" }),
    }),
  consent_photos: z
    .literal(true, {
      errorMap: () => ({ message: "You must consent to proceed" }),
    }),
  notes: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  slotId: string;
  date: string;
  priceCents: number;
  onComplete: (url: string) => void;
}

export function BookingForm({
  slotId,
  date,
  priceCents,
  onComplete,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      child_name: "",
      child_age: "" as any,
      caregiver_name: "",
      caregiver_email: "",
      caregiver_phone: "",
      notes: "",
    },
  });

  async function onSubmit(values: BookingValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: slotId,
          child_name: values.child_name,
          child_age: values.child_age ? Number(values.child_age) : null,
          caregiver_name: values.caregiver_name,
          caregiver_email: values.caregiver_email,
          caregiver_phone: values.caregiver_phone ?? "",
          consent: { medical: true, photos: true },
          notes: values.notes ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "slot_full") {
          setError("Sorry, this day just filled up. Try another date.");
        } else {
          setError("Something went wrong. Please try again.");
        }
        return;
      }

      onComplete(data.url);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-8 shadow-sm mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-800">
              {error}
            </div>
          )}

          <p className="text-lg font-black text-charcoal">
            Booking for <span className="text-lego-orange">{date}</span>
            <span className="ml-2 text-base font-bold text-slate-500">
              — ${(priceCents / 100).toFixed(0)}
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="child_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-charcoal">
                    Child's name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Jamie"
                      className="h-12 rounded-lg bg-slate-50 border-slate-200"
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
                  <FormLabel className="font-bold text-charcoal">
                    Child's age
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 8"
                      className="h-12 rounded-lg bg-slate-50 border-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="caregiver_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-charcoal">
                  Your name *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Alex"
                    className="h-12 rounded-lg bg-slate-50 border-slate-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="caregiver_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-charcoal">
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="h-12 rounded-lg bg-slate-50 border-slate-200"
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
                  <FormLabel className="font-bold text-charcoal">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="021 123 4567"
                      className="h-12 rounded-lg bg-slate-50 border-slate-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-charcoal">
                  Notes (medical, dietary, anything Dan should know)
                </FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400"
                    placeholder="Optional..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-bold text-charcoal">Consent</p>
            <FormField
              control={form.control}
              name="consent_medical"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value || false}
                      onChange={field.onChange}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal leading-relaxed cursor-pointer">
                    I consent to Brick Engaged being notified of any medical
                    conditions relevant to my child's participation
                  </FormLabel>
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
                      checked={field.value || false}
                      onChange={field.onChange}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal leading-relaxed cursor-pointer">
                    I consent to photos being taken of my child during the
                    session for promotional purposes
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormMessage />
          </div>

          <LegoButton
            type="submit"
            variant="orange"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="animate-spin" size={16} /> Processing...
              </span>
            ) : (
              `Pay $${(priceCents / 100).toFixed(0)} to confirm`
            )}
          </LegoButton>
        </form>
      </Form>
    </div>
  );
}
