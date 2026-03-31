import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instrumente financiare gratuite — Minimalistu",
  description:
    "12 calculatoare financiare interactive, construite pentru investitorul român. Gratuite, fără cont.",
};

export default function InstrumenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
