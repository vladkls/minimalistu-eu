"use client";

import dynamic from "next/dynamic";

const MinimalistuTools = dynamic(
  () => import("@/components/MinimalistuTools"),
  { ssr: false }
);

export default function InstrumentePage() {
  return (
    <div className="pt-0">
      <MinimalistuTools />
    </div>
  );
}
