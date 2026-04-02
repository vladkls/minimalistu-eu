import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deschide cont XTB cu bonus educațional | Minimalistu",
  description:
    "Deschide cont de investiții la XTB folosind codul MINIMALISTU și primești acces gratuit la 16 materiale educaționale despre investiții. Recomandat de Vlad Caluș.",
  alternates: {
    canonical: "https://minimalistu.eu/xtb",
  },
  openGraph: {
    title: "XTB + Minimalistu — Cont de investiții cu bonus educațional",
    description:
      "Brokerul pe care-l folosesc eu. Folosește codul MINIMALISTU la deschiderea contului și primești 16 materiale educaționale gratuite.",
    url: "https://minimalistu.eu/xtb",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Deschide cont XTB cu bonus educațional — Minimalistu",
  description:
    "Pagină de recomandare XTB de la Minimalistu. Folosește codul MINIMALISTU pentru 16 materiale educaționale gratuite.",
  url: "https://minimalistu.eu/xtb",
  author: {
    "@type": "Person",
    name: "Vlad Caluș",
  },
  about: {
    "@type": "FinancialProduct",
    name: "XTB — Cont de investiții",
    provider: {
      "@type": "Organization",
      name: "XTB",
    },
  },
};

export default function XTBLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
