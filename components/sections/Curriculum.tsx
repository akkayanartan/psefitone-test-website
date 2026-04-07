"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Lesson = {
  text: string;
  song?: boolean;
  exercise?: boolean;
  sub?: { text: string; song?: boolean }[];
};

type Module = {
  num: string;
  title: string;
  desc: string;
  lessons: Lesson[];
};

const curriculum: Module[] = [
  {
    num: "00",
    title: "Kursa Başlamadan Önce",
    desc: "Her şey buradan başlar.",
    lessons: [
      { text: "Hoşgeldin (Program Tanıtımı)", sub: [] },
      { text: "Soundslice Kullanım Rehberi", sub: [] },
      { text: "Doğru Çalışma Metodu", sub: [] },
      { text: "Akordeon Enstrümanı ve Ergonomisi", sub: [] },
    ],
  },
  {
    num: "01",
    title: "Müzik Teorisi I",
    desc: "Nota okuma ve temel ritim.",
    lessons: [
      { text: "Klavye ve Kağıt Üzerindeki Harita", sub: [] },
      { text: "Müzikte Zaman Yönetimi", sub: [] },
      { text: "Bona Egzersizleri", sub: [] },
      { text: "Sağ El Alıştırmaları", sub: [] },
      { text: "Birlik Nota", exercise: true, sub: [] },
      { text: "İkilik Nota", exercise: true, sub: [] },
      { text: "Dörtlük Nota", exercise: true, sub: [] },
      { text: "Parmak açma-kapama alıştırmaları", exercise: true, sub: [] },
      { text: "Tekrar eden seslerde parmak değişimleri", exercise: true, sub: [] },
      { text: "Parmak ve bilek geçişleri", exercise: true, sub: [] },
      { text: "Isınma Rutini: İlk Rutin", exercise: true, sub: [] },
    ],
  },
  {
    num: "02",
    title: "Müzik Teorisi II ve Çerkes Müziğine Giriş",
    desc: "Ritim zenginleşiyor, ilk parçalar geliyor.",
    lessons: [
      { text: "Sekizlik, Onaltılık Notalar", sub: [] },
      { text: "Kafe Kuanshe", song: true, sub: [] },
      { text: "Biz — Ubıhlar", song: true, sub: [] },
      { text: "Tekrar İşaretleri", sub: [] },
      { text: "Uzatma Noktası", sub: [] },
      { text: "Isınma Rutini: Hanon 1", exercise: true, sub: [] },
      { text: "Bağlar", sub: [] },
      { text: "EMEF — Askuryala", song: true, sub: [] },
      { text: "Üçlemeler", sub: [] },
      { text: "EMEF — Reyhaniye Kafe", song: true, sub: [] },
      { text: "Marem Gökhan Şen — Jansuret yi Gıbze", song: true, sub: [] },
      { text: "Isınma Rutini: Hanon 2", exercise: true, sub: [] },
    ],
  },
  {
    num: "03",
    title: "Bas Sistemi I",
    desc: "Sol el uyanıyor.",
    lessons: [
      { text: "Stradella Bas Sistemine Giriş", sub: [] },
      { text: "Sol el alıştırmaları (3-2, atlamalar)", sub: [] },
      { text: "Baslarda Alternatif Parmak Kullanımı (4-3, Serçe parmak)", sub: [] },
    ],
  },
  {
    num: "04",
    title: "Çift El Çalışmaları I",
    desc: "İki el, tek ses.",
    lessons: [
      { text: "Çift el çalışmalarına Giriş", sub: [] },
      { text: "Sekizlik Notalar ile Basları Eşleştirme", sub: [] },
      { text: "Biz — Ubıhlar", song: true, sub: [] },
      { text: "Üçlemeler ile Basları Eşleştirme", sub: [] },
      { text: "Marem Gökhan Şen — Jansuret yi Gıbze", song: true, sub: [] },
      { text: "Onaltılık Notalar ile Basları Eşleştirme", sub: [] },
      { text: "EMEF — Askuryala", song: true, sub: [] },
    ],
  },
];

const lessonReasons: Record<string, string> = {
  "Hoşgeldin (Program Tanıtımı)": "Programın yapısını ve beklentileri net olarak belirler; baştan doğru zihniyetle başlamak için kritiktir.",
  "Soundslice Kullanım Rehberi": "Kurs boyunca kullanacağın nota görüntüleme aracına hakim olmak, kendi kendine çalışmayı mümkün kılar.",
  "Doğru Çalışma Metodu": "Yanlış alışkanlıklar aylar içinde kötü kas hafızası oluşturur; bunu en başta düzeltmek zamanı kurtarır.",
  "Akordeon Enstrümanı ve Ergonomisi": "Enstrümanla sağlıklı bir duruş kurmadan teknik ilerleme mümkün değildir; bu ders uzun vadeli sakatlanmaları önler.",
  "Klavye ve Kağıt Üzerindeki Harita": "Notaları görsel bir haritaya oturtmak, her sonraki teorik adımı somutlaştırır.",
  "Müzikte Zaman Yönetimi": "Ritim, müziğin iskeleti. Bunu erken kavramadan hiçbir parça doğru seslenemez.",
  "Bona Egzersizleri": "Notaları seslendirerek okumak, kulak ve el arasındaki bağı pekiştirir.",
  "Sağ El Alıştırmaları": "Sağ elin tekniği burada inşa edilir; ilerleyen modüllerdeki parçalar bu temele yaslanır.",
  "Sekizlik, Onaltılık Notalar": "Çerkes müziğindeki ritim örüntülerinin büyük çoğunluğu bu nota değerlerine dayanır.",
  "Tekrar İşaretleri": "Notaları verimli okuyabilmek için şarttır; yoksa her parça çok daha uzun görünür.",
  "Uzatma Noktası": "Noktanın getirdiği ritim asimetrisi, müziğe nefes ve ifade katar.",
  "Bağlar": "Bağlar nüans ve akıcılık sağlar; bu teknik olmadan parçalar mekanik kalır.",
  "Üçlemeler": "Çerkes danslarındaki sallantılı karakteri verir; repertuvar bu noktada belirgin biçimde zenginleşir.",
  "Isınma Rutini: Hanon 2": "Her modül sonunda teknikteki kazanımları korumak için rutin güncellenir.",
  "Stradella Bas Sistemine Giriş": "Sol elin mantığını kavramak, iki eli koordineli kullanabilmenin ön koşuludur.",
  "Sol el alıştırmaları (3-2, atlamalar)": "Akordeon baslarında atlama hareketleri en sık yapılan hatalardan biridir; alıştırmalar kas hafızasını önceden kurar.",
  "Baslarda Alternatif Parmak Kullanımı (4-3, Serçe parmak)": "Serçe parmağı dahil etmek başlangıçta zordur ama hız ve esneklik için vazgeçilmezdir.",
  "Çift el çalışmalarına Giriş": "İki eli ayrı ayrı öğrendikten sonra birleştirmek yeni bir dikkat gerektirir; bu ders geçişi yapılandırır.",
  "Sekizlik Notalar ile Basları Eşleştirme": "Tanıdık parça üzerinden iki el koordinasyonu pratik edilir; bilinen içerik öğrenmeyi hızlandırır.",
  "Üçlemeler ile Basları Eşleştirme": "Üçleme ritmi iki elle çalarken özellikle karmaşıklaşır; ayrı bir odak gerektirir.",
  "Onaltılık Notalar ile Basları Eşleştirme": "Hız gerektiren bu ritim, iki el koordinasyonunun şimdiye kadarki en zorlu testidir.",
};

export default function Curriculum() {
  const [activeModule, setActiveModule] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const moduleSectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollTop = container.scrollTop;
    let active = 0;
    for (let i = 0; i < moduleSectionRefs.current.length; i++) {
      const el = moduleSectionRefs.current[i];
      if (!el) continue;
      if (el.offsetTop - 48 <= scrollTop) active = i;
    }
    setActiveModule(active);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToModule = (idx: number) => {
    const section = moduleSectionRefs.current[idx];
    const container = scrollContainerRef.current;
    if (!section || !container) return;
    container.scrollTo({ top: section.offsetTop - 24, behavior: "smooth" });
  };

  const totalLessons = curriculum.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <section
      id="muzik-programi"
      style={{
        background: "rgba(14,10,26,0.75)",
        padding: "6rem var(--section-pad-h)",
      }}
    >
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ marginBottom: "3rem" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Müzik Programı
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              margin: "0 0 0.75rem",
              lineHeight: 1.15,
            }}
          >
            Neler öğreneceksin?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              maxWidth: "520px",
            }}
          >
            10 haftalık programın içeriği. Her modül, bir sonrakine zemin hazırlar.
          </p>
        </div>

        {/* Vessel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid var(--brand-border)",
            background: "rgba(26,18,41,0.82)",
            boxShadow:
              "0 0 0 1px rgba(134,41,255,0.08), 0 24px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(134,41,255,0.06)",
          }}
        >
          {/* ── LEFT SIDEBAR ── */}
          <div
            style={{
              borderRight: "1px solid var(--brand-border)",
              display: "flex",
              flexDirection: "column",
              background: "rgba(35,27,53,0.85)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top glow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "80px",
                background: "linear-gradient(180deg, rgba(134,41,255,0.07) 0%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />

            {/* Sticky progress track */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "0",
                top: "8px",
                bottom: "52px",
                width: "3px",
                background: "rgba(134,41,255,0.08)",
                borderRadius: "0 3px 3px 0",
              }}
            />

            <nav style={{ flex: 1, padding: "8px 0", position: "relative", zIndex: 2 }}>
              {curriculum.map((m, idx) => {
                const isActive = idx === activeModule;
                return (
                  <button
                    key={m.num}
                    onClick={() => scrollToModule(idx)}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "13px 20px 13px 14px",
                      width: "100%",
                      boxSizing: "border-box",
                      position: "relative",
                      background: isActive ? "rgba(134,41,255,0.1)" : "transparent",
                      transition: "background 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(134,41,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {/* Active bar */}
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "3px",
                        height: isActive ? "56%" : "0%",
                        borderRadius: "0 3px 3px 0",
                        background: "linear-gradient(180deg, var(--secondary), var(--primary))",
                        boxShadow: isActive ? "0 0 10px rgba(134,41,255,0.55)" : "none",
                        transition:
                          "height 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
                      }}
                    />

                    {/* Number */}
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: isActive ? "var(--secondary)" : "rgba(155,145,176,0.35)",
                        minWidth: "26px",
                        paddingTop: "2px",
                        lineHeight: 1,
                        transition: "color 0.25s ease",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {m.num}
                    </span>

                    {/* Title + tagline */}
                    <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.775rem",
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "var(--text)" : "var(--text-muted)",
                          lineHeight: 1.35,
                          transition: "color 0.25s ease",
                        }}
                      >
                        {m.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.66rem",
                          color: isActive ? "var(--accent)" : "transparent",
                          fontStyle: "italic",
                          opacity: isActive ? 0.8 : 0,
                          transition: "opacity 0.25s ease, color 0.25s ease",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {m.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid var(--brand-border)",
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.66rem",
                  color: "rgba(155,145,176,0.35)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {curriculum.length} modül · {totalLessons} ders
              </span>
            </div>
          </div>

          {/* ── RIGHT PANEL (scrollable) ── */}
          <div
            ref={scrollContainerRef}
            style={{
              overflowY: "auto",
              height: "620px",
              position: "relative",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(134,41,255,0.2) transparent",
            }}
          >
            {curriculum.map((mod, modIdx) => (
              <div
                key={mod.num}
                ref={(el) => { moduleSectionRefs.current[modIdx] = el; }}
                style={{ position: "relative" }}
              >
                {/* Module banner */}
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "rgba(26,18,41,0.92)",
                    borderBottom: "1px solid var(--brand-border)",
                    padding: "18px 32px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Ghost number */}
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.4rem",
                      fontWeight: 700,
                      color: "rgba(134,41,255,0.15)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      userSelect: "none",
                    }}
                  >
                    {mod.num}
                  </span>

                  <div
                    style={{
                      width: "1px",
                      height: "36px",
                      background: "var(--brand-border)",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.15rem",
                        fontWeight: 600,
                        color: "var(--text)",
                        margin: 0,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {mod.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        opacity: 0.6,
                        fontStyle: "italic",
                      }}
                    >
                      {mod.desc}
                    </span>
                  </div>

                  {/* Lesson count badge */}
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      background: "rgba(227,224,170,0.07)",
                      border: "1px solid rgba(227,224,170,0.14)",
                      borderRadius: "100px",
                      padding: "4px 11px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {mod.lessons.length} ders
                  </span>
                </div>

                {/* Lessons */}
                <div style={{ padding: "12px 32px 28px" }}>
                  {mod.lessons.map((lesson, li) => {
                    const reason = lessonReasons[lesson.text];
                    const isLast = li === mod.lessons.length - 1;
                    return (
                      <div
                        key={li}
                        style={{
                          paddingTop: "18px",
                          paddingBottom: isLast ? "0" : "18px",
                          borderBottom: isLast
                            ? "none"
                            : "1px solid rgba(203,195,214,0.07)",
                        }}
                      >
                        {/* Lesson title row */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "12px",
                            marginBottom: reason || (lesson.sub && lesson.sub.length > 0) ? "7px" : "0",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              color: "rgba(134,41,255,0.5)",
                              letterSpacing: "0.05em",
                              minWidth: "20px",
                              flexShrink: 0,
                            }}
                          >
                            {String(li + 1).padStart(2, "0")}
                          </span>

                          <span
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.975rem",
                              fontWeight: 600,
                              color: lesson.song ? "var(--primary)" : "var(--text)",
                              lineHeight: 1.35,
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            <span>{lesson.text}</span>
                            {lesson.song && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontFamily: "var(--font-body)",
                                  fontSize: "0.6rem",
                                  fontWeight: 700,
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  color: "var(--accent)",
                                  background: "rgba(227,224,170,0.08)",
                                  border: "1px solid rgba(227,224,170,0.2)",
                                  borderRadius: "100px",
                                  padding: "2px 8px",
                                  flexShrink: 0,
                                }}
                              >
                                ♩ Örnek Parça
                              </span>
                            )}
                            {lesson.exercise && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  fontFamily: "var(--font-body)",
                                  fontSize: "0.6rem",
                                  fontWeight: 700,
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  color: "rgba(120,210,170,0.9)",
                                  background: "rgba(120,210,170,0.07)",
                                  border: "1px solid rgba(120,210,170,0.2)",
                                  borderRadius: "100px",
                                  padding: "2px 8px",
                                  flexShrink: 0,
                                }}
                              >
                                ◆ Egzersiz
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Placeholder rationale */}
                        {reason && (
                          <p
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "0.73rem",
                              color: "var(--text-muted)",
                              opacity: 0.7,
                              lineHeight: 1.6,
                              margin: "0 0 8px 32px",
                              fontStyle: "italic",
                              borderLeft: "2px solid rgba(227,224,170,0.18)",
                              paddingLeft: "10px",
                            }}
                          >
                            {reason}
                          </p>
                        )}

                        {/* Sub-lessons */}
                        {lesson.sub && lesson.sub.length > 0 && (
                          <ul
                            style={{
                              listStyle: "none",
                              margin: "6px 0 0 32px",
                              padding: 0,
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            {lesson.sub.map((s, si) => (
                              <li
                                key={si}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  fontFamily: "var(--font-body)",
                                  fontSize: "0.78rem",
                                  color: s.song ? "var(--primary)" : "var(--text-muted)",
                                  opacity: s.song ? 0.85 : 0.6,
                                  padding: "3px 0",
                                }}
                              >
                                <span
                                  style={{
                                    width: "4px",
                                    height: "4px",
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                    background: s.song ? "var(--primary)" : "rgba(155,145,176,0.3)",
                                  }}
                                />
                                {s.song && <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>♩</span>}
                                {s.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Module separator */}
                {modIdx < curriculum.length - 1 && (
                  <div
                    style={{
                      height: "1px",
                      margin: "0 32px",
                      background:
                        "linear-gradient(90deg, rgba(134,41,255,0.25) 0%, var(--brand-border) 50%, transparent 100%)",
                    }}
                  />
                )}
              </div>
            ))}

            {/* Bottom fade */}
            <div
              aria-hidden
              style={{
                position: "sticky",
                bottom: 0,
                left: 0,
                right: 0,
                height: "48px",
                background: "linear-gradient(0deg, var(--dark2) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
