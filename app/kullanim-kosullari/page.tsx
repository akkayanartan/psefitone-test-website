import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Kullanım Koşulları | Psefitone",
};

export default function KullanimKosullari() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "60vh", padding: "8rem 2rem 6rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "2.5rem", fontWeight: 700, marginBottom: "2.5rem" }}>
          KULLANIM KOŞULLARI
        </h1>

        <p style={{ marginBottom: "1.5rem", lineHeight: 1.8 }}>
          Bu Kullanım Koşulları, <strong>Nartan Psefit Akkaya</strong> (bundan sonra "Hizmet Sağlayıcı" olarak anılacaktır) tarafından işletilen internet sitesi ve bu site üzerinden sunulan tüm dijital eğitim içerikleri, materyaller ve servislerin (bundan sonra "Platform" olarak anılacaktır) kullanım şartlarını düzenlemektedir. Platform'u kullanan veya sunulan hizmetlerden yararlanan her gerçek kişi (bundan sonra "Kullanıcı" olarak anılacaktır), bu koşulları bütünüyle okuduğunu ve onayladığını beyan eder.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          1. Taraflar ve Sözleşmenin Niteliği
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          Bu metin, ticari bir tüzel kişilik barındırmayan, bireysel bir hizmet sağlayıcı olan Nartan Psefit Akkaya ile Kullanıcı arasında akdedilmiştir. Sunulan hizmetler, mesafeli sözleşme kapsamında sunulan dijital içerik ve çevrimiçi eğitim hizmeti niteliğindedir.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          2. Hizmet Kapsamı ve Değişiklik Hakları
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          Hizmet Sağlayıcı; sunduğu eğitimlerin formatını, müfredatını, kullanılan dijital araçları, fiyatlandırmayı ve her türlü içeriği dilediği zaman, önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar. Bu koşullar, Hizmet Sağlayıcı tarafından sunulan mevcut ve gelecekteki tüm içerikler için geçerli olup, içerik veya format değişiklikleri bu sözleşmenin geçerliliğini etkilemez.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          3. Fikri Mülkiyet ve Kullanım Sınırları
        </h3>
        <ul style={{ lineHeight: 1.8, marginBottom: "1rem", paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.75rem" }}><strong>Özgün İçerik:</strong> Eğitim kapsamında sunulan özgün video kayıtları, ses dosyaları, şahsi anlatımlar, ders kurgusu ve "Psefitone" markası altındaki sunum metodolojisi Hizmet Sağlayıcı&apos;nın şahsi fikri mülkiyetidir.</li>
          <li style={{ marginBottom: "0.75rem" }}><strong>Genel Bilgiler:</strong> Eğitim içerisinde yer alan evrensel müzik teorileri, anonim notalar ve genel geçer pedagojik teknikler üzerinde mülkiyet iddia edilmez. Ancak bu unsurların Platform bünyesindeki özgün seçkisi, sıralaması ve sunum tarzı bir bütün olarak koruma altındadır.</li>
          <li style={{ marginBottom: "0.75rem" }}><strong>Kısıtlamalar:</strong> Kullanıcıya sağlanan erişim hakkı şahsa özeldir. İçeriklerin; üçüncü şahıslarla paylaşılması, ortak kullanılması, kopyalanması, çoğaltılması, herhangi bir mecrada yayınlanması veya ticari amaçlarla kullanılması kesinlikle yasaktır. İhlal tespiti halinde Kullanıcı&apos;nın erişim yetkisi herhangi bir iade yapılmaksızın sonlandırılır.</li>
        </ul>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          4. Ödeme ve İade Politikası
        </h3>
        <ul style={{ lineHeight: 1.8, marginBottom: "1rem", paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.75rem" }}><strong>Cayma Hakkı İstisnası:</strong> 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca; "elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler" kapsamında cayma hakkı kullanılamaz.</li>
          <li>Kullanıcıya eğitim materyallerine erişim yetkisi tanımlandığı andan itibaren hizmet ifa edilmiş sayılır. Bu nedenle, satın alınan hizmetler için <strong>her ne sebeple olursa olsun ücret iadesi yapılmamaktadır.</strong></li>
        </ul>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          5. Sorumlulukların Sınırlandırılması
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          Hizmet Sağlayıcı, eğitim içeriklerini profesyonel standartlarda hazırlamakla birlikte, Kullanıcı&apos;nın bireysel gelişim hızı ve başarı düzeyi hakkında herhangi bir garanti vermez. Gelişim süreci tamamen Kullanıcı&apos;nın kendi çalışma disiplinine ve uygulama sıklığına bağlıdır. Teknik altyapı sağlayıcılarından veya üçüncü taraf platformlardan kaynaklanan geçici kesintilerden Hizmet Sağlayıcı sorumlu tutulamaz.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          6. Veri Gizliliği
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          Kullanıcı tarafından sağlanan isim ve iletişim bilgileri, yalnızca eğitim sürecinin yönetilmesi ve operasyonel iletişim amacıyla kullanılır. Bu veriler, yasal zorunluluklar dışında üçüncü taraflara paylaşılmaz.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          7. Yetkili Mahkeme
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          Bu sözleşmenin uygulanmasından ve yorumlanmasından doğabilecek her türlü uyuşmazlıkta Ankara (Türkiye) Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          8. Yürürlük
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          Kullanıcı, Platform üzerinden hizmet satın aldığı veya kayıt işlemlerini tamamladığı andan itibaren bu metnin tüm maddelerini kabul etmiş sayılır.
        </p>
      </main>
      <Footer />
    </>
  );
}
