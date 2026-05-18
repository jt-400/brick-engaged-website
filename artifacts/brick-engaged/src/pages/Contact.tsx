import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsSubmitted(true);
  }

  return (
    <div className="flex flex-col w-full bg-slate-50 min-h-screen">
      <section className="bg-lego-yellow text-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brick-pattern opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-4 tracking-tighter"
          >
            Let's talk
          </motion.h1>
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
              <h2 className="text-3xl font-black text-slate-900 mb-2">Brick Engaged</h2>
              <p className="text-xl font-bold text-lego-blue">Dan Mulholland</p>
            </div>

            <div className="space-y-6 text-lg font-medium text-slate-700">
              <div className="flex items-center gap-4">
                <div className="bg-lego-red text-white p-3 rounded-xl shrink-0">
                  <Phone size={24} />
                </div>
                <span>021 270 0301</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-lego-green text-white p-3 rounded-xl shrink-0">
                  <Mail size={24} />
                </div>
                <span>info@brickengaged.org</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-lego-blue text-white p-3 rounded-xl shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p>Downstairs in the Lane Park Business Centre</p>
                  <p>16-22 Lane St, Upper Hutt</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border-2 border-slate-100 shadow-sm mt-8">
              <p className="text-slate-600 font-medium">
                Feel free to message via Facebook or Instagram
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              {isSubmitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 bg-lego-green text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Message Sent!</h3>
                  <p className="text-slate-600 font-medium">Thank you for reaching out. We'll get back to you soon.</p>
                  <Button 
                    className="mt-6 bg-lego-blue hover:bg-lego-blue/90 rounded-full font-bold"
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
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
                          <FormLabel className="font-bold text-slate-700">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email address" type="email" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
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
                          <FormLabel className="font-bold text-slate-700">Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="What is this regarding?" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
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
                          <FormLabel className="font-bold text-slate-700">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help?" 
                              className="min-h-[150px] resize-none rounded-xl bg-slate-50 border-slate-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full bg-lego-blue hover:bg-lego-blue/90 text-white rounded-full font-bold h-14 text-lg mt-4">
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
