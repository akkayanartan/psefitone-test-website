"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Hiç akordeon bilmeden başlayabilir miyim?",
    a: "Evet, program tamamen yeni başlayanlar için tasarlandı. Nota okumayı bilmiyorsan da sıkıntı yok; sana bunu da öğretiyoruz.",
  },
  {
    q: "Haftada ne kadar zaman ayırmam gerekiyor?",
    a: "Minimum haftada 3-4 saat. Bu, ders videolarını izlemek ve pratik yapmak için gereken süredir. Haftalık grup seansı ve koçluk görüşmesi buna dahil değil, bunlar ekstra 1-1.5 saat.",
  },
  {
    q: "Akordeona sahip olmam gerekiyor mu?",
    a: "Evet, programa başlamadan önce bir akordeonun olması gerekiyor. Hangi akordeonun uygun olduğu konusunda başvuru sonrasında rehberlik edebiliyorum.",
  },
  {
    q: "Taksit seçeneği var mı?",
    a: "Program ücreti 25.000 TL. Farksız 3 taksitle de bölebiliyoruz. Ödemeler IBAN üzerinden yapılıyor.",
  },
  {
    q: "Grup seansları ne zaman?",
    a: "Seans günleri ve saatleri kabul edilen katılımcıların müsaitlik durumuna göre birlikte belirleniyor. Kesin saat programı başlamadan önce paylaşılıyor.",
  },
  {
    q: "Online eğitim benim için işe yarar mı?",
    a: "Eğer teknolojiyle aranız iyi değilse, işe yaramaz. Yeni bir şey öğrenmeye açık değilseniz, işe yaramaz. Bu program Soundslice üzerinden yürüyor; video gönderiyorsun, geri bildirim alıyorsun, materyallere dijital ortamda erişiyorsun. Sisteme uyum sağlayamayacağını düşünüyorsan, başvurmamanı öneririm.",
  },
  {
    q: "Başvuru nasıl işliyor?",
    a: "Aşağıdaki formu dolduruyorsun. Formu inceledikten sonra seninle iletişime geçeceğim. Programa uygunluğunu konuştuktan sonra ödeme adımına geçilecek.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

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
    <section className="section faq-section" id="faq" ref={sectionRef}>
      <div className="section-inner">
        <div className="section-header gsap-reveal">
          <span className="section-tag">Sık Sorulan Sorular</span>
          <h2 className="section-title">
            Aklındaki <em>sorular.</em>
          </h2>
        </div>

        <div className="faq-list" id="faqList">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item${openIndex === i ? " open" : ""}`}
            >
              <button
                className="faq-q"
                aria-expanded={openIndex === i}
                onClick={() => toggle(i)}
              >
                {faq.q}
                <svg
                  className="faq-chevron"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="faq-a" role="region">
                <div className="faq-a-inner">
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
