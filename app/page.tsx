import Nav from "@/components/Nav";
import CountdownBanner from "@/components/CountdownBanner";
import Hero from "@/components/sections/Hero";
import VSL from "@/components/sections/VSL";
import Marquee from "@/components/sections/Marquee";
import Features from "@/components/sections/Features";
import Comparison from "@/components/sections/Comparison";
import Outcomes from "@/components/sections/Outcomes";
import Curriculum from "@/components/sections/Curriculum";
import Instructor from "@/components/sections/Instructor";
import FAQ from "@/components/sections/FAQ";
import Apply from "@/components/sections/Apply";
import Footer from "@/components/sections/Footer";
import VideoTestimonials from "@/components/sections/VideoTestimonials";
import SectionTracker from "@/components/SectionTracker";

export default function Home() {
  return (
    <>
      <CountdownBanner />
      <Nav />
      <main id="main-content">
        <Hero />
        <Marquee />
        <VSL />
        <Comparison />
        <VideoTestimonials />
        <Features />
        <Curriculum />
        <Outcomes />
        <Instructor />
        <FAQ />
        <Apply />
      </main>
      <Footer />
      <SectionTracker />
    </>
  );
}
