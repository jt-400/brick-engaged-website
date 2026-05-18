import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <span
        onClick={onClick}
        className={`cursor-pointer px-4 py-2 rounded-full font-bold transition-all duration-200 ${
          isActive
            ? "bg-lego-blue text-white"
            : "text-foreground hover:bg-lego-blue/10"
        }`}
      >
        {children}
      </span>
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  const [location] = useLocation();
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b-4 border-lego-red">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            <span className="cursor-pointer flex items-center gap-2">
              <div className="w-8 h-8 bg-lego-red rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white/20"></div>
              </div>
              <span className="font-display font-black text-2xl tracking-tighter text-lego-red">
                BRICK ENGAGED
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/sessions">Sessions</NavLink>
            <NavLink href="/foundation">Foundation</NavLink>
            <NavLink href="/holiday">Holiday Programme</NavLink>
            <NavLink href="/about">About Dan</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b-4 border-lego-blue p-4 flex flex-col gap-4 shadow-xl">
            <NavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
            <NavLink href="/sessions" onClick={() => setIsMobileMenuOpen(false)}>Sessions</NavLink>
            <NavLink href="/foundation" onClick={() => setIsMobileMenuOpen(false)}>Foundation</NavLink>
            <NavLink href="/holiday" onClick={() => setIsMobileMenuOpen(false)}>Holiday Programme</NavLink>
            <NavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Dan</NavLink>
            <NavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-lego-blue transition-colors">
              <Facebook size={32} />
            </a>
            <a href="#" className="hover:text-lego-red transition-colors">
              <Instagram size={32} />
            </a>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-4 text-muted">
            <p className="font-medium text-white">
              © 2021 Brick Engaged, a subsidiary company of Between the Bricks Ltd.
            </p>
            <p className="text-sm">
              LEGO®, SERIOUS PLAY™, the Minifigure and the Brick and Knob configurations are trademarks of the LEGO Group, which does not sponsor, authorize or endorse this website.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
