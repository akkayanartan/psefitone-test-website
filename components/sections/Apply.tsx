"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Apply() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".gsap-reveal", sectionRef.current!).forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section className="section apply-section" id="basvur" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-header gsap-reveal">
          <span className="section-tag">Başvuru</span>
          <h2 className="section-title">10 haftada başla.</h2>
          <p className="apply-intro">
            Formu doldur, başvurunu gönder. Geri kalanı ben hallediyorum.
          </p>
        </div>

        <div className="seat-counter seat-counter--center gsap-reveal">
          <span className="pulse-dot" aria-hidden="true" />
          <span>9 kontenjan kaldı</span>
        </div>

        {/* Pricing */}
        <div className="pricing-block gsap-reveal">
          <div className="pricing-amount">25.000 TL</div>
          <div className="pricing-desc">Peşin veya 3 taksitte — fark yok.</div>
          <div className="pricing-rows">
            <div className="pricing-row">
              <span className="pricing-row-label">Peşin</span>
              <span className="pricing-row-value">25.000 TL</span>
            </div>
            <div className="pricing-row">
              <span className="pricing-row-label">3 taksit</span>
              <span className="pricing-row-value">3 × 8.334 TL</span>
            </div>
          </div>
        </div>

        {/* Warning notice */}
        <div className="warning-box gsap-reveal">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: "1px" }}
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p>
            Formu doldurduktan sonra <strong>Gönder</strong> butonuna basmayı unutma. Gönderim
            yapılmadan başvurun sisteme ulaşmaz — dolayısıyla sana geri dönüş yapamam.
          </p>
        </div>

        {/* Google Form embed */}
        <div className="form-wrapper gsap-reveal">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfgQ9Ucq1pAgVnxWVv00wJobdXVVZKcHNG7RU6IK8b-UADEdg/viewform?embedded=true"
            width="100%"
            height="1709"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            loading="lazy"
          >
            Yükleniyor&hellip;
          </iframe>
        </div>
        <p className="form-fallback">
          Form yüklenmiyorsa{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfgQ9Ucq1pAgVnxWVv00wJobdXVVZKcHNG7RU6IK8b-UADEdg/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            buraya tıklayarak yeni sekmede aç.
          </a>
        </p>

        {/* WhatsApp */}
        <div className="cta-center" style={{ marginTop: "2rem" }}>
          <a
            href="https://wa.me/905387332520?text=Merhaba%2C%20Psefitone%20Kickstarter%20hakk%C4%B1nda%20bir%20sorum%20var."
            className="btn btn-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Soruların için WhatsApp&apos;tan yaz
          </a>
        </div>
      </div>
    </section>
  );
}
