import React from "react";
import { AlertCircle, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampusPortalNotFoundProps {
  slug: string;
}

export const CampusPortalNotFound: React.FC<CampusPortalNotFoundProps> = ({ slug }) => {
  return (
    <div className="min-h-screen bg-[#0B131E] text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#111C2D] border border-slate-800 rounded-2xl p-8 text-center shadow-2xl space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-2">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Campus Portal Not Found</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            We couldn't find an active campus portal for{" "}
            <span className="text-rose-300 font-mono font-semibold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              {slug}
            </span>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-left space-y-2">
          <p className="font-semibold text-slate-300">What should you do?</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Verify that the URL has no typos (e.g. <code className="text-teal-300 font-mono">bit-demo.aivilabs.com</code>).</li>
            <li>If you are a student or staff member, request the correct portal link from your Training & Placement Officer (TPO).</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Campus OS
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              window.location.href = `https://aivilabs.com/contact?portal_inquiry=${encodeURIComponent(slug)}`;
            }}
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Contact Support
          </Button>
        </div>
      </div>

      <footer className="mt-8 text-xs text-slate-500 font-medium">
        Powered by AIVI Campus Intelligence OS
      </footer>
    </div>
  );
};
