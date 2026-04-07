"use client";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";

export default function VSL() {
  return (
    <section id="vsl" className="vsl-section">
      <LampContainer>
        <div className="section-inner vsl-inner" style={{ width: "100%", maxWidth: "var(--max-width)", padding: "0 var(--section-pad-h)" }}>
          <div className="section-header vsl-header">
            <motion.span
              className="section-tag vsl-tag"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              Programa Başlamadan Önce
            </motion.span>

            <motion.h2
              className="vsl-title vsl-title-animated"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.5, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              BU VİDEOYU TAMAMEN İZLE!
            </motion.h2>
          </div>

          <motion.div
            className="video-wrapper"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <iframe
              src="https://www.youtube.com/embed/oifnBjSKv7c?si=AtQYdDI0olf1Kp7q"
              title="Psefitone Kickstarter — Tanıtım Videosu"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className="cta-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          >
            <a href="#basvur" className="btn btn-primary btn-lg">
              Başvuru Formunu Doldur
            </a>
          </motion.div>
        </div>
      </LampContainer>
    </section>
  );
}
