import { useEffect, useRef, useState } from 'react'

const AREAS = [
  { t: 'Ceza hukuku', d: 'Gözaltından temyize kadar savunma. İfade öncesi hazırlık, tutuklamaya itiraz ve duruşma stratejisi.' },
  { t: 'Aile hukuku', d: 'Boşanma, velayet, nafaka ve mal rejimi. Mümkün olduğunda anlaşmalı, gerektiğinde kararlı.' },
  { t: 'İş hukuku', d: 'İşe iade, kıdem ve ihbar tazminatı, mobbing. İşçi ve işveren için ayrı ayrı risk analizi.' },
  { t: 'Ticaret ve şirketler', d: 'Sözleşme hazırlama, alacak tahsili, ortaklık uyuşmazlıkları ve şirket kuruluşu.' },
  { t: 'Gayrimenkul', d: 'Tapu iptali, kira ve tahliye, kat mülkiyeti. Satın almadan önce hukuki durum tespiti.' },
  { t: 'Miras hukuku', d: 'Mirasçılık belgesi, tenkis, ortaklığın giderilmesi. Aile içinde barışı koruyan çözümler.' },
]

const STEPS = [
  { t: 'Dinleriz', d: 'İlk görüşmede olayı baştan sona anlatırsınız. Belgelerinizi inceler, hakkınızı ve riskleri açıkça söyleriz.' },
  { t: 'Plan çizeriz', d: 'Hangi yolun ne kadar süreceğini ve neye mal olacağını yazılı bir yol haritasıyla paylaşırız.' },
  { t: 'Takip ederiz', d: 'Her önemli adımda sizi bilgilendiririz. Dosyanızın durumunu istediğiniz an sorabilirsiniz.' },
  { t: 'Sonuçlandırırız', d: 'Dava ya da uzlaşma, hangisi lehinize ise onu seçeriz. Karar sonrası icra ve temyiz de bizde.' },
]

const QUOTES = [
  { q: 'İşten çıkarıldığımda ne yapacağımı bilmiyordum. İlk görüşmede önümde net bir yol vardı. Beş ay sonra işe iade kararı elimdeydi.', n: 'Kerem T.', r: 'Mühendis' },
  { q: 'Boşanma sürecinde çocuğumuzun yararı hep öncelikti. Karşı tarafla da saygılı bir anlaşmaya vardık.', n: 'Derya A.', r: 'Öğretmen' },
  { q: 'Ortaklık uyuşmazlığımız yıllardır sürüyordu. Üç toplantıda masaya oturup imza attık.', n: 'Mehmet S.', r: 'Esnaf' },
]

const STATS = [
  { v: 18, s: ' yıl', l: 'avukatlık deneyimi' },
  { v: 1400, s: '+', l: 'sonuçlanan dosya' },
  { v: 92, s: '%', l: 'müvekkil tavsiye oranı' },
]

function useInView(opts = { threshold: 0.35 }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, opts)
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

function Counter({ to, suffix }) {
  const [ref, seen] = useInView()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    const start = performance.now(), dur = 1600
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{n.toLocaleString('tr-TR')}{suffix}</span>
}

function Scale() {
  return (
    <svg className="scale" viewBox="0 0 400 420" role="img" aria-label="Dengeye gelen adalet terazisi">
      <g className="stand">
        <rect x="150" y="388" width="100" height="10" rx="2" />
        <path d="M176 388 L186 150 L214 150 L224 388 Z" />
        <circle cx="200" cy="84" r="8" className="seal" />
      </g>
      <g className="beam" style={{ transformOrigin: '200px 84px' }}>
        <rect x="52" y="80" width="296" height="8" rx="4" />
        {[60, 340].map((x, i) => (
          <g key={x} className={i ? 'pan pan-r' : 'pan pan-l'} style={{ transformOrigin: `${x}px 84px` }}>
            <path d={`M${x} 88 L${x - 46} 236 M${x} 88 L${x + 46} 236`} className="rope" />
            <path d={`M${x - 58} 236 Q${x} 280 ${x + 58} 236 Z`} className="dish" />
          </g>
        ))}
      </g>
    </svg>
  )
}

function Areas() {
  const [open, setOpen] = useState(0)
  return (
    <ul className="areas">
      {AREAS.map((a, i) => (
        <li key={a.t} className={open === i ? 'on' : ''}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{a.t}</span>
            <i aria-hidden="true" />
          </button>
          <div className="panel"><p>{a.d}</p></div>
        </li>
      ))}
    </ul>
  )
}

function Process() {
  const [ref, seen] = useInView({ threshold: 0.2 })
  return (
    <ol ref={ref} className={'steps' + (seen ? ' go' : '')}>
      {STEPS.map((s, i) => (
        <li key={s.t} style={{ '--i': i }}>
          <b>{i + 1}</b>
          <h3>{s.t}</h3>
          <p>{s.d}</p>
        </li>
      ))}
    </ol>
  )
}

function Quotes() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % QUOTES.length), 7000)
    return () => clearInterval(id)
  }, [])
  const c = QUOTES[i]
  return (
    <div className="quotes">
      <blockquote key={i}>
        <p>{c.q}</p>
        <footer>{c.n}, {c.r}</footer>
      </blockquote>
      <div className="dots">
        {QUOTES.map((_, k) => (
          <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Yorum ${k + 1}`} />
        ))}
      </div>
    </div>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const submit = (e) => { e.preventDefault(); setSent(true) }
  if (sent)
    return (
      <div className="sent">
        <svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M15 27 l8 8 l15 -17" /></svg>
        <h3>Teşekkürler{name ? ', ' + name.split(' ')[0] : ''}.</h3>
        <p>Talebiniz bize ulaştı. Bir iş günü içinde sizi arayıp uygun bir görüşme saati belirleyeceğiz.</p>
      </div>
    )
  return (
    <form onSubmit={submit}>
      <label>Adınız soyadınız<input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
      <label>Telefon<input required type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" /></label>
      <label>Konu
        <select defaultValue="">
          <option value="" disabled>Seçin</option>
          {AREAS.map((a) => <option key={a.t}>{a.t}</option>)}
          <option>Diğer</option>
        </select>
      </label>
      <label>Kısaca durumunuz<textarea rows="4" placeholder="Ayrıntıları görüşmede birlikte konuşuruz." /></label>
      <button className="btn" type="submit">Görüşme talep et</button>
      <small>Paylaştığınız bilgiler avukat-müvekkil gizliliği kapsamındadır.</small>
    </form>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <>
      <header className={'nav' + (scrolled ? ' solid' : '')}>
        <a href="#top" className="brand"><span className="mark" />Denge Hukuk</a>
        <nav>
          <a href="#alanlar">Çalışma alanları</a>
          <a href="#surec">Süreç</a>
          <a href="#hakkimizda">Hakkımızda</a>
          <a href="#iletisim" className="btn sm">Ücretsiz ön görüşme</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">İzmir · Alsancak</p>
            <h1>Hukuki sorununuz, sakin ve net bir plana dönüşsün.</h1>
            <p className="lead">Karmaşık süreçleri sade bir dille anlatır, her adımda sizi bilgilendirir ve dosyanızı sonuca kadar takip ederiz.</p>
            <div className="cta">
              <a className="btn" href="#iletisim">Ön görüşme planlayın</a>
              <a className="tel" href="tel:+902321234567">0232 123 45 67</a>
            </div>
            <p className="note">İlk değerlendirme ücretsiz. Cevabınız bir iş günü içinde.</p>
          </div>
          <Scale />
        </section>

        <section className="stats">
          {STATS.map((s) => (
            <div key={s.l}><strong><Counter to={s.v} suffix={s.s} /></strong><span>{s.l}</span></div>
          ))}
        </section>

        <section id="alanlar" className="sec split">
          <div>
            <h2>Hangi konuda destek arıyorsunuz?</h2>
            <p className="sub">Her dosya kendi koşullarına göre ele alınır. Alanınızı seçin, nasıl çalıştığımızı görün.</p>
          </div>
          <Areas />
        </section>

        <section id="surec" className="sec dark">
          <h2>İlk telefondan karara, yol haritası baştan belli.</h2>
          <Process />
        </section>

        <section id="hakkimizda" className="sec about">
          <div className="portrait" aria-hidden="true"><span>S.A.</span></div>
          <div>
            <h2>Av. Selin Arda</h2>
            <p>İzmir Barosu'na kayıtlı. Dokuz Eylül Üniversitesi Hukuk Fakültesi mezunu. Ceza ve aile hukukunda on sekiz yıldır dava yürütüyor, iş ve ticaret dosyalarında arabuluculuk yapıyor.</p>
            <p>Çalışma ilkesi basit: müvekkil ne olacağını bilsin, sürpriz yaşamasın. Bu yüzden her dosyada yazılı bilgilendirme ve ücret şeffaflığı sunuyoruz.</p>
            <ul className="facts">
              <li>İzmir Barosu</li>
              <li>Arabuluculuk sertifikası</li>
              <li>İngilizce ve Almanca hizmet</li>
            </ul>
          </div>
        </section>

        <section className="sec quote-sec"><Quotes /></section>

        <section id="iletisim" className="sec split contact">
          <div>
            <h2>Önce anlatın, sonra karar verin.</h2>
            <p className="sub">Formu doldurun, ilk görüşmede durumunuzu değerlendirip size dürüst bir yol önerelim.</p>
            <dl>
              <dt>Adres</dt><dd>Kıbrıs Şehitleri Cd. No:120 K:4, Alsancak, İzmir</dd>
              <dt>Telefon</dt><dd>0232 123 45 67</dd>
              <dt>E-posta</dt><dd>iletisim@dengehukuk.example</dd>
              <dt>Çalışma saatleri</dt><dd>Hafta içi 09.00 – 18.30, cumartesi randevu ile</dd>
            </dl>
          </div>
          <Contact />
        </section>
      </main>

      <footer>
        <span>© 2026 Denge Hukuk Bürosu</span>
        <span>Bu sayfadaki bilgiler genel bilgilendirme amaçlıdır, hukuki görüş niteliği taşımaz.</span>
      </footer>
    </>
  )
}
