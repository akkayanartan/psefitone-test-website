"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".comparison-header",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".comparison-header",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".solution-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".solution-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".weekly-flow",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".weekly-flow",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".weekly-flow-step",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.15,
          scrollTrigger: {
            trigger: ".weekly-flow",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".soundslice-try",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".soundslice-try",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section className="section" id="cozum" ref={sectionRef} style={{ position: "relative", overflow: "hidden", background: "var(--brand-dark2)", paddingTop: "5rem", paddingBottom: "5rem" }}>
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10%",
          top: "30%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(134,41,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      <div className="section-inner">
        <div className="section-header comparison-header">
          <span className="section-tag" style={{ color: "var(--brand-accent)" }}>KANITLANMIŞ ÇÖZÜM</span>
          <h2 className="section-title">
            Belirsizliği Bitiren{" "}
            <em>Sistem</em>
          </h2>
          <div
            style={{
              marginTop: "2rem",
              fontSize: "1.05rem",
              color: "var(--brand-text)",
              maxWidth: "800px",
              margin: "2rem auto 0",
              lineHeight: 1.8,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem"
            }}
          >
            <p>
              Geleneksel yöntemin özü şu: bir usta çalıyor, siz taklit ediyorsunuz. Plansız, teorisiz, müfredat yok. <strong style={{ color: "var(--brand-text)" }}>Hocaya ulaşamadığınız an öğrenme de duruyor.</strong> Çoğu kişi bu yüzden bir noktada bırakıyor.
            </p>
            <p>
              Psefitone farklı bir sorudan başlıyor: "Bu kişi nasıl taklit eder?" değil, <strong style={{ color: "var(--brand-text)" }}>"Bu kişi bu müziği nasıl anlar?"</strong> Bu fark her şeyi değiştiriyor. <strong style={{ color: "var(--brand-text)" }}>Müziğin mantığını kavradığınızda</strong> yeni bir parçayı bağımsız çözebiliyorsunuz. Hata yaptığınızda nedenini görebiliyorsunuz. <strong style={{ color: "var(--brand-text)" }}>Hocasız ilerleyebiliyorsunuz.</strong>
            </p>
          </div>
        </div>

        <div className="weekly-flow gsap-reveal" aria-label="Haftalık akış">
          <p className="weekly-flow-caption">10 HAFTA · HER HAFTA AYNI RİTİM</p>
          <ol className="weekly-flow-steps">
            <li className="weekly-flow-step">
              <span className="weekly-flow-num">01</span>
              <h3 className="weekly-flow-label">Yeni Ders Açılır</h3>
              <p className="weekly-flow-desc">Her hafta bir önceki üzerine inşa edilen yeni dersler.</p>
            </li>
            <li className="weekly-flow-arrow" aria-hidden="true">→</li>
            <li className="weekly-flow-step">
              <span className="weekly-flow-num">02</span>
              <h3 className="weekly-flow-label">Egzersizleri Yükle</h3>
              <p className="weekly-flow-desc">Çalışmanı kaydet, yükle, neredeyse anında geri bildirim al.</p>
            </li>
            <li className="weekly-flow-arrow" aria-hidden="true">→</li>
            <li className="weekly-flow-step">
              <span className="weekly-flow-num">03</span>
              <h3 className="weekly-flow-label">Grup Seansı</h3>
              <p className="weekly-flow-desc">Ortak sorunları birlikte çözüyoruz.</p>
            </li>
            <li className="weekly-flow-arrow" aria-hidden="true">→</li>
            <li className="weekly-flow-step">
              <span className="weekly-flow-num">04</span>
              <h3 className="weekly-flow-label">Birebir Seans</h3>
              <p className="weekly-flow-desc">Sana özel bir uygulama planıyla bir sonraki haftaya geç.</p>
            </li>
          </ol>
          <p className="weekly-flow-loop">Her hafta yeniden, 10 hafta boyunca.</p>
        </div>

        <div className="solution-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginTop: "4rem"
        }}>
          {/* Card 1 */}
          <div className="solution-card" style={{
            background: "var(--brand-dark3)",
            border: "1px solid var(--brand-border)",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--brand-accent)", fontSize: "1.3rem", marginBottom: "1rem" }}>10 hafta nasıl çalışır?</h3>
            <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--brand-text)" }}>Sorun:</strong> <strong style={{ color: "var(--brand-text)" }}>Sırasız ve müfredatsız öğrenme</strong>, zora sokar. Koordinasyon egzersizi yapmadan süslemeli çalamazsın. Körüğü kontrol etmeyi öğrenmeden önce Şeşen çalamazsın.
            </p>
            <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "1rem" }}>
              <strong style={{ color: "var(--brand-text)" }}>Çözüm:</strong> Her haftanın bir öncekinin üzerine inşa edildiği, <strong style={{ color: "var(--brand-text)" }}>birikimli bir müfredat</strong>. Her adım bir sonrakini mümkün kılmak için var.
            </p>
          </div>

          {/* Card 2 */}
          <div className="solution-card" style={{
            background: "var(--brand-dark3)",
            border: "1px solid var(--brand-border)",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--brand-accent)", fontSize: "1.3rem", marginBottom: "1rem" }}>Haftalık grup seansı ne işe yarıyor?</h3>
            <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--brand-text)" }}>Sorun:</strong> Öğrenciler aynı materyalle çalışıyor ama <strong style={{ color: "var(--brand-text)" }}>sorunlarını tek başına çözmeye çalışıyor</strong>. Verimlilik sıfır.
            </p>
            <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "1rem" }}>
              <strong style={{ color: "var(--brand-text)" }}>Çözüm:</strong> Grup seansı bir ders değil; <strong style={{ color: "var(--brand-text)" }}>soru-cevap ortamı</strong>. Aynı haftanın materyalini çalışmış kişiler aynı sorunlarla karşılaşıyor. Herkes aynı anda cevabını alıyor, kimse yalnız değil.
            </p>
          </div>

          {/* Card 3 */}
          <div className="solution-card" style={{
            background: "var(--brand-dark3)",
            border: "1px solid var(--brand-border)",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--brand-accent)", fontSize: "1.3rem", marginBottom: "1rem" }}>Haftalık birebir seans ne işe yarıyor?</h3>
            <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--brand-text)" }}>Sorun:</strong> Herkesin hayatı farklı. Birinin işi yoğunlaşabilir, ailesine bir şey olur... Bu durumda yeni bir şey öğrenmeye devam etmek için plan yapmak gerekir. O planı yapmak bile sizi zorlar, ve <strong style={{ color: "var(--brand-text)" }}>motivasyon erir</strong>.
            </p>
            <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "1rem" }}>
              <strong style={{ color: "var(--brand-text)" }}>Çözüm:</strong> Birebir seanslar, ilerleyişinizin kişisel değerlendirmesidir. O hafta nerede duruyorsunuz, önümüzdeki hafta ne üzerine çalışmanız gerekiyor, hangi konuda takıldınız, çalışma rutininiz nasıl yapılandırılmalı: sizin için hazırlanmış <strong style={{ color: "var(--brand-text)" }}>kişisel bir yol haritası</strong> oluşturuyoruz.
            </p>
          </div>

          {/* Card 4 */}
          <div className="solution-card" style={{
            background: "var(--brand-dark3)",
            border: "1px solid var(--brand-border)",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--brand-accent)", fontSize: "1.3rem", marginBottom: "1rem" }}>Video geri bildirimi nasıl çalışıyor?</h3>
            <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--brand-text)" }}>Sorun:</strong> Geleneksel derste günler boyunca yanlış teknikle çalışabilirsin. <strong style={{ color: "var(--brand-text)" }}>O hatalar kemikleşir.</strong> Hatayı erkenden fark edip müdahale etmek imkansız olmuştur.
            </p>
            <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "1rem" }}>
              <strong style={{ color: "var(--brand-text)" }}>Çözüm:</strong> Her dersin bir görevi var. Yeni dersler açmak için çalışmanızı kayıt altına alıp sisteme yüklüyorsunuz. Bir, ilerlemenizi somut olarak görüyorsunuz. İki, <strong style={{ color: "var(--brand-text)" }}>teknik bir hata kemikleşmeden müdahale edebiliyorum.</strong>
            </p>
          </div>
        </div>

        <div className="soundslice-try gsap-reveal">
          <div className="section-header" style={{ marginTop: "5rem", marginBottom: "1.5rem" }}>
            <span className="section-tag">PLATFORMU TANIYIN</span>
            <h3 className="section-title" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              Kendiniz <em>deneyin</em>
            </h3>
            <p className="section-subtitle" style={{ marginTop: "0.75rem" }}>
              Tüm dersler bu platform üzerinden sunulacak. Aşağıdaki örnek, ders deneyiminin birebir aynısı.
            </p>
          </div>
          <div className="soundslice-wrapper">
            <iframe
              className="soundslice-iframe"
              src="https://www.soundslice.com/slices/nS11c/embed/?force_top_video=1&hshrink=1"
              title="Soundslice — örnek ders"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="solution-card" style={{
          marginTop: "3rem",
          padding: "2rem",
          textAlign: "center",
          borderTop: "1px solid var(--brand-border)",
          borderBottom: "1px solid var(--brand-border)"
        }}>
          <p style={{ fontSize: "1.15rem", color: "var(--brand-text)", fontWeight: 500 }}>
            <span style={{ color: "var(--brand-accent)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.85rem", display: "block", marginBottom: "0.5rem" }}>Özet</span>
            Psefitone sıradan bir kurs değil; <strong style={{ color: "var(--brand-text)", fontWeight: 700 }}>teori, pratik, geri bildirim ve kişisel takibi birleştiren bir sistem</strong>. Sonuç: <strong style={{ color: "var(--brand-text)", fontWeight: 700 }}>bağımsız ve özgüvenli bir Çerkes müziği icracısı</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
