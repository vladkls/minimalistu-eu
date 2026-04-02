"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";

const XTB_LINK = "https://link-pso.xtb.com/pso/LiEke";
const REFERRAL_CODE = "MINIMALISTU";

/* ─── Copy to clipboard ─── */
function CopyCodeBox() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = REFERRAL_CODE;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 bg-card border-2 border-dashed border-burgundy/20 rounded-xl p-5 text-center">
      <p className="text-sm text-text-muted mb-2">
        Folosește codul de referral la deschiderea contului:
      </p>
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl font-bold text-burgundy tracking-wider font-mono">
          {REFERRAL_CODE}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-burgundy/10 text-burgundy text-xs font-semibold rounded-lg hover:bg-burgundy/20 transition-colors cursor-pointer"
        >
          {copied ? "Copiat! \u2713" : "\uD83D\uDCCB Copiaz\u0103 codul"}
        </button>
      </div>
    </div>
  );
}

/* ─── CTA Button ─── */
function CTAButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={XTB_LINK}
      target="_blank"
      rel="noopener sponsored nofollow"
      className={`inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-amber text-burgundy-dark text-base font-bold rounded-xl hover:brightness-105 transition-all ${className}`}
    >
      Deschide cont XTB \u2192
    </a>
  );
}

/* ─── Trust Line ─── */
function TrustLine() {
  return (
    <p className="mt-4 text-xs text-text-muted text-center">
      \u2713 Cont gratuit \u00B7 \u2713 F\u0103r\u0103 comisioane pe ac\u021Biuni \u00B7 \u2713 Reglementat UE
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — Hero
   ═══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="pt-16 pb-10">
      <div className="mx-auto max-w-[680px] px-5 text-center">
        {/* Badge */}
        <span className="inline-flex items-center px-3 py-1 bg-green text-white text-[11px] font-semibold rounded-full mb-6">
          Recomandat de Vlad Calu\u0219 \u00B7 Minimalistu
        </span>

        <h1 className="font-heading text-[28px] md:text-4xl text-burgundy leading-tight">
          Brokerul pe care-l folosesc eu.
        </h1>
        <p className="mt-4 text-base text-text-muted max-w-lg mx-auto leading-relaxed">
          XTB este platforma prin care investesc personal. Dac\u0103 vrei s\u0103
          \u00EEncepi \u0219i tu, folose\u0219te codul meu \u0219i prime\u0219ti un bonus educa\u021Bional.
        </p>

        <div className="mt-8">
          <CTAButton />
        </div>

        <CopyCodeBox />
        <TrustLine />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — Bonus Materials
   ═══════════════════════════════════════════════════════════════ */
function BonusMaterials() {
  const materials = [
    { icon: "\uD83D\uDCCA", text: "Introducere \u00EEn investi\u021Bii" },
    { icon: "\uD83D\uDCC8", text: "Cum func\u021Bioneaz\u0103 bursa" },
    { icon: "\uD83D\uDCB0", text: "Tipuri de instrumente financiare" },
    { icon: "\uD83C\uDF0D", text: "ETF-uri \u0219i diversificare global\u0103" },
    { icon: "\uD83D\uDCC9", text: "Cum gestionezi riscul" },
    { icon: "\uD83E\uDDEE", text: "Analiza fundamental\u0103" },
    { icon: "\uD83D\uDCCB", text: "Cum cite\u0219ti un grafic" },
    { icon: "\uD83D\uDD04", text: "Strategii de investi\u021Bii" },
    { icon: "\uD83D\uDCB6", text: "Cum func\u021Bioneaz\u0103 ordinele la burs\u0103" },
    { icon: "\uD83C\uDFE6", text: "Diferen\u021Ba dintre ac\u021Biuni \u0219i ETF-uri" },
    { icon: "\uD83D\uDCF1", text: "Cum folose\u0219ti platforma XTB" },
    { icon: "\uD83C\uDFAF", text: "Cum \u00EE\u021Bi setezi obiectivele" },
    { icon: "\uD83D\uDEE1\uFE0F", text: "Protec\u021Bia investitorului \u00EEn UE" },
    { icon: "\uD83D\uDCC5", text: "Investi\u021Bii pe termen lung" },
    { icon: "\uD83D\uDCA1", text: "Gre\u0219eli comune de evitat" },
    { icon: "\uD83D\uDE80", text: "Primii pa\u0219i ca investitor" },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[680px] px-5">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
          <h2 className="font-heading text-xl text-text mb-2">
            \uD83C\uDF81 16 materiale educa\u021Bionale gratuite
          </h2>
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            C\u00E2nd deschizi contul cu codul MINIMALISTU, prime\u0219ti acces la 16
            resurse educa\u021Bionale despre investi\u021Bii — create de XTB pentru a te
            ajuta s\u0103 \u00EEnve\u021Bi fundamentele.
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {materials.map((m) => (
              <div
                key={m.text}
                className="flex items-start gap-2 text-[13px] text-text-muted"
              >
                <span className="flex-shrink-0">{m.icon}</span>
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-text-muted/60 leading-relaxed">
            Materialele sunt disponibile automat \u00EEn contul t\u0103u XTB dup\u0103 ce
            folose\u0219ti codul MINIMALISTU la \u00EEnregistrare.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — Why XTB
   ═══════════════════════════════════════════════════════════════ */
function WhyXTB() {
  const benefits = [
    {
      title: "0% comision pe ac\u021Biuni",
      desc: "Tranzac\u021Bionezi ac\u021Biuni \u0219i ETF-uri f\u0103r\u0103 comisioane, p\u00E2n\u0103 la un volum lunar de \u20AC100,000.",
    },
    {
      title: "Reglementat \u00EEn UE",
      desc: "XTB este reglementat de KNF (Polonia) \u0219i autorizat \u00EEn toat\u0103 Uniunea European\u0103, inclusiv Rom\u00E2nia.",
    },
    {
      title: "Platform\u0103 intuitiv\u0103",
      desc: "Aplica\u021Bia mobil\u0103 \u0219i platforma web sunt printre cele mai u\u0219or de folosit — ideale pentru \u00EEncep\u0103tori.",
    },
    {
      title: "Ac\u021Biuni frac\u021Bionare",
      desc: "Po\u021Bi investi \u0219i cu \u20AC10 — nu trebuie s\u0103 cumperi o ac\u021Biune \u00EEntreag\u0103. Perfect pentru DCA lunar.",
    },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-[680px] px-5">
        <h2 className="font-heading text-xl text-burgundy text-center mb-8">
          De ce investesc prin XTB
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-card rounded-xl border border-border p-5"
            >
              <h3 className="font-semibold text-text text-sm mb-1">
                {b.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — How to Open Account
   ═══════════════════════════════════════════════════════════════ */
function HowToOpen() {
  const steps = [
    {
      num: "1",
      title: "Click pe butonul de mai jos",
      desc: "Accesezi pagina XTB prin linkul meu de referral.",
    },
    {
      num: "2",
      title: "Completezi formularul de \u00EEnregistrare",
      desc: "Dureaz\u0103 ~10 minute. Ai nevoie de buletin/pa\u0219aport \u0219i o adres\u0103 de email.",
    },
    {
      num: "3",
      title: "Introdu codul MINIMALISTU",
      desc: "La pasul de referral, scrie codul MINIMALISTU ca s\u0103 prime\u0219ti cele 16 materiale educa\u021Bionale gratuit.",
    },
  ];

  return (
    <section className="py-12 bg-card">
      <div className="mx-auto max-w-[680px] px-5">
        <h2 className="font-heading text-xl text-burgundy text-center mb-8">
          Deschide cont \u00EEn 3 pa\u0219i
        </h2>

        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-burgundy text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                {s.num}
              </div>
              <div>
                <h3 className="font-semibold text-text text-sm">{s.title}</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — Final CTA
   ═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-[680px] px-5 text-center">
        <h2 className="font-heading text-2xl text-burgundy mb-6">
          Gata s\u0103 \u00EEncepi?
        </h2>

        <CTAButton />
        <CopyCodeBox />
        <TrustLine />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — Disclaimer
   ═══════════════════════════════════════════════════════════════ */
function Disclaimer() {
  return (
    <section className="py-8 bg-card">
      <div className="mx-auto max-w-[680px] px-5">
        <div className="text-xs text-text-muted/60 leading-relaxed space-y-3">
          <p>
            <strong className="text-text-muted">Disclaimer:</strong> Aceast\u0103
            pagin\u0103 con\u021Bine un link de afiliere. Dac\u0103 deschizi un cont XTB prin
            linkul de pe aceast\u0103 pagin\u0103, Minimalistu poate primi un comision de
            la XTB, f\u0103r\u0103 niciun cost suplimentar pentru tine. Acest lucru nu
            influen\u021Beaz\u0103 recomandarea — folosesc personal XTB ca broker principal.
          </p>
          <p>
            Investi\u021Biile implic\u0103 riscuri. Valoarea investi\u021Biilor poate fluctua,
            iar performan\u021Bele anterioare nu garanteaz\u0103 rezultate viitoare.
            Asigur\u0103-te c\u0103 \u00EEn\u021Belegi riscurile \u00EEnainte de a investi. XTB este
            reglementat de Autoritatea de Supraveghere Financiar\u0103 din Polonia
            (KNF).
          </p>
          <p>
            Vlad Calu\u0219 nu este consilier financiar autorizat. Informa\u021Biile
            prezentate au caracter educativ \u0219i informativ.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function XTBPage() {
  return (
    <>
      <Hero />
      <BonusMaterials />
      <WhyXTB />
      <HowToOpen />
      <FinalCTA />
      <Disclaimer />
      <Footer />
    </>
  );
}
