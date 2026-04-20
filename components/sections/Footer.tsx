import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Psefitone</span>
          <p className="footer-tagline">Yaşatmak için, önce iyi öğren.</p>
        </div>
        <nav className="footer-links" aria-label="Alt navigasyon">
          <Link href="/kullanim-kosullari">Kullanım Koşulları</Link>
          <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
          <Link href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link>
        </nav>
      </div>
      <p className="footer-legal">
        &copy; 2026 Psefitone. Tüm hakları saklıdır.
      </p>
    </footer>
  );
}
