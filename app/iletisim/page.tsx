import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "İletişim | Psefitone",
  description:
    "Psefitone iletişim bilgileri — Nartan Psefit Akkaya. Telefon, e-posta, adres ve WhatsApp.",
};

export default function Iletisim() {
  return (
    <>
      <Nav />
      <main className="iletisim-page">
        <section className="section">
          <div className="section-inner iletisim-inner">
            <span className="section-tag gsap-reveal">İletişim</span>
            <h1 className="section-title iletisim-title">
              Bize <em>ulaşın</em>
            </h1>
            <p className="iletisim-lede">
              Sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.
              <br />
              <strong>Yalnızca WhatsApp üzerinden geri dönüş yapılmaktadır.</strong>
            </p>

            <div className="iletisim-grid">
              <div className="iletisim-card">
                <span className="iletisim-card-label">İsim</span>
                <p className="iletisim-card-value iletisim-card-name">
                  Nartan Psefit Akkaya
                </p>
              </div>

              <div className="iletisim-card">
                <span className="iletisim-card-label">Telefon</span>
                <a
                  className="iletisim-card-value iletisim-card-link"
                  href="tel:+905318197140"
                >
                  +90 531 819 71 40
                </a>
              </div>

              <div className="iletisim-card">
                <span className="iletisim-card-label">E-posta</span>
                <a
                  className="iletisim-card-value iletisim-card-link"
                  href="mailto:akkayanartan@gmail.com"
                >
                  akkayanartan@gmail.com
                </a>
              </div>

              <div className="iletisim-card iletisim-card-wide">
                <span className="iletisim-card-label">Adres</span>
                <p className="iletisim-card-value">
                  Alacaatlı Mah. 3373/2 Cd. No 1 B/11 Çankaya/Ankara
                </p>
              </div>
            </div>

            <div className="iletisim-whatsapp">
              <p className="iletisim-whatsapp-note">
                Geri dönüş <strong>yalnızca WhatsApp</strong> üzerinden yapılır.
              </p>
              <a
                href="https://wa.me/905318197140?text=Merhaba%2C%20Psefitone%20Kickstarter%20hakk%C4%B1nda%20bir%20sorum%20var."
                className="btn btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                WhatsApp&apos;tan yaz
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
