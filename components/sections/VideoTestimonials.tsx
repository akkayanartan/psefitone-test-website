"use client";

import { motion } from "framer-motion";
import Marquee from "@/components/sections/Marquee";

const VIDEO_IDS: string[] = [
  "o3lTTOIGX_g",
  "JTwcdT2w5Tw",
  "KPjWSKhOEwc",
  "RuOCwBRDvYY",
  "QEWM6vPJwGk",
];

function baseSrc(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}


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
          <span className="vt-tag">Başlangıç Noktaları Sizinle Aynıydı</span>
          <h2 className="vt-title">
            Psefitone&apos;nun ilk gerçek deneyimleri.
          </h2>
          <p className="vt-subtitle" style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', maxWidth: '600px', marginInline: 'auto', lineHeight: '1.5' }}>
            Programa başlamadan önce hiçbirinin akordeon veya nota geçmişi yoktu.
          </p>
          <p style={{
            marginTop: '1.5rem',
            fontFamily: 'var(--font-body)',
            textAlign: 'center',
          }}>
            <span style={{
              display: 'block',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: 'var(--brand-text)',
              marginBottom: '0.4rem',
            }}>
              Aşağıdaki videoları izle.
            </span>
            <span style={{
              display: 'block',
              fontSize: '1.55rem',
              fontWeight: 800,
              color: 'var(--brand-accent)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Bu sistem çalışıyor, onlar da kanıtı.
            </span>
          </p>
        </motion.div>

        <Marquee />

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
                src={baseSrc(id)}
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

        <motion.div
          className="cta-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ marginTop: "2rem" }}
        >
          <a href="#basvur" className="btn btn-primary btn-lg">
            Başvuru Formunu Doldur
          </a>
        </motion.div>
      </div>
    </section>
  );
}
