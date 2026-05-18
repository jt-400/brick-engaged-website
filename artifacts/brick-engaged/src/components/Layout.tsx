import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/sessions", label: "Sessions" },
  { href: "/foundation", label: "Foundation" },
  { href: "/holiday", label: "Holiday Programme" },
  { href: "/about", label: "About Dan" },
  { href: "/contact", label: "Contact" },
];

const NavLink = ({
  href,
  children,
  scrolled,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  scrolled: boolean;
  onClick?: () => void;
}) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <span
        onClick={onClick}
        className={`cursor-pointer px-4 py-2 rounded-full font-bold transition-all duration-200 ${
          isActive
            ? "bg-lego-orange text-white"
            : scrolled
            ? "text-slate-800 hover:bg-slate-100"
            : "text-white hover:bg-white/20"
        }`}
      >
        {children}
      </span>
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [location] = useLocation();
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            <span className="cursor-pointer flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors duration-300 ${
                  scrolled ? "bg-lego-orange" : "bg-white/90"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                    scrolled ? "bg-white/30" : "bg-lego-orange/40"
                  }`}
                ></div>
              </div>
              <span
                className={`font-display font-black text-2xl tracking-tighter transition-colors duration-300 ${
                  scrolled ? "text-lego-orange" : "text-white"
                }`}
              >
                BRICK ENGAGED
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <NavLink key={href} href={href} scrolled={scrolled}>
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            className={`md:hidden p-2 transition-colors duration-300 ${
              scrolled ? "text-slate-800" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-4 flex flex-col gap-1 shadow-xl">
            {NAV_LINKS.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                scrolled={true}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

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
