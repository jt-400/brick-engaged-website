import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Sessions from "@/pages/Sessions";
import Foundation from "@/pages/Foundation";
import Holiday from "@/pages/Holiday";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient();

// Wrap each page in a motion div for smooth fade between routes.
const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: "easeOut" },
};

function PageWrap({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageTransition}>{children}</motion.div>;
}

function Router() {
  const [location] = useLocation();
  return (
    <Layout>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Switch key={location} location={location}>
          <Route path="/"><PageWrap><Home /></PageWrap></Route>
          <Route path="/sessions"><PageWrap><Sessions /></PageWrap></Route>
          <Route path="/foundation"><PageWrap><Foundation /></PageWrap></Route>
          <Route path="/holiday"><PageWrap><Holiday /></PageWrap></Route>
          <Route path="/about"><PageWrap><About /></PageWrap></Route>
          <Route path="/contact"><PageWrap><Contact /></PageWrap></Route>
          <Route><PageWrap><NotFound /></PageWrap></Route>
        </Switch>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
