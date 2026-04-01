"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBookingModal } from "@/components/BookingModalProvider";
import { Footer } from "@/components/Footer";

const CARTE_LINK =
  "https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017";
const EBOOK_LINK =
  "https://buy.stripe.com/14A7sM5Lb3bQ7Asar1dwc0C";
const BOOKING_LINK =
  "https://meetings-eu1.hubspot.com/vlad-calus/round-robin-consultanta";

/* ═══════════════════════════════════════════════════════════════
   Rotating Testimonial Quote
   ═══════════════════════════════════════════════════════════════ */
const ROTATING_QUOTES = [
  {
    text: "Am investit €19,500 din depozit — acum am un plan de €1,200/lună.",
    name: "Iulia",
    age: "30 ani",
  },
  {
    text: "În 8 săptămâni am automatizat tot. Obiectiv: independență financiară la 30.",
    name: "Alex",
    age: "21 ani",
  },
  {
    text: "Am realocat €10,000 din fonduri cu comisioane de 3% în ETF-uri eficiente.",
    name: "Tudor",
    age: "29 ani",
  },
];

function RotatingQuote() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_QUOTES.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const q = ROTATING_QUOTES[index];
  return (
    <div className="mt-8 h-12 flex items-center justify-center">
      <p
        className={`text-sm italic text-text-muted text-center transition-opacity duration-400 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        &bdquo;{q.text}&rdquo;{" "}
        <span className="not-italic font-medium">
          — {q.name}, {q.age}
        </span>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — Hero
   ═══════════════════════════════════════════════════════════════ */
function Hero({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-[1080px] px-5 text-center">
        <h1 className="font-heading text-4xl md:text-6xl text-burgundy leading-tight">
          Învață să-ți investești banii.
          <br />
          Fără jargon, fără bullshit.
        </h1>
        {/* GEO: Quick answer block for AI engines */}
        <p className="sr-only">
          Minimalistu este o platformă de educație financiară fondată de Vlad
          Caluș, antreprenor român și Forbes 30 Sub 30, care oferă calculatoare
          financiare gratuite, consultanță personalizată 1:1, și resurse
          educaționale pentru investitorul român. Cu peste 50.000 de membri în
          comunitate și 250+ clienți individuali consultați, Minimalistu ajută
          românii să-și construiască un plan de investiții bazat pe profilul lor
          psihologic.
        </p>
        <p className="mt-6 text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
          Mă numesc Vlad Caluș. Am devenit independent financiar la 29 de ani.
          Acum te ajut și pe tine.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenModal}
            className="inline-flex items-center px-8 py-4 bg-burgundy text-white text-base font-semibold rounded-lg hover:bg-burgundy-light transition-colors cursor-pointer"
          >
            Programează un audit →
          </button>
          <Link
            href="/instrumente"
            className="inline-flex items-center px-8 py-4 border-2 border-burgundy text-burgundy text-base font-semibold rounded-lg hover:bg-burgundy hover:text-white transition-colors"
          >
            Explorează instrumentele gratuite →
          </Link>
        </div>

        {/* Rotating testimonial */}
        <RotatingQuote />

        {/* Trust bar */}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
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
   SECTION 2 — Results / Stats
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
   SECTION 3 — Three Transformations (NEW)
   ═══════════════════════════════════════════════════════════════ */
function Transformations() {
  const cards = [
    {
      num: "1",
      emoji: "🧭",
      title: "De la haos la un plan clar",
      before:
        "Ai bani împrăștiați între depozite, fonduri și conturi fără o logică",
      after:
        "Ai o strategie completă: alocare clară, instrumente alese, plan pe 20+ ani",
      description:
        "Majoritatea oamenilor investesc la întâmplare — un fond mutual de la bancă, niște acțiuni de pe TikTok, restul în depozite. Împreună construim un portofoliu structurat, diversificat global, aliniat cu profilul tău psihologic și cu obiectivele tale concrete.",
      pill: "Plan personalizat în 90 de minute",
    },
    {
      num: "2",
      emoji: "💰",
      title: "De la bani morți la bani care lucrează",
      before:
        "€50,000 în depozite la 3% — inflația îți mănâncă economiile",
      after:
        "Capital investit eficient la 7-8% anual în ETF-uri globale cu comisioane minime",
      description:
        "Cash-ul în bancă nu e \"sigur\" — pierde valoare în fiecare zi. Clientul nostru mediu avea 53% din capital blocat neproductiv. După program, 98% lucrează activ. Diferența pe 20 de ani: +€180,000 pe un portofoliu de €100K.",
      pill: "+€180K diferență pe 20 de ani",
    },
    {
      num: "3",
      emoji: "😌",
      title: "De la frică la liniște financiară",
      before:
        "Verifici piața zilnic, te sperie fiecare scădere, amâni decizii din frică",
      after:
        "Portofoliu aliniat cu personalitatea ta — investești și dormi liniștit",
      description:
        "Cel mai important lucru nu e randamentul — e să rămâi investit pe termen lung fără să faci greșeli emoționale. Construim un portofoliu pe care TU îl poți susține psihologic, nu doar matematic.",
      pill: "6x reducere a volatilității portofoliului",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Ce obții
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-burgundy">
            Trei transformări pentru succesul tău financiar
          </h2>
          <p className="mt-4 text-text-muted max-w-xl mx-auto">
            Indiferent dacă ai €10,000 sau €500,000, aceste trei schimbări
            transformă modul în care banii lucrează pentru tine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.num}
              className="bg-card rounded-xl shadow-sm border border-border p-8 flex flex-col"
            >
              {/* Number + emoji */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-burgundy text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {c.num}
                </div>
                <span className="text-2xl">{c.emoji}</span>
              </div>

              {/* Title */}
              <h3 className="font-heading text-lg text-text mb-5">
                {c.title}
              </h3>

              {/* Before */}
              <div className="flex items-start gap-2 mb-3">
                <span className="text-red mt-0.5 flex-shrink-0">✗</span>
                <p className="text-sm text-text-muted">{c.before}</p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-text-muted/40 text-xs">↓</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* After */}
              <div className="flex items-start gap-2 mb-5">
                <span className="text-green mt-0.5 flex-shrink-0">✓</span>
                <p className="text-sm text-green font-medium">{c.after}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-text-muted leading-relaxed flex-1 mb-5">
                {c.description}
              </p>

              {/* Result pill */}
              <span className="inline-block self-start mt-auto px-3 py-1.5 bg-green/10 text-green rounded-full text-[11px] font-semibold leading-tight">
                {c.pill}
              </span>
            </div>
          ))}
        </div>

        {/* Connecting CTA */}
        <div className="text-center mt-12">
          <p className="text-text-muted mb-4">
            Vrei toate trei? Începe cu o conversație.
          </p>
          <a
            href={BOOKING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-burgundy text-white text-base font-semibold rounded-lg hover:bg-burgundy-light transition-colors"
          >
            Programează o consultanță →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Avatar Component
   ═══════════════════════════════════════════════════════════════ */
const GRADIENTS = [
  ["#7B2D50", "#E8A832"],
  ["#2F8C5E", "#E8A832"],
  ["#7B2D50", "#2F8C5E"],
  ["#E8A832", "#C0384D"],
  ["#2F8C5E", "#7B2D50"],
  ["#C0384D", "#E8A832"],
];

function Avatar({
  initials,
  index,
}: {
  initials: string;
  index: number;
}) {
  const [from, to] = GRADIENTS[index % GRADIENTS.length];
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — Testimonials
   ═══════════════════════════════════════════════════════════════ */
function Testimonials() {
  const testimonials = [
    {
      initials: "I",
      name: "Iulia",
      meta: "30 ani · Irlanda",
      quote:
        "Aveam €19,500 în depozit de 3 ani pentru că nu știam ce să fac cu ei. În prima lună am investit totul și am setat un plan de €1,200/lună. În prima săptămână am văzut deja €437 câștig.",
      result: "€19,500 investiți din depozite → plan €1,200/lună",
    },
    {
      initials: "A",
      name: "Alex",
      meta: "21 ani · România",
      quote:
        "Înainte visam la independență financiară, dar îmi lipsea harta. În 8 săptămâni mi-am organizat veniturile, am creat strategia, am implementat și automatizat portofoliul. Obiectiv: €900K avere netă până la 30 de ani.",
      result: "Independență financiară la 30 — plan complet în 8 săptămâni",
    },
    {
      initials: "D",
      name: "Dragoș",
      meta: "37 ani · România",
      quote:
        "Am investit o moștenire de peste €5,000 în 3 săptămâni, mi-am automatizat complet portofoliul și am creat un plan de €200/lună spre FIRE.",
      result: "€5,000+ investiți + portofoliu automatizat în 3 săptămâni",
    },
    {
      initials: "T",
      name: "Tudor",
      meta: "29 ani · România",
      quote:
        "Am realocat €10,000 din fonduri mutuale cu comisioane de 3% pe an în ETF-uri eficiente. Am învățat să-mi gestionez finanțele și să-mi construiesc portofoliul pentru independență financiară.",
      result: "€10,000 realocați — comisioane de la 3% la 0.2%",
    },
    {
      initials: "G",
      name: "Gheorghe",
      meta: "37 ani · Republica Moldova",
      quote:
        "Programul m-a ajutat să-mi organizez finanțele, să economisesc constant și să încep să investesc. Am câștigat curaj să acționez, am crescut veniturile și am un fond de urgență.",
      result: "Primele investiții + fond de urgență în 8 săptămâni",
    },
    {
      initials: "G+A",
      name: "Gabi și Alin",
      meta: "26 ani · Olanda",
      quote:
        "Am intrat ca un cuplu care visa la independență financiară. Am ieșit cu un plan concret pentru FIRE și achiziția casei noastre de vis în Olanda.",
      result: "Plan FIRE + strategie achiziție casă — cuplu, 26 ani",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Testimoniale
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-burgundy">
            Ce spun oamenii care au trecut prin program
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-cream rounded-xl border border-border p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar initials={t.initials} index={i} />
                <div>
                  <p className="font-semibold text-text text-sm">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.meta}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-sm text-text leading-relaxed italic flex-1 mb-4">
                &bdquo;{t.quote}&rdquo;
              </p>

              {/* Result pill */}
              <span className="inline-block self-start mt-auto px-3 py-1.5 bg-green/10 text-green rounded-full text-[11px] font-semibold leading-tight">
                {t.result}
              </span>
            </div>
          ))}
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
    <section className="py-16 md:py-24">
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
          <div className="bg-card rounded-xl p-6 md:p-8 border border-border flex flex-col">
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

            <div className="mb-6 flex-1">
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
          <div className="bg-card rounded-xl p-6 md:p-8 border border-border flex flex-col">
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

            <div className="mb-6 flex-1">
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
   SECTION 6 — About
   ═══════════════════════════════════════════════════════════════ */
function About() {
  return (
    <section id="despre" className="py-16 md:py-24 bg-card scroll-mt-20">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-burgundy mb-6">
              Cine sunt
            </h2>
            <div className="space-y-4 text-text leading-relaxed">
              <p>
                Am renunțat la facultate la 19 ani ca să lansez Planable — o
                platformă de social media management pe care am crescut-o la
                venituri anuale de 7 cifre în € și am vândut-o în 2025.
              </p>
              <p>
                La 29 de ani am devenit independent financiar — cu un sistem
                bine pus la punct astfel încât ceea ce am construit să producă
                valoare pentru decenii înainte, pentru siguranța mea și a
                familiei mele. Nu din noroc, ci din disciplină: 7 ani de
                investiții la bursă, mii de ore de studiu, și o obsesie pentru
                a înțelege cum funcționează banii.
              </p>
              <p>
                Am documentat toată călătoria pe @minimalistu.eu, unde o
                comunitate de 50.000+ de oameni învață să-și ia finanțele în
                propriile mâini.
              </p>
            </div>

            {/* Book card */}
            <div className="mt-8 p-4 bg-cream rounded-xl border border-border">
              <div className="flex items-center gap-4">
                <span className="text-3xl">📖</span>
                <div>
                  <p className="font-semibold text-text">
                    &quot;Independența financiară în 7 pași&quot;
                  </p>
                  <p className="text-sm text-text-muted">
                    Cartea mea — disponibilă în format fizic și digital.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 ml-12">
                <a
                  href={CARTE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-burgundy hover:underline"
                >
                  Cărturești (fizic) →
                </a>
                <span className="text-text-muted">·</span>
                <a
                  href={EBOOK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-burgundy hover:underline"
                >
                  eBook (digital) →
                </a>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="hidden md:block flex-shrink-0">
            <Image
              src="/vlad.jpg"
              alt="Vlad Caluș — fondator Minimalistu, investitor, Forbes 30 Sub 30"
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
   SECTION 7 — Instruments Preview
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
   SECTION 8 — How It Works
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
    <section className="py-16 md:py-24 bg-card">
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
   SECTION 9 — Press Mentions
   ═══════════════════════════════════════════════════════════════ */
function PressMentions() {
  const publications = [
    { name: "Wall Street", url: "https://www.wall-street.ro" },
    { name: "Piața Financiară", url: "https://www.piatafinanciara.ro" },
    { name: "Bursa", url: "https://www.bursa.ro" },
    { name: "Futurebanking", url: "https://www.futurebanking.ro" },
    { name: "BaniSiAfaceri", url: "https://www.banisiafaceri.ro" },
    { name: "Income Magazine", url: "https://incomemagazine.ro" },
    { name: "Retail.ro", url: "https://www.retail.ro" },
    { name: "Economistul", url: "https://www.economistul.ro" },
    { name: "Financial Market", url: "https://www.financialmarket.ro" },
    { name: "Newslist", url: "https://www.newslist.ro" },
    { name: "Ziar.com", url: "https://www.ziar.com" },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl text-burgundy">
            Mențiuni în presă
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {publications.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-burgundy transition-colors text-sm md:text-base font-medium whitespace-nowrap"
            >
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 9b — Podcast Highlights
   ═══════════════════════════════════════════════════════════════ */
function PodcastHighlights() {
  const podcasts = [
    {
      id: "Lzo5gbelkE4",
      title: "Independența financiară în 7 pași",
      show: "Podcast cu Vlad Calus",
    },
    {
      id: "RjcVnBseD4s",
      title: "Banii care aduc libertate, nu stres",
      show: "Educație Financiară",
    },
    {
      id: "tfGi6mlflFs",
      title: "Te poți pensiona la 30 de ani cu investiții?",
      show: "Traders Club",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="mx-auto max-w-[1080px] px-5">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Apariții
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-burgundy">
            Podcasturi de top
          </h2>
          <p className="mt-4 text-text-muted max-w-xl mx-auto">
            Conversații despre independență financiară, investiții și mentalitatea
            din spatele banilor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {podcasts.map((p) => (
            <a
              key={p.id}
              href={`https://www.youtube.com/watch?v=${p.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-cream rounded-xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="relative aspect-video bg-burgundy/5">
                <Image
                  src={`https://img.youtube.com/vi/${p.id}/maxresdefault.jpg`}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-burgundy/90 flex items-center justify-center group-hover:bg-burgundy transition-colors">
                    <svg
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-text text-sm leading-snug">
                  {p.title}
                </p>
                <p className="text-xs text-text-muted mt-1">{p.show}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 10 — Final CTA
   ═══════════════════════════════════════════════════════════════ */
function FinalCTA({ onOpenModal }: { onOpenModal: () => void }) {
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
        <button
          onClick={onOpenModal}
          className="mt-10 inline-flex items-center px-10 py-5 bg-burgundy text-white text-lg font-semibold rounded-xl hover:bg-burgundy-light transition-colors cursor-pointer"
        >
          Vreau un plan concret →
        </button>
        <p className="mt-6 text-sm text-text-muted">
          ✓ Fără obligații · ✓ 100% confidențial · ✓ Răspuns în 24h
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE — New order
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const { openModal } = useBookingModal();

  return (
    <>
      <Hero onOpenModal={openModal} />
      <Results />
      <Transformations />
      <Testimonials />
      <CaseStudies />
      <About />
      <InstrumentsPreview />
      <HowItWorks />
      <PressMentions />
      <PodcastHighlights />
      <FinalCTA onOpenModal={openModal} />
      <Footer />
    </>
  );
}
