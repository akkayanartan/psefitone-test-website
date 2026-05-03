export type Difficulty = "bronze" | "silver" | "gold" | "master";
export type LessonStatus = "completed" | "current" | "locked" | "available";
export type ResourceType = "pdf" | "audio" | "midi" | "video";

export interface SampleResource {
  type: ResourceType;
  name: string;
  sizeKB: number;
}

export interface SampleLesson {
  id: string;
  slug: string;
  number: string;
  title: string;
  durationMin: number;
  bpm: number;
  difficulty: Difficulty;
  status: LessonStatus;
  bookmarked: boolean;
  objectives: string[];
  resources: SampleResource[];
  selfAssessment: string[];
}

export interface SampleModule {
  id: string;
  slug: string;
  number: number;
  title: string;
  lessons: SampleLesson[];
}

export interface SampleCourse {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  modules: SampleModule[];
}

const moduleOne: SampleModule = {
  id: "m1",
  slug: "modul-1",
  number: 1,
  title: "Akorda Tanışma",
  lessons: [
    {
      id: "l-1-1",
      slug: "lesson-1-1",
      number: "1.1",
      title: "Mızrak Tutuşu",
      durationMin: 7,
      bpm: 70,
      difficulty: "bronze",
      status: "completed",
      bookmarked: true,
      objectives: [
        "Sağ el mızrak tutuşunu doğru kavra",
        "Bilek serbestliğini hisset",
        "Tek tuşa düzgün, takılmadan vurabil"
      ],
      resources: [
        { type: "pdf", name: "Mızrak Tutuşu - Görseller.pdf", sizeKB: 480 },
        { type: "audio", name: "Yavaş tempo referans.mp3", sizeKB: 1240 }
      ],
      selfAssessment: [
        "Mızrağı 30 saniye yormadan tutabiliyorum",
        "Tuşa basışlarımda bilek hareketi serbest",
        "Tek nota düzgün, kırılmadan çıkıyor"
      ]
    },
    {
      id: "l-1-2",
      slug: "lesson-1-2",
      number: "1.2",
      title: "Temel Ritm",
      durationMin: 8,
      bpm: 80,
      difficulty: "bronze",
      status: "completed",
      bookmarked: false,
      objectives: [
        "4/4 lük temel ritm kalıbını oturt",
        "Metronomla beraber kal",
        "Hızlanmadan, yavaşlamadan üç dakika çalabilesin"
      ],
      resources: [
        { type: "pdf", name: "Temel Ritm Tab.pdf", sizeKB: 320 },
        { type: "midi", name: "Ritm kalıbı.mid", sizeKB: 12 },
        { type: "audio", name: "Metronom 80 BPM.mp3", sizeKB: 880 }
      ],
      selfAssessment: [
        "Metronomla 2 dakika hatasız çalabiliyorum",
        "Tempoyu kendiliğinden hızlandırmıyorum",
        "Vuruşların hepsi eşit güçte"
      ]
    },
    {
      id: "l-1-3",
      slug: "lesson-1-3",
      number: "1.3",
      title: "Bas-Melodi Ayrımı",
      durationMin: 6,
      bpm: 80,
      difficulty: "bronze",
      status: "current",
      bookmarked: true,
      objectives: [
        "Sol elin bas, sağ elin melodi olduğunu içselleştir",
        "İki eli aynı anda farklı şeyler çalmaya alıştır",
        "Basit iki ölçü kalıbını ayrıştırarak çal"
      ],
      resources: [
        { type: "pdf", name: "Bas-Melodi Tab.pdf", sizeKB: 410 },
        { type: "audio", name: "Sadece bas.mp3", sizeKB: 720 },
        { type: "audio", name: "Sadece melodi.mp3", sizeKB: 690 }
      ],
      selfAssessment: [
        "Bas çizgisini tek başına çalabiliyorum",
        "Melodi çizgisini tek başına çalabiliyorum",
        "İkisini birden, yavaş tempoda, beraber çalabiliyorum"
      ]
    },
    {
      id: "l-1-4",
      slug: "lesson-1-4",
      number: "1.4",
      title: "İlk Kısa Ezgi",
      durationMin: 9,
      bpm: 90,
      difficulty: "silver",
      status: "available",
      bookmarked: false,
      objectives: [
        "8 ölçülük kısa bir ezgiyi sonuna kadar çal",
        "Frazlama duygusunu kazan",
        "Nefes alacağın yerleri belirle"
      ],
      resources: [
        { type: "pdf", name: "Kısa Ezgi - Notalar.pdf", sizeKB: 540 },
        { type: "video", name: "Eğitmen demo.mp4", sizeKB: 24800 }
      ],
      selfAssessment: [
        "Ezgiyi baştan sona durmadan çalabiliyorum",
        "Frazların nerede bittiğini duyuyorum",
        "Tempoyu metronomsuz da koruyabiliyorum"
      ]
    }
  ]
};

const moduleTwo: SampleModule = {
  id: "m2",
  slug: "modul-2",
  number: 2,
  title: "Sol El Bağımsızlığı",
  lessons: [
    {
      id: "l-2-1",
      slug: "lesson-2-1",
      number: "2.1",
      title: "Bas Yürüyüşü",
      durationMin: 8,
      bpm: 90,
      difficulty: "silver",
      status: "available",
      bookmarked: false,
      objectives: [
        "Bas notalarını adım adım yürüt",
        "Sol elin tek başına da müzik yapabildiğini hisset"
      ],
      resources: [{ type: "pdf", name: "Bas Yürüyüşü.pdf", sizeKB: 380 }],
      selfAssessment: [
        "Bas çizgisini tek başına 1 dakika çalabiliyorum",
        "Notalar arasında boşluk bırakmıyorum"
      ]
    },
    {
      id: "l-2-2",
      slug: "lesson-2-2",
      number: "2.2",
      title: "Akor Eşliği",
      durationMin: 10,
      bpm: 95,
      difficulty: "silver",
      status: "available",
      bookmarked: false,
      objectives: [
        "Sol elle iki temel akoru rahat al",
        "Akor değişimlerini akıcılaştır"
      ],
      resources: [
        { type: "pdf", name: "Akor Eşliği.pdf", sizeKB: 420 },
        { type: "audio", name: "Eşlik referans.mp3", sizeKB: 1100 }
      ],
      selfAssessment: [
        "İki akor arasında tereddütsüz geçiyorum",
        "Akor değişiminde tempo bozulmuyor"
      ]
    },
    {
      id: "l-2-3",
      slug: "lesson-2-3",
      number: "2.3",
      title: "Bas + Akor Birleşimi",
      durationMin: 11,
      bpm: 95,
      difficulty: "gold",
      status: "available",
      bookmarked: false,
      objectives: [
        "Bas yürüyüşü + akor eşliğini aynı elde birleştir",
        "Basit eşlik kalıbını otomatikleştir"
      ],
      resources: [{ type: "pdf", name: "Bas Akor Kalıbı.pdf", sizeKB: 460 }],
      selfAssessment: [
        "Sol el kalıbı düşünmeden tekrar ediyor",
        "Sağ ele başka bir şey verirken sol el bozulmuyor"
      ]
    },
    {
      id: "l-2-4",
      slug: "lesson-2-4",
      number: "2.4",
      title: "İki El Birlikte",
      durationMin: 12,
      bpm: 90,
      difficulty: "gold",
      status: "available",
      bookmarked: false,
      objectives: [
        "Sağ el melodiyle sol el eşliğini birleştir",
        "Yavaş tempoda kısa bir parçayı baştan sona çal"
      ],
      resources: [
        { type: "pdf", name: "İlk Tam Parça.pdf", sizeKB: 580 },
        { type: "video", name: "Demo - yavaş.mp4", sizeKB: 28400 }
      ],
      selfAssessment: [
        "Parçayı baştan sona durmadan çalabiliyorum",
        "İki elin de zamanlaması üst üste oturuyor"
      ]
    }
  ]
};

const moduleThree: SampleModule = {
  id: "m3",
  slug: "modul-3",
  number: 3,
  title: "İlk Repertuar",
  lessons: [
    {
      id: "l-3-1",
      slug: "lesson-3-1",
      number: "3.1",
      title: "Düğün Ezgisi - 1. Bölüm",
      durationMin: 10,
      bpm: 100,
      difficulty: "gold",
      status: "available",
      bookmarked: false,
      objectives: [
        "Geleneksel bir düğün ezgisinin ilk bölümünü öğren",
        "Süslemelere yer aç"
      ],
      resources: [
        { type: "pdf", name: "Düğün Ezgisi 1.pdf", sizeKB: 510 },
        { type: "audio", name: "Tam tempo referans.mp3", sizeKB: 1480 }
      ],
      selfAssessment: [
        "İlk bölümü ezbere çalabiliyorum",
        "Süsleme yerlerini biliyorum"
      ]
    },
    {
      id: "l-3-2",
      slug: "lesson-3-2",
      number: "3.2",
      title: "Düğün Ezgisi - 2. Bölüm",
      durationMin: 11,
      bpm: 100,
      difficulty: "gold",
      status: "available",
      bookmarked: false,
      objectives: [
        "İkinci bölümü öğren ve birinciyle bağla",
        "Geçişi akıcılaştır"
      ],
      resources: [{ type: "pdf", name: "Düğün Ezgisi 2.pdf", sizeKB: 540 }],
      selfAssessment: [
        "İki bölümü birleştirip çalabiliyorum",
        "Geçişte tempo bozulmuyor"
      ]
    },
    {
      id: "l-3-3",
      slug: "lesson-3-3",
      number: "3.3",
      title: "Süsleme ve Renkler",
      durationMin: 13,
      bpm: 105,
      difficulty: "master",
      status: "locked",
      bookmarked: false,
      objectives: [
        "Mordan, tril ve glissando süslemelerini tanı",
        "Ezgiye renk katmayı dene"
      ],
      resources: [],
      selfAssessment: ["Süslemeleri tempoya uydurabiliyorum"]
    },
    {
      id: "l-3-4",
      slug: "lesson-3-4",
      number: "3.4",
      title: "Tam Ezgi - Performans",
      durationMin: 14,
      bpm: 110,
      difficulty: "master",
      status: "locked",
      bookmarked: false,
      objectives: [
        "Parçayı performans temposunda baştan sona çal",
        "Bir kayıt al ve dinle"
      ],
      resources: [],
      selfAssessment: [
        "Parçayı performans temposunda baştan sona çalabiliyorum",
        "Kendi çalışımı dinleyip eksiklerimi gördüm"
      ]
    }
  ]
};

export const sampleCourse: SampleCourse = {
  id: "c-sample",
  slug: "sample-course",
  title: "Psefitone Akordeon Kursu",
  shortTitle: "Akordeon Kursu",
  modules: [moduleOne, moduleTwo, moduleThree]
};

export function findLesson(
  course: SampleCourse,
  courseSlug: string,
  lessonSlug: string
):
  | { module: SampleModule; lesson: SampleLesson; flatIndex: number; total: number }
  | null {
  if (course.slug !== courseSlug) return null;
  const flat = course.modules.flatMap((m) => m.lessons.map((l) => ({ m, l })));
  const idx = flat.findIndex((x) => x.l.slug === lessonSlug);
  if (idx === -1) return null;
  return {
    module: flat[idx].m,
    lesson: flat[idx].l,
    flatIndex: idx,
    total: flat.length
  };
}

export function getAdjacentLessons(course: SampleCourse, lessonSlug: string) {
  const flat = course.modules.flatMap((m) => m.lessons);
  const idx = flat.findIndex((l) => l.slug === lessonSlug);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null
  };
}

export function flatLessons(course: SampleCourse) {
  return course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ module: m, lesson: l }))
  );
}
