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
          {copied ? "Copiat! ✓" : "📋 Copiază codul"}
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
      {"Deschide cont XTB →"}
    </a>
  );
}

/* ─── Trust Line ─── */
function TrustLine() {
  return (
    <p className="mt-4 text-xs text-text-muted text-center">
      {"✓ Cont gratuit · ✓ Fără comisioane pe acțiuni · ✓ Reglementat UE"}
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
          {"Recomandat de Vlad Caluș · Minimalistu"}
        </span>

        <h1 className="font-heading text-[28px] md:text-4xl text-burgundy leading-tight">
          Brokerul pe care-l folosesc eu.
        </h1>
        <p className="mt-4 text-base text-text-muted max-w-lg mx-auto leading-relaxed">
          XTB este platforma prin care investesc personal. Dacă vrei să
          începi și tu, folosește codul meu și primești un bonus educațional.
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
    { icon: "📊", text: "Introducere în investiții" },
    { icon: "📈", text: "Cum funcționează bursa" },
    { icon: "💰", text: "Tipuri de instrumente financiare" },
    { icon: "🌍", text: "ETF-uri și diversificare globală" },
    { icon: "📉", text: "Cum gestionezi riscul" },
    { icon: "🧮", text: "Analiza fundamentală" },
    { icon: "📋", text: "Cum citești un grafic" },
    { icon: "🔄", text: "Strategii de investiții" },
    { icon: "💶", text: "Cum funcționează ordinele la bursă" },
    { icon: "🏦", text: "Diferența dintre acțiuni și ETF-uri" },
    { icon: "📱", text: "Cum folosești platforma XTB" },
    { icon: "🎯", text: "Cum îți setezi obiectivele" },
    { icon: "🛡️", text: "Protecția investitorului în UE" },
    { icon: "📅", text: "Investiții pe termen lung" },
    { icon: "💡", text: "Greșeli comune de evitat" },
    { icon: "🚀", text: "Primii pași ca investitor" },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[680px] px-5">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
          <h2 className="font-heading text-xl text-text mb-2">
            {"🎁 16 materiale educaționale gratuite"}
          </h2>
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            Când deschizi contul cu codul MINIMALISTU, primești acces la 16
            resurse educaționale despre investiții — create de XTB pentru a te
            ajuta să înveți fundamentele.
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
            Materialele sunt disponibile automat în contul tău XTB după ce
            folosești codul MINIMALISTU la înregistrare.
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
      title: "0% comision pe acțiuni",
      desc: "Tranzacționezi acțiuni și ETF-uri fără comisioane, până la un volum lunar de €100,000.",
    },
    {
      title: "Reglementat în UE",
      desc: "XTB este reglementat de KNF (Polonia) și autorizat în toată Uniunea Europeană, inclusiv România.",
    },
    {
      title: "Platformă intuitivă",
      desc: "Aplicația mobilă și platforma web sunt printre cele mai ușor de folosit — ideale pentru începători.",
    },
    {
      title: "Acțiuni fracționare",
      desc: "Poți investi și cu €10 — nu trebuie să cumperi o acțiune întreagă. Perfect pentru DCA lunar.",
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
      title: "Completezi formularul de înregistrare",
      desc: "Durează ~10 minute. Ai nevoie de buletin/pașaport și o adresă de email.",
    },
    {
      num: "3",
      title: "Introdu codul MINIMALISTU",
      desc: "La pasul de referral, scrie codul MINIMALISTU ca să primești cele 16 materiale educaționale gratuit.",
    },
  ];

  return (
    <section className="py-12 bg-card">
      <div className="mx-auto max-w-[680px] px-5">
        <h2 className="font-heading text-xl text-burgundy text-center mb-8">
          Deschide cont în 3 pași
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
          {"Gata să începi?"}
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
            <strong className="text-text-muted">Disclaimer:</strong> Această
            pagină conține un link de afiliere. Dacă deschizi un cont XTB prin
            linkul de pe această pagină, Minimalistu poate primi un comision de
            la XTB, fără niciun cost suplimentar pentru tine. Acest lucru nu
            influențează recomandarea — folosesc personal XTB ca broker principal.
          </p>
          <p>
            Investițiile implică riscuri. Valoarea investițiilor poate fluctua,
            iar performanțele anterioare nu garantează rezultate viitoare.
            Asigură-te că înțelegi riscurile înainte de a investi. XTB este
            reglementat de Autoritatea de Supraveghere Financiară din Polonia
            (KNF).
          </p>
          <p>
            Vlad Caluș nu este consilier financiar autorizat. Informațiile
            prezentate au caracter educativ și informativ.
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
