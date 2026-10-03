import { useEffect } from "react";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { FeatureStrip } from "./components/FeatureStrip";
import { Footer } from "./components/Footer";
import { GallerySection } from "./components/GallerySection";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Navbar } from "./components/Navbar";
import { OpeningHours } from "./components/OpeningHours";
import { Pricing } from "./components/Pricing";
import { Preloader } from "./components/ui/Preloader";
import { ScrollTrigger } from "./lib/animations";

export default function App() {
  // Trigger positions depend on image and font sizes, so measure again once they arrive.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Preloader />
      <Navbar />
      <main id="main">
        <Hero />
        <FeatureStrip />
        <Marquee />
        <GallerySection />
        <Pricing />
        <OpeningHours />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
