import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Gizlilik Politikası | Psefitone",
};

export default function GizlilikPolitikasi() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8rem 2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem", textAlign: "center" }}>
          Gizlilik Politikası
        </h1>
        <p style={{ color: "var(--color-muted, #888)", fontSize: "1.1rem", textAlign: "center" }}>
          Bu sayfa yakında yayınlanacaktır.
        </p>
      </main>
      <Footer />
    </>
  );
}
