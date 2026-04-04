"use client";

import Link from "next/link";
import Image from "next/image";

const STRIPE_LINK = "https://buy.stripe.com/9B6fZi2yZ27M7As8iTdwc0D";

/* ─── tiny helpers ─── */
const Section = ({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => (
  <section id={id} className={`py-16 md:py-24 px-5 ${className}`}>
    <div className="mx-auto max-w-[1080px]">{children}</div>
  </section>
);

const CTAButton = ({
  size = "lg",
  className = "",
}: {
  size?: "lg" | "md";
  className?: string;
}) => (
  <a
    href={STRIPE_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
      size === "lg"
        ? "px-8 py-4 text-lg"
        : "px-6 py-3 text-base"
    } bg-burgundy text-white hover:bg-burgundy-light shadow-lg shadow-burgundy/20 ${className}`}
  >
    Vreau cursul — €47 →
  </a>
);

/* ─────────────────── PAGE ─────────────────── */
export default function StartPage() {
  return (
    <main className="bg-cream">
      {/* ══════ HERO ══════ */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-5">
        {/* subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-burgundy/[0.03] to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-[1080px]">
          <div className="max-w-[720px]">
            <p className="text-burgundy font-semibold text-sm tracking-wide uppercase mb-4">
              Mini-curs video · 7 module · acces lifetime
            </p>

            <h1 className="font-heading text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.1] text-text mb-6">
              Tot ce trebuie să știi ca să faci{" "}
              <span className="text-burgundy">prima ta investiție</span>{" "}
              inteligentă
            </h1>

            <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-8 max-w-[600px]">
              Fără jargon. Fără teorie abstractă. Un plan concret, pas cu pas,
              ca să nu mai stai cu banii în bancă și să pierzi la inflație.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <CTAButton />
              <a
                href="#module"
                className="inline-flex items-center text-burgundy font-medium hover:underline underline-offset-4 py-3"
              >
                Vezi ce primești ↓
              </a>
            </div>

            {/* quick stats */}
            <div className="flex flex-wrap gap-6 text-sm text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="text-green">✓</span> ~100 minute de conținut
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-green">✓</span> Screen recording live pe XTB
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-green">✓</span> Tracker portofoliu inclus
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-green">✓</span> 13,000+ studenți
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ PROBLEM ══════ */}
      <Section className="bg-white">
        <div className="max-w-[720px] mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-text mb-8">
            Te recunoști?
          </h2>

          <div className="space-y-5">
            {[
              "Ai economii în bancă, dar știi că pierzi bani la inflație — și nu faci nimic",
              "Ai auzit de ETF-uri, acțiuni, investiții — dar nu știi de unde să începi concret",
              "Ți-e teamă să nu pierzi bani dacă investești greșit",
              "Ai citit articole, ai văzut video-uri — dar tot nu ai făcut prima investiție",
              "Vrei un plan simplu și clar, nu teorie financiară de 200 de pagini",
            ].map((text, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="mt-1 text-burgundy font-bold text-lg">—</span>
                <p className="text-text text-lg leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-cream rounded-xl border border-border">
            <p className="text-text leading-relaxed">
              <span className="font-semibold">Vestea bună:</span> nu ești singur.
              Din 466 de conversații cu oameni ca tine, am învățat că blocajul nu e
              financiar — e emoțional. Ai deja resursele. Ce lipsește e un plan
              simplu și clar.
            </p>
          </div>
        </div>
      </Section>

      {/* ══════ VLAD INTRO ══════ */}
      <Section>
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
            <Image
              src="/vlad.jpg"
              alt="Vlad Caluș"
              width={176}
              height={176}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="font-heading text-3xl text-text mb-4">
              Salut, sunt Vlad.
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-3">
              Am atins siguranța financiară la 29 de ani. Am un portofoliu de
              €300K+. Am co-fondat și ieșit din Planable (Forbes 30 Under 30).
              Și am ajutat peste 13,000 de studenți să facă primul pas în
              investiții.
            </p>
            <p className="text-text-muted text-lg leading-relaxed">
              Am creat acest curs pentru că am văzut aceeași problemă de sute de
              ori: oameni inteligenți, cu bani puși deoparte, care nu investesc
              pentru că nimeni nu le-a explicat simplu și concret cum se face.
            </p>
          </div>
        </div>
      </Section>

      {/* ══════ MODULELE ══════ */}
      <Section className="bg-white" id="module">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-text mb-4">
            Ce primești în curs
          </h2>
          <p className="text-text-muted text-lg max-w-[600px] mx-auto">
            7 module video, ~100 minute de conținut, de la zero la primul tău ETF
            cumpărat
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              num: "01",
              title: "De ce banii tăi pierd valoare chiar acum",
              desc: "Inflația în România (9,31%), Moldova și Europa. Cost de oportunitate — cât pierzi în fiecare lună.",
              time: "15 min",
            },
            {
              num: "02",
              title: "În ce poți investi și cum funcționează",
              desc: "Harta investițiilor. ETF-uri explicate simplu. Taxe și impozite — România, Moldova, diaspora.",
              time: "18 min",
            },
            {
              num: "03",
              title: "Platforma potrivită pentru tine",
              desc: "XTB, Interactive Brokers, Tradeville — comparație onestă. Screen recording cu interfața.",
              time: "12 min",
            },
            {
              num: "04",
              title: "Prima ta investiție — pas cu pas pe XTB",
              desc: "LIVE screen recording: de la deschidere cont la prima investiție. Fiecare click.",
              time: "15 min",
              highlight: true,
            },
            {
              num: "05",
              title: "Planul tău lunar de investit",
              desc: "Cât investești, când, cum. DCA, fond de urgență, buget. Un sistem de 15 minute pe lună.",
              time: "12 min",
            },
            {
              num: "06",
              title: "Cele 5 greșeli pe care le fac toți începătorii",
              desc: "Panic selling, verificat zilnic, timing-ul pieței. Povești reale — să nu le repeți.",
              time: "12 min",
            },
            {
              num: "07",
              title: "Roadmap-ul tău pe 12 luni",
              desc: "Plan concret: ce faci în luna 1, luna 3, luna 6, luna 12. Rezultate realiste cu cifre.",
              time: "10 min",
            },
            {
              num: "✦",
              title: "BONUS: Tracker Portofoliu",
              desc: "Google Sheets pre-completat. Completezi o dată pe lună, 2 minute. Exemplu real de la Vlad.",
              time: "Inclus",
              isBonus: true,
            },
          ].map((mod) => (
            <div
              key={mod.num}
              className={`p-6 rounded-xl border transition-shadow hover:shadow-md ${
                mod.highlight
                  ? "bg-burgundy/[0.04] border-burgundy/20"
                  : mod.isBonus
                    ? "bg-amber/[0.06] border-amber/20"
                    : "bg-cream border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`font-heading text-2xl ${
                    mod.isBonus ? "text-amber" : "text-burgundy/40"
                  }`}
                >
                  {mod.num}
                </span>
                <span className="text-xs font-medium text-text-muted bg-white px-2.5 py-1 rounded-full">
                  {mod.time}
                </span>
              </div>
              <h3 className="font-semibold text-text text-lg mb-2">
                {mod.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {mod.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <CTAButton />
        </div>
      </Section>

      {/* ══════ INSTRUMENTE REFERRAL ══════ */}
      <Section>
        <div className="bg-white rounded-2xl border border-border p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="font-heading text-2xl md:text-3xl text-text mb-4">
                + 12 calculatoare financiare gratuite
              </h2>
              <p className="text-text-muted leading-relaxed mb-4">
                Pe lângă curs, ai acces la toate instrumentele de pe{" "}
                <Link
                  href="/instrumente"
                  className="text-burgundy font-medium underline underline-offset-2"
                >
                  minimalistu.eu/instrumente
                </Link>{" "}
                — calculatoare de cost de oportunitate, dobândă compusă, FIRE,
                fond de urgență, DCA vs timing, și altele.
              </p>
              <p className="text-text-muted text-sm">
                Referite direct în curs, ca să simulezi exact scenariul tău.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Cost de oportunitate",
                "Dobândă compusă",
                "Fond urgență",
                "DCA vs Timing",
                "FIRE",
                "Portfolio X-Ray",
                "Toleranță risc",
              ].map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1.5 text-xs font-medium bg-burgundy/[0.06] text-burgundy rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ══════ FOR WHOM — dream outcomes ══════ */}
      <Section className="bg-white">
        <h2 className="font-heading text-3xl md:text-4xl text-text mb-4 text-center">
          Cursul e pentru tine dacă...
        </h2>
        <p className="text-text-muted text-center text-lg mb-12 max-w-[600px] mx-auto">
          Nu contează dacă ești în România, Moldova sau diaspora
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🏦",
              title: "Ai economii care stau",
              desc: "Ai €5,000 — €50,000 în bancă și știi că pierzi la inflație, dar nu te-ai apucat să investești.",
            },
            {
              emoji: "🤔",
              title: "Nu știi de unde să începi",
              desc: "Ai auzit de ETF-uri, fonduri, acțiuni — dar nimeni nu ți-a explicat simplu, pas cu pas, ce să faci.",
            },
            {
              emoji: "😰",
              title: "Ți-e teamă să greșești",
              desc: "Blocajul tău e emoțional, nu financiar. Vrei siguranță și claritate înainte să acționezi.",
            },
            {
              emoji: "📈",
              title: "Ai cumpărat ceva random",
              desc: "Ai o acțiune sau un ETF cumpărat la întâmplare. Nu ai un plan. Nu știi dacă faci bine.",
            },
            {
              emoji: "💸",
              title: "Vrei €300-€1,500/lună investiți",
              desc: "Ai capacitatea, dar n-ai sistemul. Vrei un plan pe care să-l poți urma automat, fără stres.",
            },
            {
              emoji: "🎯",
              title: "Vrei siguranță financiară",
              desc: "Nu vrei să devii milionar mâine. Vrei să dormi liniștit, știind că banii tăi lucrează pentru tine.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-cream rounded-xl border border-border"
            >
              <span className="text-3xl mb-3 block">{item.emoji}</span>
              <h3 className="font-semibold text-text mb-2">{item.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ RESULTS / NUMBERS ══════ */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl text-text mb-4">
            Ce poți realiza
          </h2>
          <p className="text-text-muted text-lg">
            Rezultate realiste la 8% medie anuală
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              period: "10 ani",
              amount: "€300/lună",
              invested: "€36,000",
              result: "€55,200",
              gain: "+€19,200",
            },
            {
              period: "20 ani",
              amount: "€300/lună",
              invested: "€72,000",
              result: "€178,000",
              gain: "+€106,000",
              featured: true,
            },
            {
              period: "30 ani",
              amount: "€300/lună",
              invested: "€108,000",
              result: "€450,000",
              gain: "+€342,000",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl text-center ${
                item.featured
                  ? "bg-burgundy text-white shadow-xl shadow-burgundy/20 scale-[1.02]"
                  : "bg-white border border-border"
              }`}
            >
              <p
                className={`text-sm font-medium uppercase tracking-wide mb-2 ${
                  item.featured ? "text-white/70" : "text-text-muted"
                }`}
              >
                {item.amount} × {item.period}
              </p>
              <p
                className={`font-heading text-4xl md:text-5xl mb-2 ${
                  item.featured ? "text-white" : "text-burgundy"
                }`}
              >
                {item.result}
              </p>
              <p
                className={`text-sm mb-1 ${
                  item.featured ? "text-white/70" : "text-text-muted"
                }`}
              >
                Investit: {item.invested}
              </p>
              <p
                className={`font-semibold ${
                  item.featured ? "text-amber-light" : "text-green"
                }`}
              >
                Câștig: {item.gain}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Simulează scenariul tău exact pe{" "}
          <Link
            href="/instrumente"
            className="text-burgundy underline underline-offset-2"
          >
            minimalistu.eu/instrumente
          </Link>
        </p>
      </Section>

      {/* ══════ TESTIMONIALS ══════ */}
      <Section className="bg-white">
        <h2 className="font-heading text-3xl md:text-4xl text-text mb-10 text-center">
          Ce spun studenții
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              text: "Am amânat investițiile ani de zile. După cursul lui Vlad, în aceeași seară mi-am deschis contul și am făcut prima investiție.",
              name: "Andreea M.",
              detail: "București, România",
            },
            {
              text: "Explicațiile sunt atât de clare încât am înțeles în 2 ore ce nu am reușit să înțeleg din 6 luni de citit pe internet.",
              name: "Ion P.",
              detail: "Chișinău, Moldova",
            },
            {
              text: "Nu sunt din România și mă temeam că taxele vor fi complicate. Vlad a acoperit exact situația mea ca român în diaspora.",
              name: "Cristian D.",
              detail: "München, Germania",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="p-6 bg-cream rounded-xl border border-border"
            >
              <p className="text-text leading-relaxed mb-4 text-[15px]">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-text text-sm">{t.name}</p>
                <p className="text-text-muted text-xs">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ FAQ ══════ */}
      <Section>
        <h2 className="font-heading text-3xl md:text-4xl text-text mb-10 text-center">
          Întrebări frecvente
        </h2>

        <div className="max-w-[720px] mx-auto space-y-6">
          {[
            {
              q: "Am nevoie de cunoștințe financiare anterioare?",
              a: "Nu. Cursul e construit de la zero. Dacă știi ce e un cont bancar, ești pregătit.",
            },
            {
              q: "Funcționează dacă nu sunt din România?",
              a: "Da. Modulul de taxe acoperă România, Moldova și principalele țări europene (Germania, Spania, UK, Franța, Italia). Platformele recomandate (XTB, IBKR) funcționează în toată Europa.",
            },
            {
              q: "Cât timp îmi ia să parcurg cursul?",
              a: "~100 minute de video. Poți parcurge totul într-o după-amiază sau câte un modul pe zi, în 7 zile.",
            },
            {
              q: "Cu cât trebuie să încep să investesc?",
              a: "Poți începe cu €50. Serios. Suma nu contează la început — obiceiul contează. În curs îți arăt exact cum calculezi suma ideală pentru venitul tău.",
            },
            {
              q: "Ce platformă de investiții recomandați?",
              a: "XTB ca primă alegere (0% comision, interfață simplă). Interactive Brokers pentru mai mult control. Tradeville doar pentru ETF-ul BET românesc. Arăt totul în Modulul 3.",
            },
            {
              q: "Ce primesc concret?",
              a: "7 module video (~100 min), screen recordings live pe XTB, tracker portofoliu Google Sheets, acces la 12 calculatoare pe minimalistu.eu/instrumente, acces lifetime fără abonament.",
            },
            {
              q: "Pot primi factura?",
              a: "Da, după achiziție primești automat confirmarea pe email. Pentru factură pe firmă, scrie-ne la contact@minimalistu.eu.",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-xl border border-border overflow-hidden"
            >
              <summary className="cursor-pointer px-6 py-5 flex items-center justify-between text-text font-medium hover:text-burgundy transition-colors list-none">
                {faq.q}
                <span className="text-burgundy/40 group-open:rotate-45 transition-transform text-xl ml-4 flex-shrink-0">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-text-muted text-[15px] leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* ══════ FINAL CTA ══════ */}
      <Section className="bg-burgundy">
        <div className="text-center max-w-[700px] mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
            Fiecare lună în care nu investești,{" "}
            <span className="text-amber-light">pierzi bani.</span>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Nu mai târziu. Nu luna viitoare. Azi poți face primul pas. €47 pentru
            un plan clar, simplu, pe care îl urmezi 15 minute pe lună.
          </p>

          <a
            href={STRIPE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-xl bg-white text-burgundy hover:bg-cream transition-colors shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            Vreau cursul — €47 →
          </a>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/60 text-sm">
            <span>✓ Acces lifetime</span>
            <span>✓ 7 module video</span>
            <span>✓ Screen recording live</span>
            <span>✓ Tracker inclus</span>
            <span>✓ Fără abonament</span>
          </div>

          <p className="mt-8 text-white/40 text-xs max-w-[500px] mx-auto leading-relaxed">
            Investițiile implică riscuri, inclusiv pierderea capitalului.
            Conținutul este educațional și nu constituie sfat financiar
            personalizat. Performanțele trecute nu garantează rezultate viitoare.
          </p>
        </div>
      </Section>
    </main>
  );
}
