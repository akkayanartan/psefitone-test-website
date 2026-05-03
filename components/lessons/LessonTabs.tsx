"use client";

import { useState } from "react";
import { useLessonShell } from "./LessonShellContext";
import LessonResources from "./LessonResources";

type TabId = "genel" | "kaynaklar";

export default function LessonTabs() {
  const { lesson } = useLessonShell();
  const [active, setActive] = useState<TabId>("genel");

  const tabs: { id: TabId; label: string }[] = [
    { id: "genel", label: "Genel" },
    { id: "kaynaklar", label: `Kaynaklar (${lesson.resources.length})` }
  ];

  return (
    <section className="lessons-tabs" aria-label="Ders sekmeleri">
      <div role="tablist" aria-label="Ders içerik sekmeleri" className="lessons-tabs__list">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            aria-controls={`lessons-tabpanel-${t.id}`}
            id={`lessons-tab-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            className={[
              "lessons-tabs__tab",
              active === t.id ? "is-active" : ""
            ].filter(Boolean).join(" ")}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="lessons-tabs__panels">
        {active === "genel" && (
          <div
            role="tabpanel"
            id="lessons-tabpanel-genel"
            aria-labelledby="lessons-tab-genel"
            className="lessons-tabs__panel"
          >
            <p>
              Bu derste {lesson.title.toLowerCase()} konusunu adım adım çalışacaksın.
              Hedeflerin yukarıda. Aşağıdaki video + tab oynatıcıyla birlikte yavaş
              tempodan başla, kendini rahat hissettiğin yere geldiğinde tempo bandını
              aç.
            </p>
            <p>
              Çalışma sırasında aklına gelen her şeyi sağdaki not alanına bırak.
              Notların ders bazında otomatik olarak kaydedilir; ileride &quot;tüm notlarım&quot;
              görünümünden geriye dönüp bakabilirsin.
            </p>
            <ul className="lessons-tabs__hints">
              <li>Önce yavaş tempoda hatasız çal, sonra hızlandır.</li>
              <li>Her gün 10 dakika, haftada 3 gün — bu dersi oturtur.</li>
              <li>Takıldığın yer olursa videoyu tek başına izle, sonra tab&apos;a dön.</li>
            </ul>
          </div>
        )}
        {active === "kaynaklar" && (
          <div
            role="tabpanel"
            id="lessons-tabpanel-kaynaklar"
            aria-labelledby="lessons-tab-kaynaklar"
            className="lessons-tabs__panel"
          >
            <LessonResources resources={lesson.resources} />
          </div>
        )}
      </div>
    </section>
  );
}
