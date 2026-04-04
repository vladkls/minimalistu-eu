import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prima Ta Investiție — Mini-Curs | Minimalistu",
  description:
    "Tot ce trebuie să știi ca să faci prima ta investiție inteligentă. 7 module video, acces lifetime, de la Vlad Caluș.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://minimalistu.eu/start",
  },
  openGraph: {
    title: "Prima Ta Investiție — Mini-Curs de la Minimalistu",
    description:
      "7 module video. ~100 minute. Tot ce trebuie să știi ca să faci prima ta investiție inteligentă. De la Vlad Caluș.",
    url: "https://minimalistu.eu/start",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Prima Ta Investiție — Mini-Curs",
  description:
    "Tot ce trebuie să știi ca să faci prima ta investiție inteligentă. 7 module video (~100 minute), acces lifetime.",
  url: "https://minimalistu.eu/start",
  provider: {
    "@type": "Person",
    name: "Vlad Caluș",
    url: "https://minimalistu.eu",
  },
  offers: {
    "@type": "Offer",
    price: "47",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT100M",
  },
};

export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
