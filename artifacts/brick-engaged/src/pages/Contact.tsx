import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LegoButton } from "@/components/LegoButton";
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
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  function onSubmit(_values: z.infer<typeof formSchema>) {
    setIsSubmitted(true);
  }

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-lego-orange text-charcoal text-xs font-black px-4 py-1.5 rounded-lg mb-6 tracking-widest uppercase"
          >
            Get in Touch
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Let's talk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-medium text-white/80"
          >
            We'd love to hear from you
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-black text-charcoal mb-1">Brick Engaged</h2>
              <p className="text-xl font-bold text-slate-500">Dan Mulholland</p>
            </div>

            <div className="space-y-5 text-lg font-medium text-slate-700">
              <div className="flex items-center gap-4">
                <div className="bg-lego-orange text-charcoal p-3 rounded-xl shrink-0">
                  <Phone size={22} />
                </div>
                <a
                  href="tel:0212700301"
                  className="hover:text-lego-orange transition-colors font-semibold"
                >
                  021 270 0301
                </a>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-charcoal text-white p-3 rounded-lg shrink-0">
                  <Mail size={22} />
                </div>
                <a
                  href="mailto:info@brickengaged.org"
                  className="hover:text-lego-orange transition-colors font-semibold"
                >
                  info@brickengaged.org
                </a>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-lego-orange text-charcoal p-3 rounded-xl shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <p>Downstairs in the Lane Park Business Centre</p>
                  <p className="text-slate-500 text-base">16–22 Lane St, Upper Hutt</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-600 font-medium">
                Feel free to message via Facebook or Instagram too.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              {isSubmitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 bg-lego-orange text-charcoal rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Send size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-charcoal">Message Sent!</h3>
                  <p className="text-slate-600 font-medium">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <LegoButton
                    variant="orange"
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                  >
                    Send another message
                  </LegoButton>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-charcoal">Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              className="h-12 rounded-lg bg-slate-50 border-slate-200 focus:border-lego-orange"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-charcoal">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your email address"
                              type="email"
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
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-charcoal">Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What is this regarding?"
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
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-charcoal">Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="How can we help?"
                              className="min-h-[150px] resize-none rounded-lg bg-slate-50 border-slate-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-lego-orange hover:bg-charcoal text-charcoal hover:text-white rounded-lg font-bold h-14 text-lg mt-4 transition-colors"
                    >
                      Submit <Send className="ml-2" size={18} />
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
