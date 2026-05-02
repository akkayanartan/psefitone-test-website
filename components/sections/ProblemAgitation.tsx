"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemAgitation() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { reduced: "(prefers-reduced-motion: reduce)", normal: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          if ((ctx.conditions as { reduced: boolean }).reduced) {
            gsap.set(".pa-content", { opacity: 1, y: 0 });
            return;
          }
          gsap.fromTo(
            ".pa-content",
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".pa-content",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        },
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="section"
      id="problem-agitation"
      style={{
        background: "var(--brand-dark)", // Stark dark background for contrast
        paddingTop: "2rem",
        paddingBottom: "4rem",
        position: "relative"
      }}
    >
      <div className="section-inner">
        <div
          className="pa-content"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "var(--brand-dark2)",
            border: "1px solid var(--brand-border)",
            borderRadius: "12px",
            padding: "3rem 2rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Subtle accent glow to indicate "problem" but kept subtle so text is readable */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              height: "4px",
              background: "linear-gradient(90deg, transparent, var(--brand-secondary), var(--brand-accent), transparent)",
              opacity: 0.8
            }}
          />

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              color: "var(--brand-text)",
              textAlign: "center",
              marginBottom: "2.5rem",
              lineHeight: 1.3,
              fontWeight: 500
            }}
          >
            Bu hisler size <em style={{ color: "var(--brand-primary)", fontStyle: "italic" }}>tanıdık geliyor mu?</em>
          </h2>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.8rem" }}>
            <li style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}>
              <span style={{ color: "var(--brand-secondary)", fontSize: "1.4rem", alignSelf: "center" }}>✗</span>
              <div>
                <strong style={{ color: "var(--brand-text)", fontSize: "1.1rem", display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Ne Çalışacağınızı Bilememek
                </strong>
                <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  Öğrenmeye heveslisiniz ama önünüzde ne bir müfredat var, ne bir yol haritası. YouTube'da bir video buluyorsunuz, ona bakıyorsunuz. Sonra bir başkası. Derken ne öğrendiğinizi, nerede durduğunuzu ve bir sonraki adımın ne olması gerektiğini bilemez hale geliyorsunuz.
                </p>
              </div>
            </li>

            <li style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}>
              <span style={{ color: "var(--brand-secondary)", fontSize: "1.4rem", alignSelf: "center" }}>✗</span>
              <div>
                <strong style={{ color: "var(--brand-text)", fontSize: "1.1rem", display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Sürekli Başa Sarmak, Hiç İlerlememek
                </strong>
                <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  Videodaki eller ekranda kaybolup gidiyor. Ne yaptığını anlayabilmek için aynı 10 saniyelik kısmı defalarca izliyorsunuz. Saatlerinizi bu döngüde tüketiyorsunuz ama parmaklar hâlâ o hareketi yapamıyor.
                </p>
              </div>
            </li>

            <li style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}>
              <span style={{ color: "var(--brand-secondary)", fontSize: "1.4rem", alignSelf: "center" }}>✗</span>
              <div>
                <strong style={{ color: "var(--brand-text)", fontSize: "1.1rem", display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Her Şeyi Bir Dışarıdan Desteğe Bağlamak
                </strong>
                <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  Görünürde ilerliyorsunuz ama bir şeyleri gerçekten anlamıyorsunuz. Çünkü müziğin arkasındaki mantığı kavrayacak bir sistemle karşılaşmamışsınız. Bu yüzden her parça sanki sıfırdan başlıyormuş gibi geliyor.
                </p>
              </div>
            </li>

            <li style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}>
              <span style={{ color: "var(--brand-secondary)", fontSize: "1.4rem", alignSelf: "center" }}>✗</span>
              <div>
                <strong style={{ color: "var(--brand-text)", fontSize: "1.1rem", display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>
                  "Yeteneksizim" Yanılgısı
                </strong>
                <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  Aylarca çabaladınız. Görünür bir ilerleme yok. Sonra da şu sonuca varıyorsunuz: "Müzik kulağım yok. Bu benim için değil. Parmaklarım çok yavaş. Yaşım geçti." Ama gerçek şu: yanlış sistemle doğru sonuca ulaşmak mümkün değil.
                </p>
              </div>
            </li>

            <li style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}>
              <span style={{ color: "var(--brand-secondary)", fontSize: "1.4rem", alignSelf: "center" }}>✗</span>
              <div>
                <strong style={{ color: "var(--brand-text)", fontSize: "1.1rem", display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Toplum Önünde Ezilme Korkusu
                </strong>
                <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  Düğünde ritmi kaybetmek. Bir ortamda herkesi bekletmek. O anın ağırlığını taşıyamayacağınızı hissettiğiniz için akordeona oturmanın bile önüne geçen bir korku oluştu. Ve o akordeon artık çalmak için değil, size her sabah "hâlâ çalamadım" diye hatırlatmak için orada duruyor.
                </p>
              </div>
            </li>

            <li style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", textAlign: "center" }}>
              <span style={{ color: "var(--brand-secondary)", fontSize: "1.4rem", alignSelf: "center" }}>✗</span>
              <div>
                <strong style={{ color: "var(--brand-text)", fontSize: "1.1rem", display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>
                  Kültürel Miras Baskısı
                </strong>
                <p style={{ color: "var(--brand-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                  Bu sadece bir enstrüman değil. Büyüdüğünüz müzik, o düğün havası, akraba sohbetlerinin vazgeçilmezi o akordeon sesi. Çalamamak sadece bir beceri eksikliği değil; aktaramıyorum, sahip çıkamıyorum hissi. Ve bu his her geçen yıl biraz daha ağırlaşıyor.
                </p>
              </div>
            </li>
          </ul>

        </div>
      </div>
    </section>
  );
}
