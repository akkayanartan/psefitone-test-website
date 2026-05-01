"use client";
import { motion } from "framer-motion";

export default function VSL() {
  return (
    <section id="vsl" className="vsl-standalone">
      <div className="vsl-standalone-inner">

        <motion.div
          className="video-wrapper"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <iframe
            src="https://www.youtube-nocookie.com/embed/Jqsh0ZUxnqk?autoplay=1&mute=1"
            title="Psefitone Tanıtım Videosu"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
        >
          <a href="#basvur" className="btn btn-primary btn-lg">
            Başvuru Formunu Doldur
          </a>
          <p className="hero-note">Sınırlı kontenjan · Başlangıç: 4 Mayıs 2026</p>
        </motion.div>

      </div>
    </section>
  );
}
