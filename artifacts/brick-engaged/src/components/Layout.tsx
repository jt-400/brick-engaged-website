import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LegoButton } from "@/components/LegoButton";
import footerBrickImg from "@assets/footer-brick.png";

const NAV_LINKS = [
  { href: "/sessions", label: "Sessions" },
  { href: "/foundation", label: "Foundation" },
  { href: "/about", label: "About" },
  { href: "/holiday", label: "Holiday" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Close menu + scroll to top on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  // Track scroll position for transparent → solid header transition
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initialise
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // All pages: header starts transparent and fills in on scroll
  const isTransparent = !isScrolled;

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
          isTransparent
            ? 'bg-transparent border-b border-transparent'
            : 'bg-white/90 backdrop-blur-md border-b border-slate-100/60'
        }`}
      >
        <div className="flex items-center h-16 px-6 md:px-10 gap-6">

          {/* Logo — always left */}
          <Link href="/">
            <span className="flex items-center gap-2 cursor-pointer select-none shrink-0">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-3 h-3 bg-red-500" />
                <div className="w-3 h-3 bg-blue-500" />
                <div className="w-3 h-3 bg-yellow-400" />
                <div className="w-3 h-3 bg-emerald-500" />
              </div>
              <span className={`font-display font-black text-lg tracking-tighter leading-none transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-charcoal'
              }`}>
                BRICK<br />ENGAGED
              </span>
            </span>
          </Link>

          {/* Nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <span className={`text-sm font-bold tracking-wide cursor-pointer transition-colors duration-300 ${
                  location === href
                    ? isTransparent ? 'text-lego-orange' : 'text-charcoal underline decoration-lego-orange decoration-2 underline-offset-4'
                    : isTransparent
                      ? 'text-white/80 hover:text-white'
                      : 'text-charcoal/70 hover:text-charcoal'
                }`}>
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: social icons + Contact Us — hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"
              className={`transition-colors duration-300 ${isTransparent ? 'text-white/70 hover:text-white' : 'text-charcoal/60 hover:text-lego-orange'}`}>
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              className={`transition-colors duration-300 ${isTransparent ? 'text-white/70 hover:text-white' : 'text-charcoal/60 hover:text-lego-orange'}`}>
              <Instagram size={20} />
            </a>
            <Link href="/contact">
              <LegoButton variant="orange" size="sm">Contact Us</LegoButton>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-charcoal hover:text-lego-orange transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-16 right-0 bottom-0 w-full sm:w-64 bg-charcoal z-40 shadow-2xl flex flex-col overflow-y-auto"
          >
            <nav className="flex flex-col gap-1 p-4 pt-6">
              {[...NAV_LINKS, { href: "/contact", label: "Contact Us" }].map(({ href, label }) => (
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

      {/* LEGO brick divider — transparent so studs sit above the page, footer body starts below */}
      <div
        aria-hidden
        className="w-full h-32 md:h-40 bg-no-repeat bg-transparent"
        style={{
          backgroundImage: `url(${footerBrickImg})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
        }}
      />

      {/* ── Footer ── */}
      <footer className="bg-charcoal text-white">
        <div className="container mx-auto px-4 py-14 text-center space-y-8">
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
