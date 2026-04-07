import Nav from "@/components/Nav";
import Footer from "@/components/sections/Footer";

export const metadata = {
  title: "Gizlilik Politikası | Psefitone",
};

export default function GizlilikPolitikasi() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "60vh", padding: "8rem 2rem 6rem", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display, serif)", fontSize: "2.5rem", fontWeight: 700, marginBottom: "2.5rem" }}>
          GİZLİLİK POLİTİKASI
        </h1>

        <p style={{ marginBottom: "1.5rem", lineHeight: 1.8 }}>
          Bu Gizlilik Politikası, <strong>Nartan Psefit Akkaya</strong> (bundan sonra "Veri Sorumlusu" olarak anılacaktır) tarafından işletilen internet sitesi ve sunulan dijital eğitim hizmetleri kapsamında, Kullanıcılara ait kişisel verilerin 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuata uygun olarak işlenmesine ilişkin usul ve esasları belirlemektedir.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          1. İşlenen Kişisel Veriler
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "0.75rem" }}>Platformun kullanımı ve eğitim süreçleri dahilinde aşağıdaki veriler işlenebilmektedir:</p>
        <ul style={{ lineHeight: 1.8, marginBottom: "1rem", paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}><strong>Kimlik Bilgileri:</strong> Ad ve soyad.</li>
          <li style={{ marginBottom: "0.5rem" }}><strong>İletişim Bilgileri:</strong> E-posta adresi ve telefon numarası.</li>
          <li style={{ marginBottom: "0.5rem" }}><strong>Eğitim ve Performans Verileri:</strong> Kurs ilerleme durumu, ödev videoları, performans kayıtları ve sisteme yüklenen çalışma materyalleri.</li>
          <li style={{ marginBottom: "0.5rem" }}><strong>Teknik Veriler:</strong> IP adresi, çerez (cookie) kayıtları ve platform kullanım istatistikleri.</li>
        </ul>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          2. Veri İşleme Amaçları
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "0.75rem" }}>Kişisel veriler aşağıdaki amaçlarla sınırlı olarak işlenmektedir:</p>
        <ul style={{ lineHeight: 1.8, marginBottom: "1rem", paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>Eğitim programlarına kayıt süreçlerinin yönetilmesi ve mülakat aşamalarının gerçekleştirilmesi.</li>
          <li style={{ marginBottom: "0.5rem" }}>Eğitim içeriklerine erişimin sağlanması ve teknik destek sunulması.</li>
          <li style={{ marginBottom: "0.5rem" }}>Kullanıcı gelişiminin takibi ve geri bildirim süreçlerinin yönetilmesi.</li>
          <li style={{ marginBottom: "0.5rem" }}>Hizmet kalitesinin artırılması ve platform güvenliğinin sağlanması.</li>
          <li style={{ marginBottom: "0.5rem" }}>Yasal yükümlülüklerin yerine getirilmesi.</li>
        </ul>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          3. Verilerin Aktarılması
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "0.75rem" }}>Kişisel veriler Hizmet Sağlayıcı tarafından üçüncü taraflara ticari amaçlarla satılmaz veya kiralanmaz. Veriler ancak aşağıdaki durumlarda aktarılabilir:</p>
        <ul style={{ lineHeight: 1.8, marginBottom: "1rem", paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}><strong>Hizmet Sağlayıcılar:</strong> Eğitim altyapısını sağlayan dijital platformlar (Soundslice, video barındırma servisleri vb.) ve e-posta gönderim sistemleri gibi teknik iş ortaklarıyla, sadece hizmetin ifası için gerekli olduğu ölçüde paylaşılır.</li>
          <li style={{ marginBottom: "0.5rem" }}><strong>Yasal Zorunluluklar:</strong> Yetkili kamu kurum ve kuruluşları tarafından yasal çerçevede talep edilmesi durumunda paylaşılır.</li>
        </ul>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          4. Veri Güvenliği ve Saklama Süresi
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          Kişisel veriler, işleme amacının gerektirdiği süre boyunca veya ilgili yasal zamanaşımı süreleri dikkate alınarak saklanır. Verilerin yetkisiz erişime, kayba veya değişikliğe karşı korunması için makul idari ve teknik tedbirler alınmaktadır.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          5. Kullanıcı Hakları (KVKK Madde 11)
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "0.75rem" }}>KVKK uyarınca, verisi işlenen her Kullanıcı aşağıdaki haklara sahiptir:</p>
        <ul style={{ lineHeight: 1.8, marginBottom: "1rem", paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>Kişisel verisinin işlenip işlenmediğini öğrenme.</li>
          <li style={{ marginBottom: "0.5rem" }}>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme.</li>
          <li style={{ marginBottom: "0.5rem" }}>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme.</li>
          <li style={{ marginBottom: "0.5rem" }}>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme.</li>
          <li style={{ marginBottom: "0.5rem" }}>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme.</li>
          <li style={{ marginBottom: "0.5rem" }}>KVKK&apos;da öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme.</li>
        </ul>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          6. Çerezler (Cookies)
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          İnternet sitesi, ziyaretçi deneyimini iyileştirmek ve site trafiğini analiz etmek amacıyla temel seviyede çerezler kullanabilir. Tarayıcı ayarları üzerinden çerez kullanımı kısıtlanabilir.
        </p>

        <h3 style={{ fontFamily: "var(--font-display, serif)", fontSize: "1.2rem", fontWeight: 700, marginTop: "2rem", marginBottom: "0.75rem" }}>
          7. Değişiklikler ve İletişim
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
          Hizmet Sağlayıcı, bu Gizlilik Politikası hükümlerini dilediği zaman güncelleme hakkını saklı tutar. Güncellemeler sitede yayınlandığı tarihte yürürlüğe girer. Veri işleme süreçleriyle ilgili her türlü soru ve talebiniz için aşağıdaki adresten iletişim kurulabilir:
        </p>
        <p style={{ lineHeight: 1.8 }}>
          <strong>Veri Sorumlusu:</strong> Nartan Psefit Akkaya<br />
          <strong>E-posta:</strong> akkayanartan@gmail.com
        </p>
      </main>
      <Footer />
    </>
  );
}
