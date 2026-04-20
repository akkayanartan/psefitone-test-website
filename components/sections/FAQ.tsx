"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqGroups = [
  {
    category: "Program",
    items: [
      {
        q: "Dersleri canlı mı izliyorum?",
        a: "Ders videoları Soundslice'ta kayıtlı. Canlı olan kısımlar haftalık grup seansı ve birebir koçluk. Kafanın karıştığı herhangi bir yerde ben canlı derslerde müdahale edebiliyorum.",
      },
      {
        q: "Birebir koçluk ne kadar sürüyor?",
        a: "15 dakika çoğu sorunu çözmek için yeterli oluyor, fakat daha detaylı bir yaklaşım gerektiren bir sorunun olursa, süreyi uzatabiliyoruz.",
      },
      {
        q: "Program boyunca hangi materyallere erişebiliyorum?",
        a: "Soundslice üzerindeki ders videoları, canlı derslerin ve görüşmelerin kayıtları, çalışma rutini rehberleri ve kontrol listeleri.",
      },
      {
        q: "Program bittikten sonra materyallere erişimim devam ediyor mu?",
        a: "Evet, belirli bir süre boyunca erişimin devam eder. Detaylar kayıt sürecinde paylaşılıyor.",
      },
    ],
  },
  {
    category: "Kayıt ve Ödeme",
    items: [
      {
        q: "Formu doldurdum, sonra ne olacak?",
        a: "Formunu inceleyeceğim ve seninle iletişime geçeceğim. Programa uygunluğunu değerlendirdikten sonra ödeme adımına geçeceğiz. Formu doldurmak kayıt garantisi değildir.",
      },
      {
        q: "Kontenjan doluysa ne yapabilirim?",
        a: "Bekleme listesine alınırsın. Bir sonraki kohort açıldığında öncelikli olarak bilgilendirilirsin.",
      },
      {
        q: "Başvurum reddedilirse sebebini öğrenebilir miyim?",
        a: "Evet, kısa bir geri bildirim paylaşırım.",
      },
    ],
  },
  {
    category: "Pratik",
    items: [
      {
        q: "Haftada ne kadar zaman ayırmam gerekiyor?",
        a: "Minimum haftada 3-4 saat pratik. Haftalık grup seansı ve koçluk görüşmesi buna dahil değil, bunlar ekstra 1-1.5 saat.",
      },
      {
        q: "Akordeona sahip olmam gerekiyor mu?",
        a: "Evet, programa başlamadan önce bir akordeonun olması gerekiyor.",
      },
      {
        q: "Grup seansları ne zaman?",
        a: "Seans günleri ve saatleri kabul edilen katılımcıların müsaitlik durumuna göre birlikte belirleniyor. Kesin saat programı başlamadan önce paylaşılıyor.",
      },
      {
        q: "Yurt dışından katılabilir miyim?",
        a: "Evet. Program tamamen online. Saat farkı grup seanslarına katılmanı zorlaştırmadığı sürece sorun yok.",
      },
      {
        q: "Programdan ayrılmak istersem ne olur?",
        a: "Program başlamadan önce iptal etmek istersen ücretin iade edilir. Program başladıktan sonra ayrılma durumunda iade yapılmaz; ancak sonuç garantimiz kapsamında programı tamamlayana kadar yanında olmaya devam ederiz.",
      },
    ],
  },
  {
    category: "İletişim",
    items: [
      {
        q: "WhatsApp'tan soru sorabilir miyim?",
        a: "Programa dair tüm bilgiler bu sayfada ve tanıtım videosunda mevcut.",
      },
      {
        q: "Kayıt olmadan önce deneme dersi var mı?",
        a: "Hayır. Tanıtım videosundan ve bu siteden programın yapısını ve sana uygun olup olmadığını değerlendirebilirsin.",
      },
    ],
  },
];

export default function FAQ() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
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

        <div className="faq-groups" id="faqList">
          {faqGroups.map((group, gi) => (
            <div key={gi} className="faq-group gsap-reveal">
              <div className="faq-category-header">
                <span className="faq-category-label">{group.category}</span>
              </div>
              {group.items.map((faq, i) => {
                const key = `${gi}-${i}`;
                return (
                  <div
                    key={key}
                    className={`faq-item${openKey === key ? " open" : ""}`}
                  >
                    <button
                      id={`faq-btn-${key}`}
                      className="faq-q"
                      aria-expanded={openKey === key}
                      aria-controls={`faq-panel-${key}`}
                      onClick={() => toggle(key)}
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
                    <div
                      id={`faq-panel-${key}`}
                      className="faq-a"
                      role="region"
                      aria-labelledby={`faq-btn-${key}`}
                    >
                      <div className="faq-a-inner">
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
