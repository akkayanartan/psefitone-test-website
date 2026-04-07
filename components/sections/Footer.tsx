export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Psefitone</span>
          <p className="footer-tagline">Yaşatmak için, önce iyi öğren.</p>
        </div>
        <nav className="footer-links" aria-label="Alt navigasyon">
          <a href="#">Kullanım Koşulları</a>
          <a href="mailto:info@psefitone.com">İletişim</a>
        </nav>
      </div>
      <p className="footer-legal">
        [ŞİRKET ADI] · Vergi No: [VERGİ NO] · &copy; 2025 Psefitone. Tüm hakları saklıdır.
      </p>
    </footer>
  );
}
