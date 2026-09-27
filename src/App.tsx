import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PageTransition } from "@/components/motion/PageTransition";
import { Home } from "@/pages/Home";
import { CaseStudy } from "@/pages/CaseStudy";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { NotFound } from "@/pages/NotFound";
import { startSmoothScroll } from "@/lib/smooth-scroll";
import { usePageMeta } from "@/hooks/use-page-meta";

// Dev-only review page for the hero object; tree-shaken out of production builds.
const HeroLab = import.meta.env.DEV ? lazy(() => import("@/pages/HeroLab").then((m) => ({ default: m.HeroLab }))) : null;

export default function App() {
  const location = useLocation();

  useEffect(() => startSmoothScroll(), []);
  usePageMeta(location.pathname);

  return (
    <div className="min-h-[100dvh]">
      <LoadingScreen />
      <Header />
      <main>
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {HeroLab && (
              <Route
                path="/lab/hero"
                element={
                  <Suspense fallback={null}>
                    <HeroLab />
                  </Suspense>
                }
              />
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
