import React from "react";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";
import CampusHeader from "@/components/CampusHeader";
import CampusFooter from "@/components/CampusFooter";
import { isCampusDomain } from "@/utils/domainHelper";

export default function LegalHeaderFooterWrapper({ children }: { children: React.ReactNode }) {
  const isCampus = isCampusDomain(window.location.hostname);

  if (isCampus) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <CampusHeader />
        <main className="flex-1">{children}</main>
        <CampusFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <GlobalHeader />
      <main className="flex-1">{children}</main>
      <GlobalFooter />
    </div>
  );
}
