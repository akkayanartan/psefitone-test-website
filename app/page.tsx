import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import VSL from "@/components/sections/VSL";
import Marquee from "@/components/sections/Marquee";
import ForWhom from "@/components/sections/ForWhom";
import Features from "@/components/sections/Features";
import Comparison from "@/components/sections/Comparison";
import Outcomes from "@/components/sections/Outcomes";
import Curriculum from "@/components/sections/Curriculum";
import Instructor from "@/components/sections/Instructor";
import FAQ from "@/components/sections/FAQ";
import Apply from "@/components/sections/Apply";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <VSL />
        <Marquee />
        <ForWhom />
        <Features />
        <Comparison />
        <Outcomes />
        <Curriculum />
        <Instructor />
        <FAQ />
        <Apply />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
