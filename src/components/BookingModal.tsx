"use client";

import { useEffect, useCallback } from "react";

const HS_FORM_URL =
  "https://2fiaz2.share-eu1.hsforms.com/2ToAV2rQ2QKGzPBaByxon6g";

export function BookingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{
        background: "rgba(44,30,38,0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: "0 24px 80px rgba(44,30,38,0.25)" }}
      >
        {/* Header */}
        <div className="p-6 pb-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-burgundy/10 text-burgundy text-lg font-bold flex items-center justify-center hover:bg-burgundy/20 transition-colors cursor-pointer"
          >
            &times;
          </button>
          <div className="flex items-center gap-2 mb-3">
            <img
              src="https://planable.imgix.net/BX3Rd95mwvvAuKGGa/E53AA5EuKR-image-169-src-1.png?auto=format&w=200&h=200&dpr=2"
              alt=""
              className="w-10 h-10 rounded-full object-cover border-2 border-burgundy/10"
            />
            <img
              src="https://planable.imgix.net/BX3Rd95mwvvAuKGGa/GjkmySXhsv-image-169-src.png?auto=format&w=200&h=200&dpr=2"
              alt=""
              className="w-10 h-10 rounded-full object-cover border-2 border-burgundy/10 -ml-3"
            />
          </div>
          <div className="text-burgundy text-xl font-bold leading-tight mb-1 pr-8 font-body">
            Programează o sesiune gratuită de audit
          </div>
          <div className="text-text-muted text-sm mb-5 leading-relaxed">
            Completează formularul și te contactăm în 24h
          </div>
        </div>
        {/* HubSpot form */}
        <div className="flex-1 px-6 pb-6 overflow-auto">
          <iframe
            src={HS_FORM_URL}
            className="w-full border-none rounded-lg bg-cream"
            style={{ height: 480 }}
            title="Programare audit Minimalistu"
          />
        </div>
      </div>
    </div>
  );
}
