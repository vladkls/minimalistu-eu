import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Calculatoare Financiare Gratuite — FIRE, Portofoliu, Dobândă Compusă | Minimalistu",
  description:
    "12 calculatoare financiare interactive gratuite: FIRE, dobândă compusă, cost de oportunitate, portfolio X-ray, chirie vs cumpărare. Construite pentru investitorul român.",
  alternates: {
    canonical: "https://minimalistu.eu/instrumente",
  },
  openGraph: {
    title: "Calculatoare Financiare Gratuite | Minimalistu",
    description:
      "12 calculatoare interactive: FIRE, portofoliu, dobândă compusă, chirie vs cumpărare. Gratuite, fără cont.",
    url: "https://minimalistu.eu/instrumente",
  },
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Minimalistu — Calculatoare Financiare",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  description:
    "12 calculatoare financiare interactive gratuite pentru investitorul român: FIRE, dobândă compusă, cost de oportunitate, portfolio X-ray, chirie vs cumpărare, fonduri mutuale vs ETF, avere netă, toleranță la risc, fond de urgență, DCA vs market timing, randament imobiliar.",
  author: {
    "@type": "Person",
    name: "Vlad Caluș",
  },
  inLanguage: "ro",
};

export default function InstrumenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppJsonLd),
        }}
      />
      {children}
    </>
  );
}
