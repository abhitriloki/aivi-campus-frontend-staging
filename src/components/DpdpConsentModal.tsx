import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Lock, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { acceptDpdpConsent } from "@/services/tenantService";

interface DpdpConsentModalProps {
  open: boolean;
  onConsentAccepted: () => void;
}

export default function DpdpConsentModal({ open, onConsentAccepted }: DpdpConsentModalProps) {
  const [locale, setLocale] = useState<"en" | "hi">("en");
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptDpdpConsent(locale);
      toast.success("DPDP Data Privacy Consent recorded successfully.");
      onConsentAccepted();
    } catch (err: any) {
      toast.error(err.message || "Failed to record DPDP consent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="h-6 w-6 text-primary" />
            DPDP Act Data Privacy Consent
            <Badge variant="outline" className="ml-auto text-xs font-mono">
              Version 1.0 (2026)
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Under the Digital Personal Data Protection (DPDP) Act, 2023, please review and consent to your data processing for campus career services.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="en" onValueChange={(v) => setLocale(v as "en" | "hi")} className="w-full mt-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="en">English Notice</TabsTrigger>
            <TabsTrigger value="hi">हिंदी सूचना</TabsTrigger>
          </TabsList>

          <TabsContent value="en" className="space-y-4 pt-3 text-sm text-muted-foreground leading-relaxed">
            <div className="border border-border/40 p-4 rounded-xl bg-muted/20 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" />
                1. Purpose of Processing
              </h4>
              <p>
                Your institution and AIVI Campus collect and process your academic records, resume data, and AI analysis history exclusively for career readiness, placement drives, skill gap analysis, and vernacular AI interview preparation.
              </p>

              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                2. Data Retention & Protection
              </h4>
              <p>
                Your personal data is retained during your enrollment and up to 1 year post-graduation for placement audit compliance, after which it is anonymized or purged.
              </p>

              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                3. Your Rights
              </h4>
              <p>
                You retain full rights to access, update, or request erasure of your data via your Account Settings, subject to institutional placement record requirements.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="hi" className="space-y-4 pt-3 text-sm text-muted-foreground leading-relaxed">
            <div className="border border-border/40 p-4 rounded-xl bg-muted/20 space-y-3 font-sans">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-primary" />
                1. डेटा प्रसंस्करण का उद्देश्य
              </h4>
              <p>
                आपका संस्थान और AIVI कैंपस आपके शैक्षणिक रिकॉर्ड, बायोडाटा डेटा और एआई विश्लेषण इतिहास का उपयोग केवल करियर तैयारी, प्लेसमेंट ड्राइव और कौशल सुधार के लिए करते हैं।
              </p>

              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                2. डेटा सुरक्षा एवं भंडारण अवधि
              </h4>
              <p>
                आपका व्यक्तिगत डेटा आपके नामांकन के दौरान तथा स्नातक के 1 वर्ष बाद तक प्लेसमेंट ऑडिट अनुपालन के लिए सुरक्षित रखा जाता है।
              </p>

              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                3. आपके अधिकार
              </h4>
              <p>
                डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम के तहत, आपको खाता सेटिंग्स के माध्यम से अपने डेटा तक पहुंचने, अपडेट करने या हटाने का पूरा अधिकार है।
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t border-border/40">
          <Button onClick={handleAccept} disabled={loading} className="w-full sm:w-auto bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold shadow-md">
            {loading ? "Recording Consent..." : "I Consent & Agree to Data Processing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
