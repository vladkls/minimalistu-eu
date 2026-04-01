import Link from "next/link";

const CARTE_LINK =
  "https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017";

export function Footer() {
  return (
    <footer className="bg-cream border-t border-border">
      <div className="mx-auto max-w-[1080px] px-5 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Left */}
          <div className="text-center md:text-left">
            <span className="font-heading text-xl text-burgundy">
              Minimalistu
            </span>
            <p className="text-text-muted text-sm mt-1">© 2026 Minimalistu</p>
          </div>

          {/* Center links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="/instrumente" className="text-text hover:text-burgundy transition-colors">
              Instrumente
            </Link>
            <a
              href={CARTE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-burgundy transition-colors"
            >
              Carte
            </a>
            <a
              href="https://instagram.com/minimalistu.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-burgundy transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/in/vladcalus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-burgundy transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Disclaimers */}
        <p className="mt-8 text-center text-xs text-text-muted leading-relaxed max-w-2xl mx-auto">
          Vlad Caluș nu este consilier financiar autorizat. Informațiile
          prezentate au caracter educativ și informativ și nu constituie
          consiliere financiară, fiscală sau de investiții personalizată.
          Consultă un consilier financiar autorizat înainte de a lua decizii de
          investiții.
        </p>
        <p className="mt-3 text-center text-xs text-text-muted leading-relaxed max-w-2xl mx-auto">
          Tranzacționarea este riscantă și ar putea duce la pierderea parțială
          sau totală a capitalului investit. Informațiile sunt furnizate doar în
          scop informativ și educațional și nu reprezintă sfaturi financiare
          și/sau recomandări de investiții.
        </p>
      </div>
    </footer>
  );
}
