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
        q: "Hiç akordeon bilmeden başlayabilir miyim?",
        a: "Evet, program tamamen yeni başlayanlar için tasarlandı. Nota okumayı bilmiyorsan da sıkıntı yok; sana bunu da öğretiyoruz.",
      },
      {
        q: "Dersleri canlı mı izliyorum?",
        a: "Hayır. Ders videoları Soundslice'ta kayıtlı, istediğin zaman erişirsin. Canlı olan kısımlar haftalık grup seansı ve birebir koçluk.",
      },
      {
        q: "Birebir koçluk ne kadar sürüyor?",
        a: "Haftalık 15 dakika.",
      },
      {
        q: "Program boyunca hangi materyallere erişebiliyorum?",
        a: "Soundslice üzerindeki ders videoları, play-along egzersizler, nota dökümanları, çalışma rutini rehberleri ve kontrol listeleri.",
      },
      {
        q: "Program bittikten sonra materyallere erişimim devam ediyor mu?",
        a: "Evet, belirli bir süre boyunca erişimin devam eder. Detaylar kayıt sürecinde paylaşılıyor.",
      },
      {
        q: "Online eğitim benim için işe yarar mı?",
        a: "Eğer teknolojiyle aranız iyi değilse, işe yaramaz. Yeni bir şey öğrenmeye açık değilseniz, işe yaramaz. Bu program Soundslice üzerinden yürüyor; video gönderiyorsun, geri bildirim alıyorsun, materyallere dijital ortamda erişiyorsun. Sisteme uyum sağlayamayacağını düşünüyorsan, başvurmamanı öneririm.",
      },
    ],
  },
  {
    category: "Kayıt ve Ödeme",
    items: [
      {
        q: "Taksit seçeneği var mı?",
        a: "Program ücreti 25.000 TL. Farksız 3 taksitle de bölebiliyoruz.",
      },
      {
        q: "Ödeme nasıl yapılıyor?",
        a: "IBAN üzerinden havale/EFT ile. Ödeme bilgileri kabul sürecinden sonra paylaşılıyor.",
      },
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
        a: "Evet, programa başlamadan önce bir akordeonun olması gerekiyor. Hangi akordeonun uygun olduğu konusunda başvuru sonrasında rehberlik edebiliyorum.",
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
        a: "Detaylar kayıt sürecinde paylaşılan koşullarda belirtiliyor.",
      },
    ],
  },
  {
    category: "İletişim",
    items: [
      {
        q: "WhatsApp'tan soru sorabilir miyim?",
        a: "Programa dair tüm bilgiler bu sayfada ve tanıtım videosunda mevcut. Başvurmak istiyorsan aşağıdaki formu doldur; süreç içinde konuşuruz.",
      },
      {
        q: "Kayıt olmadan önce deneme dersi var mı?",
        a: "Hayır. Tanıtım videosunu izleyerek programın yapısını ve sana uygun olup olmadığını değerlendirebilirsin.",
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
                      className="faq-q"
                      aria-expanded={openKey === key}
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
                    <div className="faq-a" role="region">
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
