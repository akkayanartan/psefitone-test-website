import ProgressBar from "@/components/ProgressBar";
import CountdownBanner from "@/components/CountdownBanner";
import Hero from "@/components/sections/Hero";
import VSL from "@/components/sections/VSL";
import Intrigue from "@/components/sections/Intrigue";
import ProblemAgitation from "@/components/sections/ProblemAgitation";
import Comparison from "@/components/sections/Comparison";
import Instructor from "@/components/sections/Instructor";
import FAQ from "@/components/sections/FAQ";
import Apply from "@/components/sections/Apply";
import ReminderPS from "@/components/sections/ReminderPS";
import Footer from "@/components/sections/Footer";
import VideoTestimonials from "@/components/sections/VideoTestimonials";
import SectionTracker from "@/components/SectionTracker";

export default function Home() {
  return (
    <>
      <ProgressBar />
      <CountdownBanner />
      <main id="main-content">
        <Hero />
        <VSL />
        <Intrigue />
        <ProblemAgitation />
        <Comparison />
        <Instructor />
        <VideoTestimonials />
        <Apply />
        <FAQ />
        <ReminderPS />
      </main>
      <Footer />
      <SectionTracker />
    </>
  );
}
