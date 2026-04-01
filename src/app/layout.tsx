import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { BookingModalProvider } from "@/components/BookingModalProvider";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  title:
    "Minimalistu — Educație financiară și investiții pentru români | Vlad Caluș",
  description:
    "Instrumente gratuite de calcul financiar, consultanță personalizată și educație financiară. De la Vlad Caluș — antreprenor, investitor, independent financiar la 29 de ani. Forbes 30 Sub 30.",
  keywords:
    "educație financiară, investiții, independență financiară, FIRE, ETF, portofoliu investiții, consultanță financiară, România",
  metadataBase: new URL("https://minimalistu.eu"),
  alternates: {
    canonical: "/",
    languages: {
      ro: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Minimalistu — Educație financiară pentru investitorul român",
    description:
      "Instrumente gratuite, consultanță personalizată, și un plan concret spre independența financiară. De la Vlad Caluș.",
    siteName: "Minimalistu",
    locale: "ro_RO",
    type: "website",
    url: "https://minimalistu.eu/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Minimalistu — Educație financiară pentru investitorul român",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minimalistu — Educație financiară pentru investitorul român",
    description:
      "Instrumente gratuite, consultanță personalizată, și un plan concret spre independența financiară.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// JSON-LD structured data
const jsonLd = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Minimalistu",
    url: "https://minimalistu.eu",
    description:
      "Educație financiară și consultanță personalizată pentru investitorul român. Fondator: Vlad Caluș.",
    founder: {
      "@type": "Person",
      name: "Vlad Caluș",
      jobTitle: "Fondator Minimalistu",
      description:
        "Antreprenor, investitor, independent financiar la 29 de ani. Forbes 30 Sub 30, Techstars London Alumni, autor.",
      sameAs: [
        "https://www.instagram.com/minimalistu.eu/",
        "https://www.linkedin.com/in/vladcalus/",
      ],
    },
    sameAs: ["https://www.instagram.com/minimalistu.eu/"],
  },
  person: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vlad Caluș",
    jobTitle: "Fondator Minimalistu, Antreprenor, Investitor",
    description:
      "Antreprenor român, independent financiar la 29 de ani. Co-fondator Planable (exit 2025). Forbes 30 Sub 30, Techstars London Alumni. Autor: Independența financiară în 7 pași.",
    url: "https://minimalistu.eu",
    image: "https://minimalistu.eu/vlad.jpg",
    sameAs: [
      "https://www.instagram.com/minimalistu.eu/",
      "https://www.linkedin.com/in/vladcalus/",
      "https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017",
    ],
    knowsAbout: [
      "Investiții",
      "Independență financiară",
      "ETF-uri",
      "FIRE movement",
      "Finanțe personale",
      "Portofoliu de investiții",
      "Educație financiară România",
    ],
    award: ["Forbes 30 Sub 30", "Techstars London Alumni"],
    alumniOf: { "@type": "Organization", name: "Techstars London" },
    author: {
      "@type": "Book",
      name: "Independența financiară în 7 pași",
      url: "https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017",
    },
  },
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Minimalistu",
    url: "https://minimalistu.eu",
    description: "Educație financiară și investiții pentru români",
    inLanguage: "ro",
  },
  book: {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Independența financiară în 7 pași",
    author: { "@type": "Person", name: "Vlad Caluș" },
    url: "https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017",
    inLanguage: "ro",
    genre: "Finanțe personale",
    description:
      "Ghid complet de investiții și independență financiară pentru români. Bazat pe experiența reală a autorului de a deveni independent financiar la 29 de ani.",
  },
  service: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Minimalistu Consultanță Financiară",
    provider: { "@type": "Person", name: "Vlad Caluș" },
    description:
      "Consultanță financiară personalizată 1:1 bazată pe profilul psihologic al investitorului",
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Alex" },
        reviewBody:
          "În 8 săptămâni mi-am organizat veniturile, am creat strategia și am automatizat portofoliul. Obiectiv: independență financiară la 30 de ani.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Iulia" },
        reviewBody:
          "Am investit €19,500 din economii ținute 3 ani în depozit. În prima lună am setat un plan de €1,200 pe lună.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Tudor" },
        reviewBody:
          "Am realocat €10,000 din fonduri mutuale cu comisioane de 3% pe an în ETF-uri eficiente.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "6",
      bestRating: "5",
    },
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Ce este Minimalistu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Minimalistu este o platformă de educație financiară fondată de Vlad Caluș, care oferă instrumente gratuite de calcul financiar, consultanță personalizată 1:1 și resurse educaționale pentru investitorul român. Comunitatea numără peste 50.000 de membri.",
        },
      },
      {
        "@type": "Question",
        name: "Cine este Vlad Caluș?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vlad Caluș este un antreprenor și investitor român, co-fondator al Planable (exit 2025), independent financiar la 29 de ani, Forbes 30 Sub 30, alumni Techstars London, și autor al cărții Independența financiară în 7 pași. A fondat Minimalistu pentru a ajuta românii să-și ia finanțele în propriile mâini.",
        },
      },
      {
        "@type": "Question",
        name: "Ce calculatoare financiare oferă Minimalistu gratuit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Minimalistu oferă 12 calculatoare financiare gratuite: Calculator FIRE (independență financiară), Dobândă Compusă, Cost de Oportunitate, Portfolio X-Ray (analiza portofoliului), Costuri Fonduri Mutuale vs ETF, Chirie vs Cumpărare, Calculator Avere Netă, Toleranță la Risc, Fond de Urgență, DCA vs Market Timing, și Randament Imobiliar. Toate sunt disponibile fără cont la minimalistu.eu/instrumente.",
        },
      },
      {
        "@type": "Question",
        name: "Cum funcționează consultanța financiară Minimalistu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Consultanța Minimalistu include o analiză a profilului psihologic al investitorului prin 5 dimensiuni, diagnostic complet al portofoliului actual, strategie personalizată cu alocare exactă, și un plan de acțiune cu pași concreți. Sesiunea durează 90 de minute și este urmată de un raport Portfolio DNA personalizat.",
        },
      },
      {
        "@type": "Question",
        name: "Ce este independența financiară (FIRE)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Independența financiară (FIRE — Financial Independence, Retire Early) este momentul în care veniturile pasive din investiții acoperă cheltuielile lunare. Formula de bază: Cheltuieli anuale × 25 = Numărul FIRE. De exemplu, dacă cheltuiești €2,000 pe lună, ai nevoie de €600,000 investiți pentru a fi independent financiar. Calculatorul FIRE de pe Minimalistu te ajută să calculezi exact când poți atinge acest obiectiv.",
        },
      },
      {
        "@type": "Question",
        name: "Ce sunt ETF-urile și de ce le recomandă Minimalistu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ETF-urile (Exchange-Traded Funds) sunt fonduri de investiții tranzacționate la bursă care urmăresc un indice de piață. Minimalistu recomandă ETF-uri precum VWCE sau IWDA pentru diversificare globală la comisioane minime (0.20-0.50% pe an), comparativ cu fondurile mutuale din România care percep 2-3% pe an. Diferența de comision poate costa peste €40,000 pe 20 de ani pe un portofoliu de €100,000.",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${dmSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd.organization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd.person),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd.website),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd.book),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd.service),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd.faq),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        <BookingModalProvider>
          <NavBar />
          <main className="flex-1">{children}</main>
        </BookingModalProvider>
      </body>
    </html>
  );
}
