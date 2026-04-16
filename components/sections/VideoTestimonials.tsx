"use client";

import { motion } from "framer-motion";

// Replace these 6 YouTube video IDs with your student testimonial videos.
// Format: https://www.youtube-nocookie.com/embed/VIDEO_ID
const VIDEO_IDS: string[] = [
  "o3lTTOIGX_g",
  "JTwcdT2w5Tw",
  "KPjWSKhOEwc",
  "RuOCwBRDvYY",
  "QEWM6vPJwGk",
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
          <p className="vt-subtitle" style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', maxWidth: '600px', marginInline: 'auto', lineHeight: '1.5' }}>
            Bu videolar önceki dönem katılımcılarımızın geri bildirimleridir, bazı kesitler canlı ders kayıtlarından alınmıştır.
          </p>
        </motion.div>

        <motion.div
          className="vt-grid"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          {VIDEO_IDS.map((id, index) => (
            <div key={id} className="vt-video-cell">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={`Öğrenci yorumu ${index + 1}`}
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                allowFullScreen
              />
            </div>
          ))}
        </motion.div>

        <p className="vt-scroll-hint" aria-hidden="true">← Sürükle veya kaydır →</p>
      </div>
    </section>
  );
}
