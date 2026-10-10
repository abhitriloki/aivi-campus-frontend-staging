import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Palette, Image as ImageIcon, Globe, Lock, Save, RefreshCw, Sparkles, Building, Check, Copy, ExternalLink, Info, HelpCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTenantBranding } from "@/contexts/TenantBrandingContext";
import { useAuth } from "@/contexts/AuthContext";
import { updateTenantBranding } from "@/services/tenantService";

export default function TenantSettingsPage() {
  const { branding, activeTenantId, updateBrandingColors, refreshBranding } = useTenantBranding();
  const { tenant } = useAuth();

  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#2D8B86");
  const [accentColor, setAccentColor] = useState("#FF6D4A");
  const [loginHeadline, setLoginHeadline] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [code, setCode] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedDirect, setCopiedDirect] = useState(false);
  const [copiedSubdomain, setCopiedSubdomain] = useState(false);

  useEffect(() => {
    if (branding) {
      setLogoUrl(branding.branding?.logoUrl || "");
      setPrimaryColor(branding.branding?.primaryColor || (branding as any).primaryColor || "#2D8B86");
      setAccentColor(branding.branding?.accentColor || (branding as any).accentColor || "#FF6D4A");
      setLoginHeadline(branding.branding?.loginHeadline || `Welcome to ${branding.name} Career Portal`);
      setTenantName(branding.name || "");
      const resolvedCode = branding.code || tenant.tenant?.code || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_code") : "") || "";
      setCode(resolvedCode);
      setCustomDomain("");
    }
  }, [branding, tenant.tenant]);

  // Determine current active campus host environment
  const isProduction = typeof window !== "undefined" && (
    window.location.hostname === "aivicampus.com" ||
    window.location.hostname === "www.aivicampus.com"
  );
  const rootCampusDomain = isProduction ? "aivicampus.com" : "staging.aivicampus.com";
  const effectiveCode = (code || branding.code || tenant.tenant?.code || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_code") : "") || "campus").toLowerCase();
  
  const directLoginUrl = `https://${rootCampusDomain}/campus/login/${effectiveCode}`;
  const subdomainUrl = isProduction
    ? `https://${effectiveCode}.aivicampus.com`
    : `https://${effectiveCode}.staging.aivicampus.com`;

  const copyToClipboard = async (text: string, type: "direct" | "subdomain") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "direct") {
        setCopiedDirect(true);
        setTimeout(() => setCopiedDirect(false), 2000);
      } else {
        setCopiedSubdomain(true);
        setTimeout(() => setCopiedSubdomain(false), 2000);
      }
      toast.success("URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL.");
    }
  };

  const handleSaveBranding = async () => {
    setSaving(true);
    try {
      const targetTenantId = activeTenantId || tenant.tenantId || tenant.tenant?.id || (typeof window !== "undefined" ? localStorage.getItem("aivi_active_tenant_id") : null);

      if (!targetTenantId) {
        toast.error("Tenant ID not found. Unable to save institutional settings.");
        setSaving(false);
        return;
      }

      const res = await updateTenantBranding({
        tenantId: targetTenantId,
        branding: {
          logoUrl: logoUrl.trim(),
          primaryColor: primaryColor.trim(),
          accentColor: accentColor.trim(),
          loginHeadline: loginHeadline.trim(),
        },
      });

      if (res && res.success) {
        if (typeof updateBrandingColors === "function") {
          updateBrandingColors(primaryColor, accentColor);
        }
        if (typeof refreshBranding === "function") {
          refreshBranding();
        }
        toast.success("Institutional branding settings updated and saved successfully!");
      } else {
        toast.error(res?.message || "Failed to save institutional branding settings.");
      }
    } catch (err: any) {
      console.error("Error saving branding:", err);
      toast.error(err?.message || "Failed to save institutional branding settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 text-[#101820]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E6E1D6] pb-5">
        <div>
          <Badge className="bg-[#2D8B86]/10 text-[#2D8B86] border-[#2D8B86]/30 font-bold px-3 py-1 text-xs rounded-full mb-2">
            Section 1.3: Visual Branding & Subdomain
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#101820]">Campus Branding & Portal Settings</h1>
          <p className="text-sm font-medium text-[#53606A] mt-1">Customize college logo, primary theme accent color, login headline, and subdomain routing.</p>
        </div>

        <Button
          onClick={handleSaveBranding}
          disabled={saving}
          className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving Changes..." : "Save Branding Settings"}
        </Button>
      </div>

      {/* Live Branding Preview Header */}
      <Card className="rounded-2xl border border-[#CBD5E1] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Live Student Portal Header Preview</span>
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold text-[10px]">
            Live Branding
          </Badge>
        </div>

        <div className="rounded-xl border border-[#E6E1D6] p-4 bg-[#F8F5ED] flex items-center gap-4">
          {logoUrl ? (
            <img src={logoUrl} alt="College Logo" className="h-12 w-12 rounded-xl object-contain bg-white p-1.5 border border-[#CBD5E1] shadow-xs" />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center font-extrabold text-sm text-[#2D8B86] shadow-xs">
              {tenantName?.[0] || "C"}
            </div>
          )}
          <div>
            <h3 className="text-base font-extrabold text-[#101820]">{tenantName || "Your College Name"}</h3>
            <p className="text-xs text-[#53606A] font-medium">{loginHeadline || "Welcome to Career Placement Portal"}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5" title="Primary Brand Color">
              <div className="h-6 w-6 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: primaryColor }} />
              <span className="text-xs font-mono font-bold text-[#53606A]">{primaryColor}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Accent Highlight Color">
              <div className="h-6 w-6 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: accentColor }} />
              <span className="text-xs font-mono font-bold text-[#53606A]">{accentColor}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Form Controls */}
      <div className="grid grid-cols-1 gap-6">
        {/* Visual Assets & Theme Colors */}
        <Card className="rounded-2xl border border-[#E6E1D6] bg-white shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <CardHeader className="py-5 px-6 border-b border-[#E6E1D6] bg-[#F8F5ED]">
            <CardTitle className="text-lg font-extrabold text-[#101820] flex items-center gap-2">
              <Palette className="h-5 w-5 text-[#2D8B86]" />
              Visual Assets & Theme Accent Color
            </CardTitle>
            <CardDescription className="text-xs font-medium text-[#53606A] mt-0.5">Configure institutional logo URL and primary brand accent color.</CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#53606A] flex items-center gap-1.5 mb-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-[#2D8B86]" />
                Institutional Logo URL
              </label>
              <Input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://yourcollege.ac.in/assets/logo.png"
                className="border-[#CBD5E1] focus:border-[#2D8B86] text-xs font-semibold"
              />
              <p className="text-[11px] text-[#53606A] mt-1">Recommended size: Square 200x200px PNG or SVG with transparent background.</p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#53606A] flex items-center gap-1.5 mb-1.5">
                <Palette className="h-3.5 w-3.5 text-[#2D8B86]" />
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-14 rounded-xl border border-[#CBD5E1] cursor-pointer p-1 bg-white"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#2D8B86"
                  className="w-36 border-[#CBD5E1] focus:border-[#2D8B86] text-xs font-mono font-bold"
                />
                <span className="text-xs text-[#53606A] font-medium">Applied to primary navigation, main CTA buttons, and brand headers.</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#53606A] flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#FF6D4A]" />
                Accent Highlight Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-14 rounded-xl border border-[#CBD5E1] cursor-pointer p-1 bg-white"
                />
                <Input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#FF6D4A"
                  className="w-36 border-[#CBD5E1] focus:border-[#2D8B86] text-xs font-mono font-bold"
                />
                <span className="text-xs text-[#53606A] font-medium">Applied to active badges, emphasis indicators, and highlights.</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#53606A] flex items-center gap-1.5 mb-1.5">
                <Building className="h-3.5 w-3.5 text-[#2D8B86]" />
                Branded Login Headline
              </label>
              <Input
                type="text"
                value={loginHeadline}
                onChange={(e) => setLoginHeadline(e.target.value)}
                placeholder="Welcome to Sunrise Placement & Training Portal"
                className="border-[#CBD5E1] focus:border-[#2D8B86] text-xs font-semibold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subdomain & URL Routing */}
        <Card className="rounded-2xl border border-[#E6E1D6] bg-white shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <CardHeader className="py-5 px-6 border-b border-[#E6E1D6] bg-[#F8F5ED]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-extrabold text-[#101820] flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#2D8B86]" />
                Institutional Portal & URL Routing Setup
              </CardTitle>
              <Badge className="bg-[#2D8B86]/10 text-[#2D8B86] border-[#2D8B86]/30 font-bold text-[11px]">
                {rootCampusDomain}
              </Badge>
            </div>
            <CardDescription className="text-xs font-medium text-[#53606A] mt-0.5">
              Choose the access method that works best for your college: Instant Direct Link, Dedicated Subdomain, or Custom University CNAME.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-7">
            {/* METHOD 1: Direct Institutional Login Portal */}
            <div className="rounded-xl border-2 border-[#2D8B86]/40 bg-[#2D8B86]/5 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#2D8B86] text-white font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-0.5">
                    Method 1 · Recommended & Ready Now
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Active · Zero Setup
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#53606A]">Instant Access</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#101820]">Direct Institutional Login Portal URL</h4>
                <p className="text-xs text-[#53606A] mt-0.5">
                  Share this permanent direct link with students, department faculty, and placement coordinators.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-xs font-mono font-bold text-[#101820] truncate select-all shadow-xs">
                  {directLoginUrl}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(directLoginUrl, "direct")}
                    className="border-[#CBD5E1] hover:bg-slate-50 text-[#101820] text-xs font-bold gap-1.5 h-9"
                  >
                    {copiedDirect ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                    {copiedDirect ? "Copied!" : "Copy Direct Link"}
                  </Button>
                  <a
                    href={directLoginUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-[#2D8B86] bg-[#2D8B86] hover:bg-[#1C6B68] text-white px-3.5 py-2 text-xs font-bold gap-1.5 transition-colors shadow-xs h-9"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Portal
                  </a>
                </div>
              </div>

              {/* Explanatory Guide: How to Add & How it Works */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#2D8B86]/20 text-xs">
                <div className="bg-white/80 rounded-lg p-3 border border-[#2D8B86]/20 space-y-1">
                  <p className="font-extrabold text-[#101820] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2D8B86]" />
                    How to Add This Portal
                  </p>
                  <p className="text-[11px] text-[#53606A] leading-relaxed">
                    <strong>Already added automatically!</strong> Created the moment your college workspace is provisioned. No IT approvals, DNS records, or domain purchasing needed.
                  </p>
                </div>
                <div className="bg-white/80 rounded-lg p-3 border border-[#2D8B86]/20 space-y-1">
                  <p className="font-extrabold text-[#101820] flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-[#2D8B86]" />
                    How This Works Under the Hood
                  </p>
                  <p className="text-[11px] text-[#53606A] leading-relaxed">
                    When opened, AIVI automatically extracts your unique slug (<code className="font-mono text-[#2D8B86]">{effectiveCode}</code>), displays your college logo and colors, and ensures all sign-ins map directly to your college roster.
                  </p>
                </div>
              </div>
            </div>

            {/* METHOD 2: Dedicated Institutional Subdomain */}
            <div className="rounded-xl border border-[#CBD5E1] bg-[#F8F5ED]/60 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-slate-400 text-[#101820] font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-0.5">
                    Method 2 · Subdomain
                  </Badge>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                    Wildcard DNS Routed
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#53606A]">Automatic Cloud Routing</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#101820]">Dedicated Institutional Subdomain</h4>
                <p className="text-xs text-[#53606A] mt-0.5">
                  A custom subdomain address assigned exclusively to your university workspace.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-white border border-[#CBD5E1] rounded-lg px-3.5 py-2.5 text-xs font-mono font-bold text-[#101820] truncate select-all shadow-xs flex items-center gap-1">
                  <span>https://</span>
                  <span className="text-[#2D8B86]">{effectiveCode}</span>
                  <span className="text-[#53606A]">.{rootCampusDomain}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(subdomainUrl, "subdomain")}
                  className="border-[#CBD5E1] hover:bg-slate-50 text-[#101820] text-xs font-bold gap-1.5 h-9"
                >
                  {copiedSubdomain ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                  {copiedSubdomain ? "Copied" : "Copy Subdomain"}
                </Button>
              </div>

              {/* Explanatory Guide: How Subdomain Works */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-[#CBD5E1]/60 text-xs">
                <div className="bg-white rounded-lg p-3 border border-[#CBD5E1] space-y-1">
                  <p className="font-extrabold text-[#101820] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-700" />
                    How to Use Your Subdomain
                  </p>
                  <p className="text-[11px] text-[#53606A] leading-relaxed">
                    Your slug (<code className="font-mono text-[#101820] font-bold">{effectiveCode}</code>) is assigned by the platform administrator. Anyone visiting this address is automatically directed to your branded college portal.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-[#CBD5E1] space-y-1">
                  <p className="font-extrabold text-[#101820] flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-slate-700" />
                    How Subdomain Routing Works
                  </p>
                  <p className="text-[11px] text-[#53606A] leading-relaxed">
                    Handled dynamically via AIVI's root wildcard DNS. The browser transmits the subdomain prefix to the server, which reads the college credentials without any path parameters.
                  </p>
                </div>
              </div>
            </div>

            {/* METHOD 3: Custom University Domain via CNAME */}
            <div className="rounded-xl border border-[#CBD5E1] bg-white p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-amber-400 text-amber-900 bg-amber-50 font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-0.5">
                    Method 3 · 100% White-Label (Optional)
                  </Badge>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                    Official College Domain
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#53606A]">Requires DNS Entry</span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-[#101820]">Custom University CNAME Domain</h4>
                <p className="text-xs text-[#53606A] mt-0.5">
                  Map your own college web address so students log in directly at <code className="bg-[#F8F5ED] px-1 py-0.5 rounded font-mono text-[#101820]">placements.yourcollege.ac.in</code>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#53606A] block">
                  Your Custom College Domain
                </label>
                <Input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
                  placeholder="e.g. placements.sunrise.ac.in"
                  className="border-[#CBD5E1] focus:border-[#2D8B86] text-xs font-semibold max-w-md"
                />
              </div>

              {/* Step-by-Step Setup Instructions */}
              <div className="rounded-xl border border-[#CBD5E1] bg-[#F8F5ED]/50 p-4 space-y-3">
                <p className="text-xs font-extrabold text-[#101820] flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-[#2D8B86]" />
                  How to Set Up Your Custom University CNAME (3 Simple Steps):
                </p>

                <div className="space-y-2.5 text-xs text-[#101820]">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-[#2D8B86] text-white flex items-center justify-center font-extrabold text-[11px] shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="text-[11px] text-[#53606A] leading-relaxed">
                      <strong className="text-[#101820]">Log in to your College DNS Provider:</strong> Open Cloudflare, GoDaddy, Namecheap, AWS Route 53, or send this instruction to your University IT department.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-[#2D8B86] text-white flex items-center justify-center font-extrabold text-[11px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="text-[11px] text-[#53606A] leading-relaxed space-y-1">
                      <p><strong className="text-[#101820]">Add a CNAME DNS Record with these exact values:</strong></p>
                      <div className="bg-white border border-[#CBD5E1] rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                        <div><strong className="text-[#53606A]">Type:</strong> <span className="text-[#101820] font-bold">CNAME</span></div>
                        <div><strong className="text-[#53606A]">Host / Name:</strong> <span className="text-[#2D8B86] font-bold">placements</span> (or your chosen prefix like <span className="text-[#101820]">career</span> or <span className="text-[#101820]">jobs</span>)</div>
                        <div><strong className="text-[#53606A]">Target / Value / Points to:</strong> <span className="text-[#101820] font-extrabold bg-[#F8F5ED] px-1.5 py-0.5 rounded border border-[#CBD5E1]">cname.aivicampus.com</span></div>
                        <div><strong className="text-[#53606A]">TTL:</strong> <span className="text-[#101820]">Auto or 300 seconds</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-[#2D8B86] text-white flex items-center justify-center font-extrabold text-[11px] shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="text-[11px] text-[#53606A] leading-relaxed">
                      <strong className="text-[#101820]">Save & Verify:</strong> Enter the full custom domain (e.g., <code className="font-mono text-[#2D8B86]">placements.sunrise.ac.in</code>) in the field above and click <strong>"Save Branding Settings"</strong>. SSL/TLS encryption certificates will be provisioned automatically within 15-30 minutes.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#CBD5E1] text-[11px] text-[#53606A] flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-[#2D8B86] shrink-0" />
                  <span><strong>How this works:</strong> Incoming traffic to your custom domain is routed to AIVI's edge server, which checks your verified college ID and serves your portal under your own institution's URL.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
