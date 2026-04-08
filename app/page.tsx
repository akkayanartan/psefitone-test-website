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
        <section id="hero">
          <Hero />
        </section>
        <section id="vsl">
          <VSL />
        </section>
        <section id="marquee">
          <Marquee />
        </section>
        <section id="comparison">
          <Comparison />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="curriculum">
          <Curriculum />
        </section>
        <section id="outcomes">
          <Outcomes />
        </section>
        <section id="for-whom">
          <ForWhom />
        </section>
        <section id="instructor">
          <Instructor />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <section id="basvur">
          <Apply />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </>
  );
}
