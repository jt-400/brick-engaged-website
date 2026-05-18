import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/sessions", label: "Sessions" },
  { href: "/foundation", label: "Foundation" },
  { href: "/holiday", label: "Holiday Programme" },
  { href: "/about", label: "About Dan" },
  { href: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [location] = useLocation();
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <button
        className="fixed top-5 right-5 z-50 bg-lego-orange hover:bg-charcoal text-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-xl transition-colors duration-300"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-72 bg-charcoal z-40 shadow-2xl flex flex-col overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-3 pt-10 pb-8 px-6 border-b border-white/10">
              <div className="w-12 h-12 rounded-lg bg-lego-orange flex items-center justify-center shadow-md">
                <div className="w-6 h-6 rounded-full bg-white/30"></div>
              </div>
              <span className="font-display font-black text-xl tracking-tighter text-white">
                BRICK ENGAGED
              </span>
            </div>

            <nav className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href}>
                  <span
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="cursor-pointer block px-4 py-3 rounded-lg font-bold text-base text-white hover:bg-white/10 transition-colors"
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-grow">{children}</main>

      <footer className="bg-charcoal text-white py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-lego-orange transition-colors">
              <Facebook size={32} />
            </a>
            <a href="#" className="hover:text-lego-orange transition-colors">
              <Instagram size={32} />
            </a>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <p className="font-bold text-white">
              © 2021 Brick Engaged, a subsidiary company of Between the Bricks Ltd.
            </p>
            <p className="text-sm text-white/50">
              LEGO®, SERIOUS PLAY™, the Minifigure and the Brick and Knob configurations are
              trademarks of the LEGO Group, which does not sponsor, authorize or endorse this
              website.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
