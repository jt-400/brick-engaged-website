import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { LegoButton } from "@/components/LegoButton";

export default function Confirmation() {
  const [, params] = useRoute("/book/confirmation/:bookingId");
  const bookingId = params?.bookingId;

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white rounded-3xl p-8 md:p-10 shadow-sm text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-charcoal mb-3">
          Booking confirmed!
        </h1>
        <p className="text-slate-500 font-medium mb-2">
          Your payment was successful.
        </p>
        {bookingId && (
          <p className="text-sm text-slate-400 mb-8">
            Reference: <span className="font-mono font-bold">{bookingId.slice(0, 8)}</span>
          </p>
        )}
        <p className="text-slate-500 font-medium mb-8">
          A confirmation email is on its way. Check your inbox (and spam folder).
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/holiday">
            <LegoButton variant="orange">Back to Holidays</LegoButton>
          </Link>
          <Link href="/">
            <LegoButton variant="white">Home</LegoButton>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
