"use client";

import { motion } from "framer-motion";

// Replace these 6 YouTube video IDs with your student testimonial videos.
// Format: https://www.youtube-nocookie.com/embed/VIDEO_ID
const VIDEO_IDS: string[] = [
  "PLACEHOLDER_1",
  "PLACEHOLDER_2",
  "PLACEHOLDER_3",
  "PLACEHOLDER_4",
  "PLACEHOLDER_5",
  "PLACEHOLDER_6",
];

export default function VideoTestimonials() {
  return (
    <section id="video-testimonials" className="vt-section">
      <div className="vt-inner">
        <motion.div
          className="vt-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="vt-tag">Öğrenci Videoları</span>
          <h2 className="vt-title">
            Kursiyerlerimiz Ne Diyor?
          </h2>
        </motion.div>

        <motion.div
          className="vt-grid"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          {VIDEO_IDS.map((id, index) => (
            <div key={index} className="vt-video-cell">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={`Öğrenci yorumu ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                allowFullScreen
              />
            </div>
          ))}
        </motion.div>

        <p className="vt-scroll-hint">← Sürükle veya kaydır →</p>
      </div>
    </section>
  );
}
