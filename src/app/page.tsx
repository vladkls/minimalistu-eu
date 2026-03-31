import Link from "next/link";
import Image from "next/image";

const HUBSPOT_LINK =
  "https://meetings-eu1.hubspot.com/vlad-calus/round-robin-consultanta";
const CARTE_LINK =
  "https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017";

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — Hero
   ═══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-[1080px] px-5 text-center">
        <h1 className="font-heading text-4xl md:text-6xl text-burgundy leading-tight">
          Învață să-ți investești banii.
          <br />
          Fără jargon, fără bullshit.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
          Mă numesc Vlad Caluș. Am devenit independent financiar la 29 de ani.
          Acum te ajut și pe tine.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={HUBSPOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-burgundy text-white text-base font-semibold rounded-lg hover:bg-burgundy-light transition-colors"
          >
            Programează un audit →
          </a>
          <Link
            href="/instrumente"
            className="inline-flex items-center px-8 py-4 border-2 border-burgundy text-burgundy text-base font-semibold rounded-lg hover:bg-burgundy hover:text-white transition-colors"
          >
            Explorează instrumentele gratuite →
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            "🏆 Forbes 30 Sub 30",
            "🚀 Techstars London Alumni",
            '📖 Autor: "Independența financiară în 7 pași"',
            "👥 50.000+ comunitate",
          ].map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center px-4 py-2 bg-card rounded-full text-sm text-text-muted border border-border"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — About
   ═══════════════════════════════════════════════════════════════ */
function About() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-burgundy mb-6">
              Cine sunt
            </h2>
            <div className="space-y-4 text-text leading-relaxed">
              <p>
                Am renunțat la facultate la 19 ani ca să lansez Planable — o
                platformă de social media management pe care am crescut-o la 7
                cifre ARR și am vândut-o în 2025.
              </p>
              <p>
                La 29 de ani am devenit independent financiar. Nu din noroc, ci
                din disciplină: 7 ani de investiții la bursă, mii de ore de
                studiu, și o obsesie pentru a înțelege cum funcționează banii.
              </p>
              <p>
                Am documentat toată călătoria pe @minimalistu.eu, unde o
                comunitate de 50.000+ de oameni învață să-și ia finanțele în
                propriile mâini.
              </p>
            </div>

            {/* Book card */}
            <a
              href={CARTE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">📖</span>
              <div>
                <p className="font-semibold text-text">
                  &quot;Independența financiară în 7 pași&quot;
                </p>
                <p className="text-sm text-text-muted">
                  Cartea mea, disponibilă pe Cărturești →
                </p>
              </div>
            </a>
          </div>

          {/* Photo */}
          <div className="hidden md:block flex-shrink-0">
            <Image
              src="/vlad.jpg"
              alt="Vlad Caluș"
              width={280}
              height={350}
              className="rounded-2xl object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — Results
   ═══════════════════════════════════════════════════════════════ */
function Results() {
  const stats = [
    { value: "13.000+", label: "studenți care au început să investească" },
    { value: "250+", label: "clienți individuali consultați" },
    { value: "50.000+", label: "comunitate Minimalistu" },
    { value: "€2M+", label: "portofolii analizate" },
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="mx-auto max-w-[1080px] px-5">
        <h2 className="font-heading text-3xl md:text-4xl text-burgundy text-center mb-12">
          Numere, nu promisiuni
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6">
              <div className="font-heading text-3xl md:text-4xl text-burgundy">
                {s.value}
              </div>
              <p className="mt-2 text-sm text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — Instruments Preview
   ═══════════════════════════════════════════════════════════════ */
function InstrumentsPreview() {
  const tools = [
    {
      icon: "🔥",
      name: "Calculator FIRE",
      desc: "Când devii liber financiar?",
    },
    {
      icon: "💸",
      name: "Costul de Oportunitate",
      desc: "Cât te costă să nu investești?",
    },
    {
      icon: "🔍",
      name: "Portfolio X-Ray",
      desc: "Cât de sănătos e portofoliul tău?",
    },
    {
      icon: "🏠",
      name: "Chirie vs Cumpărare",
      desc: "Ce e mai avantajos pentru tine?",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-burgundy">
            Instrumente gratuite
          </h2>
          <p className="mt-4 text-text-muted max-w-xl mx-auto">
            Calculatoare financiare care îți arată exact unde ești. 12
            instrumente interactive, construite pentru investitorul român.
            Gratuite, fără cont.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((t) => (
            <Link
              key={t.name}
              href="/instrumente"
              className="p-6 bg-card rounded-xl border border-border hover:shadow-md hover:border-burgundy/20 transition-all"
            >
              <span className="text-3xl">{t.icon}</span>
              <h3 className="mt-3 font-semibold text-text">{t.name}</h3>
              <p className="mt-1 text-sm text-text-muted">{t.desc}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/instrumente"
            className="inline-flex items-center px-8 py-4 bg-burgundy text-white text-base font-semibold rounded-lg hover:bg-burgundy-light transition-colors"
          >
            Explorează toate instrumentele →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — Case Studies
   ═══════════════════════════════════════════════════════════════ */
function CaseStudies() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-burgundy">
            Transformări reale
          </h2>
          <p className="mt-4 text-text-muted max-w-xl mx-auto">
            Exemple anonimizate din clienții noștri. Fiecare portofoliu a fost
            reconstruit pe baza profilului psihologic.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Case Study 1 */}
          <div className="bg-cream rounded-xl p-6 md:p-8 border border-border">
            <h3 className="font-heading text-xl text-burgundy mb-6">
              Capital blocat → Capital care lucrează
            </h3>

            <div className="mb-6">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Înainte
              </p>
              <ul className="space-y-2 text-sm text-text">
                <li className="flex items-start gap-2">
                  <span className="text-red mt-0.5">✗</span>53% capital blocat
                  în cash neproductiv
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red mt-0.5">✗</span>Doar 8% expunere
                  la acțiuni
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red mt-0.5">✗</span>Fonduri mutuale cu
                  comisioane 2-3%/an
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red mt-0.5">✗</span>Concentrare pe
                  România, diversificare zero
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                După
              </p>
              <ul className="space-y-2 text-sm text-text">
                <li className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>70% acțiuni
                  globale (ETF-uri), 23% titluri de stat, 5% aur
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>3.000+ companii
                  din întreaga lume
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>Comisioane reduse
                  la 0.20%
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "+3.18%", label: "randament anual" },
                { value: "+€180.000", label: "diferență pe 20 ani" },
                { value: "€40.000", label: "economie comisioane" },
                { value: "98%", label: "capital productiv" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="bg-green/8 rounded-lg p-3 text-center"
                >
                  <div className="text-green font-bold text-lg">{r.value}</div>
                  <div className="text-xs text-text-muted">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="bg-cream rounded-xl p-6 md:p-8 border border-border">
            <h3 className="font-heading text-xl text-burgundy mb-6">
              De la anxietate la stabilitate
            </h3>

            <div className="mb-6">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                Înainte
              </p>
              <ul className="space-y-2 text-sm text-text">
                <li className="flex items-start gap-2">
                  <span className="text-red mt-0.5">✗</span>24.5% în
                  criptomonede — profil ultra-conservator
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red mt-0.5">✗</span>Zero venit lunar
                  predictibil
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red mt-0.5">✗</span>Credit imobiliar +
                  zero venit activ
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red mt-0.5">✗</span>Anxietate constantă
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                După
              </p>
              <ul className="space-y-2 text-sm text-text">
                <li className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>Crypto redus de
                  la 24.5% la 4%
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>Obligațiuni
                  generatoare de venit: 0% → 22.5%
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>ETF cu dividende
                  adăugat
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-0.5">✓</span>Plan în 5 pași
                  prioritizați
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "6x", label: "reducere volatilitate" },
                { value: "€0 → venit", label: "din obligațiuni + dividende" },
                { value: "22.5%", label: "componentă stabilă nouă" },
                { value: "Somn liniștit", label: "portofoliu aliniat" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="bg-green/8 rounded-lg p-3 text-center"
                >
                  <div className="text-green font-bold text-lg">{r.value}</div>
                  <div className="text-xs text-text-muted">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — How It Works
   ═══════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Analiză personalitate",
      desc: "Profilul tău psihologic prin 5 dimensiuni",
    },
    {
      num: "2",
      title: "Diagnostic portofoliu",
      desc: "Radiografia completă a alocării tale actuale",
    },
    {
      num: "3",
      title: "Strategie personalizată",
      desc: "Portofoliu reconstruit specific pentru tine",
    },
    {
      num: "4",
      title: "Plan de acțiune",
      desc: "Pași exacți, prioritizați, cu timeline",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-5">
        <h2 className="font-heading text-3xl md:text-4xl text-burgundy text-center mb-12">
          Cum funcționează
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-burgundy text-white flex items-center justify-center font-bold text-lg">
                {s.num}
              </div>
              <h3 className="mt-4 font-semibold text-text">{s.title}</h3>
              <p className="mt-2 text-sm text-text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 7 — Final CTA
   ═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="py-20 md:py-28 bg-burgundy/5">
      <div className="mx-auto max-w-[1080px] px-5 text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-burgundy">
          Ai bani, dar nu ai un plan.
          <br />
          Hai să schimbăm asta.
        </h2>
        <p className="mt-6 text-text-muted max-w-xl mx-auto leading-relaxed">
          250+ de oameni ca tine au transformat economiile într-o strategie clară
          de independență financiară. Într-o sesiune de 90 de minute, îți arătăm
          exact ce pași să faci.
        </p>
        <a
          href={HUBSPOT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center px-10 py-5 bg-burgundy text-white text-lg font-semibold rounded-xl hover:bg-burgundy-light transition-colors"
        >
          Vreau un plan concret →
        </a>
        <p className="mt-6 text-sm text-text-muted">
          ✓ Fără obligații · ✓ 100% confidențial · ✓ Răspuns în 24h
        </p>
        <p className="mt-4 text-xs text-text-muted/60 max-w-md mx-auto">
          Auditul financiar oferit nu constituie consiliere financiară
          autorizată. Vlad Caluș nu este consilier financiar autorizat.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Results />
      <InstrumentsPreview />
      <CaseStudies />
      <HowItWorks />
      <FinalCTA />
    </>
  );
}
