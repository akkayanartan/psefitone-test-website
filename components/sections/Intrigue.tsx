"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Intrigue() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".intrigue-content",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".intrigue-content",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="section"
      id="intrigue"
      style={{
        background: "var(--brand-dark)",
        paddingTop: "4rem",
        paddingBottom: "2rem",
        position: "relative"
      }}
    >
      <div className="section-inner">
        <div
          className="intrigue-content"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}
        >
          <h3 style={{
            color: "var(--brand-accent)",
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "0.5rem"
          }}>
            Bu Programda Neler Keşfedeceksiniz?
          </h3>
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem"
          }}>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>İmrenerek izlediğiniz pşinawoların çalım tekniklerinin arkasındaki mantık ve bunları kendi parmak yapınıza <strong>nasıl uyarlayacağınız</strong>...</span>
            </li>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>Akordeon ile doğru duruş ve oturuşun neden teknik gelişimin önünde bir barikat oluşturduğu, ve bunu <strong>ilk haftadan nasıl doğru kurduğunuz</strong>...</span>
            </li>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>Sol el ve sağ eli birlikte koordineli çalmanın neden bu kadar zor göründüğü, ve <strong>bu koordinasyonu adım adım inşa eden yapılandırılmış egzersizler</strong>...</span>
            </li>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>Sadece körü körüne ezber yapmak yerine, Çerkes müziğinin matematiksel yapısını kavratarak yeni parçaları bağımsız olarak öğrenmenizi sağlayan <strong>metodun işleyişi</strong>...</span>
            </li>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>"Müzik kulağım yok" düşüncesinin neden neredeyse hiçbir zaman doğru olmadığı ve bu inancı besleyen <strong>asıl sebebin ne olduğu</strong>...</span>
            </li>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>Ritim kaçırmanın <strong>parmak problemi değil, temel kavrama problemi</strong> olduğu gerçeği ve bunu kalıcı olarak nasıl düzelteceğiniz...</span>
            </li>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>Günde 30 dakika disiplinli pratikle ilerleyebilmek için bir çalışma seansının nasıl yapılandırıldığı ve <strong>hangi sırayla çalışılması gerektiği</strong>...</span>
            </li>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>Çerkes müzik mirasını kulaktan dolma bilgilerle değil, gerçek bir müzikal sistemle geleceğe <strong>eksiksiz aktarmanın yolu</strong>...</span>
            </li>
            <li style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem", fontSize: "1.05rem", color: "var(--brand-text)", lineHeight: 1.5, alignItems: "start" }}>
              <span style={{ color: "var(--brand-secondary)", marginTop: "0.15rem", fontSize: "1.2rem", flexShrink: 0 }}>✦</span>
              <span>Kendi yaratıcılığınızı müziğe katarak, sadece taklit eden biri değil, gerçek bir icracı olmanın <strong>adımları</strong>...</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
