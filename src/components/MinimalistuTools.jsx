"use client";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// MINIMALISTU FINANCE TOOLS SUITE v4
// Brand: Minimalistu
// Tools: 1) Costul de Oportunitate 2) Dobanda Compusa 3) Calculator FIRE
// ═══════════════════════════════════════════════════════════════

const T = {
  burgundy: "#7B2D50", burgundyLight: "#8E3A62", burgundyDark: "#5E1F3C",
  burgundyFaint: "rgba(123,45,80,0.06)", burgundyMuted: "rgba(123,45,80,0.12)",
  burgundySubtle: "rgba(123,45,80,0.20)",
  amber: "#E8A832", amberLight: "#F0C060", amberFaint: "rgba(232,168,50,0.10)",
  green: "#2F8C5E", greenFaint: "rgba(47,140,94,0.08)", greenMuted: "rgba(47,140,94,0.15)",
  red: "#C0384D", redFaint: "rgba(192,56,77,0.08)", redMuted: "rgba(192,56,77,0.15)",
  cream: "#F3EDE5", white: "#FEFCFA",
  text: "#2C1E26", textMuted: "rgba(44,30,38,0.55)", textLight: "rgba(44,30,38,0.35)",
  border: "rgba(123,45,80,0.10)",
  shadow: "0 2px 16px rgba(123,45,80,0.06)", shadowLift: "0 8px 32px rgba(123,45,80,0.10)",
  radius: 16, radiusSm: 10, radiusXs: 6,
  font: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontDisplay: "'Instrument Serif', Georgia, serif",
  blue: "#3B6EA5", blueFaint: "rgba(59,110,165,0.08)", blueMuted: "rgba(59,110,165,0.15)",
  orange: "#D4722A", orangeFaint: "rgba(212,114,42,0.08)",
};

const fmt = (n) => { if (n < 0) return `-\u20AC${Math.abs(Math.round(n)).toLocaleString("ro-RO")}`; return `\u20AC${Math.round(n).toLocaleString("ro-RO")}`; };
const fmtK = (n) => { const a = Math.abs(n), s = n < 0 ? "-" : ""; if (a >= 1e6) return `${s}\u20AC${(a / 1e6).toFixed(1)}M`; if (a >= 1e4) return `${s}\u20AC${Math.round(a / 1e3)}K`; return fmt(n); };

// ─── InfoTip ─────────────────────────────────────────────────
function InfoTip({ text, presenter }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (!show) return; const fn = e => { if (ref.current && !ref.current.contains(e.target)) setShow(false); }; document.addEventListener("mousedown", fn); document.addEventListener("touchstart", fn); return () => { document.removeEventListener("mousedown", fn); document.removeEventListener("touchstart", fn); }; }, [show]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6, verticalAlign: "middle" }}>
      <span onClick={() => setShow(s => !s)} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: presenter ? 20 : 16, height: presenter ? 20 : 16, borderRadius: "50%", background: T.burgundyMuted, color: T.burgundy, fontSize: presenter ? 11 : 9, fontWeight: 700, fontFamily: T.font, fontStyle: "italic", cursor: "pointer", userSelect: "none", lineHeight: 1, flexShrink: 0 }}>i</span>
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: T.text, color: "#fff", padding: "10px 14px", borderRadius: T.radiusSm, fontSize: 12, fontFamily: T.font, lineHeight: 1.55, fontWeight: 400, fontStyle: "normal", width: presenter ? 320 : 260, maxWidth: "85vw", boxShadow: T.shadowLift, zIndex: 100 }}>
          {text}
          <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${T.text}` }} />
        </div>
      )}
    </span>
  );
}
function SectionLabel({ children, tip, presenter }) {
  return (<div style={{ display: "flex", alignItems: "center", fontSize: presenter ? 14 : 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: presenter ? 24 : 16, fontFamily: T.font }}>{children}{tip && <InfoTip text={tip} presenter={presenter} />}</div>);
}

// ─── Shared Components ───────────────────────────────────────
function Slider({ label, tip, value, onChange, min, max, step, suffix = "", presenter, formatValue }) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState("");
  const inputRef = useRef(null);
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : `${value.toLocaleString("ro-RO")}${suffix}`;
  const startEdit = () => {
    setEditVal(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current && inputRef.current.select(), 10);
  };
  const commitEdit = () => {
    setEditing(false);
    const parsed = parseFloat(editVal.replace(/[^0-9.,\-]/g, "").replace(",", "."));
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, Math.round(parsed / (step || 1)) * (step || 1)));
      onChange(Number(clamped.toFixed(10)));
    }
  };
  return (
    <div style={{ marginBottom: presenter ? 28 : 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: T.textMuted, fontSize: presenter ? 16 : 13, fontFamily: T.font, fontWeight: 500, display: "flex", alignItems: "center" }}>{label}{tip && <InfoTip text={tip} presenter={presenter} />}</span>
        {editing ? (
          <input ref={inputRef} type="text" value={editVal} onChange={e => setEditVal(e.target.value)}
            onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(false); }}
            style={{ width: presenter ? 120 : 90, textAlign: "right", color: T.burgundy, fontSize: presenter ? 22 : 15, fontWeight: 700, fontFamily: T.font, border: `2px solid ${T.amber}`, borderRadius: T.radiusXs, padding: "2px 8px", outline: "none", background: T.amberFaint }} />
        ) : (
          <span onClick={startEdit} title="Click pentru a edita" style={{ color: T.burgundy, fontSize: presenter ? 24 : 16, fontWeight: 700, fontFamily: T.font, cursor: "pointer", padding: "2px 6px", borderRadius: T.radiusXs, transition: "background 0.15s" }}
            onMouseEnter={e => e.target.style.background = T.amberFaint} onMouseLeave={e => e.target.style.background = "transparent"}>{display}</span>
        )}
      </div>
      <input type="range" min={min} max={max} step={step || 1} value={value} onChange={e => onChange(Number(e.target.value))} className="minimalistu-slider"
        style={{ width: "100%", height: presenter ? 6 : 4, borderRadius: 3, appearance: "none", WebkitAppearance: "none", background: `linear-gradient(to right, ${T.burgundy} ${pct}%, ${T.burgundyMuted} ${pct}%)`, outline: "none", cursor: "pointer" }} />
    </div>
  );
}
function StatCard({ label, tip, value, sub, color, bgColor, presenter, icon }) {
  return (
    <div style={{ padding: presenter ? "24px 28px" : "16px 20px", background: bgColor || T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, flex: 1, minWidth: 0 }}>
      {icon && <div style={{ fontSize: presenter ? 22 : 16, marginBottom: 6 }}>{icon}</div>}
      <div style={{ color: T.textMuted, fontSize: presenter ? 13 : 11, fontFamily: T.font, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, display: "flex", alignItems: "center" }}>{label}{tip && <InfoTip text={tip} presenter={presenter} />}</div>
      <div style={{ color: color || T.text, fontSize: presenter ? 32 : 22, fontWeight: 700, fontFamily: T.font, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ color: T.textMuted, fontSize: presenter ? 12 : 10, fontFamily: T.font, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
function Pill({ value, label, color, tip, presenter }) {
  const bg = color === T.red ? "rgba(192,56,77,0.08)" : color === T.green ? "rgba(47,140,94,0.08)" : color === T.amber ? "rgba(232,168,50,0.08)" : color === T.blue ? "rgba(59,110,165,0.08)" : "rgba(123,45,80,0.06)";
  return (<div style={{ padding: "8px 16px", background: bg, borderRadius: T.radiusXs, display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: presenter ? 22 : 17, fontWeight: 700, color, fontFamily: T.font }}>{value}</span><span style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font }}>{label}{tip && <InfoTip text={tip} presenter={presenter} />}</span></div>);
}
function ModeToggle({ mode, onMode, options, presenter }) {
  return (<div style={{ display: "inline-flex", background: T.burgundyMuted, borderRadius: T.radiusSm, padding: 3 }}>{options.map(o => (<button key={o.id} onClick={() => onMode(o.id)} style={{ padding: presenter ? "10px 24px" : "7px 18px", background: mode === o.id ? T.white : "transparent", border: "none", borderRadius: T.radiusXs, cursor: "pointer", color: mode === o.id ? T.burgundy : T.textMuted, fontSize: presenter ? 14 : 12, fontWeight: mode === o.id ? 700 : 500, fontFamily: T.font, transition: "all 0.2s", boxShadow: mode === o.id ? T.shadow : "none" }}>{o.icon} {o.label}</button>))}</div>);
}

// ─── Nav Bar ─────────────────────────────────────────────────
const TOOLS = [
  { id: "networth", name: "Calculator Avere Netă", icon: "💰", ready: true, desc: "Imaginea completă a finanțelor tale" },
  { id: "cost", name: "Costul de Oportunitate", icon: "\u23F3", ready: true, desc: "Cât te costă inacțiunea" },
  { id: "compound", name: "Dobânda Compusă", icon: "\uD83D\uDCC8", ready: true, desc: "Puterea compunerii în timp" },
  { id: "fire", name: "Calculator FIRE", icon: "\uD83D\uDD25", ready: true, desc: "Când devii liber financiar" },
  { id: "xray", name: "Portfolio X-Ray", icon: "\uD83D\uDD0D", ready: true, desc: "Analizează-ți portofoliul" },
  { id: "funds", name: "Costuri Fonduri", icon: "\uD83D\uDCB8", ready: true, desc: "Fond activ vs ETF" },
  { id: "alpha", name: "Avantajul Consultanței", icon: "\uD83C\uDFC6", ready: true, desc: "Impactul +3% pe an" },
  { id: "rentvsbuy", name: "Chirie vs Cumpărare", icon: "\uD83C\uDFE0", ready: true, desc: "Costul real al proprietății" },
  { id: "emergency", name: "Fond de Urgență", icon: "🛡️", ready: true, desc: "Cât ai nevoie pentru urgențe" },
  { id: "risk", name: "Toleranță la Risc", icon: "🧭", ready: true, desc: "Descoperă-ți profilul de risc" },
  { id: "dca", name: "DCA vs Timing", icon: "⏳", ready: true, desc: "Timpul în piață bate sincronizarea" },
  { id: "realestate", name: "Randament Imobiliar", icon: "🏢", ready: true, desc: "Cât câștigi REAL din chirii" },
];
function NavBar({ active, onSelect, presenter, onToggle, onAbout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const activeTool = TOOLS.find(t => t.id === active);
  useEffect(() => { if (!menuOpen) return; const fn = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, [menuOpen]);
  return (
    <div style={{ position: "relative", padding: presenter ? "16px 32px" : "12px 16px", background: T.burgundy, borderRadius: T.radius, fontFamily: T.font }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Top row: tool selector + prezentare */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <button ref={menuRef} onClick={() => setMenuOpen(m => !m)} style={{ padding: presenter ? "10px 20px" : "10px 16px", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: T.radiusSm, cursor: "pointer", color: "#fff", fontSize: presenter ? 14 : 13, fontFamily: T.font, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s", flex: 1 }}>
            <span>{activeTool ? activeTool.icon : "\u2630"}</span>
            <span style={{ flex: 1, textAlign: "left" }}>{activeTool ? activeTool.name : "Instrumente"}</span>
            <span style={{ fontSize: 10, opacity: 0.6, transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>{"\u25BC"}</span>
          </button>
          <button className="m-nav-label" onClick={onToggle} style={{ padding: "10px 14px", border: "none", borderRadius: T.radiusSm, background: presenter ? T.amber : "rgba(255,255,255,0.08)", color: presenter ? T.burgundyDark : "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: T.font, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s", flexShrink: 0 }}>{presenter ? "✦ Prezentare" : "📺 Prezentare"}</button>
        </div>
        {/* Hint: tap to see all tools */}
        <div onClick={() => setMenuOpen(m => !m)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: T.font, fontWeight: 400 }}>12 instrumente disponibile — apasă pentru a schimba</span>
        </div>
      </div>
      {menuOpen && (
        <div className="m-tools-dropdown" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: T.white, borderRadius: T.radius, boxShadow: T.shadowLift, border: `1px solid ${T.border}`, zIndex: 200, overflow: "hidden", maxHeight: "70vh", overflowY: "auto" }}>
          {TOOLS.map((t, i) => (
            <button key={t.id} onClick={() => { if (t.ready) { onSelect(t.id); setMenuOpen(false); } }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: presenter ? "14px 20px" : "11px 16px", background: active === t.id ? T.burgundyFaint : "transparent", border: "none", borderBottom: i < TOOLS.length - 1 ? `1px solid ${T.border}` : "none", cursor: t.ready ? "pointer" : "default", fontFamily: T.font, textAlign: "left", transition: "background 0.15s", opacity: t.ready ? 1 : 0.4 }}
              onMouseEnter={e => { if (active !== t.id) e.currentTarget.style.background = T.cream; }}
              onMouseLeave={e => { e.currentTarget.style.background = active === t.id ? T.burgundyFaint : "transparent"; }}>
              <span style={{ fontSize: presenter ? 22 : 18, flexShrink: 0 }}>{t.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: presenter ? 14 : 12, fontWeight: active === t.id ? 700 : 500, color: active === t.id ? T.burgundy : T.text }}>{t.name}</div>
                <div style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, marginTop: 1 }}>{t.desc}</div>
              </div>
              {active === t.id && <span style={{ fontSize: 11, color: T.burgundy, fontWeight: 600 }}>{"\u2713"}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// ─── Booking Modal ───────────────────────────────────────────
const ModalContext = React.createContext({ open: () => {} });
const CrossToolContext = React.createContext({ prefill: null, setPrefill: () => {}, navigateTo: () => {} });

function BookingModal({ isOpen, onClose }) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  const hsFormUrl = "https://2fiaz2.share-eu1.hsforms.com/2ToAV2rQ2QKGzPBaByxon6g";

  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "rgba(44,30,38,0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
      animation: "modalFadeIn 0.25s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.white, borderRadius: T.radius, width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflow: "hidden", boxShadow: "0 24px 80px rgba(44,30,38,0.25)",
        display: "flex", flexDirection: "column",
        animation: "modalSlideIn 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 24px 0", position: "relative" }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16, width: 32, height: 32,
            borderRadius: "50%", border: "none", background: T.burgundyMuted,
            color: T.burgundy, fontSize: 18, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s", fontFamily: T.font, lineHeight: 1,
          }} onMouseEnter={e => e.target.style.background = T.burgundySubtle}
             onMouseLeave={e => e.target.style.background = T.burgundyMuted}>&times;</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src="https://planable.imgix.net/BX3Rd95mwvvAuKGGa/E53AA5EuKR-image-169-src-1.png?auto=format&w=200&h=200&dpr=2" alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.burgundyMuted}` }} />
            <img src="https://planable.imgix.net/BX3Rd95mwvvAuKGGa/GjkmySXhsv-image-169-src.png?auto=format&w=200&h=200&dpr=2" alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.burgundyMuted}`, marginLeft: -14 }} />
          </div>
          <div style={{ color: T.burgundy, fontSize: 20, fontWeight: 700, fontFamily: T.font, lineHeight: 1.3, marginBottom: 6, paddingRight: 32 }}>
            Programează o sesiune gratuită de audit
          </div>
          <div style={{ color: T.textMuted, fontSize: 13, fontFamily: T.font, marginBottom: 20, lineHeight: 1.5 }}>
            Completează formularul și te contactăm în 24h
          </div>
        </div>
        {/* HubSpot form */}
        <div style={{ flex: 1, padding: "0 24px 24px", overflow: "auto" }}>
          <iframe
            src={hsFormUrl}
            style={{ width: "100%", height: 480, border: "none", borderRadius: T.radiusSm, background: T.cream }}
            title="Programare audit Minimalistu"
          />
        </div>
      </div>
    </div>
  );
}

function CTA({ presenter }) {
  const { open } = React.useContext(ModalContext);
  if (presenter) return null;
  return (
    <div className="m-cta-wrap" style={{ margin: "24px 0 0 0", padding: "24px 28px", background: `linear-gradient(135deg, ${T.burgundy}, ${T.burgundyDark})`, borderRadius: T.radius, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
      <div className="m-stack" style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1, minWidth: 240 }}>
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0, marginTop: 2 }}>
          <img src="https://planable.imgix.net/BX3Rd95mwvvAuKGGa/E53AA5EuKR-image-169-src-1.png?auto=format&w=200&h=200&dpr=2" alt="Team member" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }} />
          <img src="https://planable.imgix.net/BX3Rd95mwvvAuKGGa/GjkmySXhsv-image-169-src.png?auto=format&w=200&h=200&dpr=2" alt="Team member" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)", marginLeft: -8 }} />
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, fontFamily: T.font, marginBottom: 6, lineHeight: 1.3 }}>Ai bani, dar nu ai un plan. Hai să schimbăm asta.</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: T.font, lineHeight: 1.55 }}>250+ de oameni ca tine au transformat economiile într-o strategie clară de siguranță și libertate financiară. Într-o sesiune de 30 de minute, îți arătăm exact ce pași să faci cu banii tăi.</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button onClick={open} style={{ padding: "12px 28px", background: T.amber, border: "none", borderRadius: T.radiusSm, color: T.burgundyDark, fontSize: 14, fontWeight: 700, fontFamily: T.font, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", whiteSpace: "nowrap" }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(232,168,50,0.4)"; }}
          onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
          Vreau un plan concret &rarr;
        </button>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: T.font, whiteSpace: "nowrap" }}>{"\u2713"} Fără obligații · {"\u2713"} 100% confidențial · {"\u2713"} Răspuns în 24h</div>
      </div>
    </div>
  );
}

function FloatingCTAButton({ presenter, onOpenModal }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (presenter) return;
    const onScroll = () => { setVisible(window.scrollY > 400); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [presenter]);

  if (presenter || !visible) return null;

  return (
    <button onClick={onOpenModal} style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9000,
      padding: "14px 24px", background: T.amber, border: "none", borderRadius: T.radius,
      color: T.burgundyDark, fontSize: 13, fontWeight: 700, fontFamily: T.font,
      cursor: "pointer", boxShadow: "0 8px 32px rgba(232,168,50,0.35)",
      display: "flex", alignItems: "center", gap: 8,
      animation: "floatBtnIn 0.3s ease",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(232,168,50,0.5)"; }}
      onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 8px 32px rgba(232,168,50,0.35)"; }}>
      📅 Vreau un plan concret
    </button>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 1: COSTUL DE OPORTUNITATE (unchanged from v3)
// ═══════════════════════════════════════════════════════════════

function computeOC(idle, ma, rr, ir, yrs) { const mr = rr/100/12, mi = ir/100/12; let inv = idle, cash = idle; const pts = [{ year: 0, invested: idle, cash: idle, cost: 0 }]; for (let m = 1; m <= yrs * 12; m++) { inv = inv * (1+mr) + ma; cash = cash * (1-mi) + ma; if (m%12===0) pts.push({ year: m/12, invested: Math.round(inv), cash: Math.round(cash), cost: Math.round(inv-cash) }); } return pts; }

function OCChart({ data, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio||1, w = box.offsetWidth, h = presenter ? 420 : 320;
    canvas.width = w*dpr; canvas.height = h*dpr; canvas.style.width = w+"px"; canvas.style.height = h+"px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr,dpr); ctx.clearRect(0,0,w,h);
    if (!data || data.length < 2) return;
    const pad = { top: 40, right: presenter ? 110 : 90, bottom: 50, left: presenter ? 80 : 64 };
    const cw = w-pad.left-pad.right, ch = h-pad.top-pad.bottom;
    const maxVal = Math.max(...data.map(d => Math.max(d.invested,d.cash)))*1.12;
    const x = i => pad.left+(i/(data.length-1))*cw, y = v => pad.top+ch-(v/maxVal)*ch;
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3,3]);
    ctx.font = `${presenter?13:11}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i=0;i<=5;i++){const val=(i/5)*maxVal,yy=y(val);ctx.beginPath();ctx.moveTo(pad.left,yy);ctx.lineTo(w-pad.right,yy);ctx.stroke();ctx.fillText(fmtK(val),pad.left-10,yy+4);}
    ctx.setLineDash([]); ctx.textAlign="center"; ctx.fillStyle=T.textLight;
    data.forEach((d,i)=>{const skip=data.length>15?5:data.length>8?2:1;if(d.year%skip===0)ctx.fillText(d.year===0?"Azi":`${d.year} ani`,x(i),h-pad.bottom+22);});
    ctx.beginPath();data.forEach((d,i)=>i===0?ctx.moveTo(x(i),y(d.invested)):ctx.lineTo(x(i),y(d.invested)));
    for(let i=data.length-1;i>=0;i--)ctx.lineTo(x(i),y(data[i].cash));ctx.closePath();
    const grad=ctx.createLinearGradient(0,pad.top,0,pad.top+ch);grad.addColorStop(0,"rgba(192,56,77,0.12)");grad.addColorStop(1,"rgba(192,56,77,0.02)");ctx.fillStyle=grad;ctx.fill();
    ctx.beginPath();data.forEach((d,i)=>i===0?ctx.moveTo(x(i),y(d.cash)):ctx.lineTo(x(i),y(d.cash)));ctx.strokeStyle=T.textMuted;ctx.lineWidth=presenter?3:2;ctx.setLineDash([6,4]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();data.forEach((d,i)=>i===0?ctx.moveTo(x(i),y(d.invested)):ctx.lineTo(x(i),y(d.invested)));ctx.strokeStyle=T.green;ctx.lineWidth=presenter?3.5:2.5;ctx.stroke();
    const last=data[data.length-1],lx=x(data.length-1);
    ctx.beginPath();ctx.arc(lx,y(last.invested),presenter?6:4,0,Math.PI*2);ctx.fillStyle=T.green;ctx.fill();
    ctx.beginPath();ctx.arc(lx,y(last.cash),presenter?6:4,0,Math.PI*2);ctx.fillStyle=T.textMuted;ctx.fill();
    ctx.font=`600 ${presenter?14:12}px DM Sans,sans-serif`;ctx.textAlign="left";
    ctx.fillStyle=T.green;ctx.fillText(fmtK(last.invested),lx+10,y(last.invested)+5);
    ctx.fillStyle=T.textMuted;ctx.fillText(fmtK(last.cash),lx+10,y(last.cash)+5);
    const mi2=Math.min(Math.floor(data.length*0.65),data.length-2),md=data[mi2],mx=x(mi2),yt=y(md.invested),yb=y(md.cash);
    ctx.strokeStyle=T.red;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(mx+4,yt+6);ctx.lineTo(mx+4,yb-6);ctx.stroke();
    ctx.beginPath();ctx.moveTo(mx,yt+6);ctx.lineTo(mx+4,yt+2);ctx.lineTo(mx+8,yt+6);ctx.stroke();
    ctx.beginPath();ctx.moveTo(mx,yb-6);ctx.lineTo(mx+4,yb-2);ctx.lineTo(mx+8,yb-6);ctx.stroke();
    ctx.font=`700 ${presenter?13:11}px DM Sans,sans-serif`;ctx.fillStyle=T.red;ctx.textAlign="left";ctx.fillText(`cost: ${fmtK(md.cost)}`,mx+14,(yt+yb)/2+4);
    const ly=pad.top-16;ctx.font=`500 ${presenter?13:11}px DM Sans,sans-serif`;
    ctx.fillStyle=T.green;ctx.fillRect(pad.left,ly-4,14,3);ctx.fillText("Investit",pad.left+20,ly);
    ctx.setLineDash([4,3]);ctx.strokeStyle=T.textMuted;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(pad.left+110,ly-2.5);ctx.lineTo(pad.left+124,ly-2.5);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=T.textMuted;ctx.fillText("Cash (cont curent)",pad.left+130,ly);
  }, [data, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 8 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function OpportunityCostTool({ presenter }) {
  const [idle,setIdle]=useState(50000),[monthly,setMonthly]=useState(2000),[ret,setRet]=useState(8),[infl,setInfl]=useState(5),[years,setYears]=useState(15);
  const data = useMemo(()=>computeOC(idle,monthly,ret,infl,years),[idle,monthly,ret,infl,years]);
  const last=data[data.length-1],cost=last.cost,dailyCost=Math.round(cost/(years*365));
  const yearsLost=monthly>0?(Math.round(cost/monthly)/12).toFixed(1):"0";
  const gap=presenter?32:20;
  return (
    <div>
      <div style={{marginBottom:gap,textAlign:presenter?"center":"left"}}>
        <h1 style={{fontFamily:T.fontDisplay,fontSize:presenter?36:24,fontWeight:400,color:T.burgundy,margin:0,lineHeight:1.15}}>Cel mai scump lucru pe care il poti face cu banii tai<span style={{color:T.amber}}> este sa nu faci nimic.</span></h1>
        <p style={{fontFamily:T.font,fontSize:presenter?15:13,color:T.textMuted,margin:"8px 0 0 0",lineHeight:1.5,display:"flex",alignItems:"center",justifyContent:presenter?"center":"flex-start",flexWrap:"wrap"}}>Calculeaza costul real al banilor care stau in cont curent.<InfoTip text="Costul de oportunitate = diferenta dintre ce ai putea avea daca investesti vs ce ai efectiv daca lasi banii in cont." presenter={presenter}/></p>
      </div>
      <div className="m-tool-layout" style={{display:"flex",gap,flexWrap:"wrap"}}>
        <div style={{flex:presenter?"0 0 380px":"0 0 320px",minWidth:280,padding:presenter?"28px":"20px",background:T.white,borderRadius:T.radius,border:`1px solid ${T.border}`}}>
          <SectionLabel tip="Introdu cifrele tale reale. Calculul se actualizeaza automat." presenter={presenter}>Situația ta</SectionLabel>
          <Slider label="Suma disponibila acum" value={idle} onChange={setIdle} min={1000} max={500000} step={1000} formatValue={fmt} presenter={presenter} tip="Cat ai in conturi curente sau cash neinvestit." />
          <Slider label="Economisești lunar" value={monthly} onChange={setMonthly} min={0} max={10000} step={100} formatValue={fmt} presenter={presenter} tip="Cat pui deoparte in fiecare luna." />
          <Slider label="Randament anual estimat" value={ret} onChange={setRet} min={3} max={15} step={0.5} suffix="%" presenter={presenter} tip="MSCI World ~10%/an in ultimii 30 ani. Un 7-8% e conservator." />
          <Slider label="Inflatie medie anuala" value={infl} onChange={setInfl} min={2} max={12} step={0.5} suffix="%" presenter={presenter} tip="Romania: 5-8%. Tinta BCE: 2%." />
          <Slider label="Orizont de timp" value={years} onChange={setYears} min={3} max={30} step={1} suffix=" ani" presenter={presenter} tip="Cati ani pana la obiectivul tau financiar." />
        </div>
        <div style={{flex:1,minWidth:300,display:"flex",flexDirection:"column",gap}}>
          <div style={{padding:presenter?"28px 32px":"20px 24px",background:T.redFaint,borderRadius:T.radius,border:`1px solid ${T.redMuted}`,textAlign:presenter?"center":"left"}}>
            <div style={{fontSize:presenter?14:11,fontWeight:600,color:T.red,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:presenter?"center":"flex-start"}}>Costul de oportunitate in {years} ani<InfoTip text="Diferenta totala dintre scenariul investit vs cont curent." presenter={presenter}/></div>
            <div style={{fontSize:presenter?52:36,fontWeight:700,color:T.red,fontFamily:T.font,lineHeight:1}}>{fmt(cost)}</div>
            <div style={{display:"flex",gap:presenter?16:10,marginTop:14,flexWrap:"wrap",justifyContent:presenter?"center":"flex-start"}}>
              <Pill value={fmt(dailyCost)} label="/ zi pierdut" color={T.red} presenter={presenter} tip={`Inactivitatea te costa ${fmt(dailyCost)}/zi.`}/>
              {monthly>0&&<Pill value={`${yearsLost} ani`} label="de economii pierdute" color={T.red} presenter={presenter} tip={`Echivalentul a ${yearsLost} ani de economii de ${fmt(monthly)}/luna.`}/>}
            </div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <StatCard label="Daca investesti" value={fmtK(last.invested)} color={T.green} bgColor={T.greenFaint} presenter={presenter} icon={"\uD83D\uDCC8"} sub={`la ${ret}% pe an`} tip="Valoarea totala cu compunere."/>
            <StatCard label="Daca stau in cont" value={fmtK(last.cash)} color={T.textMuted} bgColor={T.white} presenter={presenter} icon={"\uD83C\uDFE6"} sub={`cu inflatie de ${infl}%`} tip="Valoarea reala ajustata la inflatie."/>
          </div>
          <div style={{padding:presenter?"20px 24px 16px":"16px 20px 12px",background:T.white,borderRadius:T.radius,border:`1px solid ${T.border}`}}>
            <div style={{display:"flex",alignItems:"center",marginBottom:4,fontSize:presenter?13:11,color:T.textMuted,fontFamily:T.font,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Evolutia in timp<InfoTip text="Verde = investit. Punctat = cont curent. Zona rosie = cost." presenter={presenter}/></div>
            <OCChart data={data} presenter={presenter}/>
          </div>
          <div style={{padding:presenter?"20px 28px":"16px 20px",background:T.amberFaint,borderRadius:T.radius,borderLeft:`4px solid ${T.amber}`}}>
            <div style={{fontSize:presenter?15:13,color:T.text,fontFamily:T.font,lineHeight:1.6}}>{presenter?(<><strong style={{color:T.burgundy}}>Fiecare luna de amanare costa.</strong> Pierzi <strong style={{color:T.red}}>{fmt(dailyCost)}/zi</strong> &#8212; adica <strong style={{color:T.red}}>{fmt(cost)}</strong> in {years} ani.</>):(<><strong>De retinut:</strong> Pierzi <strong style={{color:T.red}}>{fmt(dailyCost)}/zi</strong>. Diferenta de <strong style={{color:T.red}}>{fmtK(cost)}</strong> in {years} ani e un cost invizibil.</>)}</div>
          </div>
        </div>
      </div>
      <CTA presenter={presenter}/>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 2: DOBANDA COMPUSA (unchanged from v3)
// ═══════════════════════════════════════════════════════════════

function computeGrowth(ini, mo, rr, yrs) { const mr=rr/100/12; let t=ini,c=ini; const pts=[{year:0,total:ini,contributed:ini,compounding:0}]; for(let m=1;m<=yrs*12;m++){t=t*(1+mr)+mo;c+=mo;if(m%12===0)pts.push({year:m/12,total:Math.round(t),contributed:Math.round(c),compounding:Math.round(t-c)});}return pts;}
function computeComparison(ini,mo,rr,totalY,delayY){const early=computeGrowth(ini,mo,rr,totalY),late=computeGrowth(ini,mo,rr,totalY-delayY);const lp=[];for(let y=0;y<=totalY;y++){if(y<delayY)lp.push({year:y,total:0,contributed:0,compounding:0});else{const d=late[y-delayY];if(d)lp.push({...d,year:y});}}return{early,late:lp};}

function GrowthChart({ data, presenter }) {
  const canvasRef=useRef(null),containerRef=useRef(null);
  const draw=useCallback(()=>{
    const canvas=canvasRef.current,box=containerRef.current;if(!canvas||!box)return;
    const dpr=window.devicePixelRatio||1,w=box.offsetWidth,h=presenter?420:320;
    canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";
    const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);if(!data||data.length<2)return;
    const pad={top:40,right:presenter?110:90,bottom:50,left:presenter?80:64};
    const cw=w-pad.left-pad.right,ch=h-pad.top-pad.bottom;
    const maxVal=Math.max(...data.map(d=>d.total))*1.12;
    const x=i=>pad.left+(i/(data.length-1))*cw,y=v=>pad.top+ch-(v/maxVal)*ch;
    ctx.strokeStyle=T.border;ctx.lineWidth=0.5;ctx.setLineDash([3,3]);
    ctx.font=`${presenter?13:11}px DM Sans,sans-serif`;ctx.fillStyle=T.textLight;ctx.textAlign="right";
    for(let i=0;i<=5;i++){const val=(i/5)*maxVal,yy=y(val);ctx.beginPath();ctx.moveTo(pad.left,yy);ctx.lineTo(w-pad.right,yy);ctx.stroke();ctx.fillText(fmtK(val),pad.left-10,yy+4);}
    ctx.setLineDash([]);ctx.textAlign="center";ctx.fillStyle=T.textLight;
    data.forEach((d,i)=>{const skip=data.length>15?5:data.length>8?2:1;if(d.year%skip===0)ctx.fillText(d.year===0?"Azi":`${d.year} ani`,x(i),h-pad.bottom+22);});
    ctx.beginPath();data.forEach((d,i)=>i===0?ctx.moveTo(x(i),y(d.contributed)):ctx.lineTo(x(i),y(d.contributed)));
    ctx.lineTo(x(data.length-1),y(0));ctx.lineTo(x(0),y(0));ctx.closePath();ctx.fillStyle="rgba(232,168,50,0.15)";ctx.fill();
    ctx.beginPath();data.forEach((d,i)=>i===0?ctx.moveTo(x(i),y(d.total)):ctx.lineTo(x(i),y(d.total)));
    for(let i=data.length-1;i>=0;i--)ctx.lineTo(x(i),y(data[i].contributed));ctx.closePath();ctx.fillStyle="rgba(47,140,94,0.12)";ctx.fill();
    ctx.beginPath();data.forEach((d,i)=>i===0?ctx.moveTo(x(i),y(d.contributed)):ctx.lineTo(x(i),y(d.contributed)));ctx.strokeStyle=T.amber;ctx.lineWidth=presenter?2.5:2;ctx.setLineDash([5,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();data.forEach((d,i)=>i===0?ctx.moveTo(x(i),y(d.total)):ctx.lineTo(x(i),y(d.total)));ctx.strokeStyle=T.green;ctx.lineWidth=presenter?3.5:2.5;ctx.stroke();
    const last=data[data.length-1],lx=x(data.length-1);
    ctx.beginPath();ctx.arc(lx,y(last.total),presenter?6:4,0,Math.PI*2);ctx.fillStyle=T.green;ctx.fill();
    ctx.beginPath();ctx.arc(lx,y(last.contributed),presenter?6:4,0,Math.PI*2);ctx.fillStyle=T.amber;ctx.fill();
    ctx.font=`600 ${presenter?14:12}px DM Sans,sans-serif`;ctx.textAlign="left";
    ctx.fillStyle=T.green;ctx.fillText(fmtK(last.total),lx+10,y(last.total)+5);
    ctx.fillStyle=T.amber;ctx.fillText(fmtK(last.contributed),lx+10,y(last.contributed)+5);
    const ly=pad.top-16;ctx.font=`500 ${presenter?13:11}px DM Sans,sans-serif`;
    ctx.fillStyle=T.green;ctx.fillRect(pad.left,ly-4,14,3);ctx.fillText("Valoare totala",pad.left+20,ly);
    ctx.fillStyle=T.amber;ctx.setLineDash([4,3]);ctx.strokeStyle=T.amber;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(pad.left+130,ly-2.5);ctx.lineTo(pad.left+144,ly-2.5);ctx.stroke();ctx.setLineDash([]);ctx.fillText("Banii tai",pad.left+150,ly);
  },[data,presenter]);
  useEffect(()=>{draw();window.addEventListener("resize",draw);return()=>window.removeEventListener("resize",draw);},[draw]);
  return <div ref={containerRef} style={{width:"100%",marginTop:8}}><canvas ref={canvasRef} style={{display:"block",width:"100%"}}/></div>;
}

function ComparisonChart({ early, late, presenter }) {
  const canvasRef=useRef(null),containerRef=useRef(null);
  const draw=useCallback(()=>{
    const canvas=canvasRef.current,box=containerRef.current;if(!canvas||!box)return;
    const dpr=window.devicePixelRatio||1,w=box.offsetWidth,h=presenter?420:320;
    canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";
    const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);if(!early||early.length<2)return;
    const pad={top:40,right:presenter?120:100,bottom:50,left:presenter?80:64};
    const cw=w-pad.left-pad.right,ch=h-pad.top-pad.bottom;
    const maxVal=Math.max(...early.map(d=>d.total),...late.map(d=>d.total))*1.12;
    const len=early.length,x=i=>pad.left+(i/(len-1))*cw,y=v=>pad.top+ch-(v/maxVal)*ch;
    ctx.strokeStyle=T.border;ctx.lineWidth=0.5;ctx.setLineDash([3,3]);
    ctx.font=`${presenter?13:11}px DM Sans,sans-serif`;ctx.fillStyle=T.textLight;ctx.textAlign="right";
    for(let i=0;i<=5;i++){const val=(i/5)*maxVal,yy=y(val);ctx.beginPath();ctx.moveTo(pad.left,yy);ctx.lineTo(w-pad.right,yy);ctx.stroke();ctx.fillText(fmtK(val),pad.left-10,yy+4);}
    ctx.setLineDash([]);ctx.textAlign="center";ctx.fillStyle=T.textLight;
    early.forEach((d,i)=>{const skip=len>15?5:len>8?2:1;if(d.year%skip===0)ctx.fillText(d.year===0?"Azi":`${d.year} ani`,x(i),h-pad.bottom+22);});
    const fli=late.findIndex(d=>d.total>0);
    if(fli>0){ctx.beginPath();for(let i=fli;i<len;i++){i===fli?ctx.moveTo(x(i),y(early[i].total)):ctx.lineTo(x(i),y(early[i].total));}for(let i=len-1;i>=fli;i--)ctx.lineTo(x(i),y(late[i].total));ctx.closePath();ctx.fillStyle="rgba(192,56,77,0.08)";ctx.fill();}
    ctx.beginPath();let started=false;late.forEach((d,i)=>{if(d.total<=0)return;if(!started){ctx.moveTo(x(i),y(d.total));started=true;}else ctx.lineTo(x(i),y(d.total));});ctx.strokeStyle=T.blue;ctx.lineWidth=presenter?3:2;ctx.setLineDash([6,4]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();early.forEach((d,i)=>i===0?ctx.moveTo(x(i),y(d.total)):ctx.lineTo(x(i),y(d.total)));ctx.strokeStyle=T.green;ctx.lineWidth=presenter?3.5:2.5;ctx.stroke();
    const lastE=early[early.length-1],lastL=late[late.length-1],lx=x(len-1);
    ctx.beginPath();ctx.arc(lx,y(lastE.total),presenter?6:4,0,Math.PI*2);ctx.fillStyle=T.green;ctx.fill();
    ctx.beginPath();ctx.arc(lx,y(lastL.total),presenter?6:4,0,Math.PI*2);ctx.fillStyle=T.blue;ctx.fill();
    ctx.font=`600 ${presenter?14:12}px DM Sans,sans-serif`;ctx.textAlign="left";
    ctx.fillStyle=T.green;ctx.fillText(fmtK(lastE.total),lx+10,y(lastE.total)+5);
    ctx.fillStyle=T.blue;ctx.fillText(fmtK(lastL.total),lx+10,y(lastL.total)+5);
    const cod=lastE.total-lastL.total,midY=(y(lastE.total)+y(lastL.total))/2,bx=lx-20;
    ctx.strokeStyle=T.red;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(bx,y(lastE.total)+6);ctx.lineTo(bx,y(lastL.total)-6);ctx.stroke();
    ctx.beginPath();ctx.moveTo(bx-4,y(lastE.total)+6);ctx.lineTo(bx,y(lastE.total)+2);ctx.lineTo(bx+4,y(lastE.total)+6);ctx.stroke();
    ctx.beginPath();ctx.moveTo(bx-4,y(lastL.total)-6);ctx.lineTo(bx,y(lastL.total)-2);ctx.lineTo(bx+4,y(lastL.total)-6);ctx.stroke();
    ctx.font=`700 ${presenter?12:10}px DM Sans,sans-serif`;ctx.fillStyle=T.red;ctx.textAlign="right";ctx.fillText(fmtK(cod),bx-8,midY+4);
    const ly=pad.top-16;ctx.font=`500 ${presenter?13:11}px DM Sans,sans-serif`;
    ctx.fillStyle=T.green;ctx.fillRect(pad.left,ly-4,14,3);ctx.fillText("Incepe azi",pad.left+20,ly);
    ctx.fillStyle=T.blue;ctx.setLineDash([4,3]);ctx.strokeStyle=T.blue;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(pad.left+110,ly-2.5);ctx.lineTo(pad.left+124,ly-2.5);ctx.stroke();ctx.setLineDash([]);ctx.fillText("Incepe mai tarziu",pad.left+130,ly);
  },[early,late,presenter]);
  useEffect(()=>{draw();window.addEventListener("resize",draw);return()=>window.removeEventListener("resize",draw);},[draw]);
  return <div ref={containerRef} style={{width:"100%",marginTop:8}}><canvas ref={canvasRef} style={{display:"block",width:"100%"}}/></div>;
}

function StackedBar({ contributed, compounding, presenter }) {
  const total=contributed+compounding,pctComp=total>0?(compounding/total)*100:0,pctCont=100-pctComp;
  return (<div><div style={{display:"flex",height:presenter?32:24,borderRadius:T.radiusXs,overflow:"hidden",marginBottom:8}}><div style={{width:`${pctCont}%`,background:T.amber,transition:"width 0.4s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:presenter?12:10,fontWeight:700,color:"#fff",fontFamily:T.font}}>{pctCont>15&&`${Math.round(pctCont)}%`}</div><div style={{width:`${pctComp}%`,background:T.green,transition:"width 0.4s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:presenter?12:10,fontWeight:700,color:"#fff",fontFamily:T.font}}>{pctComp>15&&`${Math.round(pctComp)}%`}</div></div><div style={{display:"flex",justifyContent:"space-between",fontSize:presenter?12:10,fontFamily:T.font,color:T.textMuted}}><span><span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:T.amber,marginRight:4,verticalAlign:"middle"}}/>Banii tai: {fmtK(contributed)}</span><span><span style={{display:"inline-block",width:8,height:8,borderRadius:2,background:T.green,marginRight:4,verticalAlign:"middle"}}/>Compunere: {fmtK(compounding)}</span></div></div>);
}

function CompoundInterestTool({ presenter }) {
  const [mode,setMode]=useState("growth"),[initial,setInitial]=useState(5000),[monthly,setMonthly]=useState(500),[ret,setRet]=useState(8),[years,setYears]=useState(25),[delay,setDelay]=useState(5);
  const gap=presenter?32:20;
  const growthData=useMemo(()=>computeGrowth(initial,monthly,ret,years),[initial,monthly,ret,years]);
  const lastG=growthData[growthData.length-1];
  const compPct=lastG.total>0?(lastG.compounding/lastG.total)*100:0;
  const dailyInv=((initial/(years*365))+(monthly*12/365)).toFixed(1);
  const{early:earlyData,late:lateData}=useMemo(()=>computeComparison(initial,monthly,ret,years,delay),[initial,monthly,ret,years,delay]);
  const lastE=earlyData[earlyData.length-1],lastL=lateData[lateData.length-1],costDelay=lastE.total-lastL.total,delayDaily=Math.round(costDelay/(years*365));
  const modes=[{id:"growth",icon:"\uD83C\uDF31",label:"Crestere"},{id:"compare",icon:"\u23F1\uFE0F",label:"Cost amanare"}];

  return (
    <div>
      <div style={{marginBottom:gap,textAlign:presenter?"center":"left"}}>
        <h1 style={{fontFamily:T.fontDisplay,fontSize:presenter?36:24,fontWeight:400,color:T.burgundy,margin:0,lineHeight:1.15}}>
          {mode==="growth"?<>Banii tai pot lucra<span style={{color:T.amber}}> mai mult decat tine.</span></>:<>Fiecare an de amanare<span style={{color:T.amber}}> are un pret.</span></>}
        </h1>
        <p style={{fontFamily:T.font,fontSize:presenter?15:13,color:T.textMuted,margin:"8px 0 0 0",lineHeight:1.5,display:"flex",alignItems:"center",justifyContent:presenter?"center":"flex-start",flexWrap:"wrap"}}>
          {mode==="growth"?<>Investitii mici si constante devin sume uriase datorita dobanzii compuse.<InfoTip text="Dobanda compusa = castigi dobanda si pe dobanda anterioara. Bulgare de zapada financiar." presenter={presenter}/></>:<>Compara cat pierzi daca amani investitia cu cativa ani.<InfoTip text="Chiar daca amani doar 5 ani, diferenta poate fi de sute de mii de euro." presenter={presenter}/></>}
        </p>
      </div>
      <div style={{marginBottom:gap,textAlign:presenter?"center":"left"}}><ModeToggle mode={mode} onMode={setMode} options={modes} presenter={presenter}/></div>
      <div className="m-tool-layout" style={{display:"flex",gap,flexWrap:"wrap"}}>
        <div style={{flex:presenter?"0 0 380px":"0 0 320px",minWidth:280,padding:presenter?"28px":"20px",background:T.white,borderRadius:T.radius,border:`1px solid ${T.border}`}}>
          <SectionLabel tip="Ajusteaza parametrii si vezi cum cresc banii." presenter={presenter}>Parametri</SectionLabel>
          <Slider label="Sumă inițială" value={initial} onChange={setInitial} min={0} max={200000} step={1000} formatValue={fmt} presenter={presenter} tip="Cat investesti la inceput (lump sum)."/>
          <Slider label="Investitie lunara" value={monthly} onChange={setMonthly} min={0} max={10000} step={50} formatValue={fmt} presenter={presenter} tip="Cat adaugi lunar. Consistenta bate suma."/>
          <Slider label="Randament anual" value={ret} onChange={setRet} min={3} max={15} step={0.5} suffix="%" presenter={presenter} tip="Randamentul mediu anual. Global equities ~10%/an."/>
          <Slider label="Orizont de timp" value={years} onChange={setYears} min={5} max={40} step={1} suffix=" ani" presenter={presenter} tip="Miracolul compunerii incepe dupa 10-15 ani."/>
          {mode==="compare"&&<Slider label="Ani de intarziere" value={delay} onChange={setDelay} min={1} max={Math.min(15,years-2)} step={1} suffix=" ani" presenter={presenter} tip="Cati ani amani inceputul investitiei."/>}
        </div>
        <div style={{flex:1,minWidth:300,display:"flex",flexDirection:"column",gap}}>
          {mode==="growth"&&(<>
            <div style={{padding:presenter?"28px 32px":"20px 24px",background:T.greenFaint,borderRadius:T.radius,border:`1px solid ${T.greenMuted}`,textAlign:presenter?"center":"left"}}>
              <div style={{fontSize:presenter?14:11,fontWeight:600,color:T.green,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:presenter?"center":"flex-start"}}>Valoarea portofoliului in {years} ani<InfoTip text="Suma totala dupa investitia initiala + contributii lunare cu randamentul ales." presenter={presenter}/></div>
              <div style={{fontSize:presenter?52:36,fontWeight:700,color:T.green,fontFamily:T.font,lineHeight:1}}>{fmt(lastG.total)}</div>
              <div style={{display:"flex",gap:presenter?16:10,marginTop:14,flexWrap:"wrap",justifyContent:presenter?"center":"flex-start"}}>
                <Pill value={`${Math.round(compPct)}%`} label="din compunere" color={T.green} presenter={presenter} tip={`Din ${fmt(lastG.total)}, ${fmtK(lastG.compounding)} au venit din compunere.`}/>
                <Pill value={`\u20AC${dailyInv}`} label="/ zi investit" color={T.burgundy} presenter={presenter} tip={`Doar €${dailyInv}/zi investit de tine pentru a ajunge la ${fmtK(lastG.total)}.`}/>
              </div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <StatCard label="Banii tai" value={fmtK(lastG.contributed)} color={T.amber} bgColor={T.amberFaint} presenter={presenter} icon={"\uD83D\uDCB0"} sub={`${fmt(initial)} + ${fmt(monthly)}/luna`} tip="Suma totala din buzunar."/>
              <StatCard label="Castig din compunere" value={fmtK(lastG.compounding)} color={T.green} bgColor={T.greenFaint} presenter={presenter} icon={"\u2728"} sub={`${Math.round(compPct)}% din total`} tip="Banii generati de compunere, nu de tine."/>
            </div>
            <div style={{padding:presenter?"20px 24px":"16px 20px",background:T.white,borderRadius:T.radius,border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:10,fontSize:presenter?13:11,color:T.textMuted,fontFamily:T.font,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Compozitia portofoliului<InfoTip text="Cat vine din banii tai vs compunere." presenter={presenter}/></div>
              <StackedBar contributed={lastG.contributed} compounding={lastG.compounding} presenter={presenter}/>
            </div>
            <div style={{padding:presenter?"20px 24px 16px":"16px 20px 12px",background:T.white,borderRadius:T.radius,border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:4,fontSize:presenter?13:11,color:T.textMuted,fontFamily:T.font,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Evolutia in timp<InfoTip text="Verde = total. Amber = banii tai. Diferenta = compunere." presenter={presenter}/></div>
              <GrowthChart data={growthData} presenter={presenter}/>
            </div>
            <div style={{padding:presenter?"20px 28px":"16px 20px",background:T.amberFaint,borderRadius:T.radius,borderLeft:`4px solid ${T.amber}`}}>
              <div style={{fontSize:presenter?15:13,color:T.text,fontFamily:T.font,lineHeight:1.6}}>{presenter?(<><strong style={{color:T.burgundy}}>Banii tai lucreaza 24/7.</strong> Din {fmt(lastG.total)}, doar {fmtK(lastG.contributed)} sunt din buzunar. <strong style={{color:T.green}}>{fmtK(lastG.compounding)}</strong> ({Math.round(compPct)}%) au venit din compunere. Doar <strong>\u20AC{dailyInv}/zi</strong>.</>):(<><strong>Puterea compunerii:</strong> {fmt(monthly)}/luna = <strong style={{color:T.green}}>{Math.round(compPct)}%</strong> din portofoliu vine din compunere.</>)}</div>
            </div>
          </>)}
          {mode==="compare"&&(<>
            <div style={{padding:presenter?"28px 32px":"20px 24px",background:T.redFaint,borderRadius:T.radius,border:`1px solid ${T.redMuted}`,textAlign:presenter?"center":"left"}}>
              <div style={{fontSize:presenter?14:11,fontWeight:600,color:T.red,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:4,fontFamily:T.font,display:"flex",alignItems:"center",justifyContent:presenter?"center":"flex-start"}}>Costul amanarii de {delay} ani<InfoTip text={`Amani ${delay} ani = ${fmtK(costDelay)} mai putin. Timpul pierdut nu se recupereaza.`} presenter={presenter}/></div>
              <div style={{fontSize:presenter?52:36,fontWeight:700,color:T.red,fontFamily:T.font,lineHeight:1}}>{fmt(costDelay)}</div>
              <div style={{display:"flex",gap:presenter?16:10,marginTop:14,flexWrap:"wrap",justifyContent:presenter?"center":"flex-start"}}>
                <Pill value={fmt(delayDaily)} label="/ zi pierdut" color={T.red} presenter={presenter}/>
                <Pill value={fmt(Math.round(costDelay/delay))} label="/ an de intarziere" color={T.red} presenter={presenter}/>
              </div>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <StatCard label="Incepe azi" value={fmtK(lastE.total)} color={T.green} bgColor={T.greenFaint} presenter={presenter} icon={"\uD83D\uDE80"} sub={`${years} ani investiti`}/>
              <StatCard label={`Incepe in ${delay} ani`} value={fmtK(lastL.total)} color={T.blue} bgColor={T.blueFaint} presenter={presenter} icon={"\u23F3"} sub={`${years-delay} ani investiti`}/>
            </div>
            <div style={{padding:presenter?"20px 24px 16px":"16px 20px 12px",background:T.white,borderRadius:T.radius,border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:4,fontSize:presenter?13:11,color:T.textMuted,fontFamily:T.font,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Azi vs in {delay} ani<InfoTip text="Verde = incepi azi. Albastru = amani. Zona rosie = costul amanarii." presenter={presenter}/></div>
              <ComparisonChart early={earlyData} late={lateData} presenter={presenter}/>
            </div>
            <div style={{padding:presenter?"20px 24px":"16px 20px",background:T.white,borderRadius:T.radius,border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:12,fontSize:presenter?13:11,color:T.textMuted,fontFamily:T.font,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Detalii<InfoTip text="Ce ai pus din buzunar vs ce ai primit in fiecare scenariu." presenter={presenter}/></div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:140}}><div style={{fontSize:presenter?12:10,fontWeight:600,color:T.green,fontFamily:T.font,marginBottom:4,textTransform:"uppercase"}}>{"\uD83D\uDE80"} Incepe azi</div><div style={{fontSize:presenter?13:11,color:T.textMuted,fontFamily:T.font,lineHeight:1.8}}>Din buzunar: <strong style={{color:T.text}}>{fmtK(lastE.contributed)}</strong><br/>Compunere: <strong style={{color:T.green}}>{fmtK(lastE.compounding)}</strong><br/>Multiplicator: <strong style={{color:T.green}}>{(lastE.total/Math.max(lastE.contributed,1)).toFixed(1)}x</strong></div></div>
                <div style={{width:1,background:T.border,alignSelf:"stretch"}}/>
                <div style={{flex:1,minWidth:140}}><div style={{fontSize:presenter?12:10,fontWeight:600,color:T.blue,fontFamily:T.font,marginBottom:4,textTransform:"uppercase"}}>{"\u23F3"} In {delay} ani</div><div style={{fontSize:presenter?13:11,color:T.textMuted,fontFamily:T.font,lineHeight:1.8}}>Din buzunar: <strong style={{color:T.text}}>{fmtK(lastL.contributed)}</strong><br/>Compunere: <strong style={{color:T.blue}}>{fmtK(lastL.compounding)}</strong><br/>Multiplicator: <strong style={{color:T.blue}}>{(lastL.total/Math.max(lastL.contributed,1)).toFixed(1)}x</strong></div></div>
              </div>
            </div>
            <div style={{padding:presenter?"20px 28px":"16px 20px",background:T.amberFaint,borderRadius:T.radius,borderLeft:`4px solid ${T.amber}`}}>
              <div style={{fontSize:presenter?15:13,color:T.text,fontFamily:T.font,lineHeight:1.6}}>{presenter?(<><strong style={{color:T.burgundy}}>Timpul e cel mai pretios activ.</strong> {delay} ani amanare = <strong style={{color:T.red}}>{fmtK(costDelay)}</strong> pierduti. Nu ca investesti mai putin. Ci ca ai dat compunerii mai putin timp.</>):(<><strong>Timpul bate banii:</strong> {delay} ani intarziere costa <strong style={{color:T.red}}>{fmtK(costDelay)}</strong>. Multiplicator {(lastE.total/Math.max(lastE.contributed,1)).toFixed(1)}x vs {(lastL.total/Math.max(lastL.contributed,1)).toFixed(1)}x.</>)}</div>
            </div>
          </>)}
        </div>
      </div>
      <CTA presenter={presenter}/>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 3: CALCULATOR FIRE
// ═══════════════════════════════════════════════════════════════

function computeFIRE(currentSavings, monthlySavings, returnRate, monthlyExpenses, inflationRate, withdrawalRate) {
  const fireNumber = (monthlyExpenses * 12) / (withdrawalRate / 100);
  const mr = returnRate / 100 / 12;
  // Compute years to FIRE
  let portfolio = currentSavings;
  let months = 0;
  const maxMonths = 60 * 12; // 60 year cap
  const pts = [{ year: 0, portfolio: currentSavings }];
  while (portfolio < fireNumber && months < maxMonths) {
    portfolio = portfolio * (1 + mr) + monthlySavings;
    months++;
    if (months % 12 === 0) pts.push({ year: months / 12, portfolio: Math.round(portfolio) });
  }
  if (portfolio >= fireNumber && months % 12 !== 0) {
    pts.push({ year: Math.ceil(months / 12), portfolio: Math.round(portfolio) });
  }
  const yearsToFIRE = months < maxMonths ? months / 12 : null; // null = unreachable
  // Now compute boosted scenario (+200/month)
  const boost = 200;
  let portfolioB = currentSavings;
  let monthsB = 0;
  while (portfolioB < fireNumber && monthsB < maxMonths) {
    portfolioB = portfolioB * (1 + mr) + monthlySavings + boost;
    monthsB++;
  }
  const yearsToFIREBoosted = monthsB < maxMonths ? monthsB / 12 : null;
  // Monthly income at FIRE
  const monthlyIncomeAtFIRE = (fireNumber * (withdrawalRate / 100)) / 12;
  // Inflation-adjusted FIRE number (for display context)
  const inflAdjustedExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToFIRE || 20);
  const realFIRENumber = (inflAdjustedExpenses * 12) / (withdrawalRate / 100);

  return {
    fireNumber: Math.round(fireNumber),
    realFIRENumber: Math.round(realFIRENumber),
    yearsToFIRE,
    yearsToFIREBoosted,
    yearsSaved: yearsToFIRE != null && yearsToFIREBoosted != null ? yearsToFIRE - yearsToFIREBoosted : null,
    monthlyIncomeAtFIRE: Math.round(monthlyIncomeAtFIRE),
    inflAdjustedExpenses: Math.round(inflAdjustedExpenses),
    chartData: pts,
  };
}

// ─── FIRE Journey Chart ──────────────────────────────────────
function FIREChart({ data, fireNumber, yearsToFIRE, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 420 : 320;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!data || data.length < 2) return;

    const pad = { top: 40, right: presenter ? 110 : 90, bottom: 50, left: presenter ? 80 : 64 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const maxVal = Math.max(fireNumber * 1.15, ...data.map(d => d.portfolio)) * 1.05;
    const x = i => pad.left + (i / (data.length - 1)) * cw;
    const y = v => pad.top + ch - (v / maxVal) * ch;

    // Grid
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.font = `${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) { const val = (i / 5) * maxVal, yy = y(val); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(w - pad.right, yy); ctx.stroke(); ctx.fillText(fmtK(val), pad.left - 10, yy + 4); }
    ctx.setLineDash([]);

    // X labels
    ctx.textAlign = "center"; ctx.fillStyle = T.textLight;
    data.forEach((d, i) => {
      const skip = data.length > 20 ? 5 : data.length > 10 ? 2 : 1;
      if (d.year % skip === 0) ctx.fillText(d.year === 0 ? "Azi" : `${d.year} ani`, x(i), h - pad.bottom + 22);
    });

    // FIRE number horizontal line
    const fireY = y(fireNumber);
    ctx.strokeStyle = T.amber; ctx.lineWidth = 2; ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(pad.left, fireY); ctx.lineTo(w - pad.right, fireY); ctx.stroke();
    ctx.setLineDash([]);
    // FIRE label
    ctx.font = `700 ${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.amber; ctx.textAlign = "left";
    ctx.fillText(`FIRE: ${fmtK(fireNumber)}`, w - pad.right + 8, fireY + 4);

    // Area under portfolio line up to FIRE
    ctx.beginPath();
    data.forEach((d, i) => {
      const plotY = y(Math.min(d.portfolio, fireNumber));
      i === 0 ? ctx.moveTo(x(i), plotY) : ctx.lineTo(x(i), plotY);
    });
    ctx.lineTo(x(data.length - 1), y(0)); ctx.lineTo(x(0), y(0)); ctx.closePath();
    const grad = ctx.createLinearGradient(0, fireY, 0, y(0));
    grad.addColorStop(0, "rgba(47,140,94,0.15)"); grad.addColorStop(1, "rgba(47,140,94,0.02)");
    ctx.fillStyle = grad; ctx.fill();

    // Portfolio line
    ctx.beginPath();
    data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.portfolio)) : ctx.lineTo(x(i), y(d.portfolio)));
    ctx.strokeStyle = T.green; ctx.lineWidth = presenter ? 3.5 : 2.5; ctx.stroke();

    // FIRE intersection marker
    if (yearsToFIRE != null) {
      const fireIdx = data.findIndex(d => d.portfolio >= fireNumber);
      if (fireIdx > 0) {
        const fx = x(fireIdx), fy = y(data[fireIdx].portfolio);
        // Vertical dashed line at FIRE point
        ctx.strokeStyle = T.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, y(0)); ctx.stroke();
        ctx.setLineDash([]);
        // Star marker
        ctx.beginPath(); ctx.arc(fx, fy, presenter ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = T.amber; ctx.fill();
        ctx.beginPath(); ctx.arc(fx, fy, presenter ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = T.white; ctx.fill();
        // FIRE label — place above and to the left to avoid overlap with end label
        ctx.font = `700 ${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.amber; ctx.textAlign = "center";
        ctx.fillText(`\uD83D\uDD25 FIRE!`, fx, fy - (presenter ? 18 : 14));
      }
    }

    // End dot — only show if portfolio goes past FIRE line
    const last = data[data.length - 1], lx = x(data.length - 1);
    ctx.beginPath(); ctx.arc(lx, y(last.portfolio), presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.green; ctx.fill();
    // Only show end portfolio label if it's far enough from the FIRE line label
    const fireY2 = y(fireNumber);
    const endY = y(last.portfolio);
    const labelGap = Math.abs(endY - fireY2);
    if (labelGap > (presenter ? 20 : 16) || yearsToFIRE == null) {
      ctx.font = `600 ${presenter ? 14 : 12}px DM Sans,sans-serif`; ctx.textAlign = "left"; ctx.fillStyle = T.green;
      ctx.fillText(fmtK(last.portfolio), lx + 10, endY + 5);
    }

    // Legend
    const ly = pad.top - 16; ctx.font = `500 ${presenter ? 13 : 11}px DM Sans,sans-serif`;
    ctx.fillStyle = T.green; ctx.fillRect(pad.left, ly - 4, 14, 3); ctx.fillText("Portofoliu", pad.left + 20, ly);
    ctx.fillStyle = T.amber; ctx.setLineDash([6, 3]); ctx.strokeStyle = T.amber; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(pad.left + 110, ly - 2.5); ctx.lineTo(pad.left + 130, ly - 2.5); ctx.stroke();
    ctx.setLineDash([]); ctx.fillText("Numar FIRE", pad.left + 136, ly);
  }, [data, fireNumber, yearsToFIRE, presenter]);

  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 8 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

// ─── Progress Ring ───────────────────────────────────────────
function ProgressRing({ pct, label, color, size, presenter }) {
  const s = size || (presenter ? 100 : 72);
  const stroke = presenter ? 8 : 6;
  const r = (s - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={s} height={s} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={s/2} cy={s/2} r={r} fill="none" stroke={T.border} strokeWidth={stroke} />
        <circle cx={s/2} cy={s/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "relative", marginTop: -(s / 2) - (presenter ? 12 : 8), fontSize: presenter ? 18 : 14, fontWeight: 700, color, fontFamily: T.font, textAlign: "center", height: presenter ? 28 : 20 }}>
        {pct >= 100 ? "\uD83D\uDD25" : `${Math.round(pct)}%`}
      </div>
      <div style={{ fontSize: presenter ? 11 : 9, color: T.textMuted, fontFamily: T.font, textAlign: "center", marginTop: presenter ? 4 : 2 }}>{label}</div>
    </div>
  );
}

// ─── Main FIRE Calculator ────────────────────────────────────
function FIRECalculatorTool({ presenter }) {
  const [age, setAge] = useState(30);
  const [monthlyExpenses, setMonthlyExpenses] = useState(3000);
  const [currentSavings, setCurrentSavings] = useState(20000);
  const [monthlySavings, setMonthlySavings] = useState(1000);
  const [returnRate, setReturnRate] = useState(8);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [region, setRegion] = useState("ro"); // "ro" or "eu"

  const inflationRate = region === "ro" ? 5 : 3;
  const gap = presenter ? 32 : 20;

  const result = useMemo(
    () => computeFIRE(currentSavings, monthlySavings, returnRate, monthlyExpenses, inflationRate, withdrawalRate),
    [currentSavings, monthlySavings, returnRate, monthlyExpenses, inflationRate, withdrawalRate]
  );

  const { fireNumber, realFIRENumber, yearsToFIRE, yearsToFIREBoosted, yearsSaved, monthlyIncomeAtFIRE, chartData } = result;
  const fireAge = yearsToFIRE != null ? Math.round(age + yearsToFIRE) : null;
  const fireBoostedAge = yearsToFIREBoosted != null ? Math.round(age + yearsToFIREBoosted) : null;
  const progressPct = currentSavings > 0 ? (currentSavings / fireNumber) * 100 : 0;
  const savingsRate = monthlyExpenses > 0 ? (monthlySavings / (monthlyExpenses + monthlySavings)) * 100 : 0;

  const regions = [
    { id: "ro", icon: "\uD83C\uDDF7\uD83C\uDDF4", label: `Romania (${inflationRate}%)` },
    { id: "eu", icon: "\uD83C\uDDEA\uD83C\uDDFA", label: `Europa (3%)` },
  ];

  const reachable = yearsToFIRE != null && yearsToFIRE <= 50;

  return (
    <div>
      {/* Headline */}
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left" }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: presenter ? 36 : 24, fontWeight: 400, color: T.burgundy, margin: 0, lineHeight: 1.15 }}>
          Cât îți trebuie ca să fii<span style={{ color: T.amber }}> liber financiar?</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: presenter ? 15 : 13, color: T.textMuted, margin: "8px 0 0 0", lineHeight: 1.5, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start", flexWrap: "wrap" }}>
          Calculează numărul tau FIRE si afla când poți trăi din investiții.
          <InfoTip text="FIRE = Financial Independence, Retire Early. Numarul FIRE este suma de care ai nevoie investita astfel incat sa poti trai din randamentul portofoliului, fara sa mai depinzi de un salariu." presenter={presenter} />
        </p>
      </div>

      {/* Region toggle */}
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left", display: "flex", alignItems: "center", gap: 12, justifyContent: presenter ? "center" : "flex-start", flexWrap: "wrap" }}>
        <ModeToggle mode={region} onMode={setRegion} options={regions} presenter={presenter} />
        <span style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, fontFamily: T.font }}>
          {region === "ro" ? "Inflatie RO jan 2026: 9.6% (medie LT: ~5%)" : "Tinta BCE: 2% (medie estimata: 3%)"}
          <InfoTip text={region === "ro" ? "Inflatia actuala in Romania este 9.6% (ian 2026), dar pe termen lung estimam o medie de 5% pe an. Calculul FIRE foloseste media pe termen lung, nu rata actuala." : "Tinta BCE este 2%, dar media reala din ultimii ani a fost mai aproape de 3%. Folosim 3% ca estimare conservatoare pe termen lung."} presenter={presenter} />
        </span>
      </div>

      {/* Two-column */}
      <div className="m-tool-layout" style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {/* Left: Inputs */}
        <div style={{ flex: presenter ? "0 0 380px" : "0 0 320px", minWidth: 280, padding: presenter ? "28px" : "20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
          <SectionLabel tip="Introdu datele tale reale. Toate calculele se actualizeaza automat." presenter={presenter}>Situația ta</SectionLabel>
          <Slider label="Vârstă actuală" value={age} onChange={setAge} min={18} max={60} step={1} suffix=" ani" presenter={presenter} tip="Varsta ta actuala. Folosita pentru a calcula la ce varsta atingi FIRE." />
          <Slider label="Cheltuieli lunare" value={monthlyExpenses} onChange={setMonthlyExpenses} min={500} max={15000} step={100} formatValue={fmt} presenter={presenter} tip="Cat cheltuiesti in medie pe luna (chirie, mancare, utilitati, tot). Numarul FIRE se calculeaza pe baza cheltuielilor, nu a veniturilor." />
          <Slider label="Economii actuale" value={currentSavings} onChange={setCurrentSavings} min={0} max={500000} step={1000} formatValue={fmt} presenter={presenter} tip="Cat ai deja investit sau economisit (portofoliu + depozite + cash)." />
          <Slider label="Economisești lunar" value={monthlySavings} onChange={setMonthlySavings} min={0} max={10000} step={100} formatValue={fmt} presenter={presenter} tip="Cat pui deoparte in fiecare luna pentru investitii." />
          <Slider label="Randament anual" value={returnRate} onChange={setReturnRate} min={3} max={15} step={0.5} suffix="%" presenter={presenter} tip="Randamentul mediu anual asteptat. MSCI World ~10%/an istoric." />

          <div style={{ marginTop: 8, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
            <SectionLabel tip="Rata de retragere determina cat retragi anual din portofoliu. Regula clasica e 4% (regula celor 25x)." presenter={presenter}>Avansat</SectionLabel>
            <Slider label="Rata de retragere" value={withdrawalRate} onChange={setWithdrawalRate} min={3} max={5} step={0.25} suffix="%" presenter={presenter} tip="Cat retragi anual din portofoliu. 4% = regula clasica (25x cheltuieli anuale). 3% = mai conservator (33x). 5% = mai agresiv (20x)." />
          </div>
        </div>

        {/* Right: Results */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap }}>

          {/* ── AHA 1: FIRE Number ── */}
          <div style={{ padding: presenter ? "28px 32px" : "20px 24px", background: T.amberFaint, borderRadius: T.radius, border: `1px solid rgba(232,168,50,0.2)`, textAlign: presenter ? "center" : "left" }}>
            <div style={{ fontSize: presenter ? 14 : 11, fontWeight: 600, color: T.amber, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start" }}>
              Numărul tău FIRE
              <InfoTip text={`Numarul FIRE = cheltuieli anuale / rata de retragere. La ${fmt(monthlyExpenses)}/luna (${fmt(monthlyExpenses * 12)}/an) si ${withdrawalRate}% retragere, ai nevoie de ${fmt(fireNumber)}. Cand portofoliul tau atinge aceasta suma, poti trai din randament.`} presenter={presenter} />
            </div>
            <div style={{ fontSize: presenter ? 52 : 36, fontWeight: 700, color: T.amber, fontFamily: T.font, lineHeight: 1 }}>
              {fmt(fireNumber)}
            </div>
            <div style={{ display: "flex", gap: presenter ? 16 : 10, marginTop: 14, flexWrap: "wrap", justifyContent: presenter ? "center" : "flex-start" }}>
              <Pill value={`${Math.round(1 / (withdrawalRate / 100))}x`} label="cheltuieli anuale" color={T.amber} presenter={presenter} tip={`La rata de ${withdrawalRate}%, numarul FIRE este de ${Math.round(1 / (withdrawalRate / 100))} ori cheltuielile tale anuale.`} />
              <Pill value={`${Math.round(progressPct)}%`} label="atins deja" color={progressPct > 50 ? T.green : T.burgundy} presenter={presenter} tip={`Ai deja ${fmt(currentSavings)} din ${fmt(fireNumber)} necesare. Inca ${fmt(fireNumber - currentSavings)} de strans.`} />
            </div>
          </div>

          {/* ── AHA 2: Years to FIRE + AHA 3: Boost ── */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ padding: presenter ? "24px 28px" : "16px 20px", background: reachable ? T.greenFaint : T.redFaint, borderRadius: T.radius, border: `1px solid ${T.border}`, flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: presenter ? 22 : 16, marginBottom: 6 }}>{reachable ? "\uD83C\uDFAF" : "\u26A0\uFE0F"}</div>
              <div style={{ color: T.textMuted, fontSize: presenter ? 13 : 11, fontFamily: T.font, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, display: "flex", alignItems: "center" }}>
                Atingi FIRE în
                <InfoTip text={reachable ? `La ritmul actual, portofoliul tau va atinge ${fmt(fireNumber)} in ${yearsToFIRE.toFixed(1)} ani. Vei avea ${fireAge} ani.` : "La ritmul actual, FIRE nu e realizabil in 50 de ani. Creste economiile lunare sau scade cheltuielile."} presenter={presenter} />
              </div>
              <div style={{ color: reachable ? T.green : T.red, fontSize: presenter ? 32 : 22, fontWeight: 700, fontFamily: T.font, lineHeight: 1.1 }}>
                {reachable ? `${yearsToFIRE.toFixed(1)} ani` : "50+ ani"}
              </div>
              <div style={{ color: T.textMuted, fontSize: presenter ? 12 : 10, fontFamily: T.font, marginTop: 4 }}>
                {reachable ? `la vârsta de ${fireAge} ani` : "ajusteaza parametrii"}
              </div>
            </div>

            {/* Boost card */}
            <div style={{ padding: presenter ? "24px 28px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: presenter ? 22 : 16, marginBottom: 6 }}>{"\uD83D\uDE80"}</div>
              <div style={{ color: T.textMuted, fontSize: presenter ? 13 : 11, fontFamily: T.font, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, display: "flex", alignItems: "center" }}>
                Cu +€200/lună
                <InfoTip text={`Daca adaugi încă €200/lună la economiile tale (total: ${fmt(monthlySavings + 200)}/luna), ajungi la FIRE${yearsSaved != null ? ` cu ${yearsSaved.toFixed(1)} ani mai devreme (la ${fireBoostedAge} ani)` : ""}.`} presenter={presenter} />
              </div>
              <div style={{ color: yearsSaved != null && yearsSaved > 0 ? T.green : T.textMuted, fontSize: presenter ? 32 : 22, fontWeight: 700, fontFamily: T.font, lineHeight: 1.1 }}>
                {yearsSaved != null && yearsSaved > 0 ? `-${yearsSaved.toFixed(1)} ani` : "—"}
              </div>
              <div style={{ color: T.textMuted, fontSize: presenter ? 12 : 10, fontFamily: T.font, marginTop: 4 }}>
                {fireBoostedAge != null ? `FIRE la ${fireBoostedAge} ani` : ""}
              </div>
            </div>
          </div>

          {/* ── AHA 4: Monthly Income at FIRE ── */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: presenter ? 20 : 14, flexWrap: "wrap" }}>
            <ProgressRing pct={progressPct} label={`${fmtK(currentSavings)} din ${fmtK(fireNumber)}`} color={progressPct >= 100 ? T.green : T.amber} presenter={presenter} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ color: T.textMuted, fontSize: presenter ? 13 : 11, fontFamily: T.font, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, display: "flex", alignItems: "center" }}>
                Venit lunar la FIRE
                <InfoTip text={`Cand ai ${fmt(fireNumber)} investit la ${withdrawalRate}% retragere anuala, poti retrage ${fmt(monthlyIncomeAtFIRE)}/luna fara sa iti diminuezi portofoliul (in termeni nominali). Acesta este venitul tau pasiv lunar.`} presenter={presenter} />
              </div>
              <div style={{ color: T.green, fontSize: presenter ? 36 : 26, fontWeight: 700, fontFamily: T.font, lineHeight: 1 }}>
                {fmt(monthlyIncomeAtFIRE)}<span style={{ fontSize: presenter ? 16 : 12, fontWeight: 500, color: T.textMuted }}>/luna</span>
              </div>
              <div style={{ color: T.textMuted, fontSize: presenter ? 12 : 10, fontFamily: T.font, marginTop: 4 }}>
                = cheltuielile tale de {fmt(monthlyExpenses)}/luna acoperite 100%
              </div>
            </div>
            <div style={{ minWidth: 120, textAlign: "right" }}>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>Rată economisire</div>
              <div style={{ fontSize: presenter ? 24 : 18, fontWeight: 700, color: savingsRate >= 50 ? T.green : savingsRate >= 25 ? T.amber : T.red, fontFamily: T.font }}>{Math.round(savingsRate)}%</div>
              <div style={{ fontSize: presenter ? 10 : 8, color: T.textMuted, fontFamily: T.font }}>{savingsRate >= 50 ? "excelent" : savingsRate >= 25 ? "bun" : "de îmbunătățit"}</div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ padding: presenter ? "20px 24px 16px" : "16px 20px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Drumul către FIRE
              <InfoTip text="Linia verde = cresterea portofoliului tau in timp. Linia punctata amber = numarul FIRE (tinta). Cand linia verde atinge linia amber, esti liber financiar." presenter={presenter} />
            </div>
            <FIREChart data={chartData} fireNumber={fireNumber} yearsToFIRE={yearsToFIRE} presenter={presenter} />
          </div>

          {/* Insight */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 15 : 13, color: T.text, fontFamily: T.font, lineHeight: 1.6 }}>
              {presenter ? (
                reachable ? (
                  <><strong style={{ color: T.burgundy }}>Libertatea financiară nu e un vis. E o ecuatie.</strong> Cu {fmt(monthlySavings)}/luna si {returnRate}% randament, ajungi la {fmt(fireNumber)} in <strong style={{ color: T.green }}>{yearsToFIRE.toFixed(1)} ani</strong> (la {fireAge} ani). Doar +€200/lună te aduc acolo cu <strong style={{ color: T.green }}>{yearsSaved != null ? yearsSaved.toFixed(1) : "?"} ani mai devreme</strong>. Venitul tau pasiv: <strong style={{ color: T.green }}>{fmt(monthlyIncomeAtFIRE)}/luna</strong>.</>
                ) : (
                  <><strong style={{ color: T.burgundy }}>Numerele nu mint.</strong> La ritmul actual, FIRE nu e realizabil in 50 de ani. Dar fiecare crestere a economiilor schimba radical ecuatia. Hai sa gasim ritmul potrivit pentru tine.</>
                )
              ) : (
                reachable ? (
                  <><strong>Ecuația ta FIRE:</strong> {fmt(monthlyExpenses)}/luna cheltuieli &times; {Math.round(1 / (withdrawalRate / 100))} = <strong style={{ color: T.amber }}>{fmtK(fireNumber)}</strong>. La ritmul actual, ajungi acolo în <strong style={{ color: T.green }}>{yearsToFIRE.toFixed(1)} ani</strong>. Cu +€200/lună, scurtezi cu <strong style={{ color: T.green }}>{yearsSaved != null ? yearsSaved.toFixed(1) : "?"} ani</strong>.</>
                ) : (
                  <><strong>La ritmul actual, FIRE nu e realizabil in 50 de ani.</strong> Creste economiile lunare sau scade cheltuielile. Fiecare €200/lună conteaza enorm pe termen lung.</>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <CTA presenter={presenter} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 4: PORTFOLIO X-RAY
// ═══════════════════════════════════════════════════════════════

const PRESETS = [
  { id: "conservator", label: "Conservator", icon: "\uD83D\uDEE1\uFE0F", stocks: 15, bonds: 30, cash: 35, re: 10, gold: 10, crypto: 0, us: 20, eu: 40, em: 10, other: 30, fee: 0.5 },
  { id: "echilibrat", label: "Echilibrat", icon: "\u2696\uFE0F", stocks: 45, bonds: 20, cash: 10, re: 10, gold: 10, crypto: 5, us: 50, eu: 25, em: 15, other: 10, fee: 1.0 },
  { id: "crestere", label: "Crestere", icon: "\uD83D\uDCC8", stocks: 65, bonds: 10, cash: 5, re: 5, gold: 10, crypto: 5, us: 55, eu: 20, em: 20, other: 5, fee: 1.0 },
  { id: "agresiv", label: "Agresiv", icon: "\uD83D\uDE80", stocks: 70, bonds: 5, cash: 0, re: 0, gold: 10, crypto: 15, us: 60, eu: 15, em: 20, other: 5, fee: 0.8 },
];

function computeRiskScore(stocks, bonds, cash, re, gold, crypto, em) {
  let s = 1 + stocks * 0.06 + crypto * 0.09 + (em / 100 * stocks) * 0.015 + re * 0.02 + gold * 0.01 - cash * 0.025 - bonds * 0.02;
  return Math.max(1, Math.min(10, Math.round(s * 10) / 10));
}

function computeFeeDrag(portfolioVal, returnRate, fee, years) {
  const pts = [{ year: 0, withFee: portfolioVal, noFee: portfolioVal }];
  let wf = portfolioVal, nf = portfolioVal;
  const netR = returnRate / 100, feeR = fee / 100;
  for (let y = 1; y <= years; y++) {
    nf = nf * (1 + netR);
    wf = wf * (1 + netR - feeR);
    pts.push({ year: y, withFee: Math.round(wf), noFee: Math.round(nf) });
  }
  return pts;
}

// ─── Allocation slider that keeps total = 100% ──────────────
function AllocSliders({ values, labels, colors, icons, tips, onChange, presenter }) {
  const handleChange = (idx, newVal) => {
    const old = [...values];
    const diff = newVal - old[idx];
    if (diff === 0) return;
    old[idx] = newVal;
    // Distribute diff among other sliders proportionally
    const others = old.map((v, i) => i === idx ? 0 : v);
    const othersSum = others.reduce((a, b) => a + b, 0);
    if (othersSum === 0) { old[idx] = 100; onChange(old); return; }
    const adjusted = old.map((v, i) => {
      if (i === idx) return newVal;
      const share = v / othersSum;
      return Math.max(0, Math.round(v - diff * share));
    });
    // Fix rounding to ensure sum = 100
    const sum = adjusted.reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      const fixIdx = adjusted.findIndex((v, i) => i !== idx && v > 0);
      if (fixIdx >= 0) adjusted[fixIdx] += (100 - sum);
    }
    onChange(adjusted);
  };
  return (
    <div>
      {values.map((v, i) => (
        <div key={i} style={{ marginBottom: presenter ? 20 : 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: T.textMuted, fontSize: presenter ? 14 : 12, fontFamily: T.font, fontWeight: 500, display: "flex", alignItems: "center" }}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: colors[i], marginRight: 6 }} />
              {icons && icons[i] && <span style={{ marginRight: 4 }}>{icons[i]}</span>}
              {labels[i]}
              {tips && tips[i] && <InfoTip text={tips[i]} presenter={presenter} />}
            </span>
            <span style={{ color: colors[i], fontSize: presenter ? 20 : 15, fontWeight: 700, fontFamily: T.font }}>{v}%</span>
          </div>
          <input type="range" min={0} max={100} step={1} value={v} onChange={e => handleChange(i, Number(e.target.value))} className="minimalistu-slider"
            style={{ width: "100%", height: presenter ? 5 : 4, borderRadius: 3, appearance: "none", WebkitAppearance: "none", background: `linear-gradient(to right, ${colors[i]} ${v}%, ${T.burgundyMuted} ${v}%)`, outline: "none", cursor: "pointer" }} />
        </div>
      ))}
      <div style={{ textAlign: "right", fontSize: presenter ? 11 : 9, color: T.textLight, fontFamily: T.font }}>
        Total: {values.reduce((a, b) => a + b, 0)}%
      </div>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────
function DonutChart({ values, labels, colors, title, tip, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(box.offsetWidth, presenter ? 280 : 220);
    canvas.width = size * dpr; canvas.height = size * dpr;
    canvas.style.width = size + "px"; canvas.style.height = size + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2, outerR = size / 2 - 8, innerR = outerR * 0.58;
    const total = values.reduce((a, b) => a + b, 0);
    if (total === 0 || outerR <= 0 || innerR <= 0) return;
    let startAngle = -Math.PI / 2;
    values.forEach((v, i) => {
      if (v <= 0) return;
      const sweep = (v / total) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx + innerR * Math.cos(startAngle), cy + innerR * Math.sin(startAngle));
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
      ctx.arc(cx, cy, innerR, startAngle + sweep, startAngle, true);
      ctx.closePath(); ctx.fillStyle = colors[i]; ctx.fill();
      // Label inside slice if big enough
      if (v >= 8) {
        const midAngle = startAngle + sweep / 2;
        const labelR = (outerR + innerR) / 2;
        const lx = cx + labelR * Math.cos(midAngle), ly = cy + labelR * Math.sin(midAngle);
        ctx.font = `700 ${presenter ? 13 : 11}px DM Sans,sans-serif`;
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`${v}%`, lx, ly);
      }
      startAngle += sweep;
    });
  }, [values, colors, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);

  return (
    <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {title}{tip && <InfoTip text={tip} presenter={presenter} />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: presenter ? 24 : 16, flexWrap: "wrap", justifyContent: "center" }}>
        <div ref={containerRef}><canvas ref={canvasRef} style={{ display: "block" }} /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 100 }}>
          {values.map((v, i) => v > 0 && (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: presenter ? 13 : 11, fontFamily: T.font }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: colors[i], flexShrink: 0 }} />
              <span style={{ color: T.textMuted }}>{labels[i]}</span>
              <span style={{ color: T.text, fontWeight: 600, marginLeft: "auto" }}>{v}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Risk Gauge ──────────────────────────────────────────────
function RiskGauge({ score, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.min(box.offsetWidth, presenter ? 320 : 260), h = w * 0.55;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h - 16, r = Math.min(cx - 20, cy - 8);
    if (r <= 0) return;
    const startA = Math.PI, endA = 2 * Math.PI;
    // Background arc
    ctx.beginPath(); ctx.arc(cx, cy, r, startA, endA);
    ctx.lineWidth = presenter ? 24 : 18; ctx.strokeStyle = T.burgundyMuted; ctx.lineCap = "round"; ctx.stroke();
    // Colored segments: green (1-3), amber (4-6), red (7-10)
    const segments = [
      { from: 0, to: 0.3, color: T.green },
      { from: 0.3, to: 0.6, color: T.amber },
      { from: 0.6, to: 1.0, color: T.red },
    ];
    segments.forEach(seg => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, startA + seg.from * Math.PI, startA + seg.to * Math.PI);
      ctx.lineWidth = presenter ? 24 : 18; ctx.strokeStyle = seg.color; ctx.lineCap = "butt"; ctx.stroke();
    });
    // Needle
    const pct = Math.max(0, Math.min(1, (score - 1) / 9));
    const needleAngle = startA + pct * Math.PI;
    const needleLen = r - (presenter ? 14 : 10);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + needleLen * Math.cos(needleAngle), cy + needleLen * Math.sin(needleAngle));
    ctx.strokeStyle = T.text; ctx.lineWidth = presenter ? 3 : 2; ctx.lineCap = "round"; ctx.stroke();
    // Center dot
    ctx.beginPath(); ctx.arc(cx, cy, presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.text; ctx.fill();
    // Labels
    ctx.font = `500 ${presenter ? 11 : 9}px DM Sans,sans-serif`; ctx.textAlign = "center";
    ctx.fillStyle = T.green; ctx.fillText("Scazut", cx - r + 20, cy + (presenter ? 18 : 14));
    ctx.fillStyle = T.amber; ctx.fillText("Mediu", cx, cy - r + (presenter ? 40 : 32));
    ctx.fillStyle = T.red; ctx.fillText("Ridicat", cx + r - 20, cy + (presenter ? 18 : 14));
  }, [score, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);

  const riskLabel = score <= 3.5 ? "Scazut" : score <= 6.5 ? "Mediu" : "Ridicat";
  const riskColor = score <= 3.5 ? T.green : score <= 6.5 ? T.amber : T.red;

  return (
    <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Scor de risc<InfoTip text="Calculat pe baza alocarii pe actiuni, obligatiuni, cash si expunerea pe piete emergente. Scor 1-10 (1 = foarte conservator, 10 = foarte agresiv)." presenter={presenter} />
      </div>
      <div ref={containerRef} style={{ display: "flex", justifyContent: "center" }}><canvas ref={canvasRef} style={{ display: "block" }} /></div>
      <div style={{ marginTop: 4 }}>
        <span style={{ fontSize: presenter ? 36 : 26, fontWeight: 700, color: riskColor, fontFamily: T.font }}>{score.toFixed(1)}</span>
        <span style={{ fontSize: presenter ? 16 : 13, color: riskColor, fontFamily: T.font, marginLeft: 6, fontWeight: 600 }}>{riskLabel}</span>
      </div>
    </div>
  );
}

// ─── Fee Drag Chart ──────────────────────────────────────────
function FeeDragChart({ data, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 300 : 220;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!data || data.length < 2) return;
    const pad = { top: 30, right: presenter ? 100 : 80, bottom: 40, left: presenter ? 70 : 56 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const maxVal = Math.max(...data.map(d => d.noFee)) * 1.1;
    const x = i => pad.left + (i / (data.length - 1)) * cw, y = v => pad.top + ch - (v / maxVal) * ch;
    // Grid
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.font = `${presenter ? 12 : 10}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) { const val = (i / 4) * maxVal, yy = y(val); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(w - pad.right, yy); ctx.stroke(); ctx.fillText(fmtK(val), pad.left - 8, yy + 4); }
    ctx.setLineDash([]); ctx.textAlign = "center"; ctx.fillStyle = T.textLight;
    data.forEach((d, i) => { const skip = data.length > 15 ? 5 : 2; if (d.year % skip === 0) ctx.fillText(`${d.year} ani`, x(i), h - pad.bottom + 18); });
    // Gap area
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.noFee)) : ctx.lineTo(x(i), y(d.noFee)));
    for (let i = data.length - 1; i >= 0; i--) ctx.lineTo(x(i), y(data[i].withFee));
    ctx.closePath(); ctx.fillStyle = "rgba(192,56,77,0.10)"; ctx.fill();
    // Lines
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.noFee)) : ctx.lineTo(x(i), y(d.noFee)));
    ctx.strokeStyle = T.green; ctx.lineWidth = presenter ? 3 : 2; ctx.stroke();
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.withFee)) : ctx.lineTo(x(i), y(d.withFee)));
    ctx.strokeStyle = T.red; ctx.lineWidth = presenter ? 3 : 2; ctx.setLineDash([6, 3]); ctx.stroke(); ctx.setLineDash([]);
    // End labels
    const last = data[data.length - 1], lx = x(data.length - 1);
    ctx.font = `600 ${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.textAlign = "left";
    ctx.fillStyle = T.green; ctx.fillText(fmtK(last.noFee), lx + 8, y(last.noFee) + 4);
    ctx.fillStyle = T.red; ctx.fillText(fmtK(last.withFee), lx + 8, y(last.withFee) + 4);
    // Legend
    const ly = pad.top - 12; ctx.font = `500 ${presenter ? 11 : 9}px DM Sans,sans-serif`;
    ctx.fillStyle = T.green; ctx.fillRect(pad.left, ly - 3, 12, 2.5); ctx.fillText("Fără comisioane", pad.left + 16, ly);
    ctx.fillStyle = T.red; ctx.setLineDash([4, 2]); ctx.strokeStyle = T.red; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad.left + 130, ly - 2); ctx.lineTo(pad.left + 142, ly - 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillText("Cu comisioane", pad.left + 146, ly);
  }, [data, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 6 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

// ─── Main Portfolio X-Ray ────────────────────────────────────
function PortfolioXRayTool({ presenter }) {
  const [preset, setPreset] = useState("echilibrat");
  const defaults = PRESETS.find(p => p.id === preset);
  const [alloc, setAlloc] = useState([defaults.stocks, defaults.bonds, defaults.cash, defaults.re, defaults.gold, defaults.crypto]);
  const [geo, setGeo] = useState([defaults.us, defaults.eu, defaults.em, defaults.other]);
  const [fee, setFee] = useState(defaults.fee);
  const [portfolioVal, setPortfolioVal] = useState(100000);
  const [returnRate, setReturnRate] = useState(8);
  const [allocMode, setAllocMode] = useState("pct"); // "pct" or "abs"
  const [allocAbs, setAllocAbs] = useState([45000, 20000, 10000, 10000, 10000, 5000]); // absolute values

  const applyPreset = (id) => {
    setPreset(id);
    const p = PRESETS.find(pr => pr.id === id);
    setAlloc([p.stocks, p.bonds, p.cash, p.re, p.gold, p.crypto]);
    setGeo([p.us, p.eu, p.em, p.other]);
    setFee(p.fee);
    // Sync absolute values
    setAllocAbs([p.stocks, p.bonds, p.cash, p.re, p.gold, p.crypto].map(pct => Math.round(portfolioVal * pct / 100)));
  };

  // Sync: when abs values change, update percentages
  const handleAbsChange = (idx, val) => {
    const newAbs = [...allocAbs];
    newAbs[idx] = val;
    setAllocAbs(newAbs);
    const total = newAbs.reduce((a, b) => a + b, 0);
    if (total > 0) {
      const newPcts = newAbs.map(v => Math.round(v / total * 100));
      // Fix rounding
      const sum = newPcts.reduce((a, b) => a + b, 0);
      if (sum !== 100 && newPcts.length > 0) {
        const maxIdx = newPcts.indexOf(Math.max(...newPcts));
        newPcts[maxIdx] += 100 - sum;
      }
      setAlloc(newPcts);
      setPortfolioVal(total);
    }
  };

  const gap = presenter ? 32 : 20;
  const [stocks, bonds, cash, re, gold, crypto] = alloc;
  const [us, eu, em, other] = geo;

  const riskScore = useMemo(() => computeRiskScore(stocks, bonds, cash, re, gold, crypto, em), [stocks, bonds, cash, re, gold, crypto, em]);
  const feeData = useMemo(() => computeFeeDrag(portfolioVal, returnRate, fee, 25), [portfolioVal, returnRate, fee]);
  const lastFee = feeData[feeData.length - 1];
  const feeLost = lastFee.noFee - lastFee.withFee;
  const feePctLost = lastFee.noFee > 0 ? (feeLost / lastFee.noFee) * 100 : 0;

  const allocColors = [T.green, T.blue, T.textMuted, T.amber, "#CFB53B", T.orange];
  const allocLabels = ["Acțiuni/ETF-uri", "Obligațiuni", "Cash", "Imobiliare", "Aur/Argint", "Crypto"];
  const allocIcons = ["\uD83D\uDCC8", "\uD83D\uDCDC", "\uD83C\uDFE6", "\uD83C\uDFE0", "\uD83E\uDD47", "\u20BF"];
  const allocTips = [
    "Acțiuni și ETF-uri (ex: VWCE, IWDA) = cea mai mare creștere pe termen lung, dar și cea mai mare volatilitate.",
    "Obligațiuni = venit stabil, risc mai mic. Ideale pentru stabilizarea portofoliului.",
    "Cash și depozite = siguranță maximă, dar erodat de inflație.",
    "Imobiliare = diversificare reală + protecție la inflație.",
    "Aur/Argint = adăpost tradițional în crize. Protecție împotriva inflației, fără randament (dividende).",
    "Crypto (Bitcoin, ETH etc.) = potențial ridicat, volatilitate extremă. Doar ce îți permiți să pierzi."
  ];
  const geoColors = ["#3B82F6", T.green, T.amber, T.textMuted];
  const geoLabels = ["SUA", "Europa", "Piete emergente", "Altele"];
  const geoIcons = ["\uD83C\uDDFA\uD83C\uDDF8", "\uD83C\uDDEA\uD83C\uDDFA", "\uD83C\uDF0D", "\uD83C\uDF10"];
  const geoTips = [
    "SUA = cea mai mare piata de capital din lume (~60% din MSCI World).",
    "Europa = piete dezvoltate, expunere EUR directa.",
    "Piete emergente = potential de crestere mai mare, risc mai mare.",
    "Altele = Japonia, Australia, Canada, etc."
  ];

  return (
    <div>
      {/* Headline */}
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left" }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: presenter ? 36 : 24, fontWeight: 400, color: T.burgundy, margin: 0, lineHeight: 1.15 }}>
          Știi ce fac banii tăi<span style={{ color: T.amber }}> în spatele scenei?</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: presenter ? 15 : 13, color: T.textMuted, margin: "8px 0 0 0", lineHeight: 1.5, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start", flexWrap: "wrap" }}>
          Analizează alocarea, riscul și costul real al portofoliului tău.
          <InfoTip text="Portfolio X-Ray iti arata structura reala a portofoliului: unde sunt banii, cat risc iti asumi si cat te costa comisioanele pe termen lung." presenter={presenter} />
        </p>
      </div>

      {/* Preset buttons */}
      <div style={{ marginBottom: gap, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: presenter ? "center" : "flex-start" }}>
        {PRESETS.map(p => (
          <button key={p.id} onClick={() => applyPreset(p.id)}
            style={{ padding: presenter ? "10px 20px" : "8px 16px", background: preset === p.id ? T.burgundy : T.white, color: preset === p.id ? "#fff" : T.textMuted, border: `1px solid ${preset === p.id ? T.burgundy : T.border}`, borderRadius: T.radiusSm, cursor: "pointer", fontSize: presenter ? 13 : 11, fontFamily: T.font, fontWeight: preset === p.id ? 600 : 500, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>

      {/* Two-column */}
      <div className="m-tool-layout" style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {/* Left: Inputs */}
        <div style={{ flex: presenter ? "0 0 380px" : "0 0 320px", minWidth: 280, display: "flex", flexDirection: "column", gap }}>
          {/* Portfolio value */}
          <div style={{ padding: presenter ? "28px" : "20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <SectionLabel tip="Valoarea totala a portofoliului si randamentul asteptat." presenter={presenter}>Portofoliu</SectionLabel>
            <Slider label="Valoare portofoliu" value={portfolioVal} onChange={setPortfolioVal} min={5000} max={1000000} step={5000} formatValue={fmt} presenter={presenter} tip="Valoarea totala a investitiilor tale." />
            <Slider label="Randament anual estimat" value={returnRate} onChange={setReturnRate} min={3} max={15} step={0.5} suffix="%" presenter={presenter} tip="Randamentul brut inainte de comisioane." />
            <Slider label="Comision anual (TER)" value={fee} onChange={setFee} min={0} max={3} step={0.1} suffix="%" presenter={presenter} tip="Total Expense Ratio = costul total anual al fondurilor. ETF-uri: 0.1-0.3%. Fonduri active: 1-2.5%." />
          </div>
          {/* Asset allocation */}
          <div style={{ padding: presenter ? "28px" : "20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: presenter ? 24 : 16 }}>
              <SectionLabel tip="Cum sunt împărțiți banii între clase de active." presenter={presenter}>Alocare pe active</SectionLabel>
              <ModeToggle mode={allocMode} onMode={setAllocMode} options={[
                { id: "pct", icon: "%", label: "Procente" },
                { id: "abs", icon: "€", label: "Valoare" },
              ]} presenter={presenter} />
            </div>
            {allocMode === "pct" ? (
              <AllocSliders values={alloc} labels={allocLabels} colors={allocColors} icons={allocIcons} tips={allocTips} onChange={setAlloc} presenter={presenter} />
            ) : (
              <div>
                {allocLabels.map((label, i) => (
                  <Slider key={i} label={`${allocIcons[i]} ${label}`} value={allocAbs[i]} onChange={v => handleAbsChange(i, v)} min={0} max={1000000} step={1000} formatValue={fmt} presenter={presenter} tip={allocTips[i]} />
                ))}
                <div style={{ textAlign: "right", fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 500, marginTop: 4 }}>
                  Total: <strong style={{ color: T.burgundy }}>{fmt(allocAbs.reduce((a, b) => a + b, 0))}</strong>
                </div>
              </div>
            )}
          </div>
          {/* Geographic diversification */}
          <div style={{ padding: presenter ? "28px" : "20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <SectionLabel tip="Distributia geografica a investitiilor. Diversificarea reduce riscul." presenter={presenter}>Diversificare geografică</SectionLabel>
            <AllocSliders values={geo} labels={geoLabels} colors={geoColors} icons={geoIcons} tips={geoTips} onChange={setGeo} presenter={presenter} />
          </div>
        </div>

        {/* Right: Analysis */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap }}>
          {/* Risk Score */}
          <RiskGauge score={riskScore} presenter={presenter} />

          {/* Two donut charts side by side */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <DonutChart values={alloc} labels={allocLabels} colors={allocColors} title="Alocare active" tip="Distributia portofoliului pe clase de active." presenter={presenter} />
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <DonutChart values={geo} labels={geoLabels} colors={geoColors} title="Diversificare geo" tip="Distributia geografica a investitiilor." presenter={presenter} />
            </div>
          </div>

          {/* Fee Drag */}
          <div style={{ padding: presenter ? "24px 28px" : "18px 22px", background: T.redFaint, borderRadius: T.radius, border: `1px solid ${T.redMuted}`, textAlign: presenter ? "center" : "left" }}>
            <div style={{ fontSize: presenter ? 14 : 11, fontWeight: 600, color: T.red, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start" }}>
              Comisioanele te costă în 25 ani
              <InfoTip text={`Un comision de ${fee}%/an pare mic, dar pe 25 de ani inseamna ${fmtK(feeLost)} pierduti din portofoliul tau. Asta e ${Math.round(feePctLost)}% din cresterea potentiala.`} presenter={presenter} />
            </div>
            <div style={{ fontSize: presenter ? 48 : 32, fontWeight: 700, color: T.red, fontFamily: T.font, lineHeight: 1 }}>{fmt(feeLost)}</div>
            <div style={{ display: "flex", gap: presenter ? 16 : 10, marginTop: 12, flexWrap: "wrap", justifyContent: presenter ? "center" : "flex-start" }}>
              <Pill value={`${Math.round(feePctLost)}%`} label="din crestere pierdut" color={T.red} presenter={presenter} tip={`Din cresterea totala potentiala, ${Math.round(feePctLost)}% se duce pe comisioane.`} />
              <Pill value={fmt(Math.round(feeLost / 25 / 12))} label="/ luna in comisioane" color={T.red} presenter={presenter} tip={`Media lunara pierduta pe comisioane: ${fmt(Math.round(feeLost / 25 / 12))}.`} />
            </div>
          </div>

          {/* Fee chart */}
          <div style={{ padding: presenter ? "20px 24px 16px" : "16px 20px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Impactul comisioanelor in timp
              <InfoTip text="Verde = fara comisioane. Rosu = cu comisioane. Zona rosie = bani pierduti pe comisioane cumulate." presenter={presenter} />
            </div>
            <FeeDragChart data={feeData} presenter={presenter} />
          </div>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatCard label="Fără comisioane" value={fmtK(lastFee.noFee)} color={T.green} bgColor={T.greenFaint} presenter={presenter} icon={"\u2728"} sub={`${returnRate}% randament, 25 ani`} tip="Ce ai avea daca nu platesti comisioane." />
            <StatCard label={`Cu ${fee}% comision`} value={fmtK(lastFee.withFee)} color={T.red} bgColor={T.redFaint} presenter={presenter} icon={"\uD83D\uDCB8"} sub={`${(returnRate - fee).toFixed(1)}% randament net`} tip="Ce ai efectiv dupa comisioane." />
          </div>

          {/* Insight */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 15 : 13, color: T.text, fontFamily: T.font, lineHeight: 1.6 }}>
              {presenter ? (
                <><strong style={{ color: T.burgundy }}>Comisioanele sunt inamicul invizibil.</strong> Un {fee}% pe an pare nesemnificativ, dar in 25 de ani inseamna <strong style={{ color: T.red }}>{fmtK(feeLost)}</strong> pierduti ({Math.round(feePctLost)}% din crestere). Asta e <strong style={{ color: T.red }}>{fmt(Math.round(feeLost / 25 / 12))}/luna</strong> in comisioane. Cu cat scazi comisioanele, cu atat mai mult lucreaza compunerea pentru tine.</>
              ) : (
                <><strong>Comision de {fee}% = {fmtK(feeLost)} pierduti in 25 ani.</strong> ETF-uri cu TER sub 0.3% vs fonduri active de 1.5%+ fac o diferenta de sute de mii de euro pe termen lung.</>
              )}
            </div>
          </div>
        </div>
      </div>
      <CTA presenter={presenter} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 5: COSTURI FONDURI MUTUALE
// ═══════════════════════════════════════════════════════════════

function computeFundComparison(investment, monthlyAdd, returnRate, years, fundTER, fundEntry, fundExit, etfTER) {
  const mr = returnRate / 100 / 12;
  // Fund scenario: entry fee upfront, TER annually, exit fee at end
  let fundVal = investment * (1 - fundEntry / 100);
  let etfVal = investment; // ETFs typically no entry fee
  let totalInvested = investment;
  const pts = [{ year: 0, fund: Math.round(fundVal), etf: Math.round(etfVal) }];
  for (let m = 1; m <= years * 12; m++) {
    // Monthly growth minus monthly TER portion
    fundVal = fundVal * (1 + mr - fundTER / 100 / 12) + monthlyAdd * (1 - fundEntry / 100);
    etfVal = etfVal * (1 + mr - etfTER / 100 / 12) + monthlyAdd;
    totalInvested += monthlyAdd;
    if (m % 12 === 0) pts.push({ year: m / 12, fund: Math.round(fundVal), etf: Math.round(etfVal) });
  }
  // Apply exit fee to fund
  const fundFinal = fundVal * (1 - fundExit / 100);
  const etfFinal = etfVal;
  return {
    chartData: pts,
    fundFinal: Math.round(fundFinal),
    etfFinal: Math.round(etfFinal),
    difference: Math.round(etfFinal - fundFinal),
    totalInvested: Math.round(totalInvested),
    fundTotalFees: Math.round(etfFinal - fundFinal),
  };
}

function FundComparisonChart({ data, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 340 : 260;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!data || data.length < 2) return;
    const pad = { top: 30, right: presenter ? 100 : 80, bottom: 40, left: presenter ? 70 : 56 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const maxVal = Math.max(...data.map(d => Math.max(d.etf, d.fund))) * 1.1;
    const x = i => pad.left + (i / (data.length - 1)) * cw, y = v => pad.top + ch - (v / maxVal) * ch;
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.font = `${presenter ? 12 : 10}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) { const val = (i / 4) * maxVal, yy = y(val); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(w - pad.right, yy); ctx.stroke(); ctx.fillText(fmtK(val), pad.left - 8, yy + 4); }
    ctx.setLineDash([]); ctx.textAlign = "center"; ctx.fillStyle = T.textLight;
    data.forEach((d, i) => { const skip = data.length > 15 ? 5 : 2; if (d.year % skip === 0) ctx.fillText(`${d.year} ani`, x(i), h - pad.bottom + 18); });
    // Gap area
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.etf)) : ctx.lineTo(x(i), y(d.etf)));
    for (let i = data.length - 1; i >= 0; i--) ctx.lineTo(x(i), y(data[i].fund)); ctx.closePath(); ctx.fillStyle = "rgba(192,56,77,0.10)"; ctx.fill();
    // Fund line (red dashed)
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.fund)) : ctx.lineTo(x(i), y(d.fund)));
    ctx.strokeStyle = T.red; ctx.lineWidth = presenter ? 3 : 2; ctx.setLineDash([6, 3]); ctx.stroke(); ctx.setLineDash([]);
    // ETF line (green solid)
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.etf)) : ctx.lineTo(x(i), y(d.etf)));
    ctx.strokeStyle = T.green; ctx.lineWidth = presenter ? 3.5 : 2.5; ctx.stroke();
    // End labels
    const last = data[data.length - 1], lx = x(data.length - 1);
    ctx.beginPath(); ctx.arc(lx, y(last.etf), presenter ? 5 : 4, 0, Math.PI * 2); ctx.fillStyle = T.green; ctx.fill();
    ctx.beginPath(); ctx.arc(lx, y(last.fund), presenter ? 5 : 4, 0, Math.PI * 2); ctx.fillStyle = T.red; ctx.fill();
    ctx.font = `600 ${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.textAlign = "left";
    ctx.fillStyle = T.green; ctx.fillText(fmtK(last.etf), lx + 8, y(last.etf) + 4);
    ctx.fillStyle = T.red; ctx.fillText(fmtK(last.fund), lx + 8, y(last.fund) + 4);
    // Legend
    const ly = pad.top - 12; ctx.font = `500 ${presenter ? 11 : 9}px DM Sans,sans-serif`;
    ctx.fillStyle = T.green; ctx.fillRect(pad.left, ly - 3, 12, 2.5); ctx.fillText("ETF", pad.left + 16, ly);
    ctx.fillStyle = T.red; ctx.setLineDash([4, 2]); ctx.strokeStyle = T.red; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad.left + 50, ly - 2); ctx.lineTo(pad.left + 62, ly - 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillText("Fond activ", pad.left + 66, ly);
  }, [data, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 6 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function FonduriMutualeTool({ presenter }) {
  const [investment, setInvestment] = useState(50000);
  const [monthlyAdd, setMonthlyAdd] = useState(500);
  const [returnRate, setReturnRate] = useState(8);
  const [years, setYears] = useState(25);
  const [fundTER, setFundTER] = useState(2.0);
  const [fundEntry, setFundEntry] = useState(3.0);
  const [fundExit, setFundExit] = useState(1.0);
  const [etfTER, setEtfTER] = useState(0.2);
  const gap = presenter ? 32 : 20;

  const result = useMemo(() => computeFundComparison(investment, monthlyAdd, returnRate, years, fundTER, fundEntry, fundExit, etfTER), [investment, monthlyAdd, returnRate, years, fundTER, fundEntry, fundExit, etfTER]);
  const { chartData, fundFinal, etfFinal, difference, totalInvested } = result;
  const dailyLoss = Math.round(difference / (years * 365));
  const pctLost = etfFinal > 0 ? (difference / etfFinal * 100) : 0;
  // Cost breakdown
  const entryFeeTotal = Math.round((investment + monthlyAdd * years * 12) * fundEntry / 100);
  const exitFeeTotal = Math.round(fundFinal * fundExit / 100 / (1 - fundExit / 100));
  const terDiff = difference - entryFeeTotal - exitFeeTotal;

  return (
    <div>
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left" }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: presenter ? 36 : 24, fontWeight: 400, color: T.burgundy, margin: 0, lineHeight: 1.15 }}>
          Știi cât plătești de fapt<span style={{ color: T.amber }}> pentru fondurile tale?</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: presenter ? 15 : 13, color: T.textMuted, margin: "8px 0 0 0", lineHeight: 1.5, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start", flexWrap: "wrap" }}>
          Compară costul real al unui fond activ vs un ETF echivalent.
          <InfoTip text="Fondurile active au 3 tipuri de comisioane: de administrare (TER), de intrare si de iesire. ETF-urile au doar TER, de obicei 5-10x mai mic." presenter={presenter} />
        </p>
      </div>
      <div className="m-tool-layout" style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {/* Left: Inputs */}
        <div style={{ flex: presenter ? "0 0 380px" : "0 0 320px", minWidth: 280, display: "flex", flexDirection: "column", gap }}>
          <div style={{ padding: presenter ? "28px" : "20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <SectionLabel tip="Parametrii investitiei tale." presenter={presenter}>Investitia ta</SectionLabel>
            <Slider label="Sumă inițială" value={investment} onChange={setInvestment} min={1000} max={500000} step={1000} formatValue={fmt} presenter={presenter} tip="Cat investesti la inceput." />
            <Slider label="Adaugi lunar" value={monthlyAdd} onChange={setMonthlyAdd} min={0} max={5000} step={50} formatValue={fmt} presenter={presenter} tip="Cat adaugi in fiecare luna." />
            <Slider label="Randament brut anual" value={returnRate} onChange={setReturnRate} min={3} max={15} step={0.5} suffix="%" presenter={presenter} tip="Randamentul pietei inainte de comisioane. Ambele produse investesc in aceeasi piata." />
            <Slider label="Orizont de timp" value={years} onChange={setYears} min={5} max={40} step={1} suffix=" ani" presenter={presenter} />
          </div>
          <div style={{ padding: presenter ? "28px" : "20px", background: T.redFaint, borderRadius: T.radius, border: `1px solid ${T.redMuted}` }}>
            <SectionLabel tip="Comisioanele tipice pentru fonduri active din Romania: TER 1.5-3%, intrare 1-5%, iesire 0-2%." presenter={presenter}>{"\uD83C\uDFE6"} Fond activ</SectionLabel>
            <Slider label="Comision administrare (TER)" value={fundTER} onChange={setFundTER} min={0.5} max={4} step={0.1} suffix="%" presenter={presenter} tip="Total Expense Ratio = costul anual platit din fond. Fondul activ tipic romanesc: 1.5-3%." />
            <Slider label="Comision de intrare" value={fundEntry} onChange={setFundEntry} min={0} max={5} step={0.5} suffix="%" presenter={presenter} tip="Platit la fiecare suma investita. 3% intrare = din €1000 doar €970 ajung investiti." />
            <Slider label="Comision de ieșire" value={fundExit} onChange={setFundExit} min={0} max={3} step={0.5} suffix="%" presenter={presenter} tip="Platit cand scoti banii. Se aplica la valoarea finala." />
          </div>
          <div style={{ padding: presenter ? "28px" : "20px", background: T.greenFaint, borderRadius: T.radius, border: `1px solid ${T.greenMuted}` }}>
            <SectionLabel tip="ETF-urile au doar TER, fara comision de intrare sau iesire." presenter={presenter}>{"\u2728"} ETF echivalent</SectionLabel>
            <Slider label="Comision administrare (TER)" value={etfTER} onChange={setEtfTER} min={0.05} max={1} step={0.05} suffix="%" presenter={presenter} tip="ETF-uri globale populare: VWCE 0.22%, iShares MSCI World 0.20%." />
            <div style={{ fontSize: presenter ? 12 : 10, color: T.green, fontFamily: T.font, fontWeight: 500, padding: "8px 0" }}>Comision intrare: 0% &middot; Comision iesire: 0%</div>
          </div>
        </div>
        {/* Right: Results */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap }}>
          {/* Big red cost */}
          <div style={{ padding: presenter ? "28px 32px" : "20px 24px", background: T.redFaint, borderRadius: T.radius, border: `1px solid ${T.redMuted}`, textAlign: presenter ? "center" : "left" }}>
            <div style={{ fontSize: presenter ? 14 : 11, fontWeight: 600, color: T.red, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start" }}>
              Plătești în plus cu fondul activ
              <InfoTip text={`Diferenta totala dintre ETF si fond activ pe ${years} ani. Bani care ies din buzunarul tau in comisioane.`} presenter={presenter} />
            </div>
            <div style={{ fontSize: presenter ? 52 : 36, fontWeight: 700, color: T.red, fontFamily: T.font, lineHeight: 1 }}>{fmt(difference)}</div>
            <div style={{ display: "flex", gap: presenter ? 16 : 10, marginTop: 14, flexWrap: "wrap", justifyContent: presenter ? "center" : "flex-start" }}>
              <Pill value={fmt(dailyLoss)} label="/ zi pierdut in comisioane" color={T.red} presenter={presenter} />
              <Pill value={`${Math.round(pctLost)}%`} label="din randament mancat" color={T.red} presenter={presenter} />
            </div>
          </div>
          {/* Side by side */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatCard label="ETF" value={fmtK(etfFinal)} color={T.green} bgColor={T.greenFaint} presenter={presenter} icon={"\u2728"} sub={`TER ${etfTER}%, fara alte costuri`} tip="Valoarea finala cu ETF low-cost." />
            <StatCard label="Fond activ" value={fmtK(fundFinal)} color={T.red} bgColor={T.redFaint} presenter={presenter} icon={"\uD83C\uDFE6"} sub={`TER ${fundTER}% + intrare ${fundEntry}% + iesire ${fundExit}%`} tip="Valoarea finala dupa toate comisioanele fondului." />
          </div>
          {/* Cost breakdown */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Unde se duc banii<InfoTip text="Defalcarea comisioanelor pe categorii." presenter={presenter} />
            </div>
            {[
              { label: "Comision administrare (TER)", value: Math.max(0, terDiff), tip: `Diferenta de TER: ${fundTER}% vs ${etfTER}% = ${(fundTER - etfTER).toFixed(1)}%/an. Pe ${years} ani, acumulat cu dobanda compusa.`, color: T.red, icon: "\uD83D\uDCCA" },
              { label: "Comision de intrare", value: entryFeeTotal, tip: `${fundEntry}% din fiecare suma investita. Pe total: ~${fmtK(entryFeeTotal)}.`, color: T.orange, icon: "\uD83D\uDEAA" },
              { label: "Comision de ieșire", value: exitFeeTotal, tip: `${fundExit}% aplicat la valoarea finala.`, color: T.amber, icon: "\uD83D\uDEB6" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: presenter ? 18 : 14, marginRight: 10 }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: presenter ? 14 : 12, color: T.text, fontFamily: T.font, display: "flex", alignItems: "center" }}>{item.label}<InfoTip text={item.tip} presenter={presenter} /></span>
                <span style={{ fontSize: presenter ? 18 : 14, fontWeight: 700, color: item.color, fontFamily: T.font }}>{fmtK(Math.max(0, item.value))}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", padding: "12px 0 0", marginTop: 4 }}>
              <span style={{ flex: 1, fontSize: presenter ? 15 : 13, fontWeight: 700, color: T.text, fontFamily: T.font }}>Total costuri in plus</span>
              <span style={{ fontSize: presenter ? 22 : 17, fontWeight: 700, color: T.red, fontFamily: T.font }}>{fmtK(difference)}</span>
            </div>
          </div>
          {/* Chart */}
          <div style={{ padding: presenter ? "20px 24px 16px" : "16px 20px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              ETF vs Fond activ in timp<InfoTip text="Verde = ETF. Rosu = fond activ. Zona rosie = bani pierduti pe comisioane cumulate." presenter={presenter} />
            </div>
            <FundComparisonChart data={chartData} presenter={presenter} />
          </div>
          {/* Insight */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 15 : 13, color: T.text, fontFamily: T.font, lineHeight: 1.6 }}>
              {presenter ? (
                <><strong style={{ color: T.burgundy }}>Comisioanele sunt cel mai mare dusman al investitorului.</strong> Un fond cu TER {fundTER}% + {fundEntry}% intrare costa cu <strong style={{ color: T.red }}>{fmtK(difference)}</strong> mai mult decat un ETF cu {etfTER}% TER pe {years} ani. Asta inseamna <strong style={{ color: T.red }}>{fmt(dailyLoss)}/zi</strong> care ies din buzunarul tau. Aceeasi piata. Aceeasi expunere. Cost diferit.</>
              ) : (
                <><strong>Aceeasi piata, cost diferit:</strong> Fond activ cu {fundTER}% TER vs ETF cu {etfTER}% = <strong style={{ color: T.red }}>{fmtK(difference)}</strong> pierduti in {years} ani. Verifica comisioanele investitiilor tale.</>
              )}
            </div>
          </div>
        </div>
      </div>
      <CTA presenter={presenter} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 6: AVANTAJUL LT WEALTH (BEHAVIORAL ALPHA)
// ═══════════════════════════════════════════════════════════════

function computeAlpha(portfolioVal, monthlyAdd, baseReturn, alphaBoost, years) {
  const mr1 = baseReturn / 100 / 12, mr2 = (baseReturn + alphaBoost) / 100 / 12;
  let base = portfolioVal, boosted = portfolioVal;
  const pts = [{ year: 0, base: portfolioVal, boosted: portfolioVal }];
  for (let m = 1; m <= years * 12; m++) {
    base = base * (1 + mr1) + monthlyAdd;
    boosted = boosted * (1 + mr2) + monthlyAdd;
    if (m % 12 === 0) pts.push({ year: m / 12, base: Math.round(base), boosted: Math.round(boosted) });
  }
  return pts;
}

function AlphaChart({ data, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 380 : 280;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!data || data.length < 2) return;
    const pad = { top: 30, right: presenter ? 110 : 90, bottom: 40, left: presenter ? 70 : 56 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const maxVal = Math.max(...data.map(d => d.boosted)) * 1.12;
    const x = i => pad.left + (i / (data.length - 1)) * cw, y = v => pad.top + ch - (v / maxVal) * ch;
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.font = `${presenter ? 12 : 10}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) { const val = (i / 5) * maxVal, yy = y(val); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(w - pad.right, yy); ctx.stroke(); ctx.fillText(fmtK(val), pad.left - 8, yy + 4); }
    ctx.setLineDash([]); ctx.textAlign = "center"; ctx.fillStyle = T.textLight;
    data.forEach((d, i) => { const skip = data.length > 15 ? 5 : data.length > 8 ? 2 : 1; if (d.year % skip === 0) ctx.fillText(d.year === 0 ? "Azi" : `${d.year} ani`, x(i), h - pad.bottom + 18); });
    // Gap area (green = alpha advantage)
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.boosted)) : ctx.lineTo(x(i), y(d.boosted)));
    for (let i = data.length - 1; i >= 0; i--) ctx.lineTo(x(i), y(data[i].base)); ctx.closePath(); ctx.fillStyle = "rgba(47,140,94,0.12)"; ctx.fill();
    // Base line
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.base)) : ctx.lineTo(x(i), y(d.base)));
    ctx.strokeStyle = T.textMuted; ctx.lineWidth = presenter ? 2.5 : 2; ctx.setLineDash([6, 3]); ctx.stroke(); ctx.setLineDash([]);
    // Boosted line
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.boosted)) : ctx.lineTo(x(i), y(d.boosted)));
    ctx.strokeStyle = T.green; ctx.lineWidth = presenter ? 3.5 : 2.5; ctx.stroke();
    // End dots + labels
    const last = data[data.length - 1], lx = x(data.length - 1);
    ctx.beginPath(); ctx.arc(lx, y(last.boosted), presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.green; ctx.fill();
    ctx.beginPath(); ctx.arc(lx, y(last.base), presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.textMuted; ctx.fill();
    ctx.font = `600 ${presenter ? 14 : 12}px DM Sans,sans-serif`; ctx.textAlign = "left";
    ctx.fillStyle = T.green; ctx.fillText(fmtK(last.boosted), lx + 10, y(last.boosted) + 5);
    ctx.fillStyle = T.textMuted; ctx.fillText(fmtK(last.base), lx + 10, y(last.base) + 5);
    // Bracket for alpha gap
    const bx = lx - 20;
    ctx.strokeStyle = T.green; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(bx, y(last.boosted) + 6); ctx.lineTo(bx, y(last.base) - 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx - 4, y(last.boosted) + 6); ctx.lineTo(bx, y(last.boosted) + 2); ctx.lineTo(bx + 4, y(last.boosted) + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx - 4, y(last.base) - 6); ctx.lineTo(bx, y(last.base) - 2); ctx.lineTo(bx + 4, y(last.base) - 6); ctx.stroke();
    ctx.font = `700 ${presenter ? 12 : 10}px DM Sans,sans-serif`; ctx.fillStyle = T.green; ctx.textAlign = "right";
    ctx.fillText(`+${fmtK(last.boosted - last.base)}`, bx - 8, (y(last.boosted) + y(last.base)) / 2 + 4);
    // Legend
    const ly = pad.top - 12; ctx.font = `500 ${presenter ? 11 : 9}px DM Sans,sans-serif`;
    ctx.fillStyle = T.green; ctx.fillRect(pad.left, ly - 3, 12, 2.5); ctx.fillText("Cu consultant", pad.left + 16, ly);
    ctx.fillStyle = T.textMuted; ctx.setLineDash([4, 2]); ctx.strokeStyle = T.textMuted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad.left + 120, ly - 2); ctx.lineTo(pad.left + 132, ly - 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillText("Fără strategie", pad.left + 136, ly);
  }, [data, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 6 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function BehavioralAlphaTool({ presenter }) {
  const [portfolioVal, setPortfolioVal] = useState(100000);
  const [monthlyAdd, setMonthlyAdd] = useState(1000);
  const [baseReturn, setBaseReturn] = useState(6);
  const [years, setYears] = useState(25);
  const alphaBoost = 3; // fixed 3%
  const gap = presenter ? 32 : 20;

  const data = useMemo(() => computeAlpha(portfolioVal, monthlyAdd, baseReturn, alphaBoost, years), [portfolioVal, monthlyAdd, baseReturn, years]);
  const last = data[data.length - 1];
  const alphaDiff = last.boosted - last.base;
  const dailyAlpha = Math.round(alphaDiff / (years * 365));
  const multiplierBase = last.base / Math.max(1, portfolioVal + monthlyAdd * years * 12);
  const multiplierBoosted = last.boosted / Math.max(1, portfolioVal + monthlyAdd * years * 12);

  // Behavioral alpha sources (illustrative breakdown)
  const sources = [
    { icon: "\uD83E\uDDE0", label: "Disciplină comportamentală", desc: "Nu vinzi în panică, nu cumperi din FOMO", pct: "~1.5%", tip: "Studiile arata ca investitorii individuali pierd 1-2%/an prin decizii emotionale: panic selling, performance chasing, timing the market." },
    { icon: "\uD83D\uDCCA", label: "Rebalansare sistematică", desc: "Portofoliul ramane aliniat cu obiectivele", pct: "~0.5%", tip: "Rebalansarea regulata (cumparare ieftin, vanzare scump automat) adauga ~0.3-0.7% anual." },
    { icon: "\uD83D\uDCB0", label: "Optimizare fiscală", desc: "Structură eficientă din punct de vedere fiscal", pct: "~0.5%", tip: "Strategie de reinvestire a dividendelor, alegerea instrumentelor cu impozitare avantajoasa." },
    { icon: "\uD83C\uDFAF", label: "Alocare optimizată", desc: "Asset allocation ajustat pe profil si obiective", pct: "~0.5%", tip: "Portofoliu construit pe baza profilului de risc, orizontului si obiectivelor, nu pe baza stirilor zilei." },
  ];

  return (
    <div>
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left" }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: presenter ? 36 : 24, fontWeight: 400, color: T.burgundy, margin: 0, lineHeight: 1.15 }}>
          Ce diferență fac<span style={{ color: T.amber }}> +3% pe an?</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: presenter ? 15 : 13, color: T.textMuted, margin: "8px 0 0 0", lineHeight: 1.5, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start", flexWrap: "wrap" }}>
          Strategia Minimalistu aduce in medie +3% la randamentul anual prin disciplina comportamentala.
          <InfoTip text="Studiile Vanguard (Advisor's Alpha) si Morningstar (Gamma) arata ca un advisor bun adauga 1.5-3% pe an, in principal prin prevenirea erorilor comportamentale: panic selling, performance chasing, timing." presenter={presenter} />
        </p>
      </div>

      <div className="m-tool-layout" style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {/* Left: Inputs */}
        <div style={{ flex: presenter ? "0 0 380px" : "0 0 320px", minWidth: 280, display: "flex", flexDirection: "column", gap }}>
          <div style={{ padding: presenter ? "28px" : "20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <SectionLabel tip="Introdu situatia ta actuala." presenter={presenter}>Situația ta</SectionLabel>
            <Slider label="Portofoliu actual" value={portfolioVal} onChange={setPortfolioVal} min={5000} max={1000000} step={5000} formatValue={fmt} presenter={presenter} tip="Valoarea totala a investitiilor tale acum." />
            <Slider label="Investești lunar" value={monthlyAdd} onChange={setMonthlyAdd} min={0} max={10000} step={100} formatValue={fmt} presenter={presenter} tip="Cat adaugi in fiecare luna." />
            <Slider label="Randament actual estimat" value={baseReturn} onChange={setBaseReturn} min={2} max={12} step={0.5} suffix="%" presenter={presenter} tip="Randamentul pe care il obtii acum. Un investitor tipic fara strategie obtine 4-6% net." />
            <Slider label="Orizont de timp" value={years} onChange={setYears} min={5} max={40} step={1} suffix=" ani" presenter={presenter} />
          </div>

          {/* Alpha sources breakdown */}
          <div style={{ padding: presenter ? "28px" : "20px", background: T.greenFaint, borderRadius: T.radius, border: `1px solid ${T.greenMuted}` }}>
            <SectionLabel tip="De unde vin cele +3%: nu din randament magic, ci din evitarea greselilor." presenter={presenter}>{"\uD83C\uDFC6"} De unde vin +3%</SectionLabel>
            {sources.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", padding: "10px 0", borderBottom: i < sources.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: presenter ? 20 : 16, marginRight: 10, flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: presenter ? 14 : 12, fontWeight: 600, color: T.text, fontFamily: T.font, display: "flex", alignItems: "center" }}>{s.label}<InfoTip text={s.tip} presenter={presenter} /></div>
                  <div style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, fontFamily: T.font }}>{s.desc}</div>
                </div>
                <span style={{ fontSize: presenter ? 16 : 13, fontWeight: 700, color: T.green, fontFamily: T.font, flexShrink: 0, marginLeft: 8 }}>{s.pct}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", padding: "12px 0 0", marginTop: 4, borderTop: `2px solid ${T.green}` }}>
              <span style={{ flex: 1, fontSize: presenter ? 15 : 13, fontWeight: 700, color: T.text, fontFamily: T.font }}>Total avantaj anual</span>
              <span style={{ fontSize: presenter ? 22 : 17, fontWeight: 700, color: T.green, fontFamily: T.font }}>~+3%</span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap }}>
          {/* Big green alpha number */}
          <div style={{ padding: presenter ? "28px 32px" : "20px 24px", background: T.greenFaint, borderRadius: T.radius, border: `1px solid ${T.greenMuted}`, textAlign: presenter ? "center" : "left" }}>
            <div style={{ fontSize: presenter ? 14 : 11, fontWeight: 600, color: T.green, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start" }}>
              Diferența Minimalistu in {years} ani
              <InfoTip text={`+3% pe an transformat pe ${years} ani, cu compunerea, inseamna ${fmtK(alphaDiff)} in plus.`} presenter={presenter} />
            </div>
            <div style={{ fontSize: presenter ? 52 : 36, fontWeight: 700, color: T.green, fontFamily: T.font, lineHeight: 1 }}>+{fmt(alphaDiff)}</div>
            <div style={{ display: "flex", gap: presenter ? 16 : 10, marginTop: 14, flexWrap: "wrap", justifyContent: presenter ? "center" : "flex-start" }}>
              <Pill value={`+${fmt(dailyAlpha)}`} label="/ zi in plus" color={T.green} presenter={presenter} tip={`Fiecare zi cu strategia Minimalistu aduce in medie +${fmt(dailyAlpha)} in plus fata de un investitor tipic.`} />
              <Pill value={`${baseReturn}% \u2192 ${baseReturn + alphaBoost}%`} label="randament annual" color={T.green} presenter={presenter} />
            </div>
          </div>

          {/* Side by side */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatCard label="Fără strategie" value={fmtK(last.base)} color={T.textMuted} bgColor={T.white} presenter={presenter} icon={"\uD83D\uDC64"} sub={`${baseReturn}%/an \u00B7 ${multiplierBase.toFixed(1)}x`} tip="Randamentul unui investitor tipic fara disciplina si strategie." />
            <StatCard label="Cu consultant" value={fmtK(last.boosted)} color={T.green} bgColor={T.greenFaint} presenter={presenter} icon={"\uD83C\uDFC6"} sub={`${baseReturn + alphaBoost}%/an \u00B7 ${multiplierBoosted.toFixed(1)}x`} tip="Randamentul cu strategia comportamentala Minimalistu." />
          </div>

          {/* Chart */}
          <div style={{ padding: presenter ? "20px 24px 16px" : "16px 20px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Impactul +3% pe termen lung<InfoTip text="Verde = cu Minimalistu. Gri = fara strategie. Zona verde = diferenta din disciplina comportamentala." presenter={presenter} />
            </div>
            <AlphaChart data={data} presenter={presenter} />
          </div>

          {/* Multiplier comparison */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: presenter ? 24 : 16, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Fără strategie</div>
              <div style={{ fontSize: presenter ? 36 : 26, fontWeight: 700, color: T.textMuted, fontFamily: T.font }}>{multiplierBase.toFixed(1)}x</div>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.textMuted, fontFamily: T.font }}>multiplicator</div>
            </div>
            <div style={{ fontSize: presenter ? 28 : 20, color: T.green, fontWeight: 700 }}>&rarr;</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.green, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Cu consultant</div>
              <div style={{ fontSize: presenter ? 36 : 26, fontWeight: 700, color: T.green, fontFamily: T.font }}>{multiplierBoosted.toFixed(1)}x</div>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.green, fontFamily: T.font }}>multiplicator</div>
            </div>
          </div>

          {/* Insight */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 15 : 13, color: T.text, fontFamily: T.font, lineHeight: 1.6 }}>
              {presenter ? (
                <><strong style={{ color: T.burgundy }}>Cele +3% nu vin din prezicerea pietei. Vin din disciplina.</strong> Fără strategie, un investitor tipic obtine {baseReturn}%/an ({multiplierBase.toFixed(1)}x in {years} ani). Cu strategia Minimalistu: {baseReturn + alphaBoost}%/an ({multiplierBoosted.toFixed(1)}x). Diferenta: <strong style={{ color: T.green }}>+{fmtK(alphaDiff)}</strong>. Asta e puterea disciplinei comportamentale.</>
              ) : (
                <><strong>+3%/an pare putin.</strong> Dar pe {years} ani, transformat prin compunere, inseamna <strong style={{ color: T.green }}>+{fmtK(alphaDiff)}</strong> in plus. Diferenta vine din disciplina, nu din predictii.</>
              )}
            </div>
          </div>
        </div>
      </div>
      <CTA presenter={presenter} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 7: CHIRIE VS CUMPARARE
// ═══════════════════════════════════════════════════════════════

function computeMortgagePayment(principal, annualRate, years) {
  const mr = annualRate / 100 / 12, n = years * 12;
  if (mr === 0) return principal / n;
  return principal * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1);
}

function computeRentVsBuy(params) {
  const { propertyVal, downPaymentPct, mortgageRate, mortgageTerm, rent, rentInflation,
    amenajare, mobilier, reparatiiPct, impozitAnual, asigurareAnuala, fondRulmentLunar,
    propertyAppreciation, investReturn, years } = params;

  const downPayment = propertyVal * downPaymentPct / 100;
  const loanAmount = propertyVal - downPayment;
  const mortgageMonthly = computeMortgagePayment(loanAmount, mortgageRate, mortgageTerm);
  const mr = investReturn / 100 / 12;

  // Upfront costs buyer must pay
  const buyerUpfront = downPayment + amenajare + mobilier;

  // Track year by year
  let remainingLoan = loanAmount;
  let propertyValue = propertyVal;
  let renterPortfolio = buyerUpfront; // renter invests what buyer pays upfront
  let currentRent = rent;
  let totalBuyerPaid = buyerUpfront;
  let totalRenterPaid = 0;
  let totalMortgageInterest = 0;

  const pts = [{
    year: 0,
    buyerWealth: propertyVal - loanAmount - amenajare - mobilier,
    renterWealth: buyerUpfront,
    buyerEquity: downPayment,
    propertyValue: propertyVal,
    renterPortfolio: buyerUpfront,
  }];

  // Phantom cost accumulators
  let totalReparatii = 0, totalImpozit = 0, totalAsigurare = 0, totalFondRulment = 0, totalAmenajare = amenajare, totalMobilier = mobilier;

  for (let y = 1; y <= years; y++) {
    // Annual phantom costs
    const reparatiiAnual = propertyValue * reparatiiPct / 100;
    const fondAnual = fondRulmentLunar * 12;

    totalReparatii += reparatiiAnual;
    totalImpozit += impozitAnual;
    totalAsigurare += asigurareAnuala;
    totalFondRulment += fondAnual;

    const buyerAnnualPhantom = reparatiiAnual + impozitAnual + asigurareAnuala + fondAnual;

    // Monthly loop for precision
    for (let m = 0; m < 12; m++) {
      // Buyer: mortgage payment
      const interestPayment = remainingLoan * mortgageRate / 100 / 12;
      const principalPayment = Math.min(mortgageMonthly - interestPayment, remainingLoan);
      remainingLoan = Math.max(0, remainingLoan - principalPayment);
      totalMortgageInterest += interestPayment;

      // Buyer monthly total
      const buyerMonthly = mortgageMonthly + buyerAnnualPhantom / 12;

      // Renter: pay rent, invest difference
      const renterMonthly = currentRent;
      totalRenterPaid += renterMonthly;
      totalBuyerPaid += buyerMonthly;

      // Renter compounds portfolio monthly + invests difference when buyer pays more
      const diff = buyerMonthly - renterMonthly;
      renterPortfolio = renterPortfolio * (1 + mr) + Math.max(0, diff);
    }

    // Property appreciates
    propertyValue = propertyValue * (1 + propertyAppreciation / 100);

    // Rent inflates for next year
    currentRent = currentRent * (1 + rentInflation / 100);

    // Buyer net wealth = property value - remaining mortgage
    const buyerWealth = propertyValue - remainingLoan;
    const buyerEquity = propertyValue - remainingLoan;

    pts.push({
      year: y,
      buyerWealth: Math.round(buyerWealth),
      renterWealth: Math.round(renterPortfolio),
      buyerEquity: Math.round(buyerEquity),
      propertyValue: Math.round(propertyValue),
      renterPortfolio: Math.round(renterPortfolio),
    });
  }

  // Find breakeven year
  let breakeven = null;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1], curr = pts[i];
    if (prev.buyerWealth <= prev.renterWealth && curr.buyerWealth > curr.renterWealth) {
      // Interpolate
      const dBuyer = curr.buyerWealth - prev.buyerWealth;
      const dRenter = curr.renterWealth - prev.renterWealth;
      const gap = prev.renterWealth - prev.buyerWealth;
      breakeven = prev.year + gap / (dBuyer - dRenter);
      break;
    }
  }

  const lastPt = pts[pts.length - 1];
  const winner = lastPt.buyerWealth > lastPt.renterWealth ? "buy" : "rent";
  const advantage = Math.abs(lastPt.buyerWealth - lastPt.renterWealth);

  return {
    chartData: pts,
    winner,
    advantage: Math.round(advantage),
    breakeven: breakeven != null ? Math.round(breakeven * 10) / 10 : null,
    buyerFinal: lastPt.buyerWealth,
    renterFinal: lastPt.renterWealth,
    mortgageMonthly: Math.round(mortgageMonthly),
    totalMortgageInterest: Math.round(totalMortgageInterest),
    phantomCosts: {
      amenajare: Math.round(totalAmenajare),
      mobilier: Math.round(totalMobilier),
      reparatii: Math.round(totalReparatii),
      impozit: Math.round(totalImpozit),
      asigurare: Math.round(totalAsigurare),
      fondRulment: Math.round(totalFondRulment),
      dobandaMortgage: Math.round(totalMortgageInterest),
      total: Math.round(totalAmenajare + totalMobilier + totalReparatii + totalImpozit + totalAsigurare + totalFondRulment + totalMortgageInterest),
    },
    buyerUpfront,
    propertyFinal: Math.round(propertyValue),
  };
}

// ─── Rent vs Buy Chart ───────────────────────────────────────
function RentVsBuyChart({ data, breakeven, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 400 : 300;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!data || data.length < 2) return;
    const pad = { top: 40, right: presenter ? 120 : 100, bottom: 50, left: presenter ? 80 : 64 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const maxVal = Math.max(...data.map(d => Math.max(d.buyerWealth, d.renterWealth))) * 1.12;
    const x = i => pad.left + (i / (data.length - 1)) * cw, y = v => pad.top + ch - (v / maxVal) * ch;

    // Grid
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.font = `${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) { const val = (i / 5) * maxVal, yy = y(val); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(w - pad.right, yy); ctx.stroke(); ctx.fillText(fmtK(val), pad.left - 10, yy + 4); }
    ctx.setLineDash([]); ctx.textAlign = "center"; ctx.fillStyle = T.textLight;
    data.forEach((d, i) => { const skip = data.length > 20 ? 5 : data.length > 10 ? 2 : 1; if (d.year % skip === 0) ctx.fillText(d.year === 0 ? "Azi" : `${d.year} ani`, x(i), h - pad.bottom + 22); });

    // Determine which is on top at each point for gap coloring
    // Rent advantage area (before breakeven)
    if (breakeven != null && breakeven > 0) {
      const beIdx = Math.min(Math.ceil(breakeven), data.length - 1);
      ctx.beginPath();
      for (let i = 0; i <= beIdx; i++) { const ry = y(data[i].renterWealth); i === 0 ? ctx.moveTo(x(i), ry) : ctx.lineTo(x(i), ry); }
      for (let i = beIdx; i >= 0; i--) ctx.lineTo(x(i), y(data[i].buyerWealth));
      ctx.closePath(); ctx.fillStyle = "rgba(59,110,165,0.08)"; ctx.fill();
      // Buy advantage area (after breakeven)
      ctx.beginPath();
      for (let i = beIdx; i < data.length; i++) { i === beIdx ? ctx.moveTo(x(i), y(data[i].buyerWealth)) : ctx.lineTo(x(i), y(data[i].buyerWealth)); }
      for (let i = data.length - 1; i >= beIdx; i--) ctx.lineTo(x(i), y(data[i].renterWealth));
      ctx.closePath(); ctx.fillStyle = "rgba(47,140,94,0.08)"; ctx.fill();
    } else {
      // No breakeven — one side dominates
      ctx.beginPath(); data.forEach((d, i) => { const top = Math.max(d.buyerWealth, d.renterWealth); i === 0 ? ctx.moveTo(x(i), y(top)) : ctx.lineTo(x(i), y(top)); });
      for (let i = data.length - 1; i >= 0; i--) ctx.lineTo(x(i), y(Math.min(data[i].buyerWealth, data[i].renterWealth)));
      ctx.closePath();
      const lastD = data[data.length - 1];
      ctx.fillStyle = lastD.renterWealth > lastD.buyerWealth ? "rgba(59,110,165,0.08)" : "rgba(47,140,94,0.08)";
      ctx.fill();
    }

    // Renter line (blue)
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.renterWealth)) : ctx.lineTo(x(i), y(d.renterWealth)));
    ctx.strokeStyle = T.blue; ctx.lineWidth = presenter ? 3 : 2; ctx.setLineDash([6, 3]); ctx.stroke(); ctx.setLineDash([]);

    // Buyer line (green)
    ctx.beginPath(); data.forEach((d, i) => i === 0 ? ctx.moveTo(x(i), y(d.buyerWealth)) : ctx.lineTo(x(i), y(d.buyerWealth)));
    ctx.strokeStyle = T.green; ctx.lineWidth = presenter ? 3.5 : 2.5; ctx.stroke();

    // Breakeven marker
    if (breakeven != null && breakeven > 0 && breakeven < data.length) {
      const bIdx = Math.floor(breakeven);
      const frac = breakeven - bIdx;
      const d1 = data[bIdx], d2 = data[Math.min(bIdx + 1, data.length - 1)];
      const bx = x(bIdx) + frac * (x(Math.min(bIdx + 1, data.length - 1)) - x(bIdx));
      const bVal = d1.buyerWealth + frac * (d2.buyerWealth - d1.buyerWealth);
      const by = y(bVal);
      ctx.strokeStyle = T.amber; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, y(0)); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(bx, by, presenter ? 8 : 6, 0, Math.PI * 2); ctx.fillStyle = T.amber; ctx.fill();
      ctx.beginPath(); ctx.arc(bx, by, presenter ? 5 : 3, 0, Math.PI * 2); ctx.fillStyle = T.white; ctx.fill();
      ctx.font = `700 ${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.amber; ctx.textAlign = "center";
      ctx.fillText(`Breakeven: ${breakeven.toFixed(1)} ani`, bx, by - 14);
    }

    // End dots + labels
    const last = data[data.length - 1], lx = x(data.length - 1);
    ctx.beginPath(); ctx.arc(lx, y(last.buyerWealth), presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.green; ctx.fill();
    ctx.beginPath(); ctx.arc(lx, y(last.renterWealth), presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.blue; ctx.fill();
    ctx.font = `600 ${presenter ? 14 : 12}px DM Sans,sans-serif`; ctx.textAlign = "left";
    ctx.fillStyle = T.green; ctx.fillText(fmtK(last.buyerWealth), lx + 10, y(last.buyerWealth) + 5);
    ctx.fillStyle = T.blue; ctx.fillText(fmtK(last.renterWealth), lx + 10, y(last.renterWealth) + 5);

    // Legend
    const ly = pad.top - 16; ctx.font = `500 ${presenter ? 13 : 11}px DM Sans,sans-serif`;
    ctx.fillStyle = T.green; ctx.fillRect(pad.left, ly - 4, 14, 3); ctx.fillText("Cumparare (echitate)", pad.left + 20, ly);
    ctx.fillStyle = T.blue; ctx.setLineDash([4, 3]); ctx.strokeStyle = T.blue; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(pad.left + 180, ly - 2.5); ctx.lineTo(pad.left + 194, ly - 2.5); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillText("Chirie + investit", pad.left + 200, ly);
  }, [data, breakeven, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 8 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

// ─── Main Rent vs Buy Tool ──────────────────────────────────
function RentVsBuyTool({ presenter }) {
  const [propertyVal, setPropertyVal] = useState(100000);
  const [downPaymentPct, setDownPaymentPct] = useState(15);
  const [mortgageRate, setMortgageRate] = useState(5);
  const [mortgageTerm, setMortgageTerm] = useState(30);
  const [rent, setRent] = useState(500);
  const [rentInflation, setRentInflation] = useState(5);
  const [amenajare, setAmenajare] = useState(15000);
  const [mobilier, setMobilier] = useState(10000);
  const [reparatiiPct, setReparatiiPct] = useState(1);
  const [impozitAnual, setImpozitAnual] = useState(100);
  const [asigurareAnuala, setAsigurareAnuala] = useState(100);
  const [fondRulmentLunar, setFondRulmentLunar] = useState(50);
  const [propertyAppreciation, setPropertyAppreciation] = useState(3);
  const [investReturn, setInvestReturn] = useState(8);
  const [years, setYears] = useState(25);
  const gap = presenter ? 32 : 20;

  const result = useMemo(() => computeRentVsBuy({
    propertyVal, downPaymentPct, mortgageRate, mortgageTerm, rent, rentInflation,
    amenajare, mobilier, reparatiiPct, impozitAnual, asigurareAnuala, fondRulmentLunar,
    propertyAppreciation, investReturn, years
  }), [propertyVal, downPaymentPct, mortgageRate, mortgageTerm, rent, rentInflation,
    amenajare, mobilier, reparatiiPct, impozitAnual, asigurareAnuala, fondRulmentLunar,
    propertyAppreciation, investReturn, years]);

  const { chartData, winner, advantage, breakeven, buyerFinal, renterFinal, mortgageMonthly,
    phantomCosts, buyerUpfront, propertyFinal } = result;

  const downPayment = Math.round(propertyVal * downPaymentPct / 100);
  const buyerMonthlyTotal = mortgageMonthly + Math.round(propertyVal * reparatiiPct / 100 / 12) + Math.round(impozitAnual / 12) + Math.round(asigurareAnuala / 12) + fondRulmentLunar;

  const phantomItems = [
    { icon: "\uD83D\uDCB0", label: "Dobândă ipotecă", value: phantomCosts.dobandaMortgage, color: T.red, tip: `Dobânda totală platita la credit pe ${Math.min(years, mortgageTerm)} ani la ${mortgageRate}%.` },
    { icon: "\uD83D\uDD28", label: "Amenajare/renovare", value: phantomCosts.amenajare, color: T.orange, tip: "Cost initial de amenajare: finisaje, instalatii, zugravit, parchet, etc." },
    { icon: "\uD83D\uDECB\uFE0F", label: "Mobilier + electrocasnice", value: phantomCosts.mobilier, color: T.amber, tip: "Mobilier, electrocasnice, decoratiuni la mutare." },
    { icon: "\uD83D\uDD27", label: "Reparații anuale", value: phantomCosts.reparatii, color: T.red, tip: `~${reparatiiPct}% din valoarea proprietatii/an. Include reparatii curente, inlocuiri, mentenanta.` },
    { icon: "\uD83C\uDFDB\uFE0F", label: "Impozit proprietate", value: phantomCosts.impozit, color: T.textMuted, tip: "Impozit local anual pe proprietate." },
    { icon: "\uD83D\uDEE1\uFE0F", label: "Asigurare obligatorie", value: phantomCosts.asigurare, color: T.textMuted, tip: "Asigurarea obligatorie PAD + asigurare optionala." },
    { icon: "\uD83C\uDFE2", label: "Fond rulment/intretinere", value: phantomCosts.fondRulment, color: T.textMuted, tip: `Fond de rulment asociatie: ${fmt(fondRulmentLunar)}/luna pentru reparatii parti comune, lift, etc.` },
  ];

  const winnerColor = winner === "rent" ? T.blue : T.green;
  const winnerIcon = winner === "rent" ? "\uD83C\uDFE2" : "\uD83C\uDFE0";
  const winnerLabel = winner === "rent" ? "Chiria câștigă" : "Cumpărarea câștigă";

  return (
    <div>
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left" }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: presenter ? 36 : 24, fontWeight: 400, color: T.burgundy, margin: 0, lineHeight: 1.15 }}>
          Chirie sau rate?<span style={{ color: T.amber }}> Răspunsul te va surprinde.</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: presenter ? 15 : 13, color: T.textMuted, margin: "8px 0 0 0", lineHeight: 1.5, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start", flexWrap: "wrap" }}>
          Costul real al unei proprietăți este mult mai mare decât rata lunară.
          <InfoTip text="Majoritatea oamenilor compara rata cu chiria. Dar proprietatea vine cu costuri ascunse: amenajare, mobilier, reparatii, impozit, asigurare, fond rulment + dobanda la credit. Un chirias care investeste diferenta poate iesi mai bine." presenter={presenter} />
        </p>
      </div>

      <div className="m-tool-layout" style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {/* Left: Inputs */}
        <div style={{ flex: presenter ? "0 0 380px" : "0 0 320px", minWidth: 280, display: "flex", flexDirection: "column", gap }}>
          {/* Property & Mortgage */}
          <div style={{ padding: presenter ? "28px" : "20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <SectionLabel tip="Detalii despre apartament si credit." presenter={presenter}>{"\uD83C\uDFE0"} Proprietate</SectionLabel>
            <Slider label="Valoare apartament" value={propertyVal} onChange={setPropertyVal} min={30000} max={500000} step={5000} formatValue={fmt} presenter={presenter} tip="Pretul apartamentului. Bucuresti 2 camere: ~€80-120K." />
            <Slider label="Avans" value={downPaymentPct} onChange={setDownPaymentPct} min={5} max={50} step={1} suffix="%" presenter={presenter} tip={`${downPaymentPct}% = ${fmt(downPayment)}. Minim legal in RO: 15%.`} />
            <Slider label="Dobândă ipotecă" value={mortgageRate} onChange={setMortgageRate} min={2} max={10} step={0.25} suffix="%" presenter={presenter} tip="Dobanda anuala la credit ipotecar. Romania 2026: ~5%." />
            <Slider label="Durată credit" value={mortgageTerm} onChange={setMortgageTerm} min={10} max={35} step={1} suffix=" ani" presenter={presenter} />
            <Slider label="Apreciere proprietate/an" value={propertyAppreciation} onChange={setPropertyAppreciation} min={0} max={8} step={0.5} suffix="%" presenter={presenter} tip="Cat creste valoarea proprietatii anual. Romania medie: 2-4%." />
          </div>
          {/* Rent */}
          <div style={{ padding: presenter ? "28px" : "20px", background: T.blueFaint, borderRadius: T.radius, border: `1px solid ${T.blueMuted}` }}>
            <SectionLabel tip="Chiria si parametrii investitiei." presenter={presenter}>{"\uD83C\uDFE2"} Varianta chirie</SectionLabel>
            <Slider label="Chirie lunară" value={rent} onChange={setRent} min={200} max={3000} step={50} formatValue={fmt} presenter={presenter} tip="Chiria pentru un apartament echivalent. Bucuresti 2 camere: ~€400-600." />
            <Slider label="Creștere chirie/an" value={rentInflation} onChange={setRentInflation} min={0} max={10} step={0.5} suffix="%" presenter={presenter} tip="Cat creste chiria anual. Romania: ~3-5%." />
            <Slider label="Randament investiții" value={investReturn} onChange={setInvestReturn} min={3} max={15} step={0.5} suffix="%" presenter={presenter} tip="Chirasul investeste avansul + diferenta de costuri. Global equities ~8-10%/an." />
            <Slider label="Orizont de timp" value={years} onChange={setYears} min={5} max={35} step={1} suffix=" ani" presenter={presenter} />
          </div>
          {/* Phantom costs */}
          <div style={{ padding: presenter ? "28px" : "20px", background: T.redFaint, borderRadius: T.radius, border: `1px solid ${T.redMuted}` }}>
            <SectionLabel tip="Costurile ascunse pe care majoritatea le ignora cand compara rata cu chiria." presenter={presenter}>{"\uD83D\uDC7B"} Costuri fantomă</SectionLabel>
            <Slider label="Amenajare/renovare" value={amenajare} onChange={setAmenajare} min={0} max={50000} step={1000} formatValue={fmt} presenter={presenter} tip="Finisaje, instalatii, zugravit, parchet, gresie, etc. Cost unic la mutare." />
            <Slider label="Mobilier + electrocasnice" value={mobilier} onChange={setMobilier} min={0} max={40000} step={1000} formatValue={fmt} presenter={presenter} tip="Mobila, frigider, masina de spalat, etc. Cost unic." />
            <Slider label="Reparații anuale" value={reparatiiPct} onChange={setReparatiiPct} min={0} max={3} step={0.25} suffix="% din val." presenter={presenter} tip="Regula generala: 1%/an din valoarea proprietatii pentru mentenanta." />
            <Slider label="Impozit proprietate/an" value={impozitAnual} onChange={setImpozitAnual} min={0} max={1000} step={25} formatValue={fmt} presenter={presenter} tip="Impozit local anual. Romania: \u20AC50-200 pentru apartamente." />
            <Slider label="Asigurare/an" value={asigurareAnuala} onChange={setAsigurareAnuala} min={0} max={500} step={25} formatValue={fmt} presenter={presenter} tip="Asigurare obligatorie PAD (~€20) + optionala." />
            <Slider label="Fond rulment/lună" value={fondRulmentLunar} onChange={setFondRulmentLunar} min={0} max={200} step={10} formatValue={fmt} presenter={presenter} tip="Contributie lunara la fondul de reparatii al asociatiei." />
          </div>
        </div>

        {/* Right: Results */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap }}>

          {/* Winner verdict */}
          <div style={{ padding: presenter ? "28px 32px" : "20px 24px", background: winner === "rent" ? T.blueFaint : T.greenFaint, borderRadius: T.radius, border: `1px solid ${winner === "rent" ? T.blueMuted : T.greenMuted}`, textAlign: presenter ? "center" : "left" }}>
            <div style={{ fontSize: presenter ? 14 : 11, fontWeight: 600, color: winnerColor, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font, display: "flex", alignItems: "center", justifyContent: presenter ? "center" : "flex-start" }}>
              {winnerIcon} {winnerLabel} in {years} ani
              <InfoTip text={winner === "rent" ? `Dupa ${years} ani, chirasul care investeste diferenta are cu ${fmt(advantage)} mai mult decat proprietarul. Chiria + investitii bate cumpararea in acest scenariu.` : `Dupa ${years} ani, proprietarul are cu ${fmt(advantage)} mai mult decat chirasul. Cumpărarea câștigă datorita aprecierii proprietatii.`} presenter={presenter} />
            </div>
            <div style={{ fontSize: presenter ? 52 : 36, fontWeight: 700, color: winnerColor, fontFamily: T.font, lineHeight: 1 }}>+{fmt(advantage)}</div>
            <div style={{ display: "flex", gap: presenter ? 16 : 10, marginTop: 14, flexWrap: "wrap", justifyContent: presenter ? "center" : "flex-start" }}>
              {breakeven != null && <Pill value={`${breakeven.toFixed(1)} ani`} label="breakeven" color={T.amber} presenter={presenter} tip={`Cumpararea devine mai avantajoasa dupa ${breakeven.toFixed(1)} ani. Inainte de acest punct, chiria + investitii castiga.`} />}
              <Pill value={fmt(Math.round(advantage / years / 12))} label="/ lună diferență" color={winnerColor} presenter={presenter} />
            </div>
          </div>

          {/* Side by side wealth */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatCard label="Cumpărător" value={fmtK(buyerFinal)} color={T.green} bgColor={T.greenFaint} presenter={presenter} icon={"\uD83C\uDFE0"} sub={`Proprietate: ${fmtK(propertyFinal)}`} tip="Avere neta: valoarea proprietatii minus creditul ramas." />
            <StatCard label="Chiriaș + investitor" value={fmtK(renterFinal)} color={T.blue} bgColor={T.blueFaint} presenter={presenter} icon={"\uD83D\uDCCA"} sub={`Portofoliu investit la ${investReturn}%`} tip="Portofoliu acumulat din avans investit + diferenta lunara investita." />
          </div>

          {/* Monthly comparison */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: presenter ? 24 : 16, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", marginBottom: 4 }}>Rată ipotecă</div>
              <div style={{ fontSize: presenter ? 28 : 20, fontWeight: 700, color: T.text, fontFamily: T.font }}>{fmt(mortgageMonthly)}</div>
              <div style={{ fontSize: presenter ? 10 : 8, color: T.textMuted, fontFamily: T.font }}>luna</div>
            </div>
            <div style={{ fontSize: presenter ? 16 : 12, color: T.textMuted }}>+</div>
            <div style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.red, fontFamily: T.font, textTransform: "uppercase", marginBottom: 4 }}>Costuri ascunse</div>
              <div style={{ fontSize: presenter ? 28 : 20, fontWeight: 700, color: T.red, fontFamily: T.font }}>{fmt(buyerMonthlyTotal - mortgageMonthly)}</div>
              <div style={{ fontSize: presenter ? 10 : 8, color: T.textMuted, fontFamily: T.font }}>luna</div>
            </div>
            <div style={{ fontSize: presenter ? 16 : 12, color: T.textMuted }}>=</div>
            <div style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", marginBottom: 4 }}>Cost real total</div>
              <div style={{ fontSize: presenter ? 28 : 20, fontWeight: 700, color: T.burgundy, fontFamily: T.font }}>{fmt(buyerMonthlyTotal)}</div>
              <div style={{ fontSize: presenter ? 10 : 8, color: T.textMuted, fontFamily: T.font }}>luna</div>
            </div>
            <div style={{ fontSize: presenter ? 16 : 12, color: T.textMuted }}>vs</div>
            <div style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{ fontSize: presenter ? 11 : 9, color: T.blue, fontFamily: T.font, textTransform: "uppercase", marginBottom: 4 }}>Chirie</div>
              <div style={{ fontSize: presenter ? 28 : 20, fontWeight: 700, color: T.blue, fontFamily: T.font }}>{fmt(rent)}</div>
              <div style={{ fontSize: presenter ? 10 : 8, color: T.textMuted, fontFamily: T.font }}>luna (azi)</div>
            </div>
          </div>

          {/* Phantom costs breakdown */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {"\uD83D\uDC7B"} Costuri ascunse cumparator in {years} ani<InfoTip text="Toate costurile pe care le platesti pe langa rata lunara. Aceste costuri sunt invizibile in comparatia simpla rata vs chirie." presenter={presenter} />
            </div>
            {phantomItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: i < phantomItems.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: presenter ? 18 : 14, marginRight: 10 }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: presenter ? 14 : 12, color: T.text, fontFamily: T.font, display: "flex", alignItems: "center" }}>{item.label}<InfoTip text={item.tip} presenter={presenter} /></span>
                <span style={{ fontSize: presenter ? 18 : 14, fontWeight: 700, color: item.color, fontFamily: T.font }}>{fmtK(item.value)}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", padding: "14px 0 0", marginTop: 6, borderTop: `2px solid ${T.red}` }}>
              <span style={{ flex: 1, fontSize: presenter ? 16 : 14, fontWeight: 700, color: T.text, fontFamily: T.font }}>Total costuri ascunse</span>
              <span style={{ fontSize: presenter ? 24 : 18, fontWeight: 700, color: T.red, fontFamily: T.font }}>{fmtK(phantomCosts.total)}</span>
            </div>
          </div>

          {/* Chart */}
          <div style={{ padding: presenter ? "20px 24px 16px" : "16px 20px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4, fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Avere netă în timp<InfoTip text="Verde = proprietar (echitate imobiliara). Albastru = chirias + investitor (portofoliu). Linia amber = breakeven — punctul unde cumpararea devine mai avantajoasa." presenter={presenter} />
            </div>
            <RentVsBuyChart data={chartData} breakeven={breakeven} presenter={presenter} />
          </div>

          {/* Opportunity cost of down payment */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.amberFaint, borderRadius: T.radius, border: `1px solid rgba(232,168,50,0.2)` }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10, fontSize: presenter ? 13 : 11, color: T.amber, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Costul de oportunitate al avansului<InfoTip text={`Avansul de ${fmt(downPayment)} + amenajarea de ${fmt(amenajare)} + mobilierul de ${fmt(mobilier)} = ${fmt(Math.round(buyerUpfront))} blocati in proprietate. Dacă investeai acesti bani la ${investReturn}%/an pe ${years} ani, ajungeai la ${fmtK(Math.round(buyerUpfront * Math.pow(1 + investReturn / 100, years)))}.`} presenter={presenter} />
            </div>
            <div style={{ display: "flex", gap: presenter ? 24 : 16, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, fontFamily: T.font }}>Blocat în proprietate</div>
                <div style={{ fontSize: presenter ? 24 : 18, fontWeight: 700, color: T.amber, fontFamily: T.font }}>{fmt(Math.round(buyerUpfront))}</div>
                <div style={{ fontSize: presenter ? 10 : 8, color: T.textMuted, fontFamily: T.font }}>avans + amenajare + mobilier</div>
              </div>
              <div style={{ fontSize: presenter ? 20 : 14, color: T.amber }}>&rarr;</div>
              <div>
                <div style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, fontFamily: T.font }}>Dacă investeai la {investReturn}%</div>
                <div style={{ fontSize: presenter ? 24 : 18, fontWeight: 700, color: T.green, fontFamily: T.font }}>{fmtK(Math.round(buyerUpfront * Math.pow(1 + investReturn / 100, years)))}</div>
                <div style={{ fontSize: presenter ? 10 : 8, color: T.textMuted, fontFamily: T.font }}>in {years} ani</div>
              </div>
            </div>
          </div>

          {/* Insight */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 15 : 13, color: T.text, fontFamily: T.font, lineHeight: 1.6 }}>
              {presenter ? (
                winner === "rent" ? (
                  <><strong style={{ color: T.burgundy }}>Rata lunara e doar jumatate din poveste.</strong> Costul real al proprietatii include <strong style={{ color: T.red }}>{fmtK(phantomCosts.total)}</strong> in costuri ascunse pe {years} ani. Dobânda la credit = <strong style={{ color: T.red }}>{fmtK(phantomCosts.dobandaMortgage)}</strong>. Un chirias care investeste diferenta are cu <strong style={{ color: T.blue }}>{fmtK(advantage)}</strong> mai mult.{breakeven != null && <> Cumpararea devine avantajoasa abia dupa <strong style={{ color: T.amber }}>{breakeven.toFixed(1)} ani</strong>.</>}</>
                ) : (
                  <><strong style={{ color: T.burgundy }}>In acest scenariu, cumpararea castiga</strong> cu {fmtK(advantage)} in {years} ani. Dar nu ignora costurile ascunse de <strong style={{ color: T.red }}>{fmtK(phantomCosts.total)}</strong>.{breakeven != null && <> Ai avut nevoie de <strong style={{ color: T.amber }}>{breakeven.toFixed(1)} ani</strong> ca sa recuperezi investitia initiala.</>}</>
                )
              ) : (
                winner === "rent" ? (
                  <><strong>Chiria + investitii castiga cu {fmtK(advantage)}</strong> in {years} ani. Costurile ascunse ale proprietatii: <strong style={{ color: T.red }}>{fmtK(phantomCosts.total)}</strong>.{breakeven != null && <> Breakeven la {breakeven.toFixed(1)} ani.</>}</>
                ) : (
                  <><strong>Cumpărarea câștigă cu {fmtK(advantage)}</strong> in {years} ani, dar costurile ascunse de <strong style={{ color: T.red }}>{fmtK(phantomCosts.total)}</strong> sunt reale. Breakeven: {breakeven != null ? `${breakeven.toFixed(1)} ani` : "de la inceput"}.</>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <CTA presenter={presenter} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 8: FOND DE URGENTA
// ═══════════════════════════════════════════════════════════════

function EmergencyFundTool({ presenter }) {
  const [expenses, setExpenses] = useState(3000);
  const [activity, setActivity] = useState("angajat");
  const [partner, setPartner] = useState(false);
  const [partnerIncome, setPartnerIncome] = useState(false);
  const [married, setMarried] = useState(false);
  const [kids, setKids] = useState(0);
  const [savings, setSavings] = useState(5000);

  const result = useMemo(() => {
    // Base months by activity type
    let baseMin, baseMax;
    if (activity === "angajat") { baseMin = 3; baseMax = 6; }
    else if (activity === "freelancer") { baseMin = 6; baseMax = 9; }
    else { baseMin = 9; baseMax = 12; }

    // Kids add months
    const kidExtra = kids >= 3 ? 2 : kids >= 1 ? 1 : 0;

    // No partner with income = more risk
    const partnerExtra = (partner && partnerIncome) ? -1 : 0;

    // Single unmarried = slightly less obligation but also less safety net
    const marriedExtra = (!married && !partner) ? 1 : 0;

    const recMin = Math.max(3, baseMin + kidExtra + partnerExtra + marriedExtra);
    const recMax = Math.max(recMin, baseMax + kidExtra + partnerExtra + marriedExtra);

    const fundMin = recMin * expenses;
    const fundMax = recMax * expenses;
    const current = savings;
    const deficitMin = Math.max(0, fundMin - current);
    const deficitMax = Math.max(0, fundMax - current);
    const pctMin = fundMin > 0 ? Math.min(100, Math.round((current / fundMin) * 100)) : 0;
    const pctMax = fundMax > 0 ? Math.min(100, Math.round((current / fundMax) * 100)) : 0;

    return { recMin, recMax, fundMin, fundMax, deficitMin, deficitMax, pctMin, pctMax };
  }, [expenses, activity, partner, partnerIncome, married, kids, savings]);

  const activityOptions = [
    { id: "angajat", label: "Angajat", icon: "💼" },
    { id: "freelancer", label: "Freelancer", icon: "💻" },
    { id: "somer", label: "Șomer", icon: "🔍" },
  ];

  const ToggleButton = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{ padding: presenter ? "10px 20px" : "8px 16px", background: active ? T.burgundy : T.white, color: active ? "#fff" : T.textMuted, border: `1px solid ${active ? T.burgundy : T.border}`, borderRadius: T.radiusSm, fontSize: presenter ? 14 : 12, fontWeight: active ? 700 : 500, fontFamily: T.font, cursor: "pointer", transition: "all 0.2s" }}>{children}</button>
  );

  const barColor = result.pctMin >= 100 ? T.green : result.pctMin >= 60 ? T.amber : T.red;

  return (
    <div>
      <SectionLabel tip="Calculează suma necesară pentru fondul tău de urgență bazat pe situația ta financiară și personală." presenter={presenter}>🛡️ Calculator Fond de Urgență</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: presenter ? "1fr 1.4fr" : "1fr", gap: presenter ? 32 : 20 }}>
        <div>
          <Slider label="Cheltuieli lunare totale" tip="Include chirie/rată, utilități, mâncare, transport, abonamente, asigurări și alte cheltuieli recurente." value={expenses} onChange={setExpenses} min={500} max={15000} step={100} suffix="" presenter={presenter} formatValue={v => fmt(v)} />
          <Slider label="Economii actuale" tip="Suma pe care o ai deja pusă deoparte pentru urgențe." value={savings} onChange={setSavings} min={0} max={100000} step={500} suffix="" presenter={presenter} formatValue={v => fmt(v)} />

          <div style={{ marginBottom: presenter ? 24 : 16 }}>
            <div style={{ color: T.textMuted, fontSize: presenter ? 14 : 12, fontFamily: T.font, fontWeight: 500, marginBottom: 8, display: "flex", alignItems: "center" }}>Tip activitate<InfoTip text="Angajații au venituri mai stabile. Freelancerii au nevoie de o pernă mai mare din cauza veniturilor variabile. Șomerii au nevoie de cel mai mare fond." presenter={presenter} /></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {activityOptions.map(o => (
                <ToggleButton key={o.id} active={activity === o.id} onClick={() => setActivity(o.id)}>{o.icon} {o.label}</ToggleButton>
              ))}
            </div>
          </div>

          <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: presenter ? 24 : 16 }}>
            <div>
              <div style={{ color: T.textMuted, fontSize: presenter ? 14 : 12, fontFamily: T.font, fontWeight: 500, marginBottom: 8 }}>Partener</div>
              <div style={{ display: "flex", gap: 8 }}>
                <ToggleButton active={partner} onClick={() => setPartner(true)}>Da</ToggleButton>
                <ToggleButton active={!partner} onClick={() => { setPartner(false); setPartnerIncome(false); }}>Nu</ToggleButton>
              </div>
            </div>
            {partner && (
              <div>
                <div style={{ color: T.textMuted, fontSize: presenter ? 14 : 12, fontFamily: T.font, fontWeight: 500, marginBottom: 8 }}>Partener cu venit</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <ToggleButton active={partnerIncome} onClick={() => setPartnerIncome(true)}>Da</ToggleButton>
                  <ToggleButton active={!partnerIncome} onClick={() => setPartnerIncome(false)}>Nu</ToggleButton>
                </div>
              </div>
            )}
          </div>

          <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: presenter ? 24 : 16 }}>
            <div>
              <div style={{ color: T.textMuted, fontSize: presenter ? 14 : 12, fontFamily: T.font, fontWeight: 500, marginBottom: 8 }}>Căsătorit</div>
              <div style={{ display: "flex", gap: 8 }}>
                <ToggleButton active={married} onClick={() => setMarried(true)}>Da</ToggleButton>
                <ToggleButton active={!married} onClick={() => setMarried(false)}>Nu</ToggleButton>
              </div>
            </div>
            <div>
              <div style={{ color: T.textMuted, fontSize: presenter ? 14 : 12, fontFamily: T.font, fontWeight: 500, marginBottom: 8, display: "flex", alignItems: "center" }}>Copii<InfoTip text="Copiii cresc necesarul fondului de urgență deoarece adaugă cheltuieli fixe și imprevizibile (sănătate, educație)." presenter={presenter} /></div>
              <div style={{ display: "flex", gap: 8 }}>
                {[0, 1, 2, 3].map(n => (
                  <ToggleButton key={n} active={kids === n} onClick={() => setKids(n)}>{n === 0 ? "0" : n === 3 ? "3+" : n}</ToggleButton>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <StatCard label="Recomandare" tip="Numărul de luni de cheltuieli pe care ar trebui să le acopere fondul tău de urgență." value={`${result.recMin}–${result.recMax} luni`} color={T.burgundy} bgColor={T.burgundyFaint} presenter={presenter} icon="📅" />
            <StatCard label="Fond necesar" tip="Suma totală recomandată pentru fondul de urgență." value={`${fmtK(result.fundMin)} – ${fmtK(result.fundMax)}`} color={T.burgundy} bgColor={T.white} presenter={presenter} icon="🎯" />
          </div>

          {/* Progress bar */}
          <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ color: T.textMuted, fontSize: presenter ? 13 : 11, fontFamily: T.font, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Progres fond de urgență</span>
              <span style={{ color: barColor, fontSize: presenter ? 18 : 15, fontWeight: 700, fontFamily: T.font }}>{result.pctMin}%</span>
            </div>
            <div style={{ height: presenter ? 16 : 10, background: T.burgundyMuted, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${result.pctMin}%`, background: barColor, borderRadius: 999, transition: "all 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: presenter ? 12 : 10, fontFamily: T.font, color: T.textMuted }}>
              <span>Ai: {fmt(savings)}</span>
              <span>Minim: {fmt(result.fundMin)}</span>
            </div>
          </div>

          {/* Deficit / surplus cards */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {result.deficitMin > 0 ? (
              <StatCard label="Mai ai nevoie de" tip="Suma minimă pe care trebuie să o mai economisești." value={fmt(result.deficitMin)} sub={`până la ${fmt(result.deficitMax)} ideal`} color={T.red} bgColor={T.redFaint} presenter={presenter} icon="⚠️" />
            ) : (
              <StatCard label="Fond complet!" tip="Ai acoperit necesarul minim." value="✓ Acoperit" sub={result.deficitMax > 0 ? `Mai ai nevoie de ${fmt(result.deficitMax)} pentru nivelul ideal` : "Ai fondul complet acoperit!"} color={T.green} bgColor={T.greenFaint} presenter={presenter} icon="✅" />
            )}
          </div>

          {/* Breakdown per months */}
          <div style={{ marginTop: 16, padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12, fontFamily: T.font }}>Detaliere pe luni</div>
            {[3, 6, 9, 12].map(m => {
              const needed = m * expenses;
              const pct = Math.min(100, Math.round((savings / needed) * 100));
              const isInRange = m >= result.recMin && m <= result.recMax;
              return (
                <div key={m} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ width: 55, fontSize: presenter ? 13 : 11, fontWeight: isInRange ? 700 : 500, color: isInRange ? T.burgundy : T.textMuted, fontFamily: T.font }}>{m} luni</span>
                  <div style={{ flex: 1, height: presenter ? 10 : 6, background: T.burgundyMuted, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: isInRange ? T.burgundy : T.textLight, borderRadius: 999, transition: "all 0.3s" }} />
                  </div>
                  <span style={{ width: 70, textAlign: "right", fontSize: presenter ? 13 : 11, fontWeight: isInRange ? 700 : 500, color: isInRange ? T.burgundy : T.textMuted, fontFamily: T.font }}>{fmtK(needed)}</span>
                  {isInRange && <span style={{ fontSize: 10, color: T.amber }}>★</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insight box */}
      <div style={{ marginTop: 20, padding: "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}` }}>
        <div style={{ fontSize: presenter ? 14 : 12, fontFamily: T.font, color: T.text, lineHeight: 1.6 }}>
          <strong>De reținut:</strong>{" "}
          {activity === "angajat" && "Ca angajat ai un venit stabil, dar poți pierde jobul oricând. "}
          {activity === "freelancer" && "Ca freelancer, veniturile fluctuează lunar — ai nevoie de o pernă mai generoasă. "}
          {activity === "somer" && "Fără venit stabil, fondul de urgență este prioritatea #1. "}
          {kids > 0 && `Cu ${kids} copil${kids > 1 ? "i" : ""}, cheltuielile neprevăzute cresc semnificativ. `}
          {partner && partnerIncome && "Partenerul cu venit reduce riscul, dar nu te baza exclusiv pe asta. "}
          Fondul ideal acoperă <strong style={{ color: T.burgundy }}>{result.recMin}–{result.recMax} luni</strong> ({fmt(result.fundMin)} – {fmt(result.fundMax)}).
        </div>
      </div>

      <CTA presenter={presenter} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 9: EVALUARE TOLERANTA LA RISC
// ═══════════════════════════════════════════════════════════════

const RISK_QUESTIONS = [
  {
    q: "Dacă portofoliul tău ar scădea cu 20% într-o lună, ce ai face?",
    tip: "Bazat pe studiul Kahneman & Tversky privind aversiunea la pierdere.",
    options: [
      { text: "Vând totul imediat", score: 1 },
      { text: "Vând o parte pentru a reduce riscul", score: 2 },
      { text: "Nu fac nimic, aștept recuperarea", score: 4 },
      { text: "Cumpăr mai mult la preț redus", score: 5 },
    ],
  },
  {
    q: "Care este orizontul tău de investiție?",
    tip: "Orizontul lung permite asumarea unui risc mai mare (Siegel, Stocks for the Long Run).",
    options: [
      { text: "Sub 2 ani", score: 1 },
      { text: "2–5 ani", score: 2 },
      { text: "5–10 ani", score: 4 },
      { text: "Peste 10 ani", score: 5 },
    ],
  },
  {
    q: "Ce procentaj din venituri poți investi lunar fără a-ți afecta traiul?",
    tip: "Capacitatea financiară de a absorbi pierderi (Cordell, 2001 - Risk Tolerance framework).",
    options: [
      { text: "Sub 5%", score: 1 },
      { text: "5–15%", score: 2 },
      { text: "15–30%", score: 4 },
      { text: "Peste 30%", score: 5 },
    ],
  },
  {
    q: "Ai un fond de urgență care acoperă 3–6 luni de cheltuieli?",
    tip: "Lipsa fondului de urgență obligă la lichidarea investițiilor în momente nefavorabile.",
    options: [
      { text: "Nu, deloc", score: 1 },
      { text: "Parțial (1–2 luni)", score: 2 },
      { text: "Da, 3–6 luni", score: 4 },
      { text: "Da, peste 6 luni", score: 5 },
    ],
  },
  {
    q: "Cum reacționezi la volatilitatea zilnică a piețelor?",
    tip: "Studiul Dalbar arată că investitorii care verifică frecvent au randamente mai mici cu 4-5% pe an.",
    options: [
      { text: "Verific zilnic și mă stresez", score: 1 },
      { text: "Verific săptămânal, uneori îngrijorat", score: 2 },
      { text: "Verific lunar, rămân calm", score: 4 },
      { text: "Verific rar, am încredere în strategie", score: 5 },
    ],
  },
  {
    q: "Ce randament anual aștepți de la investiții (și ce risc accepți)?",
    tip: "Randamente mari = risc mare. Relația risc-randament este fundamentală (Markowitz, Modern Portfolio Theory).",
    options: [
      { text: "2–4% (risc minim, ca depozitele)", score: 1 },
      { text: "4–7% (risc moderat, obligațiuni + acțiuni)", score: 2 },
      { text: "7–10% (risc ridicat, majoritar acțiuni)", score: 4 },
      { text: "Peste 10% (risc foarte ridicat, acțiuni aggressive)", score: 5 },
    ],
  },
  {
    q: "Dacă un prieten îți recomandă o investiție 'sigură' cu randament mare, ce faci?",
    tip: "Rezistența la FOMO și gândirea independentă sunt indicatori de maturitate financiară (Barber & Odean, 2001).",
    options: [
      { text: "Investesc imediat, nu vreau să pierd ocazia", score: 1 },
      { text: "Investesc o sumă mică să testez", score: 2 },
      { text: "Cercetez temeinic înainte de decizie", score: 4 },
      { text: "Ignor — dacă sună prea bine, probabil e", score: 5 },
    ],
  },
  {
    q: "Care descriere te reprezintă cel mai bine ca investitor?",
    tip: "Auto-evaluarea profilului (Grable & Lytton, 1999 - Financial Risk Tolerance revisited).",
    options: [
      { text: "Conservator: vreau să-mi protejez capitalul", score: 1 },
      { text: "Moderat: accept fluctuații mici pentru creștere", score: 2 },
      { text: "Echilibrat: accept riscuri calculate", score: 4 },
      { text: "Agresiv: maximizez creșterea pe termen lung", score: 5 },
    ],
  },
];

function RiskToleranceTool({ presenter }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const answered = Object.keys(answers).length;
  const total = RISK_QUESTIONS.length;
  const allAnswered = answered === total;

  const result = useMemo(() => {
    if (!allAnswered) return null;
    const sum = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = total * 5;
    const pct = Math.round((sum / maxScore) * 100);
    const normalized = (sum / maxScore) * 10; // 0-10 scale

    let profile, color, description, allocation;
    if (normalized <= 2.5) {
      profile = "Conservator";
      color = T.blue;
      description = "Preferi siguranța capitalului. Fluctuațiile te stresează și eviți riscurile. Investițiile tale ar trebui să fie predominant în instrumente cu venit fix.";
      allocation = { bonds: 70, stocks: 15, cash: 15 };
    } else if (normalized <= 4.5) {
      profile = "Moderat-Conservator";
      color = T.green;
      description = "Accepți fluctuații mici pentru o creștere moderată. Preferi un echilibru cu accent pe stabilitate.";
      allocation = { bonds: 50, stocks: 35, cash: 15 };
    } else if (normalized <= 6.5) {
      profile = "Echilibrat";
      color = T.amber;
      description = "Accepți riscuri calculate și înțelegi că volatilitatea pe termen scurt este prețul creșterii pe termen lung.";
      allocation = { bonds: 35, stocks: 55, cash: 10 };
    } else if (normalized <= 8.5) {
      profile = "Moderat-Agresiv";
      color = T.orange;
      description = "Ești confortabil cu volatilitatea și prioritizezi creșterea capitalului. Poți tolera scăderi semnificative.";
      allocation = { bonds: 20, stocks: 70, cash: 10 };
    } else {
      profile = "Agresiv";
      color = T.red;
      description = "Maximizezi potențialul de creștere și accepți riscuri mari. Ești pregătit pentru fluctuații extreme.";
      allocation = { bonds: 10, stocks: 85, cash: 5 };
    }

    return { sum, pct, normalized, profile, color, description, allocation };
  }, [answers, allAnswered, total]);

  const handleAnswer = (qIndex, score) => {
    setAnswers(prev => ({ ...prev, [qIndex]: score }));
  };

  const reset = () => { setAnswers({}); setShowResult(false); };

  // Gauge drawing
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box || !result) return;
    const dpr = window.devicePixelRatio || 1;
    const w = box.offsetWidth, h = presenter ? 180 : 140;
    if (w <= 0) return;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h - 16, r = Math.min(cx - 30, cy - 8);
    if (r <= 0) return;
    const startA = Math.PI, endA = 2 * Math.PI;

    // Background arc
    ctx.beginPath(); ctx.arc(cx, cy, r, startA, endA);
    ctx.lineWidth = presenter ? 28 : 20; ctx.strokeStyle = T.burgundyMuted; ctx.lineCap = "round"; ctx.stroke();

    // Colored segments
    const segments = [
      { from: 0, to: 0.25, color: T.blue },
      { from: 0.25, to: 0.45, color: T.green },
      { from: 0.45, to: 0.65, color: T.amber },
      { from: 0.65, to: 0.85, color: T.orange },
      { from: 0.85, to: 1.0, color: T.red },
    ];
    segments.forEach(seg => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, startA + seg.from * Math.PI, startA + seg.to * Math.PI);
      ctx.lineWidth = presenter ? 28 : 20; ctx.strokeStyle = seg.color; ctx.lineCap = "butt"; ctx.stroke();
    });

    // Needle
    const pct = Math.max(0, Math.min(1, result.normalized / 10));
    const needleAngle = startA + pct * Math.PI;
    const needleLen = r - (presenter ? 18 : 12);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + needleLen * Math.cos(needleAngle), cy + needleLen * Math.sin(needleAngle));
    ctx.strokeStyle = T.text; ctx.lineWidth = presenter ? 3 : 2; ctx.lineCap = "round"; ctx.stroke();

    // Center dot
    ctx.beginPath(); ctx.arc(cx, cy, presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.text; ctx.fill();

    // Labels
    ctx.font = `500 ${presenter ? 10 : 8}px DM Sans,sans-serif`; ctx.textAlign = "center";
    ctx.fillStyle = T.blue; ctx.fillText("Conservator", cx - r + 30, cy + (presenter ? 18 : 14));
    ctx.fillStyle = T.amber; ctx.fillText("Echilibrat", cx, cy - r + (presenter ? 44 : 34));
    ctx.fillStyle = T.red; ctx.fillText("Agresiv", cx + r - 25, cy + (presenter ? 18 : 14));
  }, [result, presenter]);

  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  useEffect(() => { if (showResult) { requestAnimationFrame(draw); } }, [showResult, draw]);

  return (
    <div>
      <SectionLabel tip="Evaluare bazată pe studii internaționale: Kahneman & Tversky (Prospect Theory), Grable & Lytton (1999), Cordell (2001), Markowitz (Modern Portfolio Theory)." presenter={presenter}>🧭 Evaluare Toleranță la Risc</SectionLabel>

      {!showResult ? (
        <div>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: presenter ? 8 : 5, background: T.burgundyMuted, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(answered / total) * 100}%`, background: T.burgundy, borderRadius: 999, transition: "all 0.3s" }} />
            </div>
            <span style={{ fontSize: presenter ? 14 : 12, color: T.textMuted, fontFamily: T.font, fontWeight: 600 }}>{answered}/{total}</span>
          </div>

          {/* Questions */}
          {RISK_QUESTIONS.map((rq, qi) => (
            <div key={qi} style={{ marginBottom: presenter ? 28 : 20, padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${answers[qi] !== undefined ? T.burgundy : T.border}`, transition: "border 0.2s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <span style={{ width: presenter ? 28 : 24, height: presenter ? 28 : 24, borderRadius: "50%", background: answers[qi] !== undefined ? T.burgundy : T.burgundyMuted, color: answers[qi] !== undefined ? "#fff" : T.burgundy, display: "flex", alignItems: "center", justifyContent: "center", fontSize: presenter ? 13 : 11, fontWeight: 700, fontFamily: T.font, flexShrink: 0 }}>{qi + 1}</span>
                <div>
                  <div style={{ fontSize: presenter ? 15 : 13, fontWeight: 600, color: T.text, fontFamily: T.font, lineHeight: 1.4 }}>{rq.q}</div>
                  {rq.tip && <div style={{ fontSize: presenter ? 11 : 10, color: T.textLight, fontFamily: T.font, marginTop: 4, fontStyle: "italic" }}>{rq.tip}</div>}
                </div>
              </div>
              <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {rq.options.map((opt, oi) => (
                  <button key={oi} onClick={() => handleAnswer(qi, opt.score)}
                    style={{ padding: presenter ? "12px 16px" : "10px 12px", background: answers[qi] === opt.score ? T.burgundyFaint : T.cream, border: `1.5px solid ${answers[qi] === opt.score ? T.burgundy : T.border}`, borderRadius: T.radiusSm, cursor: "pointer", textAlign: "left", fontSize: presenter ? 13 : 11, color: answers[qi] === opt.score ? T.burgundy : T.text, fontWeight: answers[qi] === opt.score ? 600 : 400, fontFamily: T.font, transition: "all 0.15s", lineHeight: 1.4 }}>{opt.text}</button>
                ))}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={() => allAnswered && setShowResult(true)} disabled={!allAnswered}
              style={{ padding: presenter ? "14px 40px" : "12px 32px", background: allAnswered ? T.burgundy : T.burgundyMuted, color: allAnswered ? "#fff" : T.textMuted, border: "none", borderRadius: T.radiusSm, fontSize: presenter ? 16 : 14, fontWeight: 700, fontFamily: T.font, cursor: allAnswered ? "pointer" : "default", transition: "all 0.2s" }}>
              {allAnswered ? "Vezi rezultatul →" : `Răspunde la toate întrebările (${answered}/${total})`}
            </button>
          </div>
        </div>
      ) : result && (
        <div>
          {/* Result header */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: presenter ? 14 : 12, color: T.textMuted, fontFamily: T.font, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Profilul tău de risc</div>
            <div style={{ fontSize: presenter ? 36 : 28, fontWeight: 700, color: result.color, fontFamily: T.font }}>{result.profile}</div>
            <div style={{ fontSize: presenter ? 14 : 12, color: T.textMuted, fontFamily: T.font, marginTop: 8 }}>Scor: {result.sum} din {total * 5} ({result.pct}%)</div>
          </div>

          {/* Gauge */}
          <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, marginBottom: 16 }}>
            <div ref={containerRef} style={{ display: "flex", justifyContent: "center" }}><canvas ref={canvasRef} style={{ display: "block" }} /></div>
          </div>

          {/* Description */}
          <div style={{ padding: "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, marginBottom: 16 }}>
            <div style={{ fontSize: presenter ? 14 : 12, fontFamily: T.font, color: T.text, lineHeight: 1.7 }}>{result.description}</div>
          </div>

          {/* Insight */}
          <div style={{ padding: "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}`, marginBottom: 16 }}>
            <div style={{ fontSize: presenter ? 14 : 12, fontFamily: T.font, color: T.text, lineHeight: 1.6 }}>
              <strong>Important:</strong> Acest chestionar oferă o evaluare orientativă. Toleranța la risc se schimbă în timp și depinde de context. Un consilier financiar poate face o evaluare mai detaliată, ținând cont de situația ta completă.
            </div>
          </div>

          {/* Retake */}
          <div style={{ textAlign: "center" }}>
            <button onClick={reset} style={{ padding: presenter ? "12px 32px" : "10px 24px", background: "transparent", color: T.burgundy, border: `2px solid ${T.burgundy}`, borderRadius: T.radiusSm, fontSize: presenter ? 14 : 12, fontWeight: 700, fontFamily: T.font, cursor: "pointer" }}>↻ Refă evaluarea</button>
          </div>

          <CTA presenter={presenter} />
        </div>
      )}

      {!showResult && <CTA presenter={presenter} />}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// ABOUT PANEL (DRAWER)
// ═══════════════════════════════════════════════════════════════

function AboutPanel({ isOpen, onClose }) {
  const { open: openBooking } = React.useContext(ModalContext);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = "hidden"; } else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  const CredPill = ({ children, href }) => {
    const inner = (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: T.burgundyFaint, borderRadius: 999, fontSize: 11, fontWeight: 600, color: T.burgundy, fontFamily: T.font, whiteSpace: "nowrap", border: `1px solid ${T.burgundyMuted}`, cursor: href ? "pointer" : "default", transition: "background 0.15s" }}>{children}</span>
    );
    return href ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{inner}</a> : inner;
  };

  const SectionTitle = ({ children }) => (
    <div style={{ fontSize: 20, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 12, lineHeight: 1.3 }}>{children}</div>
  );

  const Body = ({ children }) => (
    <div style={{ fontSize: 13, color: T.textMuted, fontFamily: T.font, lineHeight: 1.7, marginBottom: 24 }}>{children}</div>
  );

  const GreenPill = ({ value, label }) => (
    <div style={{ padding: "10px 16px", background: T.greenFaint, borderRadius: T.radiusSm, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.greenMuted}` }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: T.green, fontFamily: T.font }}>{value}</span>
      <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.font }}>{label}</span>
    </div>
  );

  const BeforeItem = ({ children }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
      <span style={{ color: T.red, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✕</span>
      <span style={{ fontSize: 12, color: T.textMuted, fontFamily: T.font, lineHeight: 1.5 }}>{children}</span>
    </div>
  );

  const AfterItem = ({ children }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
      <span style={{ color: T.green, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
      <span style={{ fontSize: 12, color: T.text, fontFamily: T.font, lineHeight: 1.5 }}>{children}</span>
    </div>
  );

  const Step = ({ num, title, desc }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.burgundy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, fontFamily: T.font, flexShrink: 0 }}>{num}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 10001,
        background: isOpen ? "rgba(44,30,38,0.5)" : "transparent",
        backdropFilter: isOpen ? "blur(3px)" : "none",
        pointerEvents: isOpen ? "auto" : "none",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
      }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 10002,
        width: "100%", maxWidth: 520,
        background: T.cream,
        boxShadow: isOpen ? "-16px 0 60px rgba(44,30,38,0.15)" : "none",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 20px 0" }}>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: "50%", border: "none",
            background: T.burgundyMuted, color: T.burgundy, fontSize: 20,
            fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", transition: "background 0.15s", fontFamily: T.font, lineHeight: 1,
          }} onMouseEnter={e => e.target.style.background = T.burgundySubtle}
             onMouseLeave={e => e.target.style.background = T.burgundyMuted}>&times;</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 28px 40px", WebkitOverflowScrolling: "touch" }}>

          {/* ── SECTION 1: Hero ── */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.burgundy, fontFamily: T.font, lineHeight: 1.3, marginBottom: 12 }}>
              Nu sunt un consultant financiar tipic. Sunt un antreprenor care este liber financiar.
            </div>
            <div style={{ fontSize: 14, color: T.textMuted, fontFamily: T.font, lineHeight: 1.5 }}>
              Independență financiară la 29 de ani. Acum te ajut și pe tine.
            </div>
          </div>

          {/* ── SECTION 2: Story ── */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <img src="https://planable.imgix.net/BX3Rd95mwvvAuKGGa/E53AA5EuKR-image-169-src-1.png?auto=format&w=200&h=200&dpr=2" alt="Vlad Caluș" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${T.burgundyMuted}` }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>Vlad Caluș</div>
                <div style={{ fontSize: 12, color: T.textMuted, fontFamily: T.font, lineHeight: 1.5 }}>Fondator Minimalistu</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: T.textMuted, fontFamily: T.font, lineHeight: 1.75, marginBottom: 20 }}>
              Am renunțat la facultate la 19 ani ca să lansez Planable — o platformă de social media management pe care am crescut-o la 7 cifre ARR și am vândut-o în 2025 împreună cu co-fondatorii mei.
              <br /><br />
              La 29 de ani am devenit independent financiar. Nu din noroc, ci din disciplină: 7 ani de investiții la bursă, mii de ore de studiu, și o obsesie pentru a înțelege cum funcționează banii.
              <br /><br />
              Am documentat toată călătoria pe <strong style={{ color: T.burgundy }}>@minimalistu.eu</strong>, unde o comunitate de 50.000+ de oameni învață să-și ia finanțele în propriile mâini.
              <br /><br />
              Povestea completă și metodologia mea sunt în cartea «Independența financiară în 7 pași», disponibilă pe <a href="https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017" target="_blank" rel="noopener noreferrer" style={{ color: T.burgundy, fontWeight: 600, textDecoration: "underline" }}>Cărturești</a>.
            </div>

            {/* Credibility pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <CredPill>🏆 Forbes 30 Sub 30</CredPill>
              <CredPill>🚀 Techstars London Alumni</CredPill>
              <CredPill href="https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017">📖 Independența financiară în 7 pași</CredPill>
              <CredPill>🔑 Exit Planable → SE Ranking (2025)</CredPill>
            </div>
          </div>

          {/* ── SECTION 3: Minimalistu ── */}
          <div style={{ marginBottom: 40 }}>
            <SectionTitle>Despre Minimalistu</SectionTitle>
            <Body>
              Am construit Minimalistu pentru oamenii care câștigă bine, dar nu au un plan clar pentru banii lor.
              <br /><br />
              Nu vindem produse financiare. Te ajutăm să înțelegi ce ai, ce-ți lipsește, și ce pași concreți să faci.
            </Body>
          </div>

          {/* ── SECTION 4: Results ── */}
          <div style={{ marginBottom: 40 }}>
            <SectionTitle>Numere, nu promisiuni</SectionTitle>
            <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <StatCard label="Studenți activi" value="13.000+" color={T.burgundy} bgColor={T.burgundyFaint} icon="🎓" />
              <StatCard label="Clienți consultați" value="250+" color={T.burgundy} bgColor={T.burgundyFaint} icon="🤝" />
              <StatCard label="Comunitate" value="50.000+" color={T.burgundy} bgColor={T.burgundyFaint} icon="📱" />
              <StatCard label="Portofolii analizate" value="€2M+" color={T.burgundy} bgColor={T.burgundyFaint} icon="🔬" />
            </div>
          </div>

          {/* ── SECTION 5: Transformări reale ── */}
          <div style={{ marginBottom: 40 }}>
            <SectionTitle>Transformări reale din programul nostru</SectionTitle>
            <Body>Două exemple anonimizate din programul Mastermind. Fiecare portofoliu a fost reconstruit pe baza profilului psihologic al investitorului.</Body>

            {/* Transformation 1 */}
            <div style={{ background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: T.font }}>Capital blocat → Capital care lucrează</div>
              </div>
              <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {/* Before */}
                <div style={{ padding: "16px 20px", borderRight: `1px solid ${T.border}`, background: T.redFaint }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.red, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontFamily: T.font }}>Problema</div>
                  <BeforeItem>53% din capital blocat în cash neproductiv</BeforeItem>
                  <BeforeItem>Doar 8% expunere la acțiuni</BeforeItem>
                  <BeforeItem>Fonduri mutuale cu comisioane de 2-3% pe an</BeforeItem>
                  <BeforeItem>Diversificare aproape zero — concentrat pe România</BeforeItem>
                </div>
                {/* After */}
                <div style={{ padding: "16px 20px", background: T.greenFaint }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontFamily: T.font }}>Soluția noastră</div>
                  <AfterItem>70% acțiuni globale (ETF-uri), 23% titluri de stat, 5% aur</AfterItem>
                  <AfterItem>Acces la 3.000+ companii din întreaga lume</AfterItem>
                  <AfterItem>Comisioane reduse de la 2-3% la 0.20%</AfterItem>
                  <AfterItem>Implementare graduală prin DCA în 3-6 luni</AfterItem>
                </div>
              </div>
              {/* Results */}
              <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <GreenPill value="+3.18%" label="randament anual estimat" />
                <GreenPill value="+€180K" label="diferență pe 20 ani" />
                <GreenPill value="€40K" label="economie comisioane" />
                <GreenPill value="98%" label="capital productiv" />
              </div>
            </div>

            {/* Transformation 2 */}
            <div style={{ background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: T.font }}>De la anxietate la stabilitate</div>
              </div>
              <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {/* Before */}
                <div style={{ padding: "16px 20px", borderRight: `1px solid ${T.border}`, background: T.redFaint }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.red, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontFamily: T.font }}>Problema</div>
                  <BeforeItem>24.5% în crypto — profil ultra-conservator (deschidere 10%)</BeforeItem>
                  <BeforeItem>Zero venit lunar predictibil, familie dependentă</BeforeItem>
                  <BeforeItem>Credit imobiliar + zero venit activ</BeforeItem>
                  <BeforeItem>Volatilitate lunară de ±zeci de mii de euro</BeforeItem>
                  <BeforeItem>Anxietate constantă și stres financiar</BeforeItem>
                </div>
                {/* After */}
                <div style={{ padding: "16px 20px", background: T.greenFaint }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontFamily: T.font }}>Soluția noastră</div>
                  <AfterItem>Crypto redus de la 24.5% la 4%</AfterItem>
                  <AfterItem>Obligațiuni generatoare de venit: 0% → 22.5%</AfterItem>
                  <AfterItem>ETF cu dividende adăugat (4.5% randament)</AfterItem>
                  <AfterItem>Strategie fiscală: vânzare crypto în regim favorabil</AfterItem>
                  <AfterItem>Plan concret în 5 pași prioritizați</AfterItem>
                </div>
              </div>
              {/* Results */}
              <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <GreenPill value="6x" label="reducere volatilitate" />
                <GreenPill value="€0 → venit" label="pasiv din obligațiuni" />
                <GreenPill value="22.5%" label="componentă stabilă nouă" />
                <GreenPill value="😴" label="somn liniștit" />
              </div>
            </div>
          </div>

          {/* ── SECTION 6: How it works ── */}
          <div style={{ marginBottom: 40 }}>
            <SectionTitle>Cum funcționează</SectionTitle>
            <div style={{ marginTop: 16 }}>
              <Step num="1" title="Analiză personalitate" desc="Profilul tău psihologic prin 5 dimensiuni (conștiinciozitate, stabilitate emoțională, extroversie, deschidere)" />
              <Step num="2" title="Diagnostic portofoliu" desc="Radiografia completă a alocării actuale: ce funcționează, ce te costă, ce lipsește" />
              <Step num="3" title="Strategie personalizată" desc="Portofoliu reconstruit specific pentru profilul tău, nu o soluție generică" />
              <Step num="4" title="Plan de acțiune" desc="Pași exacți, prioritizați, cu timeline și beneficii fiscale incluse" />
            </div>
          </div>

          {/* ── SECTION 7: CTA ── */}
          <div style={{ padding: "24px 28px", background: `linear-gradient(135deg, ${T.burgundy}, ${T.burgundyDark})`, borderRadius: T.radius }}>
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, fontFamily: T.font, marginBottom: 8, lineHeight: 1.3 }}>
              Ai bani, dar nu ai un plan. Hai să schimbăm asta.
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: T.font, lineHeight: 1.55, marginBottom: 16 }}>
              250+ de oameni ca tine au transformat economiile într-o strategie clară.
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <button onClick={() => { onClose(); setTimeout(openBooking, 350); }} style={{ padding: "12px 28px", background: T.amber, border: "none", borderRadius: T.radiusSm, color: T.burgundyDark, fontSize: 14, fontWeight: 700, fontFamily: T.font, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(232,168,50,0.4)"; }}
                onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
                Vreau un plan concret &rarr;
              </button>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: T.font }}>{"\u2713"} Fără obligații · {"\u2713"} 100% confidențial · {"\u2713"} Răspuns în 24h</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 10: CALCULATOR AVERE NETĂ (NET WORTH CALCULATOR)
// ═══════════════════════════════════════════════════════════════

function NWDonutChart({ liquid, illiquid, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 320 : 260;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    const total = liquid + illiquid;
    if (total <= 0) return;
    const cx = w / 2, cy = h / 2, outerR = Math.min(cx, cy) - 20, innerR = outerR * 0.6;
    if (outerR <= 0 || innerR <= 0) return;
    const liqPct = liquid / total, illPct = illiquid / total;
    const startL = -Math.PI / 2, endL = startL + liqPct * 2 * Math.PI;
    // Liquid segment
    ctx.beginPath(); ctx.arc(cx, cy, outerR, startL, endL); ctx.arc(cx, cy, innerR, endL, startL, true); ctx.closePath();
    ctx.fillStyle = T.green; ctx.fill();
    // Illiquid segment
    ctx.beginPath(); ctx.arc(cx, cy, outerR, endL, startL + 2 * Math.PI); ctx.arc(cx, cy, innerR, startL + 2 * Math.PI, endL, true); ctx.closePath();
    ctx.fillStyle = "rgba(44,30,38,0.15)"; ctx.fill();
    // Center text
    ctx.fillStyle = T.burgundy; ctx.font = `700 ${presenter ? 18 : 15}px DM Sans,sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Avere Netă", cx, cy - (presenter ? 14 : 10));
    ctx.font = `700 ${presenter ? 28 : 22}px DM Sans,sans-serif`;
    ctx.fillText(fmtK(total), cx, cy + (presenter ? 14 : 10));
    // Labels
    const fs = presenter ? 13 : 11;
    // Liquid label
    const lAngle = startL + (liqPct * Math.PI);
    const lx = cx + (outerR + 24) * Math.cos(lAngle), ly = cy + (outerR + 24) * Math.sin(lAngle);
    ctx.fillStyle = T.green; ctx.font = `700 ${fs}px DM Sans,sans-serif`; ctx.textAlign = lx < cx ? "right" : "left";
    ctx.fillText(`Lichid: ${fmtK(liquid)} (${Math.round(liqPct * 100)}%)`, lx, ly);
    // Illiquid label
    const iAngle = endL + (illPct * Math.PI);
    const ix = cx + (outerR + 24) * Math.cos(iAngle), iy = cy + (outerR + 24) * Math.sin(iAngle);
    ctx.fillStyle = T.textMuted; ctx.font = `700 ${fs}px DM Sans,sans-serif`; ctx.textAlign = ix < cx ? "right" : "left";
    ctx.fillText(`Nelichid: ${fmtK(illiquid)} (${Math.round(illPct * 100)}%)`, ix, iy);
  }, [liquid, illiquid, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%" }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function NWProjectionChart({ dataNoChange, dataOptimized, years, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 380 : 300;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!dataNoChange || dataNoChange.length < 2) return;
    const pad = { top: 40, right: presenter ? 110 : 80, bottom: 50, left: presenter ? 80 : 64 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const allVals = [...dataNoChange, ...dataOptimized];
    const maxVal = Math.max(...allVals) * 1.12 || 1;
    const x = i => pad.left + (i / (dataNoChange.length - 1)) * cw;
    const y = v => pad.top + ch - (v / maxVal) * ch;
    // Grid
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.font = `${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) { const val = (i / 5) * maxVal, yy = y(val); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(w - pad.right, yy); ctx.stroke(); ctx.fillText(fmtK(val), pad.left - 10, yy + 4); }
    ctx.setLineDash([]); ctx.textAlign = "center"; ctx.fillStyle = T.textLight;
    dataNoChange.forEach((_, i) => { const skip = dataNoChange.length > 20 ? 5 : dataNoChange.length > 10 ? 2 : 1; if (i % skip === 0) ctx.fillText(i === 0 ? "Azi" : `${i} ani`, x(i), h - pad.bottom + 22); });
    // Fill between lines
    ctx.beginPath();
    dataOptimized.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
    for (let i = dataNoChange.length - 1; i >= 0; i--) ctx.lineTo(x(i), y(dataNoChange[i]));
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch); grad.addColorStop(0, "rgba(47,140,94,0.12)"); grad.addColorStop(1, "rgba(47,140,94,0.02)"); ctx.fillStyle = grad; ctx.fill();
    // No change line
    ctx.beginPath(); dataNoChange.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
    ctx.strokeStyle = T.textMuted; ctx.lineWidth = presenter ? 3 : 2; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
    // Optimized line
    ctx.beginPath(); dataOptimized.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
    ctx.strokeStyle = T.green; ctx.lineWidth = presenter ? 3.5 : 2.5; ctx.stroke();
    // End dots
    const lastIdx = dataNoChange.length - 1;
    ctx.beginPath(); ctx.arc(x(lastIdx), y(dataOptimized[lastIdx]), presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.green; ctx.fill();
    ctx.beginPath(); ctx.arc(x(lastIdx), y(dataNoChange[lastIdx]), presenter ? 6 : 4, 0, Math.PI * 2); ctx.fillStyle = T.textMuted; ctx.fill();
    ctx.font = `600 ${presenter ? 14 : 12}px DM Sans,sans-serif`; ctx.textAlign = "left";
    ctx.fillStyle = T.green; ctx.fillText(fmtK(dataOptimized[lastIdx]), x(lastIdx) + 10, y(dataOptimized[lastIdx]) + 5);
    ctx.fillStyle = T.textMuted; ctx.fillText(fmtK(dataNoChange[lastIdx]), x(lastIdx) + 10, y(dataNoChange[lastIdx]) + 5);
    // Gap at year 20 or midpoint
    const gapIdx = Math.min(20, Math.floor(dataNoChange.length * 0.65));
    if (gapIdx > 0 && gapIdx < dataNoChange.length) {
      const gx = x(gapIdx), gy1 = y(dataOptimized[gapIdx]), gy2 = y(dataNoChange[gapIdx]);
      const gap = dataOptimized[gapIdx] - dataNoChange[gapIdx];
      if (gap > 0) {
        ctx.strokeStyle = T.amber; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx + 4, gy1 + 6); ctx.lineTo(gx + 4, gy2 - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx, gy1 + 6); ctx.lineTo(gx + 4, gy1 + 2); ctx.lineTo(gx + 8, gy1 + 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(gx, gy2 - 6); ctx.lineTo(gx + 4, gy2 - 2); ctx.lineTo(gx + 8, gy2 - 6); ctx.stroke();
        ctx.font = `700 ${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.amber; ctx.textAlign = "left";
        ctx.fillText(`+${fmtK(gap)}`, gx + 14, (gy1 + gy2) / 2 + 4);
      }
    }
    // Legend
    const ly = pad.top - 16; ctx.font = `500 ${presenter ? 13 : 11}px DM Sans,sans-serif`;
    ctx.fillStyle = T.green; ctx.fillRect(pad.left, ly - 4, 14, 3); ctx.fillText("Investit optim", pad.left + 20, ly);
    ctx.setLineDash([4, 3]); ctx.strokeStyle = T.textMuted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(pad.left + 130, ly - 2.5); ctx.lineTo(pad.left + 144, ly - 2.5); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = T.textMuted; ctx.fillText("Fără schimbări", pad.left + 150, ly);
  }, [dataNoChange, dataOptimized, years, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 8 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function NWStackedBar({ segments, total, presenter }) {
  if (total <= 0) return null;
  return (
    <div style={{ width: "100%", marginTop: 8, marginBottom: 8 }}>
      <div style={{ display: "flex", width: "100%", height: presenter ? 28 : 20, borderRadius: T.radiusXs, overflow: "hidden", background: T.burgundyMuted }}>
        {segments.filter(s => s.value > 0).map((s, i) => (
          <div key={i} title={`${s.label}: ${fmtK(s.value)} (${Math.round(s.value / total * 100)}%)`}
            style={{ width: `${(s.value / total) * 100}%`, background: s.color, minWidth: 2, transition: "width 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        {segments.filter(s => s.value > 0).map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: presenter ? 11 : 9, color: T.textMuted, fontFamily: T.font }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            {s.label}: {fmtK(s.value)} ({Math.round(s.value / total * 100)}%)
          </div>
        ))}
      </div>
    </div>
  );
}

function NWCollapsible({ title, color, isOpen, onToggle, summary, children, presenter }) {
  return (
    <div style={{ marginBottom: 12, background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, overflow: "hidden" }}>
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: presenter ? "16px 24px" : "12px 18px", background: "transparent", border: "none",
        cursor: "pointer", fontFamily: T.font, textAlign: "left",
      }}>
        <span style={{ fontSize: presenter ? 16 : 13, fontWeight: 700, color, display: "flex", alignItems: "center", gap: 8 }}>
          {title}
          {!isOpen && summary && <span style={{ fontSize: presenter ? 12 : 10, fontWeight: 500, color: T.textMuted, marginLeft: 8 }}>{summary}</span>}
        </span>
        <span style={{ fontSize: 12, color: T.textMuted, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {isOpen && <div style={{ padding: presenter ? "0 24px 20px" : "0 18px 16px" }}>{children}</div>}
    </div>
  );
}

function CrossToolCard({ icon, title, desc, btnText, onClick, accent, presenter }) {
  return (
    <div style={{
      padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius,
      border: `1px solid ${accent ? T.burgundyMuted : T.border}`, cursor: "pointer", transition: "box-shadow 0.2s, transform 0.15s",
      borderLeft: accent ? `4px solid ${T.burgundy}` : undefined,
    }}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadowLift; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = ""; }}>
      <div style={{ fontSize: presenter ? 22 : 18, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: presenter ? 15 : 13, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: presenter ? 12 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.5, marginBottom: 12 }}>{desc}</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: presenter ? 13 : 11, fontWeight: 700, color: accent ? T.burgundy : T.green, fontFamily: T.font }}>{btnText} →</div>
    </div>
  );
}

function NetWorthTool({ presenter, onNavigate }) {
  const { open: openModal } = React.useContext(ModalContext);
  const { setPrefill } = React.useContext(CrossToolContext);

  // Assets - Liquid
  const [cash, setCash] = useState(5000);
  const [deposits, setDeposits] = useState(20000);
  const [stocks, setStocks] = useState(10000);
  const [bonds, setBonds] = useState(5000);
  const [crypto, setCrypto] = useState(2000);
  const [gold, setGold] = useState(0);
  // Assets - Illiquid
  const [property, setProperty] = useState(100000);
  const [cars, setCars] = useState(15000);
  const [business, setBusiness] = useState(0);
  // Liabilities
  const [mortgage, setMortgage] = useState(60000);
  const [consumerLoans, setConsumerLoans] = useState(0);
  const [creditCards, setCreditCards] = useState(0);
  // Growth
  const [yearlySavings, setYearlySavings] = useState(6000);
  const [investReturn, setInvestReturn] = useState(7);
  const [propertyAppreciation, setPropertyAppreciation] = useState(3);

  // Collapsible sections
  const [activeOpen, setActiveOpen] = useState(true);
  const [debtOpen, setDebtOpen] = useState(false);
  const [growthOpen, setGrowthOpen] = useState(false);

  // Computed values
  const liquid = cash + deposits + stocks + bonds + crypto + gold;
  const illiquid = property + cars + business;
  const totalAssets = liquid + illiquid;
  const totalDebt = mortgage + consumerLoans + creditCards;
  const netWorth = totalAssets - totalDebt;
  const invested = stocks + bonds + crypto;
  const uninvested = cash + deposits + gold;
  const debtRatio = totalAssets > 0 ? (totalDebt / totalAssets) * 100 : 0;
  const liquidPct = totalAssets > 0 ? (liquid / totalAssets) * 100 : 0;

  // Debt monthly estimates
  const mortgageMonthly = mortgage > 0 ? Math.round(mortgage * (0.05 / 12) / (1 - Math.pow(1 + 0.05 / 12, -360))) : 0;
  const consumerMonthly = consumerLoans > 0 ? Math.round(consumerLoans * (0.10 / 12) / (1 - Math.pow(1 + 0.10 / 12, -60))) : 0;
  const cardMonthly = creditCards > 0 ? Math.round(creditCards * 0.03) : 0;
  const totalDebtMonthly = mortgageMonthly + consumerMonthly + cardMonthly;
  const freeableMonthly = consumerMonthly + cardMonthly;

  // Projection data
  const projectionYears = 30;
  const projectionNoChange = useMemo(() => {
    const pts = [netWorth];
    let liq = liquid, illiq = illiquid, debt = totalDebt;
    for (let y = 1; y <= projectionYears; y++) {
      const cashPart = cash + deposits + gold;
      const investPart = stocks + bonds + crypto;
      const cashGrowth = cashPart * Math.pow(1.01, y) + (yearlySavings * 0.5) * y;
      const investGrowth = investPart * Math.pow(1 + investReturn / 100, y) + (yearlySavings * 0.5) * ((Math.pow(1 + investReturn / 100, y) - 1) / (investReturn / 100));
      const propGrowth = property * Math.pow(1 + propertyAppreciation / 100, y);
      const otherIlliq = cars * Math.pow(0.9, y) + business * Math.pow(1.05, y);
      const debtRemain = Math.max(0, mortgage * Math.pow(0.97, y)) + Math.max(0, consumerLoans * Math.pow(0.8, y)) + Math.max(0, creditCards * Math.pow(0.7, y));
      pts.push(Math.round(cashGrowth + investGrowth + propGrowth + otherIlliq - debtRemain));
    }
    return pts;
  }, [cash, deposits, gold, stocks, bonds, crypto, property, cars, business, mortgage, consumerLoans, creditCards, yearlySavings, investReturn, propertyAppreciation, netWorth]);

  const projectionOptimized = useMemo(() => {
    const pts = [netWorth];
    const allInvestable = liquid;
    for (let y = 1; y <= projectionYears; y++) {
      const investGrowth = allInvestable * Math.pow(1 + investReturn / 100, y) + yearlySavings * ((Math.pow(1 + investReturn / 100, y) - 1) / (investReturn / 100));
      const propGrowth = property * Math.pow(1 + propertyAppreciation / 100, y);
      const otherIlliq = cars * Math.pow(0.9, y) + business * Math.pow(1.05, y);
      const debtRemain = Math.max(0, mortgage * Math.pow(0.97, y)) + Math.max(0, consumerLoans * Math.pow(0.8, y)) + Math.max(0, creditCards * Math.pow(0.7, y));
      pts.push(Math.round(investGrowth + propGrowth + otherIlliq - debtRemain));
    }
    return pts;
  }, [liquid, property, cars, business, mortgage, consumerLoans, creditCards, yearlySavings, investReturn, propertyAppreciation, netWorth]);

  // Milestones
  const milestones = useMemo(() => {
    const targets = [100000, 250000, 500000, 1000000];
    return targets.map(t => {
      if (netWorth >= t) return { target: t, years: 0, reached: true };
      const idx = projectionOptimized.findIndex(v => v >= t);
      return { target: t, years: idx > 0 ? idx : null, reached: false };
    });
  }, [projectionOptimized, netWorth]);

  // Debt health
  const debtHealth = debtRatio < 20 ? { color: T.green, label: "Sănătos — datoriile sunt sub control" } :
    debtRatio < 40 ? { color: T.amber, label: "Moderat — atenție la creditele de consum" } :
    debtRatio < 60 ? { color: T.red, label: "Ridicat — datoriile consumă o parte semnificativă" } :
    { color: "#8B0000", label: "Critic — prioritizează reducerea datoriilor" };

  // Top 3 assets
  const assetList = [
    { name: "Proprietăți", value: property }, { name: "Depozite", value: deposits },
    { name: "Acțiuni/ETF", value: stocks }, { name: "Cash", value: cash },
    { name: "Obligațiuni", value: bonds }, { name: "Crypto", value: crypto },
    { name: "Aur", value: gold }, { name: "Auto", value: cars },
    { name: "Business", value: business },
  ].filter(a => a.value > 0).sort((a, b) => b.value - a.value);
  const top3 = assetList.slice(0, 3);

  // Bar segments
  const barSegments = [
    { label: "Cash", value: cash, color: T.green },
    { label: "Depozite", value: deposits, color: "#4CAF7D" },
    { label: "Acțiuni", value: stocks, color: "#2E7D50" },
    { label: "Obligațiuni", value: bonds, color: "#5BA88A" },
    { label: "Crypto", value: crypto, color: "#F0C060" },
    { label: "Aur", value: gold, color: "#D4A843" },
    { label: "Proprietăți", value: property, color: "rgba(44,30,38,0.25)" },
    { label: "Auto", value: cars, color: "rgba(44,30,38,0.15)" },
    { label: "Business", value: business, color: "rgba(44,30,38,0.20)" },
  ];

  const handleNavigate = (targetTool, prefillData) => {
    setPrefill(prefillData);
    onNavigate(targetTool);
  };

  const gap = presenter ? 32 : 20;

  return (
    <div>
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left" }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: presenter ? 36 : 24, fontWeight: 400, color: T.burgundy, margin: 0, lineHeight: 1.15 }}>
          Calculatorul tău de <span style={{ color: T.amber }}>Avere Netă</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: presenter ? 15 : 13, color: T.textMuted, margin: "8px 0 0 0", lineHeight: 1.5 }}>
          Imaginea completă a finanțelor tale. Descoperă cât din averea ta lucrează activ.
        </p>
      </div>

      <div className="m-tool-layout" style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {/* ── INPUT PANEL ── */}
        <div style={{ flex: presenter ? "0 0 400px" : "0 0 340px", minWidth: 280 }}>
          <NWCollapsible title="ACTIVE (Avere)" color={T.green} isOpen={activeOpen} onToggle={() => setActiveOpen(o => !o)} summary={`Total: ${fmtK(totalAssets)}`} presenter={presenter}>
            <div style={{ fontSize: presenter ? 12 : 10, fontWeight: 600, color: T.green, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12, fontFamily: T.font }}>Lichide</div>
            <Slider label="💵 Cash (numerar + conturi)" value={cash} onChange={setCash} min={0} max={500000} step={1000} formatValue={fmt} presenter={presenter} />
            <Slider label="🏦 Depozite bancare" value={deposits} onChange={setDeposits} min={0} max={1000000} step={1000} formatValue={fmt} presenter={presenter} />
            <Slider label="📈 Acțiuni / ETF-uri" value={stocks} onChange={setStocks} min={0} max={2000000} step={1000} formatValue={fmt} presenter={presenter} />
            <Slider label="📊 Obligațiuni / Titluri de stat" value={bonds} onChange={setBonds} min={0} max={1000000} step={1000} formatValue={fmt} presenter={presenter} />
            <Slider label="₿ Criptomonede" value={crypto} onChange={setCrypto} min={0} max={500000} step={500} formatValue={fmt} presenter={presenter} />
            <Slider label="🥇 Aur / Metale prețioase" value={gold} onChange={setGold} min={0} max={500000} step={500} formatValue={fmt} presenter={presenter} />
            <div style={{ height: 16 }} />
            <div style={{ fontSize: presenter ? 12 : 10, fontWeight: 600, color: T.green, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12, fontFamily: T.font }}>Nelichide</div>
            <Slider label="🏠 Proprietăți imobiliare" value={property} onChange={setProperty} min={0} max={5000000} step={5000} formatValue={fmt} presenter={presenter} />
            <Slider label="🚗 Autoturisme" value={cars} onChange={setCars} min={0} max={500000} step={1000} formatValue={fmt} presenter={presenter} />
            <Slider label="🏢 Participații în afaceri" value={business} onChange={setBusiness} min={0} max={5000000} step={5000} formatValue={fmt} presenter={presenter} />
          </NWCollapsible>

          <NWCollapsible title="DATORII" color={T.red} isOpen={debtOpen} onToggle={() => setDebtOpen(o => !o)} summary={totalDebt > 0 ? `Total: ${fmtK(totalDebt)}` : "Fără datorii"} presenter={presenter}>
            <Slider label="🏠 Credit ipotecar (sold rămas)" value={mortgage} onChange={setMortgage} min={0} max={2000000} step={1000} formatValue={fmt} presenter={presenter} />
            <Slider label="💳 Credite de consum" value={consumerLoans} onChange={setConsumerLoans} min={0} max={200000} step={500} formatValue={fmt} presenter={presenter} />
            <Slider label="💳 Carduri de credit (sold)" value={creditCards} onChange={setCreditCards} min={0} max={100000} step={500} formatValue={fmt} presenter={presenter} />
          </NWCollapsible>

          <NWCollapsible title="CREȘTERE" color={T.amber} isOpen={growthOpen} onToggle={() => setGrowthOpen(o => !o)} summary={`${fmtK(yearlySavings)}/an · ${investReturn}% randament`} presenter={presenter}>
            <Slider label="Rata anuală de economisire" value={yearlySavings} onChange={setYearlySavings} min={0} max={100000} step={500} formatValue={v => `${fmt(v)}/an`} presenter={presenter} tip={`Echivalent cu ${fmt(Math.round(yearlySavings / 12))}/lună`} />
            <Slider label="Randament investiții (% anual)" value={investReturn} onChange={setInvestReturn} min={0} max={15} step={0.5} suffix="%" presenter={presenter} tip="MSCI World ~10%/an istoric. 7% e conservator." />
            <Slider label="Apreciere proprietăți (% anual)" value={propertyAppreciation} onChange={setPropertyAppreciation} min={0} max={10} step={0.5} suffix="%" presenter={presenter} />
          </NWCollapsible>
        </div>

        {/* ── OUTPUT DASHBOARD ── */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap }}>

          {/* AHA #1: Big Number */}
          <div style={{ padding: presenter ? "28px 32px" : "20px 24px", background: T.burgundyFaint, borderRadius: T.radius, border: `1px solid ${T.burgundyMuted}`, textAlign: presenter ? "center" : "left" }}>
            <div style={{ fontSize: presenter ? 14 : 11, fontWeight: 600, color: T.burgundy, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font }}>Averea ta netă</div>
            <div style={{ fontSize: presenter ? 56 : 40, fontWeight: 700, color: netWorth >= 0 ? T.burgundy : T.red, fontFamily: T.font, lineHeight: 1 }}>{fmt(netWorth)}</div>
            <div style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, fontFamily: T.font, marginTop: 8 }}>
              Total active: {fmtK(totalAssets)} · Total datorii: {fmtK(totalDebt)}
            </div>
            <NWStackedBar segments={barSegments} total={totalAssets} presenter={presenter} />
            {top3.length > 0 && (
              <div style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, fontFamily: T.font, marginTop: 4 }}>
                Top 3: {top3.map((a, i) => `${a.name} ${fmtK(a.value)} (${Math.round(a.value / totalAssets * 100)}%)`).join(", ")}
              </div>
            )}
          </div>

          {/* AHA #2: Lichid vs Nelichid */}
          <div style={{ padding: presenter ? "24px 28px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8, fontFamily: T.font }}>Lichid vs. Nelichid</div>
            <NWDonutChart liquid={liquid} illiquid={illiquid} presenter={presenter} />
            {liquidPct < 30 && totalAssets > 0 && (
              <div style={{ marginTop: 12, padding: "12px 16px", background: T.amberFaint, borderRadius: T.radiusSm, borderLeft: `4px solid ${T.amber}` }}>
                <div style={{ fontSize: presenter ? 14 : 12, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 4 }}>
                  ⚠️ {Math.round(100 - liquidPct)}% din averea ta este blocată în active nelichide.
                </div>
                <div style={{ fontSize: presenter ? 12 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.5 }}>
                  Doar {fmtK(liquid)} lucrează activ pentru tine. Averea ta arată bine pe hârtie, dar cea mai mare parte nu poate fi investită sau accesată rapid.
                </div>
              </div>
            )}
            {/* Sub-insight: Investit vs Neinvestit */}
            {liquid > 0 && (
              <div style={{ marginTop: 12, padding: "12px 16px", background: T.greenFaint, borderRadius: T.radiusSm }}>
                <div style={{ fontSize: presenter ? 12 : 10, fontWeight: 600, color: T.textMuted, fontFamily: T.font, marginBottom: 8 }}>
                  Din {fmtK(liquid)} lichide: {fmtK(invested)} investiți · {fmtK(uninvested)} în cash/depozite
                </div>
                <div style={{ display: "flex", height: presenter ? 14 : 10, borderRadius: 4, overflow: "hidden", background: T.burgundyMuted }}>
                  {invested > 0 && <div style={{ width: `${(invested / liquid) * 100}%`, background: T.green, transition: "width 0.3s" }} />}
                  {uninvested > 0 && <div style={{ width: `${(uninvested / liquid) * 100}%`, background: "rgba(44,30,38,0.12)", transition: "width 0.3s" }} />}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: presenter ? 11 : 9, fontFamily: T.font }}>
                  <span style={{ color: T.green }}>Investit: {Math.round(invested / liquid * 100)}%</span>
                  <span style={{ color: T.textMuted }}>Neinvestit: {Math.round(uninvested / liquid * 100)}%</span>
                </div>
              </div>
            )}
          </div>

          {/* AHA #3: Projection */}
          <div style={{ padding: presenter ? "20px 24px 16px" : "16px 20px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font }}>Proiecție — La acest ritm...</div>
            <NWProjectionChart dataNoChange={projectionNoChange} dataOptimized={projectionOptimized} years={projectionYears} presenter={presenter} />
            {projectionOptimized.length > 20 && projectionNoChange.length > 20 && (
              <div style={{ textAlign: "center", marginTop: 8, fontSize: presenter ? 14 : 12, fontWeight: 700, color: T.amber, fontFamily: T.font }}>
                Diferența la 20 de ani: +{fmtK(projectionOptimized[20] - projectionNoChange[20])} dacă pui capitalul la lucru
              </div>
            )}
            {/* Milestones */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ padding: "6px 12px", background: m.reached ? T.greenFaint : T.cream, borderRadius: T.radiusXs, border: `1px solid ${m.reached ? T.greenMuted : T.border}`, fontSize: presenter ? 12 : 10, fontFamily: T.font }}>
                  <span style={{ fontWeight: 700, color: m.reached ? T.green : T.text }}>{fmtK(m.target)}</span>
                  <span style={{ color: T.textMuted, marginLeft: 4 }}>
                    {m.reached ? "✓ Deja acolo!" : m.years ? `→ ${m.years} ani` : "→ 30+ ani"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AHA #4: Debt ratio */}
          {totalDebt > 0 && (
            <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8, fontFamily: T.font }}>Datorii vs. Active productive</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: presenter ? 32 : 24, fontWeight: 700, color: debtHealth.color, fontFamily: T.font }}>{Math.round(debtRatio)}%</span>
                <span style={{ fontSize: presenter ? 13 : 11, color: debtHealth.color, fontFamily: T.font, fontWeight: 600 }}>{debtHealth.label}</span>
              </div>
              <div style={{ width: "100%", height: presenter ? 10 : 6, borderRadius: 4, background: T.burgundyMuted, marginBottom: 12 }}>
                <div style={{ width: `${Math.min(debtRatio, 100)}%`, height: "100%", borderRadius: 4, background: debtHealth.color, transition: "width 0.3s" }} />
              </div>
              {totalDebtMonthly > 0 && (
                <div style={{ fontSize: presenter ? 12 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6 }}>
                  Plătești ~<strong style={{ color: T.text }}>{fmt(totalDebtMonthly)}/lună</strong> pe datorii.
                  {freeableMonthly > 0 && <> Dacă elimini creditele de consum și cardurile, eliberezi <strong style={{ color: T.green }}>{fmt(freeableMonthly)}/lună</strong> pentru investiții.</>}
                </div>
              )}
            </div>
          )}

          {/* Insight box */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 15 : 13, color: T.text, fontFamily: T.font, lineHeight: 1.6 }}>
              {liquidPct < 30 ? (
                <><strong style={{ color: T.burgundy }}>Averea ta e concentrată în active nelichide.</strong> Doar <strong style={{ color: T.green }}>{Math.round(liquidPct)}%</strong> este lichid — o realocare ar putea accelera creșterea semnificativ.</>
              ) : invested < uninvested ? (
                <><strong style={{ color: T.burgundy }}>Ai capital lichid, dar mare parte stă neproductiv.</strong> Din {fmtK(liquid)} lichide, doar {fmtK(invested)} sunt investiți. Restul de {fmtK(uninvested)} poate lucra mai mult pentru tine.</>
              ) : (
                <><strong style={{ color: T.burgundy }}>Ai o bază solidă.</strong> Cu {fmtK(invested)} investiți activ și economii de {fmtK(yearlySavings)}/an, ești pe drumul bun spre independența financiară.</>
              )}
            </div>
          </div>

          {/* ── CROSS-TOOL CONNECTIONS ── */}
          {!presenter && (
            <div>
              <div style={{ fontSize: presenter ? 16 : 14, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 12 }}>Pasul următor: Aprofundează analiza</div>
              <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {stocks + bonds + crypto > 5000 && (
                  <CrossToolCard icon="📊" title="Analizează-ți portofoliul" desc={`Ai ${fmtK(stocks + bonds + crypto)} în investiții. Verifică alocarea, riscul și comisioanele.`} btnText="Deschide Portfolio X-Ray" presenter={presenter}
                    onClick={() => handleNavigate("xray", { source: "networth", portfolioValue: stocks + bonds + crypto })} />
                )}
                {cash + deposits > 10000 && (
                  <CrossToolCard icon="💸" title="Cât te costă cash-ul?" desc={`Ai ${fmtK(cash + deposits)} în cash/depozite. Calculează costul de oportunitate.`} btnText="Deschide Costul de Oportunitate" presenter={presenter}
                    onClick={() => handleNavigate("cost", { source: "networth", idleAmount: cash + deposits })} />
                )}
                {liquid > 20000 && (
                  <CrossToolCard icon="🔥" title="Calculează numărul tău FIRE" desc={`Cu ${fmtK(liquid)} lichide și ${fmtK(yearlySavings)}/an economii, cât mai ai până la libertatea financiară?`} btnText="Deschide Calculator FIRE" presenter={presenter}
                    onClick={() => handleNavigate("fire", { source: "networth", portfolio: liquid, monthlySavings: Math.round(yearlySavings / 12) })} />
                )}
                {(cash + deposits > liquid * 0.5 || stocks > 5000) && (
                  <CrossToolCard icon="🏦" title="Compară fonduri vs ETF-uri" desc="Verifică cât te costă fondurile mutuale vs ETF-uri pe termen lung." btnText="Deschide Comparație Fonduri" presenter={presenter}
                    onClick={() => handleNavigate("funds", { source: "networth" })} />
                )}
                {property > 0 && mortgage > 0 && (
                  <CrossToolCard icon="🏠" title="Chirie vs Cumpărare" desc="Merită proprietatea ta? Sau ai fi câștigat mai mult investind?" btnText="Deschide Chirie vs Cumpărare" presenter={presenter}
                    onClick={() => handleNavigate("rentvsbuy", { source: "networth", propertyValue: property })} />
                )}
                <CrossToolCard icon="📞" title="Vorbește cu un consultant" desc="Ai o imagine completă. Acum hai să construim un plan." btnText="Vreau un plan concret" accent presenter={presenter}
                  onClick={openModal} />
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ margin: "8px 0 0 0", padding: "24px 28px", background: `linear-gradient(135deg, ${T.burgundy}, ${T.burgundyDark})`, borderRadius: T.radius }}>
            <div className="m-cta-wrap" style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, fontFamily: T.font, marginBottom: 6, lineHeight: 1.3 }}>Ai văzut cifrele. Acum hai să construim un plan.</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: T.font, lineHeight: 1.55 }}>250+ de oameni ca tine au transformat economiile într-o strategie clară de independență financiară.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button onClick={openModal} style={{ padding: "12px 28px", background: T.amber, border: "none", borderRadius: T.radiusSm, color: T.burgundyDark, fontSize: 14, fontWeight: 700, fontFamily: T.font, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(232,168,50,0.4)"; }}
                  onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
                  Vreau un plan concret &rarr;
                </button>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: T.font, whiteSpace: "nowrap" }}>{"\u2713"} Fără obligații · {"\u2713"} 100% confidențial · {"\u2713"} Răspuns în 24h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 11: DCA vs TIMING
// ═══════════════════════════════════════════════════════════════

function DCAComparisonChart({ ana, bogdan, cristina, dan, years, crashYear, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 420 : 340;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!ana || ana.length < 2) return;
    const pad = { top: 44, right: presenter ? 100 : 70, bottom: 50, left: presenter ? 80 : 64 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const all = [...ana, ...bogdan, ...cristina, ...dan];
    const maxVal = Math.max(...all) * 1.1 || 1;
    const n = ana.length;
    const x = i => pad.left + (i / (n - 1)) * cw;
    const y = v => pad.top + ch - (v / maxVal) * ch;
    // Grid
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.font = `${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) { const val = (i / 5) * maxVal, yy = y(val); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(w - pad.right, yy); ctx.stroke(); ctx.fillText(fmtK(val), pad.left - 10, yy + 4); }
    ctx.setLineDash([]); ctx.textAlign = "center"; ctx.fillStyle = T.textLight;
    for (let i = 0; i < n; i++) { const skip = n > 25 ? 5 : n > 12 ? 2 : 1; if (i % skip === 0) ctx.fillText(i === 0 ? "Azi" : `${i}a`, x(i), h - pad.bottom + 22); }
    // Crash marker
    if (crashYear > 0 && crashYear <= years) {
      const cx2 = x(crashYear);
      ctx.strokeStyle = "rgba(192,56,77,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(cx2, pad.top); ctx.lineTo(cx2, pad.top + ch); ctx.stroke(); ctx.setLineDash([]);
      ctx.font = `600 ${presenter ? 11 : 9}px DM Sans,sans-serif`; ctx.fillStyle = T.red; ctx.textAlign = "center";
      ctx.fillText("📉 Crash -20%", cx2, pad.top - 8);
      // Bogdan entry marker
      ctx.fillStyle = T.amber;
      ctx.fillText("🟡 Bogdan investește", cx2, pad.top - (presenter ? 22 : 20));
    }
    // Draw lines helper
    const drawLine = (data, color, width, dash) => {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width;
      if (dash) ctx.setLineDash(dash); else ctx.setLineDash([]);
      data.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
      ctx.stroke(); ctx.setLineDash([]);
    };
    // Fill between Ana and Dan
    ctx.beginPath();
    ana.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
    for (let i = dan.length - 1; i >= 0; i--) ctx.lineTo(x(i), y(dan[i]));
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch); grad.addColorStop(0, "rgba(47,140,94,0.08)"); grad.addColorStop(1, "rgba(47,140,94,0.02)"); ctx.fillStyle = grad; ctx.fill();
    // Lines
    drawLine(dan, "rgba(44,30,38,0.35)", presenter ? 2.5 : 2, [6, 4]);
    drawLine(cristina, T.red, presenter ? 2.5 : 2);
    drawLine(bogdan, T.amber, presenter ? 2.5 : 2);
    drawLine(ana, T.green, presenter ? 3.5 : 2.5);
    // End dots & labels
    const lastI = n - 1;
    const lines = [
      { data: ana, color: T.green, label: "Ana" },
      { data: bogdan, color: T.amber, label: "Bogdan" },
      { data: cristina, color: T.red, label: "Cristina" },
      { data: dan, color: "rgba(44,30,38,0.5)", label: "Dan" },
    ];
    lines.forEach(l => {
      const lx = x(lastI), ly2 = y(l.data[lastI]);
      ctx.beginPath(); ctx.arc(lx, ly2, presenter ? 5 : 3.5, 0, Math.PI * 2); ctx.fillStyle = l.color; ctx.fill();
      ctx.font = `600 ${presenter ? 12 : 10}px DM Sans,sans-serif`; ctx.fillStyle = l.color; ctx.textAlign = "left";
      ctx.fillText(`${l.label}: ${fmtK(l.data[lastI])}`, lx + 8, ly2 + 4);
    });
    // Legend
    const ly = pad.top - 28; ctx.font = `500 ${presenter ? 12 : 10}px DM Sans,sans-serif`;
    const legends = [
      { color: T.green, label: "🟢 Ana (DCA)" },
      { color: T.amber, label: "🟡 Bogdan (așteaptă)" },
      { color: T.red, label: "🔴 Cristina (ghinion)" },
      { color: "rgba(44,30,38,0.4)", label: "⚫ Dan (cash)" },
    ];
    let lx2 = pad.left;
    legends.forEach(l => {
      ctx.fillStyle = l.color; ctx.fillRect(lx2, ly - 3, 10, 3);
      ctx.fillStyle = T.textMuted; ctx.textAlign = "left"; ctx.fillText(l.label, lx2 + 14, ly + 1);
      lx2 += ctx.measureText(l.label).width + 28;
    });
  }, [ana, bogdan, cristina, dan, years, crashYear, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 8 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function DCABarChart({ values, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 200 : 160;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!values || values.length === 0) return;
    const pad = { top: 20, right: 20, bottom: 40, left: 20 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const maxVal = Math.max(...values.map(v => v.value)) * 1.1;
    const barW = Math.min(80, cw / values.length - 16);
    const totalBarWidth = values.length * (barW + 16) - 16;
    const startX = pad.left + (cw - totalBarWidth) / 2;
    values.forEach((v, i) => {
      const bx = startX + i * (barW + 16);
      const bh = (v.value / maxVal) * ch;
      const by = pad.top + ch - bh;
      // Bar
      ctx.fillStyle = v.color; ctx.beginPath();
      const r = 6; ctx.moveTo(bx + r, by); ctx.lineTo(bx + barW - r, by); ctx.quadraticCurveTo(bx + barW, by, bx + barW, by + r);
      ctx.lineTo(bx + barW, pad.top + ch); ctx.lineTo(bx, pad.top + ch); ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by); ctx.fill();
      // Value
      ctx.font = `700 ${presenter ? 14 : 12}px DM Sans,sans-serif`; ctx.fillStyle = v.color; ctx.textAlign = "center";
      ctx.fillText(fmtK(v.value), bx + barW / 2, by - 6);
      // Label
      ctx.font = `500 ${presenter ? 11 : 9}px DM Sans,sans-serif`; ctx.fillStyle = T.textMuted;
      ctx.fillText(v.label, bx + barW / 2, h - pad.bottom + 16);
      ctx.fillText(v.icon, bx + barW / 2, h - pad.bottom + 30);
    });
  }, [values, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%" }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function HistoryCard({ icon, title, text, presenter }) {
  return (
    <div style={{ flex: 1, minWidth: 200, padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: presenter ? 28 : 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: presenter ? 14 : 12, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 6, lineHeight: 1.3 }}>{title}</div>
      <div style={{ fontSize: presenter ? 12 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function ScenarioCard({ icon, name, subtitle, color, value, diff, presenter }) {
  return (
    <div style={{ padding: presenter ? "20px 24px" : "14px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, borderTop: `4px solid ${color}`, textAlign: "center", minWidth: 0 }}>
      <div style={{ fontSize: presenter ? 28 : 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: presenter ? 14 : 12, fontWeight: 700, color, fontFamily: T.font }}>{name}</div>
      <div style={{ fontSize: presenter ? 10 : 9, color: T.textMuted, fontFamily: T.font, marginBottom: 8, lineHeight: 1.4 }}>{subtitle}</div>
      <div style={{ fontSize: presenter ? 26 : 20, fontWeight: 700, color, fontFamily: T.font }}>{fmtK(value)}</div>
      {diff !== undefined && diff !== 0 && (
        <div style={{ fontSize: presenter ? 12 : 10, fontWeight: 600, color: diff > 0 ? T.green : T.red, fontFamily: T.font, marginTop: 4 }}>
          {diff > 0 ? "+" : ""}{fmtK(diff)} vs Ana
        </div>
      )}
    </div>
  );
}

function DCAvsTimingTool({ presenter }) {
  const { open: openModal } = React.useContext(ModalContext);

  // Inputs
  const [lumpSum, setLumpSum] = useState(20000);
  const [monthly, setMonthly] = useState(500);
  const [years, setYears] = useState(20);
  const [returnRate, setReturnRate] = useState(8);
  const [safeRate, setSafeRate] = useState(3);
  const [crashYear, setCrashYear] = useState(3);

  const mr = returnRate / 100 / 12;
  const sr = safeRate / 100 / 12;
  const totalMonths = years * 12;

  // Scenario 1: Ana — DCA imediat
  const anaData = useMemo(() => {
    const pts = [];
    let bal = lumpSum;
    pts.push(bal);
    for (let m = 1; m <= totalMonths; m++) {
      bal = bal * (1 + mr) + monthly;
      if (m % 12 === 0) pts.push(Math.round(bal));
    }
    return pts;
  }, [lumpSum, monthly, totalMonths, mr]);

  // Scenario 2: Bogdan — Waits for crash
  const bogdanData = useMemo(() => {
    const pts = [];
    const crashM = crashYear > years ? Infinity : crashYear * 12;
    let safeBal = lumpSum;
    let investBal = 0;
    let invested = false;
    pts.push(safeBal);
    for (let m = 1; m <= totalMonths; m++) {
      if (!invested) {
        safeBal = safeBal * (1 + sr) + monthly;
        if (m >= crashM) {
          // Crash happened, invest everything
          investBal = safeBal; // invest accumulated at current market level (which is higher than start despite crash)
          safeBal = 0;
          invested = true;
        }
      } else {
        investBal = investBal * (1 + mr) + monthly;
      }
      if (m % 12 === 0) pts.push(Math.round(invested ? investBal : safeBal));
    }
    return pts;
  }, [lumpSum, monthly, totalMonths, mr, sr, crashYear, years]);

  // Scenario 3: Cristina — Worst timer
  const cristinaData = useMemo(() => {
    const pts = [];
    let bal = lumpSum;
    // Immediate 30% crash in month 1
    bal = bal * 0.7;
    pts.push(lumpSum); // show starting value
    for (let m = 1; m <= totalMonths; m++) {
      if (m === 1) {
        bal = bal + monthly; // already crashed, add first DCA at low prices
      } else {
        bal = bal * (1 + mr) + monthly;
      }
      if (m % 12 === 0) pts.push(Math.round(bal));
    }
    return pts;
  }, [lumpSum, monthly, totalMonths, mr]);

  // Scenario 4: Dan — Cash forever
  const danData = useMemo(() => {
    const pts = [];
    let bal = lumpSum;
    pts.push(bal);
    for (let m = 1; m <= totalMonths; m++) {
      bal = bal * (1 + sr) + monthly;
      if (m % 12 === 0) pts.push(Math.round(bal));
    }
    return pts;
  }, [lumpSum, monthly, totalMonths, sr]);

  const anaFinal = anaData[anaData.length - 1];
  const bogdanFinal = bogdanData[bogdanData.length - 1];
  const cristinaFinal = cristinaData[cristinaData.length - 1];
  const danFinal = danData[danData.length - 1];
  const danReal = Math.round(danFinal / Math.pow(1.03, years)); // inflation-adjusted
  const costOfWaiting = anaFinal - bogdanFinal;
  const worstTimerGain = cristinaFinal - danFinal;
  const totalContributed = lumpSum + monthly * totalMonths;

  // Worst-case recovery calc
  const crashLoss = Math.round(lumpSum * 0.3);
  const afterCrash = Math.round(lumpSum * 0.7);
  const recoveryMonths = useMemo(() => {
    let bal = afterCrash;
    for (let m = 1; m <= 120; m++) {
      bal = bal * (1 + mr) + monthly;
      if (bal >= lumpSum) return m;
    }
    return 120;
  }, [afterCrash, mr, monthly, lumpSum]);
  const at3Years = useMemo(() => {
    let bal = afterCrash;
    for (let m = 1; m <= 36; m++) bal = bal * (1 + mr) + monthly;
    return Math.round(bal);
  }, [afterCrash, mr, monthly]);
  const at10Years = useMemo(() => {
    let bal = afterCrash;
    for (let m = 1; m <= 120; m++) bal = bal * (1 + mr) + monthly;
    return Math.round(bal);
  }, [afterCrash, mr, monthly]);
  const noInvest3 = Math.round(lumpSum * Math.pow(1 + safeRate / 100, 3) + monthly * 12 * 3);
  const noInvest10 = Math.round(lumpSum * Math.pow(1 + safeRate / 100, 10) + monthly * 12 * 10);

  // Market growth during wait
  const marketGrowthDuringWait = Math.round((Math.pow(1 + returnRate / 100, crashYear) - 1) * 100);
  const marketAfterCrash = Math.round((Math.pow(1 + returnRate / 100, crashYear) * 0.8 - 1) * 100);

  const gap = presenter ? 32 : 20;
  const crashNever = crashYear > years;

  return (
    <div>
      {/* SECTION 1: Hero */}
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left" }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: presenter ? 36 : 24, fontWeight: 400, color: T.burgundy, margin: 0, lineHeight: 1.15 }}>
          Cel mai periculos lucru pe care-l poți face cu banii tăi<span style={{ color: T.amber }}> este să aștepți momentul perfect.</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: presenter ? 15 : 13, color: T.textMuted, margin: "8px 0 0 0", lineHeight: 1.5 }}>
          Toată lumea vrea să cumpere la minim. Aproape nimeni nu reușește. Hai să vedem de ce.
        </p>
      </div>

      <div className="m-tool-layout" style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {/* SECTION 2: Inputs */}
        <div style={{ flex: presenter ? "0 0 380px" : "0 0 320px", minWidth: 280, padding: presenter ? "28px" : "20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
          <SectionLabel tip="Introdu cifrele tale. Toate scenariile se actualizează automat." presenter={presenter}>Scenariul tău</SectionLabel>
          <Slider label="Sumă disponibilă acum" value={lumpSum} onChange={setLumpSum} min={1000} max={1000000} step={1000} formatValue={fmt} presenter={presenter} tip="Suma pe care o ai disponibilă și te gândești să o investești" />
          <Slider label="Contribuție lunară" value={monthly} onChange={setMonthly} min={0} max={10000} step={100} formatValue={fmt} presenter={presenter} tip="Cât poți pune deoparte lunar pentru investiții" />
          <Slider label="Orizont de investiție" value={years} onChange={setYears} min={1} max={40} step={1} suffix=" ani" presenter={presenter} />
          <Slider label="Randament mediu anual" value={returnRate} onChange={setReturnRate} min={1} max={15} step={0.5} suffix="%" presenter={presenter} tip="Media istorică a S&P 500 pe 30 ani: ~10%. Cu diversificare globală: ~7-9%" />
          <Slider label="Randament safe haven" value={safeRate} onChange={setSafeRate} min={0} max={7} step={0.5} suffix="%" presenter={presenter} tip="Cât câștigă banii tăi în timp ce 'aștepți momentul potrivit'" />

          {/* SECTION 5: Crash slider */}
          <div style={{ marginTop: 16, padding: "16px", background: T.amberFaint, borderRadius: T.radiusSm, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 700, color: T.amber, fontFamily: T.font, marginBottom: 8 }}>📉 Când vine crash-ul de -20%?</div>
            <Slider label="" value={crashYear} onChange={setCrashYear} min={1} max={years + 1} step={1}
              formatValue={v => v > years ? "Niciodată" : `Anul ${v}`} presenter={presenter} />
            <div style={{ fontSize: presenter ? 11 : 9, color: T.textMuted, fontFamily: T.font, lineHeight: 1.5, marginTop: 4 }}>
              {crashNever ? "Bogdan așteaptă un crash care nu vine niciodată. Banii stau în depozite tot timpul." :
                `Bogdan așteaptă ${crashYear} an${crashYear > 1 ? "i" : ""}, apoi investește tot după crash.`}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Results */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap }}>

          {/* SECTION 3: The 4 Scenarios */}
          <div className="m-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            <ScenarioCard icon="🟢" name="Ana" subtitle="Investește imediat + DCA lunar" color={T.green} value={anaFinal} presenter={presenter} />
            <ScenarioCard icon="🟡" name="Bogdan" subtitle={crashNever ? "Așteaptă un crash care nu vine" : `Așteaptă crash-ul din anul ${crashYear}`} color={T.amber} value={bogdanFinal} diff={bogdanFinal - anaFinal} presenter={presenter} />
            <ScenarioCard icon="🔴" name="Cristina" subtitle="Investește la cel mai prost moment" color={T.red} value={cristinaFinal} diff={cristinaFinal - anaFinal} presenter={presenter} />
            <ScenarioCard icon="⚫" name="Dan" subtitle="Nu investește niciodată" color="rgba(44,30,38,0.5)" value={danFinal} diff={danFinal - anaFinal} presenter={presenter} />
          </div>

          {/* Bar chart */}
          <div style={{ padding: presenter ? "20px 24px 8px" : "16px 20px 4px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <DCABarChart values={[
              { label: "Ana", icon: "🟢", value: anaFinal, color: T.green },
              { label: "Bogdan", icon: "🟡", value: bogdanFinal, color: T.amber },
              { label: "Cristina", icon: "🔴", value: cristinaFinal, color: T.red },
              { label: "Dan", icon: "⚫", value: danFinal, color: "rgba(44,30,38,0.35)" },
            ]} presenter={presenter} />
          </div>

          {/* SECTION 4: Key Insights */}
          {/* Insight 1: Cost of waiting */}
          <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.redFaint, borderRadius: T.radius, border: `1px solid ${T.redMuted}` }}>
            <div style={{ fontSize: presenter ? 12 : 10, fontWeight: 600, color: T.red, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font }}>Costul așteptării</div>
            <div style={{ fontSize: presenter ? 36 : 28, fontWeight: 700, color: T.red, fontFamily: T.font }}>{fmt(Math.abs(costOfWaiting))}</div>
            <div style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6, marginTop: 8 }}>
              {crashNever ? (
                <>Bogdan a așteptat un crash care nu a venit niciodată. Banii lui au câștigat doar {safeRate}%/an în depozite, în timp ce Ana a câștigat {returnRate}%/an investind disciplinat.</>
              ) : (
                <>Bogdan a așteptat {crashYear} an{crashYear > 1 ? "i" : ""} pentru o corecție de -20%. {marketAfterCrash > 0 ? (
                  <>Chiar și după crash, piața era ÎNCĂ cu {marketAfterCrash}% mai sus decât la început. Bogdan a cumpărat "la reducere"... dar reducerea era față de un preț și mai mare.</>
                ) : (
                  <>A investit într-un moment mai bun, dar a pierdut {crashYear} an{crashYear > 1 ? "i" : ""} de creștere compusă — un cost enorm pe termen lung.</>
                )}</>
              )}
            </div>
          </div>

          {/* Insight 2: Worst timer wins */}
          <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.greenFaint, borderRadius: T.radius, border: `1px solid ${T.greenMuted}` }}>
            <div style={{ fontSize: presenter ? 12 : 10, fontWeight: 600, color: T.green, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font }}>Chiar și cel mai mare ghinionist câștigă</div>
            <div style={{ fontSize: presenter ? 28 : 22, fontWeight: 700, color: T.green, fontFamily: T.font }}>+{fmtK(worstTimerGain)} peste cash</div>
            <div style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6, marginTop: 8 }}>
              Cristina a investit la CEL MAI PROST moment posibil. A văzut imediat -30%. Dar nu a vândut. În {years} ani, portofoliul ei valorează {fmtK(cristinaFinal)} — {cristinaFinal > danFinal * 1.5 ? "aproape dublu" : "semnificativ mai mult"} față de Dan care n-a investit niciodată.
            </div>
          </div>

          {/* Insight 3: Cash is NOT safe */}
          <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}`, borderLeft: `4px solid rgba(44,30,38,0.3)` }}>
            <div style={{ fontSize: presenter ? 12 : 10, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font }}>"Investiția sigură" a lui Dan</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <div>
                <span style={{ fontSize: presenter ? 22 : 18, fontWeight: 700, color: T.textMuted, fontFamily: T.font, textDecoration: "line-through" }}>{fmtK(danFinal)}</span>
                <span style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, fontFamily: T.font, marginLeft: 4 }}>nominal</span>
              </div>
              <div>
                <span style={{ fontSize: presenter ? 28 : 22, fontWeight: 700, color: T.red, fontFamily: T.font }}>{fmtK(danReal)}</span>
                <span style={{ fontSize: presenter ? 12 : 10, color: T.red, fontFamily: T.font, marginLeft: 4 }}>putere reală</span>
              </div>
            </div>
            <div style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6, marginTop: 8 }}>
              Inflația de 3%/an a mâncat {Math.round((1 - danReal / danFinal) * 100)}% din valoarea reală a banilor. Cash-ul nu e sigur — e o pierdere lentă și sigură.
            </div>
          </div>

          {/* Comparison chart */}
          <div style={{ padding: presenter ? "20px 24px 16px" : "16px 20px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font }}>Evoluția celor 4 scenarii</div>
            <DCAComparisonChart ana={anaData} bogdan={bogdanData} cristina={cristinaData} dan={danData} years={years} crashYear={crashNever ? 0 : crashYear} presenter={presenter} />
          </div>

          {/* SECTION 6: Historical context */}
          <div>
            <div style={{ fontSize: presenter ? 16 : 14, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 12 }}>Lecții din istorie</div>
            <div className="m-history-cards" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <HistoryCard icon="📈" title="Piața crește mai des decât scade" text="Din ultimii 50 de ani, piața globală a fost pe plus în 39 de ani (78%). Dacă aștepți un crash, aștepți ceva care se întâmplă doar 22% din timp." presenter={presenter} />
              <HistoryCard icon="🏔️" title="All-time high nu înseamnă vârf" text="S&P 500 a atins un nou maxim istoric de peste 1.200 de ori din 1950. Investind la FIECARE all-time high, randamentul mediu pe 5 ani a fost de +52%." presenter={presenter} />
              <HistoryCard icon="🔄" title="Recuperarea vine mereu" text="Cel mai lung bear market din istorie (2000-2013) a durat 13 ani. Media? 14 luni. Dacă ai răbdare, piața revine." presenter={presenter} />
            </div>
          </div>

          {/* SECTION 7: Worst case */}
          <div style={{ padding: presenter ? "24px 28px" : "18px 22px", background: T.burgundyFaint, borderRadius: T.radius, border: `1px solid ${T.burgundyMuted}` }}>
            <div style={{ fontSize: presenter ? 18 : 15, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 12, lineHeight: 1.3 }}>
              Dar dacă mă bag și mâine cade -30%?
            </div>
            <div style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.7 }}>
              Investești <strong style={{ color: T.text }}>{fmt(lumpSum)}</strong> azi. Mâine piața cade 30%.
              Portofoliul tău: <strong style={{ color: T.red }}>{fmt(afterCrash)}</strong>. Durere.
            </div>
            <div style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.7, marginTop: 8 }}>
              Dar continui DCA: <strong style={{ color: T.text }}>{fmt(monthly)}/lună</strong>. Cumperi acum la prețuri MULT mai mici.
            </div>
            <div className="m-scenario-recovery" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
              <div style={{ flex: 1, minWidth: 140, padding: "12px 16px", background: T.white, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: presenter ? 10 : 9, color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.03em" }}>Recuperare completă</div>
                <div style={{ fontSize: presenter ? 20 : 16, fontWeight: 700, color: T.amber, fontFamily: T.font }}>{recoveryMonths} luni</div>
              </div>
              <div style={{ flex: 1, minWidth: 140, padding: "12px 16px", background: T.white, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: presenter ? 10 : 9, color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.03em" }}>La 3 ani</div>
                <div style={{ fontSize: presenter ? 20 : 16, fontWeight: 700, color: T.green, fontFamily: T.font }}>{fmtK(at3Years)}</div>
                <div style={{ fontSize: 9, color: T.textMuted, fontFamily: T.font }}>vs {fmtK(noInvest3)} fără investiție</div>
              </div>
              <div style={{ flex: 1, minWidth: 140, padding: "12px 16px", background: T.white, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: presenter ? 10 : 9, color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.03em" }}>La 10 ani</div>
                <div style={{ fontSize: presenter ? 20 : 16, fontWeight: 700, color: T.green, fontFamily: T.font }}>{fmtK(at10Years)}</div>
                <div style={{ fontSize: 9, color: T.textMuted, fontFamily: T.font }}>crash-ul e o amintire</div>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: "12px 16px", background: T.greenFaint, borderRadius: T.radiusSm, borderLeft: `4px solid ${T.green}` }}>
              <div style={{ fontSize: presenter ? 14 : 12, fontWeight: 700, color: T.green, fontFamily: T.font }}>
                Un crash nu e o pierdere. E o reducere. Dar doar dacă ești deja în piață.
              </div>
            </div>
          </div>

          {/* Insight summary */}
          <div style={{ padding: presenter ? "20px 28px" : "16px 20px", background: T.amberFaint, borderRadius: T.radius, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 15 : 13, color: T.text, fontFamily: T.font, lineHeight: 1.6 }}>
              <strong style={{ color: T.burgundy }}>Timpul în piață bate sincronizarea pieței.</strong> Ana nu a ghicit nimic. Nu a cronometrat nimic. A investit disciplinat, lunar, indiferent de ce făcea piața. Și a câștigat mai mult decât toți ceilalți.
            </div>
          </div>

          {/* SECTION 8: CTA */}
          <div style={{ padding: "24px 28px", background: `linear-gradient(135deg, ${T.burgundy}, ${T.burgundyDark})`, borderRadius: T.radius }}>
            <div className="m-cta-wrap" style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, fontFamily: T.font, marginBottom: 6, lineHeight: 1.3 }}>Ai strategia, dar îți lipsește planul.</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: T.font, lineHeight: 1.55 }}>DCA funcționează. Dar care ETF-uri? Ce alocare? Cât risc? Cum rebalansezi? Acestea sunt întrebările la care te ajutăm noi.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button onClick={openModal} style={{ padding: "12px 28px", background: T.amber, border: "none", borderRadius: T.radiusSm, color: T.burgundyDark, fontSize: 14, fontWeight: 700, fontFamily: T.font, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(232,168,50,0.4)"; }}
                  onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
                  Vreau un plan de investiții concret &rarr;
                </button>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: T.font, whiteSpace: "nowrap" }}>{"\u2713"} Fără obligații · {"\u2713"} 100% confidențial · {"\u2713"} Răspuns în 24h</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// TOOL 12: RANDAMENT IMOBILIAR
// ═══════════════════════════════════════════════════════════════

const CITY_PRESETS = {
  bucuresti: { label: "București", value: 100000, rent: 500, airbnbNight: 45, airbnbOcc: 65, maintenance: 100, taxProp: 200 },
  cluj: { label: "Cluj-Napoca", value: 110000, rent: 450, airbnbNight: 50, airbnbOcc: 60, maintenance: 110, taxProp: 220 },
  timisoara: { label: "Timișoara", value: 80000, rent: 380, airbnbNight: 40, airbnbOcc: 55, maintenance: 80, taxProp: 160 },
  iasi: { label: "Iași", value: 75000, rent: 350, airbnbNight: 35, airbnbOcc: 50, maintenance: 75, taxProp: 150 },
  brasov: { label: "Brașov", value: 90000, rent: 400, airbnbNight: 55, airbnbOcc: 60, maintenance: 90, taxProp: 180 },
  constanta: { label: "Constanța", value: 75000, rent: 350, airbnbNight: 50, airbnbOcc: 45, maintenance: 75, taxProp: 150 },
  altul: { label: "Altul", value: 80000, rent: 400, airbnbNight: 40, airbnbOcc: 50, maintenance: 80, taxProp: 160 },
};

function RECostsDonut({ segments, total, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 280 : 220;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (total <= 0) return;
    const cx = w / 2, cy = h / 2, outerR = Math.min(cx, cy) - 30, innerR = outerR * 0.55;
    if (outerR <= 0 || innerR <= 0) return;
    let angle = -Math.PI / 2;
    segments.filter(s => s.value > 0).forEach(s => {
      const sweep = (s.value / total) * 2 * Math.PI;
      ctx.beginPath(); ctx.arc(cx, cy, outerR, angle, angle + sweep); ctx.arc(cx, cy, innerR, angle + sweep, angle, true); ctx.closePath();
      ctx.fillStyle = s.color; ctx.fill();
      // Label
      const midAngle = angle + sweep / 2;
      const lx = cx + (outerR + 18) * Math.cos(midAngle), ly = cy + (outerR + 18) * Math.sin(midAngle);
      if (s.value / total > 0.05) {
        ctx.font = `600 ${presenter ? 10 : 8}px DM Sans,sans-serif`; ctx.fillStyle = s.color;
        ctx.textAlign = lx < cx ? "right" : "left"; ctx.textBaseline = "middle";
        ctx.fillText(`${Math.round(s.value / total * 100)}%`, lx, ly);
      }
      angle += sweep;
    });
    ctx.fillStyle = T.burgundy; ctx.font = `700 ${presenter ? 14 : 11}px DM Sans,sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Din fiecare €1", cx, cy - 8);
    ctx.fillText("de chirie", cx, cy + 8);
  }, [segments, total, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%" }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function REComparisonChart({ reData, etfData, bondsData, years, presenter }) {
  const canvasRef = useRef(null), containerRef = useRef(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current, box = containerRef.current;
    if (!canvas || !box) return;
    const dpr = window.devicePixelRatio || 1, w = box.offsetWidth, h = presenter ? 380 : 300;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + "px"; canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
    if (!reData || reData.length < 2) return;
    const pad = { top: 40, right: presenter ? 100 : 70, bottom: 50, left: presenter ? 80 : 64 };
    const cw = w - pad.left - pad.right, ch = h - pad.top - pad.bottom;
    const all = [...reData, ...etfData, ...bondsData];
    const maxVal = Math.max(...all) * 1.1 || 1;
    const n = reData.length;
    const x = i => pad.left + (i / (n - 1)) * cw;
    const y = v => pad.top + ch - (v / maxVal) * ch;
    ctx.strokeStyle = T.border; ctx.lineWidth = 0.5; ctx.setLineDash([3, 3]);
    ctx.font = `${presenter ? 13 : 11}px DM Sans,sans-serif`; ctx.fillStyle = T.textLight; ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) { const val = (i / 5) * maxVal, yy = y(val); ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(w - pad.right, yy); ctx.stroke(); ctx.fillText(fmtK(val), pad.left - 10, yy + 4); }
    ctx.setLineDash([]); ctx.textAlign = "center"; ctx.fillStyle = T.textLight;
    for (let i = 0; i < n; i++) { const skip = n > 20 ? 5 : n > 10 ? 2 : 1; if (i % skip === 0) ctx.fillText(i === 0 ? "Azi" : `${i}a`, x(i), h - pad.bottom + 22); }
    // Fill between ETF and RE
    ctx.beginPath();
    etfData.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
    for (let i = reData.length - 1; i >= 0; i--) ctx.lineTo(x(i), y(reData[i]));
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch); grad.addColorStop(0, "rgba(47,140,94,0.08)"); grad.addColorStop(1, "rgba(47,140,94,0.01)"); ctx.fillStyle = grad; ctx.fill();
    // Lines
    const drawLine = (data, color, w2, dash) => {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = w2;
      if (dash) ctx.setLineDash(dash); else ctx.setLineDash([]);
      data.forEach((v, i) => i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v)));
      ctx.stroke(); ctx.setLineDash([]);
    };
    drawLine(bondsData, T.blue, presenter ? 2.5 : 2, [4, 4]);
    drawLine(reData, T.amber, presenter ? 2.5 : 2);
    drawLine(etfData, T.green, presenter ? 3.5 : 2.5);
    const lastI = n - 1;
    [{ d: etfData, c: T.green, l: "ETF" }, { d: reData, c: T.amber, l: "Imobiliar" }, { d: bondsData, c: T.blue, l: "Titluri" }].forEach(ln => {
      ctx.beginPath(); ctx.arc(x(lastI), y(ln.d[lastI]), presenter ? 5 : 3.5, 0, Math.PI * 2); ctx.fillStyle = ln.c; ctx.fill();
      ctx.font = `600 ${presenter ? 12 : 10}px DM Sans,sans-serif`; ctx.fillStyle = ln.c; ctx.textAlign = "left";
      ctx.fillText(`${ln.l}: ${fmtK(ln.d[lastI])}`, x(lastI) + 8, y(ln.d[lastI]) + 4);
    });
    const ly = pad.top - 16; ctx.font = `500 ${presenter ? 12 : 10}px DM Sans,sans-serif`; let lx = pad.left;
    [{ c: T.green, l: "📈 ETF Global" }, { c: T.amber, l: "🏠 Imobiliar" }, { c: T.blue, l: "🏦 Titluri stat" }].forEach(lg => {
      ctx.fillStyle = lg.c; ctx.fillRect(lx, ly - 3, 10, 3);
      ctx.fillStyle = T.textMuted; ctx.textAlign = "left"; ctx.fillText(lg.l, lx + 14, ly + 1);
      lx += ctx.measureText(lg.l).width + 28;
    });
  }, [reData, etfData, bondsData, years, presenter]);
  useEffect(() => { draw(); const ro = new ResizeObserver(draw); if (containerRef.current) ro.observe(containerRef.current); window.addEventListener("resize", draw); return () => { ro.disconnect(); window.removeEventListener("resize", draw); }; }, [draw]);
  return <div ref={containerRef} style={{ width: "100%", marginTop: 8 }}><canvas ref={canvasRef} style={{ display: "block", width: "100%" }} /></div>;
}

function WaterfallItem({ label, amount, positive, presenter }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: presenter ? "8px 0" : "5px 0", borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font }}>{label}</span>
      <span style={{ fontSize: presenter ? 14 : 12, fontWeight: 700, color: positive ? T.green : T.red, fontFamily: T.font }}>
        {positive ? "+" : "−"}{fmt(Math.abs(amount))}
      </span>
    </div>
  );
}

function WaterfallTotal({ label, amount, color, presenter }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: presenter ? "10px 0" : "7px 0", borderTop: `2px solid ${color || T.burgundy}` }}>
      <span style={{ fontSize: presenter ? 14 : 12, fontWeight: 700, color: color || T.burgundy, fontFamily: T.font }}>{label}</span>
      <span style={{ fontSize: presenter ? 18 : 15, fontWeight: 700, color: color || T.burgundy, fontFamily: T.font }}>{fmt(amount)}</span>
    </div>
  );
}

function REWarningCard({ icon, title, text, presenter }) {
  return (
    <div style={{ flex: 1, minWidth: 180, padding: presenter ? "16px 20px" : "12px 16px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
      <div style={{ fontSize: presenter ? 22 : 18, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 700, color: T.text, fontFamily: T.font, marginBottom: 4, lineHeight: 1.3 }}>{title}</div>
      <div style={{ fontSize: presenter ? 11 : 10, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function RandamentImobiliarTool({ presenter }) {
  const { open: openModal } = React.useContext(ModalContext);

  // Rental type
  const [rentalType, setRentalType] = useState("long"); // "long" | "airbnb"
  // Property
  const [city, setCity] = useState("bucuresti");
  const [propValue, setPropValue] = useState(100000);
  const [propType, setPropType] = useState("2cam");
  const [area, setArea] = useState(55);
  const [yearBuilt, setYearBuilt] = useState(1980);
  // Financing
  const [hasMortgage, setHasMortgage] = useState(false);
  const [downPct, setDownPct] = useState(15);
  const [mortgageRate, setMortgageRate] = useState(5.5);
  const [mortgageYears, setMortgageYears] = useState(30);
  // Long-term rental
  const [monthlyRent, setMonthlyRent] = useState(500);
  const [vacancyMonths, setVacancyMonths] = useState(1);
  const [rentGrowth, setRentGrowth] = useState(3);
  // Airbnb
  const [airbnbNight, setAirbnbNight] = useState(45);
  const [airbnbOcc, setAirbnbOcc] = useState(65);
  const [airbnbCommission, setAirbnbCommission] = useState(3);
  const [cleaningCost, setCleaningCost] = useState(25);
  const [reservationsPerMonth, setReservationsPerMonth] = useState(8);
  const [airbnbGrowth, setAirbnbGrowth] = useState(2);
  // Costs
  const [taxProperty, setTaxProperty] = useState(200);
  const [insurance, setInsurance] = useState(100);
  const [maintenanceFee, setMaintenanceFee] = useState(100);
  const [repairPct, setRepairPct] = useState(1);
  const [renovationCost, setRenovationCost] = useState(3000);
  // Airbnb-specific costs
  const [utilities, setUtilities] = useState(150);
  const [managementPct, setManagementPct] = useState(0);
  const [furnishingCost, setFurnishingCost] = useState(500);
  // Tax
  const [deductionOn, setDeductionOn] = useState(true);
  // Appreciation
  const [appreciation, setAppreciation] = useState(3);
  // Comparison
  const [etfReturn, setEtfReturn] = useState(8);
  const [bondsReturn, setBondsReturn] = useState(6.5);
  const [compYears, setCompYears] = useState(20);

  // Collapsible
  const [propOpen, setPropOpen] = useState(true);
  const [finOpen, setFinOpen] = useState(false);
  const [rentOpen, setRentOpen] = useState(true);
  const [costsOpen, setCostsOpen] = useState(false);
  const [apprOpen, setApprOpen] = useState(false);

  // City auto-fill
  const handleCityChange = (newCity) => {
    setCity(newCity);
    const p = CITY_PRESETS[newCity];
    if (p) {
      setPropValue(p.value);
      setMonthlyRent(p.rent);
      setAirbnbNight(p.airbnbNight);
      setAirbnbOcc(p.airbnbOcc);
      setMaintenanceFee(p.maintenance);
      setTaxProperty(p.taxProp);
    }
  };

  // Calculations
  const downPayment = Math.round(propValue * downPct / 100);
  const loanAmount = hasMortgage ? propValue - downPayment : 0;
  const capitalInvested = hasMortgage ? downPayment : propValue;
  const monthlyMortgageRate = mortgageRate / 100 / 12;
  const mortgagePayment = loanAmount > 0 ? Math.round(loanAmount * monthlyMortgageRate / (1 - Math.pow(1 + monthlyMortgageRate, -mortgageYears * 12))) : 0;
  const totalMortgagePaid = mortgagePayment * mortgageYears * 12;
  const totalInterestPaid = totalMortgagePaid - loanAmount;

  // Annual income
  const nightsPerMonth = Math.round(30 * airbnbOcc / 100);
  const airbnbMonthlyGross = Math.round(airbnbNight * nightsPerMonth);
  const airbnbAnnualGross = airbnbMonthlyGross * 12;
  const longTermAnnualGross = monthlyRent * 12;

  const annualGrossRent = rentalType === "long" ? longTermAnnualGross : airbnbAnnualGross;
  const vacancyCost = rentalType === "long" ? Math.round(monthlyRent * vacancyMonths) : 0;
  const effectiveRent = annualGrossRent - vacancyCost;

  // Annual costs
  const repairCost = Math.round(propValue * repairPct / 100);
  const renovationAmortized = Math.round(renovationCost / 5);
  const airbnbPlatformFee = rentalType === "airbnb" ? Math.round(airbnbAnnualGross * airbnbCommission / 100) : 0;
  const airbnbCleaningTotal = rentalType === "airbnb" ? cleaningCost * reservationsPerMonth * 12 : 0;
  const airbnbUtilitiesTotal = rentalType === "airbnb" ? utilities * 12 : 0;
  const airbnbManagement = rentalType === "airbnb" ? Math.round(airbnbAnnualGross * managementPct / 100) : 0;
  const airbnbFurnishing = rentalType === "airbnb" ? furnishingCost : 0;

  const totalCostsBeforeTax = (maintenanceFee * 12) + repairCost + renovationAmortized + insurance + taxProperty +
    airbnbPlatformFee + airbnbCleaningTotal + airbnbUtilitiesTotal + airbnbManagement + airbnbFurnishing;

  const profitBeforeTax = effectiveRent - totalCostsBeforeTax;
  const taxableIncome = deductionOn ? Math.round(profitBeforeTax * 0.8) : profitBeforeTax;
  const incomeTax = Math.max(0, Math.round(taxableIncome * 0.1));
  const cassTax = Math.max(0, Math.round(taxableIncome * 0.1));
  const totalTax = incomeTax + cassTax;

  const annualNetProfit = profitBeforeTax - totalTax;
  const monthlyNetProfit = Math.round(annualNetProfit / 12);
  const monthlyCashFlow = monthlyNetProfit - mortgagePayment;

  // Yields
  const grossYield = propValue > 0 ? (annualGrossRent / propValue * 100) : 0;
  const netYield = capitalInvested > 0 ? (annualNetProfit / capitalInvested * 100) : 0;
  const totalYield = netYield + appreciation;
  const yieldDrop = grossYield > 0 ? Math.round((1 - netYield / grossYield) * 100) : 0;

  // Per-euro breakdown
  const profitPerEuro = annualGrossRent > 0 ? (annualNetProfit / annualGrossRent) : 0;

  // Donut segments
  const donutSegments = [
    { label: "Profit net", value: Math.max(0, annualNetProfit), color: T.green },
    { label: "Întreținere + reparații", value: maintenanceFee * 12 + repairCost, color: T.red },
    { label: "Taxe", value: totalTax, color: T.amber },
    { label: "Vacanță", value: vacancyCost, color: T.orange },
    { label: "Asigurare + impozit", value: insurance + taxProperty, color: "rgba(44,30,38,0.4)" },
    { label: "Renovare", value: renovationAmortized, color: T.blue },
    ...(rentalType === "airbnb" ? [
      { label: "Airbnb fees", value: airbnbPlatformFee + airbnbCleaningTotal + airbnbUtilitiesTotal + airbnbManagement + airbnbFurnishing, color: "#9B59B6" },
    ] : []),
  ];

  // Comparison projections
  const reProjection = useMemo(() => {
    const pts = [capitalInvested];
    let cumRent = 0, propVal = propValue;
    for (let y = 1; y <= compYears; y++) {
      cumRent += annualNetProfit * Math.pow(1 + rentGrowth / 100, y - 1);
      propVal = propValue * Math.pow(1 + appreciation / 100, y);
      pts.push(Math.round(cumRent + propVal - (hasMortgage ? loanAmount * Math.max(0, 1 - y / mortgageYears) : 0)));
    }
    return pts;
  }, [capitalInvested, propValue, annualNetProfit, rentGrowth, appreciation, compYears, hasMortgage, loanAmount, mortgageYears]);

  const etfProjection = useMemo(() => {
    const pts = [capitalInvested];
    for (let y = 1; y <= compYears; y++) pts.push(Math.round(capitalInvested * Math.pow(1 + (etfReturn - 0.22) / 100, y)));
    return pts;
  }, [capitalInvested, etfReturn, compYears]);

  const bondsProjection = useMemo(() => {
    const pts = [capitalInvested];
    for (let y = 1; y <= compYears; y++) pts.push(Math.round(capitalInvested * Math.pow(1 + bondsReturn / 100, y)));
    return pts;
  }, [capitalInvested, bondsReturn, compYears]);

  const etfFinal = etfProjection[etfProjection.length - 1];
  const reFinal = reProjection[reProjection.length - 1];
  const bondsFinal = bondsProjection[bondsProjection.length - 1];
  const etfAdvantage = etfFinal - reFinal;

  // Airbnb hourly rate
  const airbnbHoursPerMonth = 20;
  const longTermHoursPerMonth = 2;
  const airbnbExtraHours = (airbnbHoursPerMonth - longTermHoursPerMonth) * 12;
  // Compare long-term vs airbnb (if airbnb selected, compute long-term equivalent)
  const ltAnnualNet = useMemo(() => {
    const ltGross = monthlyRent * 12;
    const ltVac = monthlyRent * vacancyMonths;
    const ltEff = ltGross - ltVac;
    const ltCosts = (maintenanceFee * 12) + repairCost + renovationAmortized + insurance + taxProperty;
    const ltProfit = ltEff - ltCosts;
    const ltTaxable = deductionOn ? ltProfit * 0.8 : ltProfit;
    return Math.round(ltProfit - Math.max(0, ltTaxable * 0.2));
  }, [monthlyRent, vacancyMonths, maintenanceFee, repairCost, renovationAmortized, insurance, taxProperty, deductionOn]);

  const gap = presenter ? 32 : 20;
  const yieldColor = netYield < 4 ? T.red : netYield < 6 ? T.amber : T.green;

  // Select element style
  const selectStyle = { padding: "8px 12px", border: `1px solid ${T.border}`, borderRadius: T.radiusXs, fontSize: presenter ? 14 : 12, fontFamily: T.font, color: T.text, background: T.white, cursor: "pointer", width: "100%", marginBottom: presenter ? 20 : 14 };

  return (
    <div>
      {/* HERO */}
      <div style={{ marginBottom: gap, textAlign: presenter ? "center" : "left" }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: presenter ? 36 : 24, fontWeight: 400, color: T.burgundy, margin: 0, lineHeight: 1.15 }}>
          Cât câștigi REAL din apartamentul tău<span style={{ color: T.amber }}> de investiție?</span>
        </h1>
        <p style={{ fontFamily: T.font, fontSize: presenter ? 15 : 13, color: T.textMuted, margin: "8px 0 0 0", lineHeight: 1.5 }}>
          Majoritatea proprietarilor calculează randamentul greșit. Chiria brută nu e profit. Hai să vedem cifrele reale.
        </p>
      </div>

      {/* Rental type toggle */}
      <div style={{ marginBottom: gap }}>
        <ModeToggle mode={rentalType} onMode={setRentalType} options={[
          { id: "long", icon: "📋", label: "Termen lung" },
          { id: "airbnb", icon: "🏖️", label: "Airbnb" },
        ]} presenter={presenter} />
      </div>

      <div className="m-tool-layout" style={{ display: "flex", gap, flexWrap: "wrap" }}>
        {/* INPUT PANEL */}
        <div style={{ flex: presenter ? "0 0 400px" : "0 0 340px", minWidth: 280 }}>

          <NWCollapsible title="PROPRIETATEA" color={T.burgundy} isOpen={propOpen} onToggle={() => setPropOpen(o => !o)} presenter={presenter}>
            <div style={{ marginBottom: presenter ? 20 : 14 }}>
              <div style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, marginBottom: 4 }}>Oraș</div>
              <select value={city} onChange={e => handleCityChange(e.target.value)} style={selectStyle}>
                {Object.entries(CITY_PRESETS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <Slider label="Valoare proprietate" value={propValue} onChange={setPropValue} min={20000} max={2000000} step={5000} formatValue={fmt} presenter={presenter} tip="Valoarea de piață curentă sau prețul de achiziție" />
            <Slider label="Suprafață utilă (mp)" value={area} onChange={setArea} min={20} max={200} step={1} suffix=" mp" presenter={presenter} />
          </NWCollapsible>

          <NWCollapsible title="ACHIZIȚIE & FINANȚARE" color={T.blue} isOpen={finOpen} onToggle={() => setFinOpen(o => !o)} summary={hasMortgage ? `Credit · Rată: ${fmt(mortgagePayment)}/lună` : "Cash integral"} presenter={presenter}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={() => setHasMortgage(false)} style={{ flex: 1, padding: "10px", border: `2px solid ${!hasMortgage ? T.burgundy : T.border}`, borderRadius: T.radiusSm, background: !hasMortgage ? T.burgundyFaint : T.white, color: !hasMortgage ? T.burgundy : T.textMuted, fontSize: 12, fontWeight: 600, fontFamily: T.font, cursor: "pointer" }}>Cash integral</button>
              <button onClick={() => setHasMortgage(true)} style={{ flex: 1, padding: "10px", border: `2px solid ${hasMortgage ? T.burgundy : T.border}`, borderRadius: T.radiusSm, background: hasMortgage ? T.burgundyFaint : T.white, color: hasMortgage ? T.burgundy : T.textMuted, fontSize: 12, fontWeight: 600, fontFamily: T.font, cursor: "pointer" }}>Credit ipotecar</button>
            </div>
            {hasMortgage && (<>
              <Slider label="Avans" value={downPct} onChange={setDownPct} min={0} max={100} step={1} suffix="%" presenter={presenter} tip={`Avans: ${fmt(downPayment)}`} />
              <Slider label="Dobândă credit (% anual)" value={mortgageRate} onChange={setMortgageRate} min={2} max={12} step={0.1} suffix="%" presenter={presenter} tip="Dobânda medie credit ipotecar în România: ~5-6%" />
              <Slider label="Durata credit" value={mortgageYears} onChange={setMortgageYears} min={5} max={35} step={1} suffix=" ani" presenter={presenter} />
              <div style={{ padding: "10px 14px", background: T.blueFaint, borderRadius: T.radiusXs, fontSize: presenter ? 13 : 11, color: T.blue, fontFamily: T.font, fontWeight: 600 }}>
                Rata lunară: {fmt(mortgagePayment)} · Total dobândă: {fmtK(totalInterestPaid)}
              </div>
            </>)}
          </NWCollapsible>

          <NWCollapsible title="VENIT DIN CHIRII" color={T.green} isOpen={rentOpen} onToggle={() => setRentOpen(o => !o)} summary={rentalType === "long" ? `${fmt(monthlyRent)}/lună` : `${fmt(airbnbNight)}/noapte · ${airbnbOcc}% ocupare`} presenter={presenter}>
            {rentalType === "long" ? (<>
              <Slider label="Chirie lunară brută" value={monthlyRent} onChange={setMonthlyRent} min={100} max={5000} step={50} formatValue={fmt} presenter={presenter} />
              <Slider label="Luni de vacanță/an" value={vacancyMonths} onChange={setVacancyMonths} min={0} max={6} step={0.5} suffix=" luni" presenter={presenter} tip="Perioada medie fără chiriaș" />
              <Slider label="Creștere anuală chirie" value={rentGrowth} onChange={setRentGrowth} min={0} max={10} step={0.5} suffix="%" presenter={presenter} />
            </>) : (<>
              <Slider label="Preț mediu/noapte" value={airbnbNight} onChange={setAirbnbNight} min={15} max={300} step={5} formatValue={v => `€${v}`} presenter={presenter} />
              <Slider label="Rata de ocupare" value={airbnbOcc} onChange={setAirbnbOcc} min={10} max={100} step={5} suffix="%" presenter={presenter} tip="Media Airbnb București: 55-70%" />
              <div style={{ padding: "8px 14px", background: T.greenFaint, borderRadius: T.radiusXs, fontSize: presenter ? 12 : 10, color: T.green, fontFamily: T.font, fontWeight: 600, marginBottom: 14 }}>
                ~{nightsPerMonth} nopți/lună → {fmt(airbnbMonthlyGross)}/lună brut
              </div>
              <Slider label="Comision Airbnb" value={airbnbCommission} onChange={setAirbnbCommission} min={0} max={15} step={1} suffix="%" presenter={presenter} tip="Airbnb ia ~3% de la gazdă" />
              <Slider label="Cost curățenie/rezervare" value={cleaningCost} onChange={setCleaningCost} min={0} max={100} step={5} formatValue={v => `€${v}`} presenter={presenter} />
              <Slider label="Rezervări/lună" value={reservationsPerMonth} onChange={setReservationsPerMonth} min={1} max={30} step={1} presenter={presenter} />
              <Slider label="Creștere anuală preț" value={airbnbGrowth} onChange={setAirbnbGrowth} min={0} max={10} step={0.5} suffix="%" presenter={presenter} />
            </>)}
          </NWCollapsible>

          <NWCollapsible title="COSTURI" color={T.red} isOpen={costsOpen} onToggle={() => setCostsOpen(o => !o)} summary={`Total: ${fmtK(totalCostsBeforeTax + totalTax)}/an`} presenter={presenter}>
            <Slider label="Impozit proprietate/an" value={taxProperty} onChange={setTaxProperty} min={0} max={5000} step={50} formatValue={fmt} presenter={presenter} />
            <Slider label="Asigurare (PAD)/an" value={insurance} onChange={setInsurance} min={0} max={500} step={10} formatValue={fmt} presenter={presenter} />
            <Slider label="Întreținere/lună" value={maintenanceFee} onChange={setMaintenanceFee} min={0} max={500} step={10} formatValue={fmt} presenter={presenter} tip="Costul lunar al asociației" />
            <Slider label="Reparații (% din valoare/an)" value={repairPct} onChange={setRepairPct} min={0} max={5} step={0.5} suffix="%" presenter={presenter} tip="Regulă generală: 1-2% din valoare pe an" />
            <Slider label="Renovare la fiecare 5 ani" value={renovationCost} onChange={setRenovationCost} min={0} max={20000} step={500} formatValue={fmt} presenter={presenter} />
            {rentalType === "airbnb" && (<>
              <div style={{ height: 8 }} />
              <div style={{ fontSize: 10, fontWeight: 600, color: T.red, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8, fontFamily: T.font }}>Costuri Airbnb</div>
              <Slider label="Utilități/lună" value={utilities} onChange={setUtilities} min={0} max={500} step={10} formatValue={fmt} presenter={presenter} tip="La Airbnb tu plătești utilitățile" />
              <Slider label="Management/co-host (%)" value={managementPct} onChange={setManagementPct} min={0} max={30} step={5} suffix="%" presenter={presenter} tip="15-25% dacă externalizezi" />
              <Slider label="Mobilier + consumabile/an" value={furnishingCost} onChange={setFurnishingCost} min={0} max={3000} step={100} formatValue={fmt} presenter={presenter} />
            </>)}
            <div style={{ height: 8 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <button onClick={() => setDeductionOn(d => !d)} style={{ width: 36, height: 20, borderRadius: 10, border: "none", background: deductionOn ? T.green : T.burgundyMuted, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: deductionOn ? 18 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
              <span style={{ fontSize: presenter ? 12 : 10, color: T.textMuted, fontFamily: T.font }}>Deducere forfetară 20%</span>
            </div>
            <div style={{ padding: "8px 14px", background: T.redFaint, borderRadius: T.radiusXs, fontSize: presenter ? 12 : 10, color: T.red, fontFamily: T.font, fontWeight: 600 }}>
              Taxe estimate: {fmt(totalTax)}/an (impozit {fmt(incomeTax)} + CASS {fmt(cassTax)})
            </div>
          </NWCollapsible>

          <NWCollapsible title="APRECIERE" color={T.amber} isOpen={apprOpen} onToggle={() => setApprOpen(o => !o)} summary={`${appreciation}%/an`} presenter={presenter}>
            <Slider label="Apreciere anuală estimată" value={appreciation} onChange={setAppreciation} min={-5} max={15} step={0.5} suffix="%" presenter={presenter} tip="Media istorică România: 3-5%" />
          </NWCollapsible>
        </div>

        {/* OUTPUT PANEL */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap }}>

          {/* 3A: Summary Cards */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <StatCard label="Randament brut" value={`${grossYield.toFixed(1)}%`} color={T.amber} bgColor={T.amberFaint} presenter={presenter} icon="📊" sub={`Chirie ${fmtK(annualGrossRent)}/an`} />
            <StatCard label="Randament net" value={`${netYield.toFixed(1)}%`} color={yieldColor} bgColor={netYield < 4 ? T.redFaint : netYield < 6 ? T.amberFaint : T.greenFaint} presenter={presenter} icon="📉" sub={`Costurile mănâncă ${yieldDrop}%`} />
            <StatCard label="Randament total" value={`${totalYield.toFixed(1)}%`} color={totalYield >= 6 ? T.green : T.amber} bgColor={totalYield >= 6 ? T.greenFaint : T.amberFaint} presenter={presenter} icon="📈" sub={`Include +${appreciation}% apreciere`} />
          </div>

          {/* Yield drop insight */}
          <div style={{ padding: presenter ? "16px 20px" : "12px 16px", background: T.amberFaint, borderRadius: T.radiusSm, borderLeft: `4px solid ${T.amber}` }}>
            <div style={{ fontSize: presenter ? 14 : 12, fontWeight: 700, color: T.burgundy, fontFamily: T.font }}>
              De la {grossYield.toFixed(1)}% brut la {netYield.toFixed(1)}% net — costurile mănâncă {yieldDrop}% din randament
            </div>
          </div>

          {/* 3B: Cash Flow Waterfall */}
          <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12, fontFamily: T.font }}>Cash Flow Lunar</div>
            <WaterfallItem label={rentalType === "long" ? "Chirie brută" : "Venit Airbnb brut"} amount={Math.round(annualGrossRent / 12)} positive presenter={presenter} />
            {vacancyCost > 0 && <WaterfallItem label={`Vacanță (${vacancyMonths} luni)`} amount={Math.round(vacancyCost / 12)} positive={false} presenter={presenter} />}
            <WaterfallItem label="Întreținere/asociație" amount={maintenanceFee} positive={false} presenter={presenter} />
            <WaterfallItem label={`Reparații (${repairPct}%/an)`} amount={Math.round(repairCost / 12)} positive={false} presenter={presenter} />
            <WaterfallItem label="Renovare (amortizat)" amount={Math.round(renovationAmortized / 12)} positive={false} presenter={presenter} />
            <WaterfallItem label="Asigurare + impozit prop." amount={Math.round((insurance + taxProperty) / 12)} positive={false} presenter={presenter} />
            {rentalType === "airbnb" && <>
              <WaterfallItem label="Comision Airbnb" amount={Math.round(airbnbPlatformFee / 12)} positive={false} presenter={presenter} />
              <WaterfallItem label="Curățenie" amount={Math.round(airbnbCleaningTotal / 12)} positive={false} presenter={presenter} />
              <WaterfallItem label="Utilități" amount={utilities} positive={false} presenter={presenter} />
              {managementPct > 0 && <WaterfallItem label="Management" amount={Math.round(airbnbManagement / 12)} positive={false} presenter={presenter} />}
            </>}
            <WaterfallItem label="Impozit + CASS" amount={Math.round(totalTax / 12)} positive={false} presenter={presenter} />
            <WaterfallTotal label="PROFIT NET" amount={monthlyNetProfit} color={monthlyNetProfit >= 0 ? T.green : T.red} presenter={presenter} />
            {hasMortgage && <>
              <WaterfallItem label="Rata credit" amount={mortgagePayment} positive={false} presenter={presenter} />
              <WaterfallTotal label="CASH FLOW REAL" amount={monthlyCashFlow} color={monthlyCashFlow >= 0 ? T.green : T.red} presenter={presenter} />
            </>}
          </div>

          {/* Cash flow insight */}
          {hasMortgage && monthlyCashFlow < 0 && (
            <div style={{ padding: presenter ? "16px 20px" : "12px 16px", background: T.redFaint, borderRadius: T.radiusSm, border: `1px solid ${T.redMuted}` }}>
              <div style={{ fontSize: presenter ? 28 : 22, fontWeight: 700, color: T.red, fontFamily: T.font }}>{fmt(monthlyCashFlow)}/lună</div>
              <div style={{ fontSize: presenter ? 12 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.5, marginTop: 4 }}>
                Proprietatea ta de investiție ÎȚI COSTĂ {fmt(Math.abs(monthlyCashFlow))}/lună în loc să-ți genereze venit.
              </div>
            </div>
          )}
          {!hasMortgage && (
            <div style={{ padding: presenter ? "16px 20px" : "12px 16px", background: monthlyNetProfit > 0 ? T.greenFaint : T.redFaint, borderRadius: T.radiusSm }}>
              <div style={{ fontSize: presenter ? 13 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.5 }}>
                Profit net: <strong style={{ color: monthlyNetProfit > 0 ? T.green : T.red }}>{fmt(monthlyNetProfit)}/lună</strong> — dar ai blocat {fmtK(propValue)} pentru un randament de {netYield.toFixed(1)}%.
              </div>
            </div>
          )}

          {/* 3D: Costs Donut */}
          <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: presenter ? 13 : 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font }}>
              Din fiecare €1 de chirie, ție îți rămân €{profitPerEuro.toFixed(2)}
            </div>
            <RECostsDonut segments={donutSegments} total={annualGrossRent} presenter={presenter} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {donutSegments.filter(s => s.value > 0).map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: T.textMuted, fontFamily: T.font }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  {s.label}: {fmtK(s.value)}
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: Comparison */}
          <div>
            <div style={{ fontSize: presenter ? 16 : 14, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 12 }}>Ce s-ar fi întâmplat dacă investeai aceiași bani altfel?</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <Slider label="Randament ETF" value={etfReturn} onChange={setEtfReturn} min={4} max={12} step={0.5} suffix="%" presenter={presenter} />
              <Slider label="Randament titluri stat" value={bondsReturn} onChange={setBondsReturn} min={3} max={10} step={0.5} suffix="%" presenter={presenter} />
              <Slider label="Perioada comparație" value={compYears} onChange={setCompYears} min={5} max={30} step={5} suffix=" ani" presenter={presenter} />
            </div>
          </div>
          <div style={{ padding: presenter ? "20px 24px 16px" : "16px 20px 12px", background: T.white, borderRadius: T.radius, border: `1px solid ${T.border}` }}>
            <REComparisonChart reData={reProjection} etfData={etfProjection} bondsData={bondsProjection} years={compYears} presenter={presenter} />
          </div>

          {/* Big comparison number */}
          {etfAdvantage > 0 && (
            <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.greenFaint, borderRadius: T.radius, border: `1px solid ${T.greenMuted}` }}>
              <div style={{ fontSize: presenter ? 12 : 10, fontWeight: 600, color: T.green, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, fontFamily: T.font }}>Diferența pe {compYears} de ani</div>
              <div style={{ fontSize: presenter ? 32 : 24, fontWeight: 700, color: T.green, fontFamily: T.font }}>+{fmtK(etfAdvantage)} cu ETF</div>
              <div style={{ fontSize: presenter ? 12 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6, marginTop: 8 }}>
                Cu același capital de {fmtK(capitalInvested)}, investit în ETF la {etfReturn}% ajungeai la {fmtK(etfFinal)}. Din apartament: {fmtK(reFinal)}. Plus zero stres, zero chiriași, zero reparații.
              </div>
            </div>
          )}

          {/* Comparison pills */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: presenter ? 12 : 10, fontFamily: T.font }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                  <th style={{ textAlign: "left", padding: "8px 6px", color: T.textMuted, fontWeight: 600 }}></th>
                  <th style={{ padding: "8px 6px", color: T.amber, fontWeight: 700 }}>🏠 Imobiliar</th>
                  <th style={{ padding: "8px 6px", color: T.green, fontWeight: 700 }}>📈 ETF</th>
                  <th style={{ padding: "8px 6px", color: T.blue, fontWeight: 700 }}>🏦 Titluri stat</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Randament net/an", `${netYield.toFixed(1)}%`, `${(etfReturn - 0.22).toFixed(1)}%`, `${bondsReturn}%`],
                  ["Lichiditate", "Săpt-luni", "Secunde", "Zile"],
                  ["Efort/lună", rentalType === "airbnb" ? "~20h" : "~2h", "0h", "0h"],
                  ["Diversificare", "1 apart.", "3000+ comp.", "Stat român"],
                  ["Impozit câștig", "~20%", "10%", "0% (Fidelis)"],
                ].map(([label, ...vals], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "6px", color: T.textMuted, fontWeight: 500 }}>{label}</td>
                    {vals.map((v, j) => <td key={j} style={{ padding: "6px", textAlign: "center", color: T.text, fontWeight: 600 }}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SECTION 5: Mortgage deep dive */}
          {hasMortgage && loanAmount > 0 && (
            <div style={{ padding: presenter ? "20px 24px" : "16px 20px", background: T.redFaint, borderRadius: T.radius, border: `1px solid ${T.redMuted}` }}>
              <div style={{ fontSize: presenter ? 14 : 12, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 12 }}>Cât te costă creditul REAL?</div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div><div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.font }}>Suma împrumutată</div><div style={{ fontSize: presenter ? 20 : 16, fontWeight: 700, color: T.text, fontFamily: T.font }}>{fmtK(loanAmount)}</div></div>
                <div><div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.font }}>Total plătit</div><div style={{ fontSize: presenter ? 20 : 16, fontWeight: 700, color: T.red, fontFamily: T.font }}>{fmtK(totalMortgagePaid)}</div></div>
                <div><div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.font }}>Total dobândă</div><div style={{ fontSize: presenter ? 20 : 16, fontWeight: 700, color: T.red, fontFamily: T.font }}>{fmtK(totalInterestPaid)}</div></div>
              </div>
              {/* Principal vs Interest bar */}
              <div style={{ display: "flex", height: presenter ? 20 : 14, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ width: `${(loanAmount / totalMortgagePaid) * 100}%`, background: T.blue }} title="Principal" />
                <div style={{ width: `${(totalInterestPaid / totalMortgagePaid) * 100}%`, background: T.red }} title="Dobândă" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: T.font }}>
                <span style={{ color: T.blue }}>Principal: {Math.round(loanAmount / totalMortgagePaid * 100)}%</span>
                <span style={{ color: T.red }}>Dobândă: {Math.round(totalInterestPaid / totalMortgagePaid * 100)}%</span>
              </div>
              <div style={{ marginTop: 12, fontSize: presenter ? 12 : 11, color: T.textMuted, fontFamily: T.font, lineHeight: 1.6 }}>
                Plătești <strong style={{ color: T.red }}>{fmtK(totalMortgagePaid)}</strong> pentru un apartament de {fmtK(propValue)}. Dobânda de {fmtK(totalInterestPaid)} reprezintă {Math.round(totalInterestPaid / propValue * 100)}% din preț.
              </div>
            </div>
          )}

          {/* SECTION 6: Warnings */}
          <div>
            <div style={{ fontSize: presenter ? 16 : 14, fontWeight: 700, color: T.burgundy, fontFamily: T.font, marginBottom: 12 }}>Ce nu poți pune în calculator</div>
            <div className="m-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <REWarningCard icon="😤" title="Chiriașii problemă" text="Întârzieri, daune, evacuări costisitoare. Un chiriaș rău poate anula profitul pe un an întreg." presenter={presenter} />
              <REWarningCard icon="🔧" title="Costuri neprevăzute" text="Centrală termică (€2K), țeavă crăpată (€1.5K), consolidare bloc (€5K+). Când apar, sunt devastatoare." presenter={presenter} />
              <REWarningCard icon="⏰" title="Timpul tău" text="Găsit chiriași, rezolvat probleme, declarații fiscale. Cu ETF-uri, cumperi și uiți." presenter={presenter} />
              <REWarningCard icon="📉" title="Leverage-ul tăie în ambele direcții" text="Dacă piața scade 20%, pierzi din avans — și rata tot trebuie plătită." presenter={presenter} />
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: "24px 28px", background: `linear-gradient(135deg, ${T.burgundy}, ${T.burgundyDark})`, borderRadius: T.radius }}>
            <div className="m-cta-wrap" style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, fontFamily: T.font, marginBottom: 6, lineHeight: 1.3 }}>Imobiliar, bursă, sau ambele?</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: T.font, lineHeight: 1.55 }}>Nu există răspuns universal. Te ajutăm să construiești un mix care funcționează pentru tine — nu pentru vecinul tău.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button onClick={openModal} style={{ padding: "12px 28px", background: T.amber, border: "none", borderRadius: T.radiusSm, color: T.burgundyDark, fontSize: 14, fontWeight: 700, fontFamily: T.font, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(232,168,50,0.4)"; }}
                  onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>
                  Vreau o strategie personalizată &rarr;
                </button>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: T.font, whiteSpace: "nowrap" }}>{"\u2713"} Fără obligații · {"\u2713"} 100% confidențial · {"\u2713"} Răspuns în 24h</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN APP SHELL
// ═══════════════════════════════════════════════════════════════

export default function MinimalistuTools() {
  const [tool, setTool] = useState("fire");
  const [presenter, setPresenter] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const openAbout = useCallback(() => setAboutOpen(true), []);
  const closeAbout = useCallback(() => setAboutOpen(false), []);
  const modalCtx = useMemo(() => ({ open: openModal }), [openModal]);
  const crossToolCtx = useMemo(() => ({ prefill, setPrefill, navigateTo: setTool }), [prefill]);
  const handleNavigateFromNW = useCallback((targetTool) => { setTool(targetTool); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  return (
    <ModalContext.Provider value={modalCtx}>
    <CrossToolContext.Provider value={crossToolCtx}>
    <div style={{ minHeight: "100vh", background: T.cream, fontFamily: T.font, padding: presenter ? "24px" : "16px" }}>
      <style>{`
        .minimalistu-slider::-webkit-slider-thumb { -webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:${T.burgundy};border:3px solid ${T.white};cursor:pointer;box-shadow:0 1px 4px rgba(123,45,80,0.25); }
        .minimalistu-slider::-moz-range-thumb { width:18px;height:18px;border-radius:50%;background:${T.burgundy};border:3px solid ${T.white};cursor:pointer; }
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes floatBtnIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes prefillFadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .about-drawer { max-width: 100% !important; }
          .m-tool-layout { flex-direction: column !important; }
          .m-tool-layout > * { flex: 1 1 100% !important; min-width: 0 !important; max-width: 100% !important; }
          .m-tool-panel { flex-basis: 100% !important; }
          .m-grid-2 { grid-template-columns: 1fr !important; }
          .m-grid-4 { grid-template-columns: 1fr 1fr !important; }
          .m-grid-2col { grid-template-columns: 1fr !important; }
          .m-stack { flex-direction: column !important; }
          .m-stack > * { min-width: 0 !important; }
          .m-content-pad { padding: 16px !important; }
          .m-cta-wrap { flex-direction: column !important; align-items: stretch !important; text-align: center !important; }
          .m-cta-wrap > * { min-width: 0 !important; }
          .m-cta-btn-wrap { align-items: center !important; }
          .m-nav-label { display: none !important; }
          .m-hero-title { font-size: 22px !important; }
          .m-big-number { font-size: 32px !important; }
          .m-history-cards { flex-direction: column !important; }
          .m-history-cards > * { min-width: 0 !important; }
          .m-scenario-recovery { flex-direction: column !important; }
          .m-scenario-recovery > * { min-width: 0 !important; }
        }
      `}</style>
      <div style={{ maxWidth: presenter ? 1200 : 900, margin: "0 auto" }}>
        <NavBar active={tool} onSelect={setTool} presenter={presenter} onToggle={() => setPresenter(p => !p)} onAbout={openAbout} />
        <div className="m-content-pad" style={{ background: T.cream, padding: presenter ? 40 : 24 }}>
          <div style={{ display: tool === "networth" ? "block" : "none" }}><NetWorthTool presenter={presenter} onNavigate={handleNavigateFromNW} /></div>
          <div style={{ display: tool === "cost" ? "block" : "none" }}><OpportunityCostTool presenter={presenter} /></div>
          <div style={{ display: tool === "compound" ? "block" : "none" }}><CompoundInterestTool presenter={presenter} /></div>
          <div style={{ display: tool === "fire" ? "block" : "none" }}><FIRECalculatorTool presenter={presenter} /></div>
          <div style={{ display: tool === "xray" ? "block" : "none" }}><PortfolioXRayTool presenter={presenter} /></div>
          <div style={{ display: tool === "funds" ? "block" : "none" }}><FonduriMutualeTool presenter={presenter} /></div>
          <div style={{ display: tool === "alpha" ? "block" : "none" }}><BehavioralAlphaTool presenter={presenter} /></div>
          <div style={{ display: tool === "rentvsbuy" ? "block" : "none" }}><RentVsBuyTool presenter={presenter} /></div>
          <div style={{ display: tool === "emergency" ? "block" : "none" }}><EmergencyFundTool presenter={presenter} /></div>
          <div style={{ display: tool === "risk" ? "block" : "none" }}><RiskToleranceTool presenter={presenter} /></div>
          <div style={{ display: tool === "dca" ? "block" : "none" }}><DCAvsTimingTool presenter={presenter} /></div>
          <div style={{ display: tool === "realestate" ? "block" : "none" }}><RandamentImobiliarTool presenter={presenter} /></div>
        </div>
        <div style={{ textAlign: "center", padding: "20px 0 8px", color: T.textLight, fontSize: 11, fontFamily: T.font }}>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 14, color: T.burgundySubtle }}>Minimalistu</span>
        </div>
        <div style={{ textAlign: "center", padding: "0 20px 24px", maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: 10, color: T.textLight, fontFamily: T.font, lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: T.textMuted }}>Disclaimer:</strong> Aceste instrumente sunt oferite exclusiv în scop educativ și informativ.
            Nu constituie consiliere financiară, fiscală sau de investiții personalizată.
            Rezultatele sunt estimative și bazate pe ipoteze simplificate — randamentele viitoare nu sunt garantate.
            Performanțele istorice nu garantează rezultate viitoare. Consultă un consilier financiar autorizat
            înainte de a lua decizii de investiții. Vlad Caluș și Minimalistu nu își asumă responsabilitatea
            pentru deciziile luate pe baza acestor calcule.
          </p>
        </div>
      </div>
      <FloatingCTAButton presenter={presenter} onOpenModal={openModal} />
      <BookingModal isOpen={modalOpen} onClose={closeModal} />
      <AboutPanel isOpen={aboutOpen} onClose={closeAbout} />
    </div>
    </CrossToolContext.Provider>
    </ModalContext.Provider>
  );
}