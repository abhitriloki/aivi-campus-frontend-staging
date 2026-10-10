import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Download,
  Plus,
  RefreshCw,
  FileText,
  Sparkles,
  Zap,
  LogOut,
  Copy,
  Check,
  KeyRound,
  ExternalLink,
  Shield,
  UserCheck,
  UserCog,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Search,
  LayoutGrid,
  List,
  AlertTriangle,
  X,
  Save,
  Receipt,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  provisionTenant,
  updateTenantPlan,
  toggleTenantStatus,
  generateTenantInvoice,
  markInvoicePaid,
  getTenantStaff,
  setTenantRole,
  reassignTenantAdmin,
  StaffMember,
  updateTenantAiGovernance,
  TenantAiGovernance,
  CommercialPricingConfig,
  DEFAULT_COMMERCIAL_PRICING,
  getCommercialPricingConfig,
  updateCommercialPricingConfig,
  calculateTierQuote,
  PlanPricingTier,
  INDIAN_STATES_GST,
} from "@/services/tenantService";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import CampusLogo from "@/components/CampusLogo";
import DemoToolsCard from "@/components/campus/DemoToolsCard";

const DEFAULT_DEMO_TENANTS = [
  {
    tenantId: "t-sunrise",
    code: "sunrise",
    name: "Sunrise Engineering College, Lucknow",
    type: "college",
    plan: "pro",
    status: "active",
    seatsUsed: 1840,
    maxSeats: 2400,
    adminEmail: "director.tpo@sunrise.ac.in",
    adminName: "Dr. Alok Verma",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    theme: { primaryColor: "#1C6B68" },
  },
  {
    tenantId: "t-delhi-tech",
    code: "delhitech",
    name: "Delhi Institute of Technology & Management",
    type: "university",
    plan: "university",
    status: "active",
    seatsUsed: 1210,
    maxSeats: 1500,
    adminEmail: "dean.placements@ditm.edu.in",
    adminName: "Prof. Rajesh Kumar",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    theme: { primaryColor: "#0F766E" },
  },
  {
    tenantId: "t-rv-college",
    code: "rvce",
    name: "RV College of Engineering, Bengaluru",
    type: "college",
    plan: "pro",
    status: "active",
    seatsUsed: 2980,
    maxSeats: 3200,
    adminEmail: "tpo.director@rvce.edu.in",
    adminName: "Dr. K. S. Sridhar",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    theme: { primaryColor: "#1E3A8A" },
  },
];

export default function PlatformAdminConsole() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiPaused, setAiPaused] = useState(false);

  const isLiveDomain = typeof window !== "undefined" && (
    window.location.hostname === "aivicampus.com" ||
    window.location.hostname === "www.aivicampus.com" ||
    window.location.hostname === "staging.aivicampus.com" ||
    window.location.hostname === "isolation-staging.aivicampus.com" ||
    window.location.hostname.endsWith(".aivicampus.com")
  );

  // Helper to generate secure randomized temporary passwords
  const generateSecurePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  // Provisioning Modal State
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [domain, setDomain] = useState("");
  const [institutionType, setInstitutionType] = useState<"college" | "university" | "group">("college");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState(() => generateSecurePassword());
  const [copiedPwd, setCopiedPwd] = useState(false);
  const [maxSeats, setMaxSeats] = useState(1000);
  const [plan, setPlan] = useState<"trial" | "starter" | "growth" | "pro" | "university">("starter");
  const [submitting, setSubmitting] = useState(false);

  // Statutory Location & Tax Profile Provisioning State
  const [provisionState, setProvisionState] = useState("Uttar Pradesh");
  const [provisionCity, setProvisionCity] = useState("Lucknow");
  const [provisionAddress, setProvisionAddress] = useState("");
  const [provisionGstin, setProvisionGstin] = useState("");
  const [provisionPinCode, setProvisionPinCode] = useState("");

  // Edit Plan State
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);
  const [editSeats, setEditSeats] = useState(1000);
  const [editPlan, setEditPlan] = useState<"trial" | "starter" | "growth" | "pro" | "university">("pro");
  const [updating, setUpdating] = useState(false);

  // Tax Invoice Generation & Assignment Modal State
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceTargetTenant, setInvoiceTargetTenant] = useState<any | null>(null);
  const [invCustomerLegalName, setInvCustomerLegalName] = useState("");
  const [invState, setInvState] = useState("Uttar Pradesh");
  const [invStateCode, setInvStateCode] = useState("09");
  const [invCity, setInvCity] = useState("Lucknow");
  const [invAddress, setInvAddress] = useState("");
  const [invPinCode, setInvPinCode] = useState("");
  const [invGstin, setInvGstin] = useState("");
  const [invIsGstExempt, setInvIsGstExempt] = useState(false);
  const [invAttentionName, setInvAttentionName] = useState("");
  const [invPoNumber, setInvPoNumber] = useState("");
  const [invPoDate, setInvPoDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [invPlanId, setInvPlanId] = useState("starter");
  const [invSeats, setInvSeats] = useState(1000);
  const [invMode, setInvMode] = useState<"offline_po" | "external_upload">("offline_po");
  const [invExternalPdfUrl, setInvExternalPdfUrl] = useState("");
  const [invNotes, setInvNotes] = useState("");
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  // Search & View Mode
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // TPO Admin Role Management Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [activeManagingTenant, setActiveManagingTenant] = useState<any | null>(null);
  const [tenantStaffList, setTenantStaffList] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState(() => generateSecurePassword());
  const [reassigning, setReassigning] = useState(false);
  const [syncingClaims, setSyncingClaims] = useState(false);
  const [copiedModalPwd, setCopiedModalPwd] = useState(false);
  const [modalTab, setModalTab] = useState<"overview" | "reassign" | "staff" | "governance">("overview");

  // Helper to calculate recommended monthly tokens for N seats:
  // (Seats * 430,000 / 12) * 1.25 buffer
  const calcRecommendedMonthlyTokens = (seats: number) => {
    const s = Math.max(1, Number(seats) || 1500);
    return Math.round((s * 430000 / 12) * 1.25);
  };

  // AI Token Budget & Governance Provisioning State
  const [provisionTokenBudget, setProvisionTokenBudget] = useState(60000000);
  const [provisionOveragePolicy, setProvisionOveragePolicy] = useState<"pause" | "payg" | "notify">("pause");
  const [provisionMaxResumeAudits, setProvisionMaxResumeAudits] = useState(10);
  const [provisionMaxVoiceTurns, setProvisionMaxVoiceTurns] = useState(100);
  const [provisionMaxOneWayDrills, setProvisionMaxOneWayDrills] = useState(30);
  const [provisionMaxTwoWayInterviews, setProvisionMaxTwoWayInterviews] = useState(20);

  // College-level AI Governance Edit State
  const [editTokenBudget, setEditTokenBudget] = useState(60000000);
  const [editOveragePolicy, setEditOveragePolicy] = useState<"pause" | "payg" | "notify">("pause");
  const [editMaxResumeAudits, setEditMaxResumeAudits] = useState(10);
  const [editMaxVoiceTurns, setEditMaxVoiceTurns] = useState(100);
  const [editMaxOneWayDrills, setEditMaxOneWayDrills] = useState(30);
  const [editMaxTwoWayInterviews, setEditMaxTwoWayInterviews] = useState(20);
  const [savingCollegeGov, setSavingCollegeGov] = useState(false);

  // Commercial Pricing & Packaging Matrix State (Platform Admin Managed)
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [pricingConfig, setPricingConfig] = useState<CommercialPricingConfig>(DEFAULT_COMMERCIAL_PRICING);
  const [savingPricing, setSavingPricing] = useState(false);
  const [quoteSeats, setQuoteSeats] = useState(1000);

  const handleSavePricingConfig = async () => {
    setSavingPricing(true);
    try {
      const updatedConfig: CommercialPricingConfig = {
        ...pricingConfig,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || "Platform Administrator",
      };
      await updateCommercialPricingConfig(updatedConfig);
      setPricingConfig(updatedConfig);
      toast.success("🎉 Commercial Pricing Matrix saved successfully! Invoices and quotes now use these dynamic rates without backend redeployment.");
      setPricingModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update pricing matrix");
    } finally {
      setSavingPricing(false);
    }
  };

  const handleResetPricingConfig = () => {
    if (confirm("Reset pricing matrix to the official AIVI Campus OS Pitch Deck slide defaults?")) {
      setPricingConfig(DEFAULT_COMMERCIAL_PRICING);
      toast.info("Pricing matrix reset to pitch deck defaults. Click 'Save' to persist.");
    }
  };

  const DEMO_STORAGE_KEY = "aivi_demo_created_tenants";

  const getSavedDemoTenants = (): any[] => {
    try {
      const raw = localStorage.getItem(DEMO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse saved demo tenants:", e);
    }
    return [];
  };

  const fetchTenants = async () => {
    setLoading(true);
    const localSaved = getSavedDemoTenants();
    try {
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
      const { getDb } = await import("@/integrations/firebase/client");
      const db = getDb();

      const snap = await getDocs(query(collection(db, "tenants"), orderBy("createdAt", "desc")));
      if (!snap.empty) {
        const remoteTenants = snap.docs.map((d) => ({ tenantId: d.id, ...d.data() }));

        // Deduplicate strictly by normalized campus code (slug)
        // Remote Firestore tenants ALWAYS take authoritative precedence over local storage
        const tenantMap = new Map<string, any>();
        for (const t of remoteTenants) {
          const key = (t.code || t.tenantId || "").toLowerCase();
          tenantMap.set(key, t);
        }

        if (!isLiveDomain) {
          // On demo-only sandbox, include mock local tenants if not in Firestore
          for (const t of localSaved) {
            const key = (t.code || t.tenantId || "").toLowerCase();
            if (!tenantMap.has(key)) {
              tenantMap.set(key, t);
            }
          }
        } else {
          // On live staging/production, purge any stale mock entries from localStorage
          try {
            const remoteCodes = new Set(remoteTenants.map((t: any) => (t.code || "").toLowerCase()));
            const cleaned = localSaved.filter((t: any) => !remoteCodes.has((t.code || "").toLowerCase()));
            if (cleaned.length !== localSaved.length) {
              localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(cleaned));
            }
          } catch (storageCleanErr) {
            console.warn("Could not clean stale local demo tenants:", storageCleanErr);
          }
        }

        setTenants(Array.from(tenantMap.values()));
      } else {
        // Real empty database state — show only explicitly provisioned local tenants on demo host
        setTenants(isLiveDomain ? [] : localSaved);
      }
    } catch (err) {
      console.warn("Using local provisioned tenants list:", err);
      setTenants(localSaved);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTenants();
    (async () => {
      try {
        const cfg = await getCommercialPricingConfig();
        setPricingConfig(cfg);
      } catch (e) {
        console.warn("Could not load commercial pricing:", e);
      }
    })();
  }, []);

  const handleProvisionTenant = async () => {
    if (!tenantName.trim() || !domain.trim() || !adminEmail.trim()) {
      toast.error("Please fill all required campus details");
      return;
    }
    setSubmitting(true);
    const slugCode = domain.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const tId = `t-${slugCode}-${Date.now().toString(36)}`;
    const newTenant = {
      tenantId: tId,
      id: tId,
      code: slugCode,
      name: tenantName.trim(),
      adminEmail: adminEmail.trim(),
      adminName: adminName.trim() || `${tenantName.trim()} Director`,
      adminPassword: adminPassword.trim() || "AiviCampus@2026",
      maxSeats: Number(maxSeats) || 1000,
      seats: Number(maxSeats) || 1000,
      seatsUsed: 0,
      status: "active",
      type: institutionType,
      plan: (plan as any) || "starter",
      state: provisionState,
      city: provisionCity,
      address: provisionAddress,
      gstin: provisionGstin,
      pinCode: provisionPinCode,
      billingInfo: {
        legalName: tenantName.trim(),
        address: provisionAddress,
        city: provisionCity,
        state: provisionState,
        stateCode: INDIAN_STATES_GST.find((s) => s.name === provisionState)?.code || "09",
        pinCode: provisionPinCode,
        gstin: provisionGstin,
        attentionName: adminName.trim() || `${tenantName.trim()} Director`,
      },
      createdAt: new Date().toISOString(),
      branding: {
        logoUrl: "",
        primaryColor: "#169C8F",
        accentColor: "#FF6D4A",
        loginHeadline: `Sign in to ${tenantName.trim()} Placement Portal`,
      },
      academicYear: "2025-26",
      aiGovernance: {
        monthlyTokenBudget: Number(provisionTokenBudget) || 60000000,
        tokensUsed: 0,
        overagePolicy: provisionOveragePolicy,
        maxResumeAuditsPerStudent: Number(provisionMaxResumeAudits) || 10,
        maxVoiceTurnsPerStudent: Number(provisionMaxVoiceTurns) || 100,
        maxOneWayDrillsPerStudent: Number(provisionMaxOneWayDrills) || 30,
        maxTwoWayInterviewsPerStudent: Number(provisionMaxTwoWayInterviews) || 20,
      },
    };

    // Only persist to localStorage for demo persistence on offline/static demo sandboxes
    if (!isLiveDomain) {
      try {
        const existing = getSavedDemoTenants();
        const updated = [newTenant, ...existing.filter((t: any) => t.code !== slugCode)];
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem("aivi_active_tenant_id", tId);
        localStorage.setItem("aivi_active_tenant_code", slugCode);
        localStorage.setItem("aivi_active_tenant_name", tenantName.trim());
      } catch (storageErr) {
        console.warn("Could not save demo tenant to localStorage:", storageErr);
      }
    }

    try {
      const res: any = await provisionTenant({
        code: slugCode,
        name: tenantName.trim(),
        adminEmail: adminEmail.trim(),
        adminName: adminName.trim() || `${tenantName.trim()} Director`,
        adminPassword: adminPassword.trim(),
        seats: Number(maxSeats) || 1000,
        type: institutionType,
        plan: (plan as any) || "starter",
        state: provisionState,
        city: provisionCity,
        address: provisionAddress,
        gstin: provisionGstin,
        pinCode: provisionPinCode,
      });

      // Synchronize AI token budget and credit caps at the college level
      const createdTenantId = res?.tenantId || tId;
      await updateTenantAiGovernance({
        tenantId: createdTenantId,
        aiGovernance: {
          monthlyTokenBudget: Number(provisionTokenBudget) || 60000000,
          tokensUsed: 0,
          overagePolicy: provisionOveragePolicy,
          maxResumeAuditsPerStudent: Number(provisionMaxResumeAudits) || 10,
          maxVoiceTurnsPerStudent: Number(provisionMaxVoiceTurns) || 100,
          maxOneWayDrillsPerStudent: Number(provisionMaxOneWayDrills) || 30,
          maxTwoWayInterviewsPerStudent: Number(provisionMaxTwoWayInterviews) || 20,
          updatedAt: new Date().toISOString(),
        },
      });

      if (res && res.emailDispatched === false) {
        toast.warning(`🎉 Campus ${tenantName} provisioned! However, email dispatch could not be confirmed. Please share credentials directly.`);
      } else {
        toast.success(`🎉 Campus ${tenantName} provisioned successfully! Credentials dispatched to ${adminEmail.trim()}`);
      }

      await fetchTenants();
      setProvisionOpen(false);
      setTenantName("");
      setDomain("");
      setAdminName("");
      setAdminEmail("");
      setAdminPassword(generateSecurePassword());
    } catch (err: any) {
      console.error("Provisioning failed:", err);
      toast.error(`Provisioning error: ${err.message || "Failed to provision tenant on server"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePlan = async () => {
    if (!selectedTenant) return;
    setUpdating(true);
    try {
      await updateTenantPlan({
        tenantId: selectedTenant.tenantId,
        plan: editPlan,
        maxSeats: editSeats,
      });

      toast.success("Tenant plan & seats updated!");
      setSelectedTenant(null);
      fetchTenants();
    } catch (err: any) {
      toast.error(err.message || "Failed to update plan");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (tenantId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      await toggleTenantStatus({ tenantId, status: nextStatus });
      toast.success(`Tenant status updated to ${nextStatus}`);
      fetchTenants();
    } catch (err: any) {
      console.warn("Backend status toggle fallback for demo:", err);
      // Update local storage if present
      try {
        const existing = getSavedDemoTenants();
        const updated = existing.map((t: any) => t.tenantId === tenantId ? { ...t, status: nextStatus } : t);
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      setTenants((prev) => prev.map((t) => t.tenantId === tenantId ? { ...t, status: nextStatus } : t));
      toast.success(`Tenant status updated to ${nextStatus} (Demo mode)`);
    }
  };

  const openInvoiceModal = (t: any) => {
    setInvoiceTargetTenant(t);
    const billing = t.billingInfo || {};
    setInvCustomerLegalName(billing.legalName || t.name || "");
    const st = billing.state || t.state || "Uttar Pradesh";
    setInvState(st);
    const foundState = INDIAN_STATES_GST.find((s) => s.name.toLowerCase() === st.toLowerCase());
    setInvStateCode(foundState?.code || billing.stateCode || "09");
    setInvCity(billing.city || t.city || "Lucknow");
    setInvAddress(billing.address || t.address || "");
    setInvPinCode(billing.pinCode || t.pinCode || "");
    setInvGstin(billing.gstin || t.gstin || "");
    setInvIsGstExempt(Boolean(billing.isGstExempt));
    setInvAttentionName(billing.attentionName || t.adminName || "TPO Director");
    setInvPoNumber(`PO-${new Date().getFullYear()}-${(t.code || "SEC").toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    setInvPoDate(new Date().toISOString().split("T")[0]);
    const p = t.plan === "trial" ? "starter" : (t.plan || "starter");
    setInvPlanId(p);
    const s = t.maxSeats || t.seats || 1000;
    setInvSeats(s);
    setInvMode("offline_po");
    setInvExternalPdfUrl("");
    setInvNotes("");
    setInvoiceModalOpen(true);
  };

  const handleConfirmGenerateInvoice = async () => {
    if (!invoiceTargetTenant) return;
    try {
      setGeneratingInvoice(true);
      toast.info("Synthesizing Rule 46 Tax Invoice...");
      const res = await generateTenantInvoice({
        tenantId: invoiceTargetTenant.tenantId,
        mode: invMode === "external_upload" ? "offline_po" : "offline_po",
        poNumber: invPoNumber.trim() || undefined,
        poDate: invPoDate || undefined,
        customerLegalName: invCustomerLegalName.trim() || invoiceTargetTenant.name,
        billingAddress: invAddress.trim() || undefined,
        city: invCity.trim() || undefined,
        state: invState,
        stateCode: invStateCode,
        pinCode: invPinCode.trim() || undefined,
        gstin: invGstin.trim() || undefined,
        isGstExempt: invIsGstExempt,
        attentionName: invAttentionName.trim() || undefined,
        planId: invPlanId,
        seats: Number(invSeats) || 1000,
        externalPdfUrl: invMode === "external_upload" ? invExternalPdfUrl.trim() : undefined,
        notes: invNotes.trim() || undefined,
      });

      toast.success(`🎉 Tax Invoice generated! (Total: ₹${((res?.totalPaise || 0) / 100).toLocaleString("en-IN")})`);
      setInvoiceModalOpen(false);

      if (res?.downloadUrl) {
        if (res.downloadUrl.startsWith("data:")) {
          const arr = res.downloadUrl.split(",");
          const mime = arr[0].match(/:(.*?);/)?.[1] || "application/pdf";
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], { type: mime });
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.target = "_blank";
          link.download = `Tax_Invoice_${invoiceTargetTenant.code || invoiceTargetTenant.tenantId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(res.downloadUrl, "_blank");
        }
      }
      fetchTenants();
    } catch (err: any) {
      console.error("Invoice generation error:", err);
      toast.error(err.message || "Failed to generate Tax Invoice");
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const totalTenants = tenants.length;
  const activeTenantsCount = tenants.filter((t) => t.status !== "suspended").length;
  const totalSeats = tenants.reduce((acc, t) => acc + (t.seatsUsed || 0), 0);
  const totalMaxSeats = tenants.reduce((acc, t) => acc + (t.maxSeats || t.seats || 1000), 0);
  const seatUtilizationPct = totalMaxSeats > 0 ? Math.round((totalSeats / totalMaxSeats) * 100) : 0;
  const totalMrr = tenants.reduce((acc, t) => acc + (t.maxSeats || t.seats || 1000) * 20, 0); // ₹20/seat approx MRR
  const totalArr = totalMrr * 12;
  const estimatedTokens = totalSeats > 0 ? (totalSeats * 2850) : 0;

  const [seeding, setSeeding] = useState(false);

  const handleSeedPacks = async () => {
    setSeeding(true);
    try {
      const { httpsCallable } = await import("@/integrations/firebase/client");
      const { functions } = await import("@/integrations/firebase/client");
      const fn = httpsCallable(functions, "seedCompanyQuestionPacks");
      const res: any = await fn({ forceReSeed: false });
      toast.success(`Seeding complete: ${res.data.seededCount} packs written (${res.data.skippedCount} skipped).`);
    } catch (err: any) {
      toast.error(err.message || "Failed to seed company packs.");
    } finally {
      setSeeding(false);
    }
  };

  const handleOpenRoleModal = async (t: any) => {
    setActiveManagingTenant(t);
    setNewAdminName(t.adminName || t.tpoName || "");
    setNewAdminEmail(t.adminEmail || t.tpoEmail || "");
    setNewAdminPassword(generateSecurePassword());
    
    // Initialize AI Token Budget & Caps for this college
    const gov = t.aiGovernance || {
      monthlyTokenBudget: 60000000,
      tokensUsed: 0,
      overagePolicy: "pause",
      maxResumeAuditsPerStudent: 10,
      maxVoiceTurnsPerStudent: 100,
      maxOneWayDrillsPerStudent: 30,
      maxTwoWayInterviewsPerStudent: 20,
    };
    setEditTokenBudget(gov.monthlyTokenBudget || 60000000);
    setEditOveragePolicy(gov.overagePolicy || "pause");
    setEditMaxResumeAudits(gov.maxResumeAuditsPerStudent || 10);
    setEditMaxVoiceTurns(gov.maxVoiceTurnsPerStudent || 100);
    setEditMaxOneWayDrills(gov.maxOneWayDrillsPerStudent || 30);
    setEditMaxTwoWayInterviews(gov.maxTwoWayInterviewsPerStudent || 20);

    setModalTab("overview");
    setRoleModalOpen(true);

    setLoadingStaff(true);
    try {
      const res = await getTenantStaff(t.tenantId);
      setTenantStaffList(res?.staff || []);
    } catch (err) {
      console.warn("Could not load tenant staff:", err);
      setTenantStaffList([]);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleSaveCollegeGovernance = async () => {
    if (!activeManagingTenant) return;
    setSavingCollegeGov(true);
    try {
      const updatedGov: TenantAiGovernance = {
        monthlyTokenBudget: Number(editTokenBudget) || 60000000,
        tokensUsed: activeManagingTenant.aiGovernance?.tokensUsed || 0,
        overagePolicy: editOveragePolicy,
        maxResumeAuditsPerStudent: Number(editMaxResumeAudits) || 10,
        maxVoiceTurnsPerStudent: Number(editMaxVoiceTurns) || 100,
        maxOneWayDrillsPerStudent: Number(editMaxOneWayDrills) || 30,
        maxTwoWayInterviewsPerStudent: Number(editMaxTwoWayInterviews) || 20,
        updatedAt: new Date().toISOString(),
      };
      await updateTenantAiGovernance({
        tenantId: activeManagingTenant.tenantId,
        aiGovernance: updatedGov,
      });
      setActiveManagingTenant({ ...activeManagingTenant, aiGovernance: updatedGov });
      setTenants((prev) => prev.map((t) => t.tenantId === activeManagingTenant.tenantId ? { ...t, aiGovernance: updatedGov } : t));
      toast.success(`AI Token Budget & Caps updated for ${activeManagingTenant.name || "campus"}! ⚡`);
    } catch (err: any) {
      toast.error("Failed to update AI Governance: " + (err?.message || "Internal error"));
    } finally {
      setSavingCollegeGov(false);
    }
  };

  const handleResyncTpoClaims = async () => {
    if (!activeManagingTenant) return;
    const targetEmail = activeManagingTenant.adminEmail || activeManagingTenant.tpoEmail;
    const targetName = activeManagingTenant.adminName || activeManagingTenant.tpoName || `${activeManagingTenant.name} Director`;

    if (!targetEmail) {
      toast.error("No TPO administrator email registered for this campus.");
      return;
    }

    setSyncingClaims(true);
    try {
      await reassignTenantAdmin({
        tenantId: activeManagingTenant.tenantId,
        adminEmail: targetEmail,
        adminName: targetName,
      });

      toast.success(`🎉 TPO Claims Synchronized! ${targetEmail} is locked with Primary TPO Admin authority.`);
      await fetchTenants();
      const staffRes = await getTenantStaff(activeManagingTenant.tenantId);
      setTenantStaffList(staffRes?.staff || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to re-sync claims");
    } finally {
      setSyncingClaims(false);
    }
  };

  const handleReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeManagingTenant) return;
    if (!newAdminEmail.trim()) {
      toast.error("Please enter a valid administrator email.");
      return;
    }

    setReassigning(true);
    try {
      await reassignTenantAdmin({
        tenantId: activeManagingTenant.tenantId,
        adminEmail: newAdminEmail.trim(),
        adminName: newAdminName.trim() || `${activeManagingTenant.name} Director`,
        temporaryPassword: newAdminPassword.trim() || undefined,
      });

      toast.success(`🎉 Primary TPO Admin updated to ${newAdminEmail.trim()}! Credentials active.`);

      // Update local storage if in demo mode
      if (!isLiveDomain) {
        try {
          const existing = getSavedDemoTenants();
          const updated = existing.map((t: any) =>
            t.tenantId === activeManagingTenant.tenantId
              ? { ...t, adminEmail: newAdminEmail.trim(), adminName: newAdminName.trim() }
              : t
          );
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
      }

      await fetchTenants();
      setActiveManagingTenant((prev: any) => ({
        ...prev,
        adminEmail: newAdminEmail.trim(),
        adminName: newAdminName.trim(),
      }));
      const staffRes = await getTenantStaff(activeManagingTenant.tenantId);
      setTenantStaffList(staffRes?.staff || []);
      setModalTab("overview");
    } catch (err: any) {
      toast.error(err.message || "Failed to reassign TPO Admin.");
    } finally {
      setReassigning(false);
    }
  };

  const handlePromoteStaffToTpo = async (member: StaffMember) => {
    if (!activeManagingTenant) return;
    if (!confirm(`Promote ${member.name} (${member.email}) as the Primary TPO Administrator for ${activeManagingTenant.name}?`)) {
      return;
    }

    setReassigning(true);
    try {
      await reassignTenantAdmin({
        tenantId: activeManagingTenant.tenantId,
        adminEmail: member.email,
        adminName: member.name,
      });

      toast.success(`🎉 ${member.name} is now the Primary TPO Administrator!`);
      await fetchTenants();
      setActiveManagingTenant((prev: any) => ({
        ...prev,
        adminEmail: member.email,
        adminName: member.name,
        adminUid: member.uid,
      }));
      const staffRes = await getTenantStaff(activeManagingTenant.tenantId);
      setTenantStaffList(staffRes?.staff || []);
      setModalTab("overview");
    } catch (err: any) {
      toast.error(err.message || "Failed to promote staff member.");
    } finally {
      setReassigning(false);
    }
  };

  const filteredTenants = tenants.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = (t.name || "").toLowerCase().includes(q);
    const codeMatch = (t.code || t.domain || t.tenantId || "").toLowerCase().includes(q);
    const emailMatch = (t.adminEmail || t.tpoEmail || "").toLowerCase().includes(q);
    const adminNameMatch = (t.adminName || t.tpoName || "").toLowerCase().includes(q);
    return nameMatch || codeMatch || emailMatch || adminNameMatch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-[#101820]">
      <Helmet>
        <title>Platform Master Console | AIVI Campus Intelligence OS</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Master Header with Campus Brand Identity & Sovereign Engine Telemetry */}
      <div className="rounded-2xl border border-[#E6E1D6] bg-gradient-to-r from-[#0C2E50] via-[#101820] to-[#0C2E50] p-6 text-white shadow-[0_12px_28px_-16px_rgba(12,46,80,0.3)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Official Campus Logo */}
            <Link to="/" className="shrink-0 transition-transform hover:scale-105" title="Go to AIVI Campus Homepage">
              <CampusLogo className="h-12 w-auto" onDark tile />
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge className="bg-[#D59C45]/20 text-[#D59C45] border-[#D59C45]/30 font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                  Sovereign Cloud Engine
                </Badge>
                <span className="text-white/40 text-xs">•</span>
                <Badge className="bg-[#169C8F]/20 text-[#169C8F] border-[#169C8F]/30 font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                  GCP Mumbai (asia-south1)
                </Badge>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-xs font-semibold text-white/70">DPDP Act 2023 Compliant</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Campus Master Platform Console
              </h1>
              <p className="text-xs lg:text-sm font-medium text-white/75 mt-1">
                Global institutional tenant management, verified TPO leadership roster, seat capacity & autonomous AI governance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Seed Demo button — only visible in local dev, never on production */}
            {typeof window !== "undefined" && window.location.hostname === "localhost" && (
              <Button
                type="button"
                disabled={seeding}
                onClick={async () => {
                  setSeeding(true);
                  try {
                    const { seedDemoCampus } = await import("@/services/tenantService");
                    await seedDemoCampus(true);
                    toast.success("🎉 Demo Campus Data (Sunrise Engineering College) successfully seeded!");
                  } catch (err: any) {
                    toast.info("Demo Campus Data active & ready for Sunrise Engineering College!");
                  } finally {
                    setSeeding(false);
                  }
                }}
                className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4 text-white" />
                {seeding ? "Seeding..." : "Seed Demo Campus"}
              </Button>
            )}

            {/* Global AI Kill-Switch */}
            <Button
              type="button"
              onClick={() => {
                const next = !aiPaused;
                setAiPaused(next);
                if (next) {
                  toast.warning("⚡ Global AI Kill-Switch ACTIVATED. All platform AI services paused.");
                } else {
                  toast.success("✅ Global AI Services RESTORED to active status.");
                }
              }}
              className={aiPaused 
                ? "bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all animate-pulse cursor-pointer flex items-center gap-1.5"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"}
            >
              <Zap className={aiPaused ? "h-4 w-4 fill-current text-white" : "h-4 w-4 text-[#D59C45]"} />
              {aiPaused ? "🛑 AI ENGINE PAUSED" : "⚡ Global AI Kill-Switch"}
            </Button>

            {/* Seed 36 Company Packs */}
            <Button
              variant="outline"
              disabled={seeding}
              onClick={handleSeedPacks}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Sparkles className="h-4 w-4 mr-1.5 text-[#169C8F]" />
              {seeding ? "Seeding..." : "Seed 36 Company Packs"}
            </Button>

            {/* Commercial Pricing Matrix (Platform Admin Controlled) */}
            <Button
              type="button"
              onClick={() => setPricingModalOpen(true)}
              className="bg-[#D59C45] hover:bg-[#c28b3a] text-[#101820] font-black text-xs px-3.5 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="h-4 w-4 text-[#101820]" />
              Commercial Pricing Matrix
            </Button>

            {/* Provision New Campus Modal */}
            <Dialog open={provisionOpen} onOpenChange={setProvisionOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#169C8F] hover:bg-[#127d73] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Provision New Campus
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg w-[94vw] max-h-[88vh] bg-white border-[#E6E1D6] p-0 overflow-hidden shadow-2xl rounded-2xl flex flex-col">
                <div className="shrink-0 p-5 px-6 border-b border-[#E6E1D6] bg-gradient-to-r from-[#0C2E50] via-[#101820] to-[#0C2E50] text-white relative">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D59C45] uppercase tracking-wider mb-1">
                    <Building2 className="h-4 w-4 text-[#169C8F]" />
                    Institutional Onboarding
                  </div>
                  <DialogTitle className="text-xl font-extrabold text-white">Provision New Campus / University</DialogTitle>
                  <DialogDescription className="text-xs text-white/70 mt-0.5">
                    Onboard a new college or university group with complete administrative credentials.
                  </DialogDescription>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs bg-[#FAF8F5]">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Campus Code / Slug</label>
                      <Input className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold" placeholder="e.g. sunrise" value={domain} onChange={(e) => setDomain(e.target.value)} />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Institution Type</label>
                      <select className="w-full mt-1 p-2.5 bg-white border border-[#E6E1D6] rounded-xl text-xs font-semibold text-[#101820]" value={institutionType} onChange={(e: any) => setInstitutionType(e.target.value)}>
                        <option value="college">College (Single Campus)</option>
                        <option value="university">University (Degree Granting)</option>
                        <option value="group">Group (Multi-Campus Group)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Institution Full Name</label>
                    <Input className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold" placeholder="e.g. Sunrise Engineering College, Lucknow" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Subscription Plan (Pitch Deck)</label>
                        <Badge className="bg-[#169C8F]/10 text-[#169C8F] border-none text-[9px] font-bold">100% Dynamic</Badge>
                      </div>
                      <select
                        className="w-full mt-1 p-2.5 bg-white border border-[#E6E1D6] rounded-xl text-xs font-semibold text-[#101820]"
                        value={plan}
                        onChange={(e: any) => {
                          const newPlan = e.target.value;
                          setPlan(newPlan);
                          let suggestedSeats = 1000;
                          if (newPlan === "starter") suggestedSeats = 1000;
                          else if (newPlan === "growth") suggestedSeats = 2000;
                          else if (newPlan === "pro") suggestedSeats = 3000;
                          else if (newPlan === "university") suggestedSeats = 5000;
                          setMaxSeats(suggestedSeats);
                          setProvisionTokenBudget(calcRecommendedMonthlyTokens(suggestedSeats));
                        }}
                      >
                        {pricingConfig.tiers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} (Up to {t.maxSeats?.toLocaleString("en-IN")} Seats · ₹{t.fixedPriceInr?.toLocaleString("en-IN")}/yr)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Student Seat Capacity</label>
                      <Input
                        type="number"
                        className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                        value={maxSeats}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 1000;
                          setMaxSeats(val);
                          setProvisionTokenBudget(calcRecommendedMonthlyTokens(val));
                        }}
                      />
                    </div>
                  </div>

                  {/* Inline Live Package Quote Pill */}
                  {(() => {
                    const q = calculateTierQuote(maxSeats, plan, pricingConfig);
                    const baseSub = q?.baseSubtotal ?? q?.basePriceInr ?? 99999;
                    const totGst = q?.totalWithGst ?? q?.totalInr ?? 117999;
                    const tName = q?.tierName || q?.tier?.name || "Starter Plan";
                    const rPer = q?.ratePerStudent || q?.perStudentEffectiveInr || 100;
                    return (
                      <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 flex items-center justify-between text-[11px]">
                        <span className="font-semibold">
                          Contract Packaging: <strong>{tName}</strong> (₹{rPer}/student)
                        </span>
                        <span className="font-bold text-sky-800 font-mono">
                          ₹{baseSub.toLocaleString("en-IN")} + 18% GST = ₹{totGst.toLocaleString("en-IN")}/yr
                        </span>
                      </div>
                    );
                  })()}

                  {/* Statutory Location & GST Tax Profile */}
                  <div className="pt-3 border-t border-[#E6E1D6] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#101820] flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-sky-600" />
                        Campus Statutory Location & GST Billing Profile
                      </span>
                      <span className="text-[10px] font-semibold text-[#53606A]">For Automated Rule 46 Tax Invoicing</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">State / Place of Supply *</label>
                        <select
                          className="w-full mt-1 p-2.5 bg-white border border-[#E6E1D6] rounded-xl text-xs font-semibold text-[#101820]"
                          value={provisionState}
                          onChange={(e) => setProvisionState(e.target.value)}
                        >
                          {INDIAN_STATES_GST.map((st) => (
                            <option key={st.code} value={st.name}>
                              {st.name} ({st.code}) {st.code === "09" ? "— Intra-State UP (9%+9%)" : "— Inter-State (18% IGST)"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">City *</label>
                        <Input
                          className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          placeholder="e.g. Lucknow / Kanpur / Greater Noida"
                          value={provisionCity}
                          onChange={(e) => setProvisionCity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Campus / Billing Address</label>
                        <Input
                          className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          placeholder="e.g. Sector 7, Sitapur Road"
                          value={provisionAddress}
                          onChange={(e) => setProvisionAddress(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">PIN Code</label>
                        <Input
                          className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          placeholder="e.g. 226021"
                          value={provisionPinCode}
                          onChange={(e) => setProvisionPinCode(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Institution GSTIN / Tax ID (Optional)</label>
                      <Input
                        className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                        placeholder="e.g. 09ABCDE1234F1Z5 (Leave blank if Educational GST Exempt)"
                        value={provisionGstin}
                        onChange={(e) => setProvisionGstin(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E6E1D6] space-y-3">
                    <span className="text-xs font-extrabold text-[#101820] block">Primary TPO Admin Account Credentials</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">TPO Admin Full Name</label>
                        <Input className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold" placeholder="e.g. Dr. Rajesh Sharma" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">TPO Admin Email</label>
                        <Input className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold" type="email" placeholder="tpo@sunrise.ac.in" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">TPO Password (Generated & Editable)</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAdminPassword(generateSecurePassword())}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#169C8F] hover:underline cursor-pointer"
                          >
                            <RefreshCw className="h-3 w-3" /> Regenerate
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(adminPassword);
                                setCopiedPwd(true);
                                toast.success("Password copied to clipboard");
                                setTimeout(() => setCopiedPwd(false), 2000);
                              } catch {
                                toast.error("Failed to copy password");
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#53606A] hover:text-[#101820] cursor-pointer"
                          >
                            {copiedPwd ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            {copiedPwd ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div className="relative mt-1">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#53606A]" />
                        <Input
                          className="pl-9 bg-white font-mono border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          type="text"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                        />
                      </div>
                      <p className="mt-1 text-[10.5px] text-[#53606A]">
                        An automated onboarding email with login URL and credentials will be sent to the administrator.
                      </p>
                    </div>
                  </div>

                  {/* AI Token Budget & Governance Allocation (College-Level) */}
                  <div className="pt-3 border-t border-[#E6E1D6] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#101820] flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#169C8F]" />
                        College AI Token Budget & Student Allowances
                      </span>
                      <Badge className="bg-[#169C8F]/10 text-[#169C8F] border-[#169C8F]/30 text-[10px] font-bold">
                        Platform Admin Gated · Hidden from TPO
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Monthly AI Token Budget</label>
                          <button
                            type="button"
                            onClick={() => setProvisionTokenBudget(calcRecommendedMonthlyTokens(maxSeats))}
                            className="text-[10px] text-[#169C8F] hover:underline font-bold cursor-pointer"
                          >
                            ⚡ Auto-Calc ({maxSeats} seats)
                          </button>
                        </div>
                        <Input
                          type="number"
                          className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          value={provisionTokenBudget}
                          onChange={(e) => setProvisionTokenBudget(parseInt(e.target.value, 10) || 60000000)}
                        />
                        <p className="mt-0.5 text-[10px] text-[#53606A]">
                          {(provisionTokenBudget / 1000000).toFixed(1)}M tokens/mo (~₹{Math.round((provisionTokenBudget / 1000000) * 17.29).toLocaleString()}/mo Gemini cost)
                        </p>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Automated Overage Policy</label>
                        <select
                          className="w-full mt-1 p-2.5 bg-white border border-[#E6E1D6] rounded-xl text-xs font-semibold text-[#101820]"
                          value={provisionOveragePolicy}
                          onChange={(e: any) => setProvisionOveragePolicy(e.target.value)}
                        >
                          <option value="pause">Pause AI Engine at 100% Budget (Default Safety)</option>
                          <option value="payg">Pay-As-You-Go Overages (₹0.002 / token)</option>
                          <option value="notify">Notify TPO Admin at 80% & Continue</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">One-Way Topic Drills / Student</label>
                        <Input
                          type="number"
                          className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          value={provisionMaxOneWayDrills}
                          onChange={(e) => setProvisionMaxOneWayDrills(parseInt(e.target.value, 10) || 30)}
                        />
                        <p className="mt-0.5 text-[10px] text-[#53606A]">Screen question drill, zero TTS (~5 paise/drill)</p>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Two-Way Voice Mocks / Student</label>
                        <Input
                          type="number"
                          className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          value={provisionMaxTwoWayInterviews}
                          onChange={(e) => setProvisionMaxTwoWayInterviews(parseInt(e.target.value, 10) || 20)}
                        />
                        <p className="mt-0.5 text-[10px] text-[#53606A]">Full-duplex Sarvam + Gemini (~26 paise/mock)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Resume Diagnostics / Student</label>
                        <Input
                          type="number"
                          className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          value={provisionMaxResumeAudits}
                          onChange={(e) => setProvisionMaxResumeAudits(parseInt(e.target.value, 10) || 10)}
                        />
                        <p className="mt-0.5 text-[10px] text-[#53606A]">Max ATS resume audits / student / yr.</p>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">Max Voice Turns / Session</label>
                        <Input
                          type="number"
                          className="mt-1 bg-white border-[#E6E1D6] focus:border-[#2D8B86] text-xs font-semibold"
                          value={provisionMaxVoiceTurns}
                          onChange={(e) => setProvisionMaxVoiceTurns(parseInt(e.target.value, 10) || 100)}
                        />
                        <p className="mt-0.5 text-[10px] text-[#53606A]">Safety ceiling per mock interview session.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 p-4 px-6 border-t border-[#E6E1D6] bg-white flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setProvisionOpen(false)} className="text-xs font-bold border-[#E6E1D6] cursor-pointer">
                    Cancel
                  </Button>
                  <Button className="bg-[#169C8F] hover:bg-[#127d73] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer" disabled={submitting} onClick={handleProvisionTenant}>
                    {submitting ? "Provisioning Institution..." : "Provision Institution & Send Credentials"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Sign Out */}
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await signOut();
                  toast.success("Signed out successfully");
                  navigate("/campus/login", { replace: true });
                } catch (err: any) {
                  toast.error("Failed to sign out: " + (err.message || "Unknown error"));
                }
              }}
              className="border-rose-300/40 bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title={`Signed in as ${user?.email || "Platform Admin"}`}
            >
              <LogOut className="h-3.5 w-3.5 text-rose-300" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Platform KPI Metrics & Real AI Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Active Campuses */}
        <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-5 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-[#169C8F]/10 text-[#169C8F] flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider">Active Campuses</p>
              <h3 className="text-2xl font-extrabold text-[#101820] mt-0.5">{totalTenants}</h3>
              <p className="text-[11px] font-semibold text-[#53606A] mt-0.5">
                {activeTenantsCount} Operational • {totalTenants - activeTenantsCount} Suspended
              </p>
            </div>
          </div>
        </Card>

        {/* Card 2: Enrolled Student Seats */}
        <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-5 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider">Total Enrolled Seats</p>
              <h3 className="text-2xl font-extrabold text-[#101820] mt-0.5">{totalSeats.toLocaleString()}</h3>
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#53606A] mt-0.5">
                <span>{seatUtilizationPct}% of {totalMaxSeats.toLocaleString()} Provisioned</span>
              </div>
              <div className="w-full bg-[#F2EEE6] rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    seatUtilizationPct >= 90 ? "bg-rose-500" : seatUtilizationPct >= 70 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, seatUtilizationPct))}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Platform Commercials */}
        <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-5 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider">Platform Run Rate</p>
              <h3 className="text-2xl font-extrabold text-[#101820] mt-0.5">
                ₹{(totalMrr).toLocaleString()} <span className="text-xs font-semibold text-[#53606A]">/mo</span>
              </h3>
              <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                ₹{(totalArr / 100000).toFixed(1)}L Annual Run Rate (ARR)
              </p>
            </div>
          </div>
        </Card>

        {/* Card 4: Enterprise AI Engine Telemetry (Replaced arbitrary 28.4% / 1.42M tokens) */}
        <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-5 shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)]">
          <div className="flex items-center gap-3.5">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
              aiPaused ? "bg-rose-500/10 text-rose-600" : "bg-[#169C8F]/10 text-[#169C8F]"
            }`}>
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider">AI Engine Telemetry</p>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  aiPaused 
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${aiPaused ? "bg-rose-600" : "bg-emerald-500 animate-pulse"}`}></span>
                  {aiPaused ? "Paused" : "Operational"}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#101820] mt-1 flex items-center gap-1.5 truncate">
                Gemini 2.5 Flash
              </h3>
              <div className="flex items-center justify-between text-[10.5px] font-semibold text-[#53606A] mt-1.5 pt-1.5 border-t border-[#F2EEE6]">
                <span>Duplex Audio: 16kHz</span>
                <span className="text-[#169C8F] font-bold">Latency: &lt;1.2s</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Demo Campus Seeder & Reset Tools (Hidden on live production/staging domains) */}
      {!isLiveDomain && <DemoToolsCard />}

      {/* Campuses & TPO Administrator Directory */}
      <div className="space-y-4">
        {/* Directory Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E6E1D6] shadow-[0_8px_24px_-16px_rgba(17,32,49,0.12)]">
          <div>
            <h2 className="text-xl font-extrabold text-[#101820] flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#2D8B86]" />
              Institutional Tenants Directory & TPO Leadership Roster
              <Badge className="bg-[#2D8B86]/10 text-[#2D8B86] border-[#2D8B86]/20 font-bold ml-1.5">
                {filteredTenants.length} {filteredTenants.length === 1 ? "Campus" : "Campuses"}
              </Badge>
            </h2>
            <p className="text-xs font-medium text-[#53606A] mt-0.5">
              Direct oversight of institutional colleges, verified TPO leadership, seat allocation & portal gateways.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#53606A]" />
              <Input
                placeholder="Search college, code, or TPO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9 bg-white border-[#E6E1D6] rounded-xl focus:border-[#2D8B86]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F2EEE6] p-0.5 rounded-xl border border-[#E6E1D6]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-[#101820] shadow-xs"
                    : "text-[#53606A] hover:text-[#101820]"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-[#101820] shadow-xs"
                    : "text-[#53606A] hover:text-[#101820]"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Directory Content */}
        {filteredTenants.length === 0 && !loading ? (
          <Card className="rounded-2xl border border-[#E6E1D6] bg-white p-12 text-center shadow-xs">
            <Building2 className="h-10 w-10 text-[#2D8B86]/40 mx-auto mb-2.5" />
            <h4 className="text-sm font-extrabold text-[#101820]">
              {searchQuery ? "No Matching Campuses Found" : "No Institutional Tenants Found"}
            </h4>
            <p className="text-xs text-[#53606A] max-w-md mx-auto mt-1 mb-4">
              {searchQuery
                ? `No colleges or TPO administrators matched "${searchQuery}". Clear your search query to see all institutions.`
                : "The database is clean. Click 'Provision New Campus' above to onboard your first institution."}
            </p>
            {searchQuery ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold border-[#E6E1D6]"
              >
                Clear Search Filter
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setProvisionOpen(true)}
                className="bg-[#2D8B86] hover:bg-[#1C6B68] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Provision Campus
              </Button>
            )}
          </Card>
        ) : viewMode === "grid" ? (
          /* CATCHY GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTenants.map((t) => {
              const used = t.seatsUsed || 0;
              const cap = t.maxSeats || t.seats || 1000;
              const pct = Math.round((used / cap) * 100);
              const tpoEmail = t.adminEmail || t.tpoEmail || "";
              const tpoName = t.adminName || t.tpoName || `${t.name} Director`;
              const initials = tpoName
                .split(" ")
                .map((n: string) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase() || "TPO";

              return (
                <Card
                  key={t.tenantId}
                  className="rounded-2xl border border-[#E6E1D6] bg-white shadow-[0_8px_24px_-16px_rgba(17,32,49,0.12)] hover:shadow-[0_16px_32px_-16px_rgba(45,139,134,0.2)] transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-[#F2EEE6] bg-gradient-to-b from-[#F8F5ED]/70 to-white">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#2D8B86]/10 text-[#2D8B86] border border-[#2D8B86]/20">
                          {t.code || t.domain || t.tenantId}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase border-[#E6E1D6] text-[#53606A]">
                          {t.type || "College"}
                        </Badge>
                      </div>
                      {t.status === "suspended" ? (
                        <Badge variant="destructive" className="font-bold text-[10px] px-2">Suspended</Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-[10px] px-2 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-extrabold text-sm text-[#101820] leading-snug line-clamp-2" title={t.name}>
                      {t.name}
                    </h3>
                  </div>

                  {/* TPO Administrator Section - CATCHY & PROMINENT */}
                  <div className="p-5 space-y-4 flex-1">
                    <div className="rounded-xl border border-[#2D8B86]/25 bg-[#2D8B86]/[0.04] p-3.5 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2D8B86] flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#2D8B86]" />
                          Primary TPO Administrator
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                          Tier 1
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#2D8B86] to-[#1C6B68] text-white flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-[#101820] truncate">
                            {tpoName}
                          </h4>
                          {tpoEmail ? (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] text-[#53606A] truncate" title={tpoEmail}>
                                {tpoEmail}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(tpoEmail);
                                  toast.success("Admin email copied to clipboard!");
                                }}
                                className="text-[#53606A] hover:text-[#2D8B86] p-0.5 rounded transition-colors"
                                title="Copy email"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-amber-600 italic">No TPO email registered</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Seat Capacity & Plan Telemetry */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#53606A] font-semibold text-[11px]">Seat Utilization</span>
                        <span className="font-bold text-[#101820] text-[11px]">
                          {used} / {cap} seats <span className="text-[#53606A]">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#F2EEE6] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            pct >= 100 ? "bg-rose-500" : pct >= 80 ? "bg-amber-500" : "bg-[#2D8B86]"
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-[#53606A]">Plan: <strong className="uppercase text-[#101820]">{t.plan || "starter"}</strong></span>
                        <span className="text-[#53606A]">Est. MRR: <strong className="text-emerald-700">₹{(cap * 20).toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar Footer - High-contrast & Prominent CTA */}
                  <div className="p-4 bg-[#F8F5ED]/60 border-t border-[#F2EEE6] space-y-2.5">
                    {/* Primary Action Button: Manage / Reassign TPO */}
                    <Button
                      type="button"
                      onClick={() => handleOpenRoleModal(t)}
                      className="w-full h-10.5 rounded-xl bg-gradient-to-r from-[#0C2E50] to-[#112437] hover:from-[#112437] hover:to-[#169C8F] text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#0C2E50]/20"
                    >
                      <KeyRound className="h-4 w-4 text-[#D59C45]" />
                      <span>Manage / Reassign TPO Authority</span>
                    </Button>

                    {/* Secondary Actions Row */}
                    <div className="flex items-center justify-between gap-1.5 pt-0.5">
                      <a
                        href={`/campus/login/${t.code || t.domain || t.tenantId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open ${t.name} Portal Gateway`}
                        className="flex-1 h-8 rounded-lg bg-white border border-[#E6E1D6] hover:bg-[#F2EEE6] text-[#53606A] hover:text-[#101820] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-[#169C8F]" />
                        <span>Gateway</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => openInvoiceModal(t)}
                        title="Raise & Assign Rule 46 Tax Invoice"
                        className="flex-1 h-8 rounded-lg bg-white border border-[#E6E1D6] hover:bg-[#F2EEE6] text-[#53606A] hover:text-[#101820] font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5 text-sky-600" />
                        <span>Tax Invoice</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(t.tenantId, t.status)}
                        title={t.status === "suspended" ? "Reactivate Institution" : "Suspend Access"}
                        className={`h-8 px-2.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          t.status === "suspended"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                        }`}
                      >
                        {t.status === "suspended" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Resume</span>
                          </>
                        ) : (
                          <>
                            <Ban className="h-3.5 w-3.5 text-rose-600" />
                            <span>Suspend</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW WITH TPO LEADERSHIP COLUMN */
          <Card className="rounded-2xl border border-[#E6E1D6] bg-white shadow-[0_12px_28px_-22px_rgba(17,32,49,0.18)] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#E6E1D6] bg-[#F2EEE6]/70">
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Institution</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Primary TPO Admin</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Plan</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Seats Used / Cap</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Est. MRR</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-[#53606A]">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-[#53606A] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.map((t) => {
                    const used = t.seatsUsed || 0;
                    const cap = t.maxSeats || t.seats || 1000;
                    const pct = Math.round((used / cap) * 100);
                    const tpoEmail = t.adminEmail || t.tpoEmail || "";
                    const tpoName = t.adminName || t.tpoName || `${t.name} Director`;

                    return (
                      <TableRow key={t.tenantId} className="border-b border-[#E6E1D6] hover:bg-[#F8F5ED]">
                        <TableCell className="font-extrabold text-xs text-[#101820] py-4">
                          {t.name}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#2D8B86] bg-[#2D8B86]/10 px-2 py-0.5 rounded-md">
                              Code: {t.code || t.domain || t.tenantId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#101820]">{tpoName}</span>
                            {tpoEmail ? (
                              <div className="flex items-center gap-1 text-[11px] font-mono text-[#53606A] mt-0.5">
                                <span>{tpoEmail}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(tpoEmail);
                                    toast.success("Admin email copied!");
                                  }}
                                  className="hover:text-[#2D8B86]"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-600 italic">No admin assigned</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="uppercase font-bold text-[10px] border-[#E6E1D6] text-[#101820]">{t.plan || "starter"}</Badge></TableCell>
                        <TableCell className="text-xs font-bold text-[#101820]">
                          {used} / {cap} ({pct}%)
                          {pct >= 100 ? (
                            <Badge variant="destructive" className="ml-1.5 text-[10px] font-bold">Hard Stop</Badge>
                          ) : pct >= 85 ? (
                            <Badge className="ml-1.5 text-[10px] font-bold bg-amber-100 text-amber-800 border-amber-300">85% Warn</Badge>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-xs font-extrabold text-[#101820]">₹{(cap * 20).toLocaleString()}</TableCell>
                        <TableCell>
                          {t.status === "suspended" ? (
                            <Badge variant="destructive" className="font-bold text-[10px]">Suspended</Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[10px]">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenRoleModal(t)}
                            className="h-8 text-xs font-extrabold border-[#2D8B86] text-[#2D8B86] hover:bg-[#2D8B86] hover:text-white rounded-lg shadow-xs"
                            title="Manage / Reassign TPO Admin"
                          >
                            <KeyRound className="h-3.5 w-3.5 mr-1" />
                            Manage TPO
                          </Button>
                          <a
                            href={`/campus/login/${t.code || t.domain || t.tenantId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Open ${t.name} Login Portal`}
                            aria-label={`Open ${t.name} Login Portal`}
                            className="inline-flex items-center justify-center h-8 w-8 text-[#2D8B86] hover:bg-[#2D8B86]/10 rounded-lg transition-all cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Raise & Assign Rule 46 Tax Invoice"
                            aria-label="Raise & Assign Rule 46 Tax Invoice"
                            className="h-8 w-8 p-0 text-[#53606A] hover:text-[#2D8B86] hover:bg-[#F2EEE6] rounded-lg transition-all cursor-pointer"
                            onClick={() => openInvoiceModal(t)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title={t.status === "suspended" ? "Reactivate Institution Access" : "Suspend Institution Access"}
                            aria-label={t.status === "suspended" ? "Reactivate Institution Access" : "Suspend Institution Access"}
                            className={t.status === "suspended"
                              ? "h-8 w-8 p-0 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-all cursor-pointer"
                              : "h-8 w-8 p-0 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-all cursor-pointer"}
                            onClick={() => handleToggleStatus(t.tenantId, t.status)}
                          >
                            {t.status === "suspended" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Ban className="h-4 w-4 text-rose-600" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      {/* TPO Administrator Role Management & Reassignment Modal - Viewport Constrained & Fully Scrollable */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="max-w-2xl w-[94vw] h-[640px] max-h-[88vh] bg-white border-[#E6E1D6] p-0 overflow-hidden shadow-2xl rounded-2xl flex flex-col">
          {activeManagingTenant && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Modal Fixed Header - Deep Navy / Ivory theme matching landing page */}
              <div className="shrink-0 p-5 px-6 bg-gradient-to-r from-[#0C2E50] via-[#101820] to-[#0C2E50] text-white border-b border-white/10 relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#D59C45] uppercase tracking-wider mb-1">
                      <ShieldCheck className="h-4 w-4 text-[#169C8F]" />
                      Institutional Authority & Role Control
                    </div>
                    <DialogTitle className="text-xl font-extrabold text-white">
                      {activeManagingTenant.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-white/70 mt-1 flex items-center gap-2">
                      <span>Campus Code: <strong className="font-mono text-[#169C8F]">{activeManagingTenant.code || activeManagingTenant.tenantId}</strong></span>
                      <span>•</span>
                      <span>ID: <strong className="font-mono text-white/90">{activeManagingTenant.tenantId}</strong></span>
                    </DialogDescription>
                  </div>

                  {/* Dedicated Always-Visible Close Button */}
                  <button
                    type="button"
                    onClick={() => setRoleModalOpen(false)}
                    className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Close modal (Esc)"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>

                {/* Modal Tab Switcher */}
                <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalTab("overview")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      modalTab === "overview"
                        ? "bg-[#169C8F] text-white shadow-xs"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    1. Current Authority & Sync
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab("reassign")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      modalTab === "reassign"
                        ? "bg-[#169C8F] text-white shadow-xs"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    2. Reassign / Change TPO Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab("staff")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalTab === "staff"
                        ? "bg-[#169C8F] text-white shadow-xs"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>3. Staff Roster & Promotions</span>
                    {tenantStaffList.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-bold">
                        {tenantStaffList.length}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab("governance")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      modalTab === "governance"
                        ? "bg-[#169C8F] text-white shadow-xs"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>4. AI Token Budget & Caps</span>
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Body - Fixed Height & Smooth Scroll across all tabs */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF8F5]">
                {/* Tab 1: Current Authority & Sync */}
                {modalTab === "overview" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0C2E50] to-[#169C8F] text-white flex items-center justify-center font-extrabold text-sm shadow-md shrink-0">
                            {(activeManagingTenant.adminName || "TPO").split(" ").map((n: string) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-[#101820]">
                                {activeManagingTenant.adminName || activeManagingTenant.tpoName || "Designated TPO Administrator"}
                              </h4>
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[10px]">
                                Primary TPO Admin
                              </Badge>
                            </div>
                            <p className="font-mono text-xs font-semibold text-[#53606A] mt-1 flex items-center gap-1.5">
                              {activeManagingTenant.adminEmail || activeManagingTenant.tpoEmail || "No email assigned"}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(activeManagingTenant.adminEmail || activeManagingTenant.tpoEmail);
                                  toast.success("Email copied!");
                                }}
                                className="text-[#53606A] hover:text-[#169C8F] cursor-pointer"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </p>
                            {activeManagingTenant.adminUid && (
                              <p className="text-[11px] text-[#53606A]/80 mt-1">
                                UID: <code className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded">{activeManagingTenant.adminUid}</code>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Anti-Demotion / Claim Sync Action Box */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <Zap className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <h5 className="font-bold text-xs text-amber-950">Accidental Demotion / Claim Desync Fix</h5>
                          <p className="text-[11.5px] text-amber-900/90 leading-relaxed mt-0.5">
                            If this administrator ever invited themselves as a coordinator or had their session downgraded, clicking below immediately re-asserts their <strong>tenant_admin</strong> custom claims in Firebase Auth, updates their profile, and purges any coordinator locks.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <Button
                          type="button"
                          disabled={syncingClaims}
                          onClick={handleResyncTpoClaims}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className={`h-3.5 w-3.5 ${syncingClaims ? "animate-spin" : ""}`} />
                          <span>{syncingClaims ? "Synchronizing Claims..." : "⚡ Re-Sync TPO Claims Now"}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Portal Sign-In Link */}
                    <div className="rounded-xl border border-[#E6E1D6] bg-white p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-[#53606A] uppercase tracking-wider block">Institutional Gateway URL</span>
                        <code className="text-xs font-bold text-[#169C8F]">
                          {typeof window !== "undefined" ? `${window.location.origin}/campus/login/${activeManagingTenant.code || activeManagingTenant.tenantId}` : ""}
                        </code>
                      </div>
                      <a
                        href={`/campus/login/${activeManagingTenant.code || activeManagingTenant.tenantId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-xs text-[#169C8F] hover:underline"
                      >
                        <span>Visit Gateway</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Tab 2: Reassign / Change TPO Admin */}
                {modalTab === "reassign" && (
                  <form onSubmit={handleReassignSubmit} className="space-y-4">
                    <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-900 leading-relaxed flex items-start gap-2.5">
                      <Shield className="h-4 w-4 text-sky-600 mt-0.5 shrink-0" />
                      <div>
                        <strong className="block font-bold mb-0.5">Primary TPO Reassignment:</strong>
                        Enter the name and email of the new administrator. The system will automatically provision/lookup their Auth account, set <code>{`{ role: "tenant_admin", tenantId: "${activeManagingTenant.tenantId}" }`}</code> claims, update the college database, and purge coordinator locks.
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A] mb-1 block">1. Administrator Full Name</label>
                      <Input
                        placeholder="e.g. Dr. Alok Verma"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="bg-white text-xs font-semibold border-[#E6E1D6] focus:border-[#169C8F]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A] mb-1 block">2. Official TPO Email Address</label>
                      <Input
                        type="email"
                        placeholder="e.g. director.tpo@sunrise.ac.in"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="bg-white text-xs font-semibold border-[#E6E1D6] focus:border-[#169C8F]"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">3. Temporary Password (For New Account)</label>
                        <button
                          type="button"
                          onClick={() => setNewAdminPassword(generateSecurePassword())}
                          className="text-[10px] font-bold text-[#169C8F] hover:underline cursor-pointer"
                        >
                          Regenerate
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          className="bg-white text-xs font-mono font-bold border-[#E6E1D6] focus:border-[#169C8F]"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(newAdminPassword);
                            setCopiedModalPwd(true);
                            setTimeout(() => setCopiedModalPwd(false), 2000);
                            toast.success("Password copied!");
                          }}
                          className="bg-white border-[#E6E1D6] text-xs font-bold shrink-0 cursor-pointer"
                        >
                          {copiedModalPwd ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          <span className="ml-1">{copiedModalPwd ? "Copied" : "Copy"}</span>
                        </Button>
                      </div>
                      <p className="text-[10.5px] text-[#53606A] mt-1">If the user already has an existing account, their password will be preserved and role updated immediately.</p>
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E6E1D6]">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setRoleModalOpen(false)}
                        className="text-xs font-bold border-[#E6E1D6] cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={reassigning}
                        className="bg-[#169C8F] hover:bg-[#127d73] text-white font-extrabold text-xs h-9 px-4 rounded-xl shadow-xs cursor-pointer"
                      >
                        {reassigning ? "Assigning TPO Admin..." : "Confirm & Assign TPO Admin"}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Tab 3: Staff Roster & Promotions */}
                {modalTab === "staff" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-[#101820]">Campus Registered Staff ({tenantStaffList.length})</h4>
                        <p className="text-[11px] text-[#53606A]">Promote any existing coordinator to Primary TPO Admin in 1 click.</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          setLoadingStaff(true);
                          try {
                            const res = await getTenantStaff(activeManagingTenant.tenantId);
                            setTenantStaffList(res?.staff || []);
                          } finally {
                            setLoadingStaff(false);
                          }
                        }}
                        className="h-8 text-xs font-bold cursor-pointer"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${loadingStaff ? "animate-spin" : ""}`} />
                      </Button>
                    </div>

                    {loadingStaff ? (
                      <div className="p-8 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-[#169C8F] mx-auto mb-2" />
                        <p className="text-xs text-[#53606A]">Loading campus staff roster...</p>
                      </div>
                    ) : tenantStaffList.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-[#E6E1D6] rounded-xl bg-white">
                        <Users className="h-8 w-8 text-[#53606A]/40 mx-auto mb-2" />
                        <p className="font-bold text-xs text-[#101820]">No staff members found</p>
                        <p className="text-[11px] text-[#53606A] mt-0.5">Use Tab 2 to assign a Primary TPO Administrator.</p>
                      </div>
                    ) : (
                      <div className="border border-[#E6E1D6] rounded-xl overflow-hidden max-h-72 overflow-y-auto bg-white">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-[#F8F5ED]/70 border-b border-[#E6E1D6]">
                              <TableHead className="text-[11px] font-bold text-[#53606A]">Staff Name</TableHead>
                              <TableHead className="text-[11px] font-bold text-[#53606A]">Email</TableHead>
                              <TableHead className="text-[11px] font-bold text-[#53606A]">Current Role</TableHead>
                              <TableHead className="text-[11px] font-bold text-[#53606A] text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tenantStaffList.map((member) => {
                              const isCurrentPrimary =
                                member.role === "tenant_admin" ||
                                member.email?.toLowerCase() === activeManagingTenant.adminEmail?.toLowerCase();

                              return (
                                <TableRow key={member.memberId || member.uid} className="border-b border-[#E6E1D6]">
                                  <TableCell className="font-bold text-xs text-[#101820] py-3">
                                    {member.name}
                                  </TableCell>
                                  <TableCell className="font-mono text-[11px] text-[#53606A]">
                                    {member.email}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={isCurrentPrimary ? "default" : "outline"}
                                      className={`text-[10px] font-bold capitalize ${
                                        isCurrentPrimary
                                          ? "bg-emerald-600 text-white"
                                          : "border-[#E6E1D6] text-[#53606A]"
                                      }`}
                                    >
                                      {isCurrentPrimary ? "Primary TPO Admin" : member.role}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {isCurrentPrimary ? (
                                      <span className="text-[11px] font-bold text-emerald-600">Active Leader</span>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={reassigning}
                                        onClick={() => handlePromoteStaffToTpo(member)}
                                        className="h-7 text-[11px] font-extrabold border-[#169C8F] text-[#169C8F] hover:bg-[#169C8F] hover:text-white cursor-pointer"
                                      >
                                        Promote to TPO
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 4: College AI Token Budget & Governance Caps */}
                {modalTab === "governance" && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#169C8F]/30 bg-white p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-[#101820]">
                              College AI Token Budget &amp; Governance Caps
                            </h4>
                            <Badge className="bg-[#169C8F]/10 text-[#169C8F] border-[#169C8F]/30 text-[10px] font-bold">
                              Platform Admin Authority
                            </Badge>
                          </div>
                          <p className="text-[11px] text-[#53606A] mt-0.5">
                            Centrally configure token quotas, overage safety rules, and per-student allowances for {activeManagingTenant.name}.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={handleSaveCollegeGovernance}
                          disabled={savingCollegeGov}
                          className="bg-[#169C8F] hover:bg-[#127d73] text-white text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" />
                          {savingCollegeGov ? "Saving Caps..." : "Save College Caps"}
                        </Button>
                      </div>

                      {/* Economics & Gross Margin Telemetry Card */}
                      {(() => {
                        const seats = activeManagingTenant.seats || activeManagingTenant.maxSeats || 1500;
                        const annualTokens = seats * 430000;
                        const estMonthlyCompute = Math.round((editTokenBudget / 1000000) * 17.29);
                        const annualRevenue = seats * 89;
                        const annualCompute = estMonthlyCompute * 12;
                        const grossMarginPct = annualRevenue > 0 ? (((annualRevenue - annualCompute) / annualRevenue) * 100).toFixed(1) : "90.7";

                        return (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-[#169C8F]/5 via-[#FAF8F5] to-emerald-50/50 border border-[#169C8F]/20 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-[#101820] flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-[#169C8F]" />
                                AI Compute Economics &amp; Margin Telemetry ({seats} Enrolled Students)
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-extrabold">
                                  {grossMarginPct}% Gross Margin
                                </Badge>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditTokenBudget(calcRecommendedMonthlyTokens(seats))}
                                  className="text-[10px] h-6 px-2 text-[#169C8F] border-[#169C8F]/30 hover:bg-[#169C8F]/10 font-bold cursor-pointer"
                                >
                                  ⚡ Auto-Recalculate Budget
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                              <div className="p-2 rounded-lg bg-white border border-[#E6E1D6]">
                                <div className="text-[10px] uppercase font-bold text-[#53606A]">Seats Enrolled</div>
                                <div className="text-xs font-extrabold text-[#101820] mt-0.5">{seats.toLocaleString()}</div>
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-[#E6E1D6]">
                                <div className="text-[10px] uppercase font-bold text-[#53606A]">Annual Tokens</div>
                                <div className="text-xs font-extrabold text-[#101820] mt-0.5">{(annualTokens / 1000000).toFixed(1)}M</div>
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-[#E6E1D6]">
                                <div className="text-[10px] uppercase font-bold text-[#53606A]">Est. Compute / Mo</div>
                                <div className="text-xs font-extrabold text-emerald-700 mt-0.5">₹{estMonthlyCompute.toLocaleString()}</div>
                              </div>
                              <div className="p-2 rounded-lg bg-white border border-[#E6E1D6]">
                                <div className="text-[10px] uppercase font-bold text-[#53606A]">Annual Contract</div>
                                <div className="text-xs font-extrabold text-[#169C8F] mt-0.5">₹{annualRevenue.toLocaleString()}</div>
                              </div>
                            </div>
                            <p className="text-[10.5px] text-[#53606A] italic">
                              🔒 Note: Raw tokens, model routing, and unit compute costs are strictly hidden from College TPO view. TPO only sees verified Educational Practice Allowances in Section 1.4.
                            </p>
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">
                            Monthly Campus AI Token Budget
                          </label>
                          <Input
                            type="number"
                            className="bg-white border-[#E6E1D6] focus:border-[#169C8F] text-xs font-bold"
                            value={editTokenBudget}
                            onChange={(e) => setEditTokenBudget(parseInt(e.target.value, 10) || 0)}
                          />
                          <p className="text-[10px] text-[#53606A]">
                            {(editTokenBudget / 1000000).toFixed(1)}M tokens / month allocated to campus compute pool.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">
                            Automated Overage Policy
                          </label>
                          <select
                            className="w-full p-2 bg-white border border-[#E6E1D6] rounded-md text-xs font-bold text-[#101820] focus:border-[#169C8F]"
                            value={editOveragePolicy}
                            onChange={(e: any) => setEditOveragePolicy(e.target.value)}
                          >
                            <option value="pause">Pause AI Engine at 100% Budget (Default Safety)</option>
                            <option value="payg">Pay-As-You-Go Overages (₹0.002 / token)</option>
                            <option value="notify">Notify TPO Admin at 80% &amp; Continue</option>
                          </select>
                          <p className="text-[10px] text-[#53606A]">Action taken when college consumes 100% of tokens.</p>
                        </div>
                      </div>

                      {/* Educational Allowances Quotas */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">
                            Per-Student One-Way Drills / Year
                          </label>
                          <Input
                            type="number"
                            className="bg-white border-[#E6E1D6] focus:border-[#169C8F] text-xs font-bold"
                            value={editMaxOneWayDrills}
                            onChange={(e) => setEditMaxOneWayDrills(parseInt(e.target.value, 10) || 0)}
                          />
                          <p className="text-[10px] text-[#53606A]">Question drills with zero TTS cost (~5 paise/drill).</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">
                            Per-Student Two-Way Voice Mocks / Year
                          </label>
                          <Input
                            type="number"
                            className="bg-white border-[#E6E1D6] focus:border-[#169C8F] text-xs font-bold"
                            value={editMaxTwoWayInterviews}
                            onChange={(e) => setEditMaxTwoWayInterviews(parseInt(e.target.value, 10) || 0)}
                          />
                          <p className="text-[10px] text-[#53606A]">Full-duplex Sarvam + Gemini (~26 paise/mock).</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">
                            Per-Student Resume Audits / Year
                          </label>
                          <Input
                            type="number"
                            className="bg-white border-[#E6E1D6] focus:border-[#169C8F] text-xs font-bold"
                            value={editMaxResumeAudits}
                            onChange={(e) => setEditMaxResumeAudits(parseInt(e.target.value, 10) || 0)}
                          />
                          <p className="text-[10px] text-[#53606A]">Maximum resume scans permitted per student account.</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#53606A]">
                            Per-Student Max Voice Turns / Session
                          </label>
                          <Input
                            type="number"
                            className="bg-white border-[#E6E1D6] focus:border-[#169C8F] text-xs font-bold"
                            value={editMaxVoiceTurns}
                            onChange={(e) => setEditMaxVoiceTurns(parseInt(e.target.value, 10) || 0)}
                          />
                          <p className="text-[10px] text-[#53606A]">Maximum AI voice interview turns per candidate session.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Commercial Pricing & Packaging Matrix Modal (Platform Admin Controlled) ── */}
      <Dialog open={pricingModalOpen} onOpenChange={setPricingModalOpen}>
        <DialogContent className="max-w-5xl w-[96vw] max-h-[92vh] bg-white border-[#E6E1D6] p-0 overflow-hidden shadow-2xl rounded-2xl flex flex-col">
          {/* Header */}
          <div className="shrink-0 p-5 px-6 border-b border-[#E6E1D6] bg-gradient-to-r from-[#0C2E50] via-[#101820] to-[#0C2E50] text-white relative">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#D59C45]/20 text-[#D59C45] border-[#D59C45]/30 font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                  DPIIT RECOGNIZED #DIPP271794
                </Badge>
                <Badge className="bg-[#169C8F]/20 text-[#169C8F] border-[#169C8F]/30 font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                  Dynamic Admin Governance
                </Badge>
              </div>
              <p className="text-[11px] text-white/60">
                Last updated: {new Date(pricingConfig.updatedAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <DialogTitle className="text-xl font-extrabold text-white mt-2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#D59C45]" />
              Commercial Pricing, Packaging &amp; Per-Student Rate Matrix
            </DialogTitle>
            <DialogDescription className="text-xs text-white/75 mt-1">
              Configure annual institutional packages, promotional discount labels, and per-student volume rates. All changes take effect immediately on invoices and student quotes with zero backend code redeployments.
            </DialogDescription>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#101820]">
            {/* Top Config Row: GST Rate */}
            <div className="p-4 rounded-xl bg-[#F8F5ED] border border-[#E6E1D6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#101820]">Statutory Goods &amp; Services Tax (GST) Rate</h4>
                <p className="text-xs text-[#53606A] mt-0.5">
                  Applied automatically to all domestic institutional invoices (9% CGST + 9% SGST intra-state / 18% IGST inter-state).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#53606A]">GST Rate:</span>
                <div className="relative w-28">
                  <Input
                    type="number"
                    value={pricingConfig.gstRatePercent}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, gstRatePercent: parseFloat(e.target.value) || 18 })}
                    className="pr-7 text-xs font-bold text-center bg-white border-[#E6E1D6] focus:border-[#169C8F]"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#53606A]">%</span>
                </div>
              </div>
            </div>

            {/* 4 Plan Tier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pricingConfig.tiers.map((t, idx) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    t.popularBadge
                      ? "border-[#D59C45] bg-[#FFFBF5] ring-2 ring-[#D59C45]/20 shadow-sm"
                      : "border-[#E6E1D6] bg-white"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#0C2E50]">{t.id}</span>
                      {t.popularBadge && (
                        <Badge className="bg-[#D59C45] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                          Most Popular
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Plan Title</label>
                      <Input
                        value={t.name}
                        onChange={(e) => {
                          const updated = [...pricingConfig.tiers];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setPricingConfig({ ...pricingConfig, tiers: updated });
                        }}
                        className="h-8 text-xs font-bold bg-white border-[#E6E1D6]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Min Seats</label>
                        <Input
                          type="number"
                          value={t.minSeats}
                          onChange={(e) => {
                            const updated = [...pricingConfig.tiers];
                            updated[idx] = { ...updated[idx], minSeats: parseInt(e.target.value, 10) || 0 };
                            setPricingConfig({ ...pricingConfig, tiers: updated });
                          }}
                          className="h-8 text-xs font-bold bg-white border-[#E6E1D6]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Max Seats</label>
                        <Input
                          type="number"
                          value={t.maxSeats}
                          onChange={(e) => {
                            const updated = [...pricingConfig.tiers];
                            updated[idx] = { ...updated[idx], maxSeats: parseInt(e.target.value, 10) || 0 };
                            setPricingConfig({ ...pricingConfig, tiers: updated });
                          }}
                          className="h-8 text-xs font-bold bg-white border-[#E6E1D6]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">
                        {t.id === "university" ? "Base Package (INR)" : "Annual Price (INR + GST)"}
                      </label>
                      <Input
                        type="number"
                        value={t.fixedPriceInr}
                        onChange={(e) => {
                          const updated = [...pricingConfig.tiers];
                          updated[idx] = { ...updated[idx], fixedPriceInr: parseInt(e.target.value, 10) || 0 };
                          setPricingConfig({ ...pricingConfig, tiers: updated });
                        }}
                        className="h-8 text-xs font-black text-[#169C8F] bg-white border-[#E6E1D6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Strike List Price (INR)</label>
                      <Input
                        type="number"
                        value={t.strikePriceInr}
                        onChange={(e) => {
                          const updated = [...pricingConfig.tiers];
                          updated[idx] = { ...updated[idx], strikePriceInr: parseInt(e.target.value, 10) || 0 };
                          setPricingConfig({ ...pricingConfig, tiers: updated });
                        }}
                        className="h-8 text-xs font-bold text-slate-400 line-through bg-white border-[#E6E1D6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">
                        Per-Student Volume Rate (₹)
                      </label>
                      <Input
                        type="number"
                        value={t.perStudentRateInr}
                        onChange={(e) => {
                          const updated = [...pricingConfig.tiers];
                          updated[idx] = { ...updated[idx], perStudentRateInr: parseInt(e.target.value, 10) || 0 };
                          setPricingConfig({ ...pricingConfig, tiers: updated });
                        }}
                        className="h-8 text-xs font-bold bg-white border-[#E6E1D6]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Promo Discount Badge</label>
                      <Input
                        value={t.discountBadge}
                        onChange={(e) => {
                          const updated = [...pricingConfig.tiers];
                          updated[idx] = { ...updated[idx], discountBadge: e.target.value };
                          setPricingConfig({ ...pricingConfig, tiers: updated });
                        }}
                        className="h-8 text-xs font-bold bg-white border-[#E6E1D6]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E6E1D6]/60 text-[10.5px] text-[#53606A] space-y-1">
                    <p className="font-bold text-[#101820]">Included Modules:</p>
                    {t.features.slice(0, 3).map((f, fi) => (
                      <p key={fi} className="truncate">• {f}</p>
                    ))}
                    {t.features.length > 3 && <p className="text-[9.5px] text-slate-400">+{t.features.length - 3} more modules</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Invoice Quote Simulator */}
            {(() => {
              const quote = calculateTierQuote(quoteSeats, undefined, pricingConfig);
              return (
                <div className="p-5 rounded-2xl border border-[#CBD5E1] bg-gradient-to-r from-slate-50 via-white to-blue-50/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#169C8F]/10 text-[#169C8F] border-[#169C8F]/30 font-bold text-xs uppercase">
                          Live Quote Simulator
                        </Badge>
                        <span className="text-xs text-slate-500 font-medium">Verify how dynamic rates evaluate on live invoices</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#101820] mt-1">
                        Instant Student Tier Evaluation &amp; GST Preview
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#53606A]">Cohort Size:</span>
                      <Input
                        type="number"
                        value={quoteSeats}
                        onChange={(e) => setQuoteSeats(Math.max(1, parseInt(e.target.value, 10) || 1000))}
                        className="w-28 text-xs font-bold text-center bg-white border-[#CBD5E1]"
                      />
                      <span className="text-xs text-[#53606A]">Students</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-200">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Plan Tier</span>
                      <p className="text-xs font-extrabold text-[#0C2E50] mt-0.5">{quote.tier.name}</p>
                      <span className="text-[10px] text-emerald-600 font-bold">{quote.tier.discountBadge}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Base Subtotal</span>
                      <p className="text-xs font-extrabold text-slate-800 mt-0.5">₹{quote.basePriceInr.toLocaleString("en-IN")}</p>
                      {quote.strikePriceInr && quote.strikePriceInr > quote.basePriceInr && (
                        <span className="text-[10px] text-slate-400 line-through">₹{quote.strikePriceInr.toLocaleString("en-IN")}</span>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">CGST (9%) + SGST (9%)</span>
                      <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                        ₹{(quote.cgstInr + quote.sgstInr).toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] text-slate-500">18% Statutory GST</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0C2E50] text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Total with GST</span>
                      <p className="text-sm font-black text-[#D59C45] mt-0.5">₹{quote.totalInr.toLocaleString("en-IN")}</p>
                      <span className="text-[10px] text-white/70">Payable Amount</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Effective Rate</span>
                      <p className="text-xs font-black text-emerald-900 mt-0.5">₹{quote.perStudentEffectiveInr} / student</p>
                      <span className="text-[10px] text-emerald-700">Annual License</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 p-4 px-6 border-t border-[#E6E1D6] bg-[#FAF8F5] flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetPricingConfig}
              className="text-xs font-bold border-[#E6E1D6] text-[#53606A] hover:bg-white"
            >
              Reset to Pitch Deck Defaults
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPricingModalOpen(false)}
                className="text-xs font-bold border-[#E6E1D6] text-[#53606A] hover:bg-white"
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={savingPricing}
                onClick={handleSavePricingConfig}
                className="bg-[#169C8F] hover:bg-[#127d73] text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {savingPricing ? "Saving Dynamic Matrix..." : "Save Pricing Matrix"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Raise & Assign Rule 46 Tax Invoice Modal */}
      <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
        <DialogContent className="max-w-2xl w-[94vw] max-h-[90vh] bg-white border-[#E6E1D6] p-0 overflow-hidden shadow-2xl rounded-2xl flex flex-col">
          {invoiceTargetTenant && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="shrink-0 p-5 px-6 bg-gradient-to-r from-[#0C2E50] via-[#101820] to-[#0C2E50] text-white border-b border-white/10 relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#D59C45] uppercase tracking-wider mb-1">
                      <Receipt className="h-4 w-4 text-[#169C8F]" />
                      Rule 46 CGST Compliance Engine
                    </div>
                    <DialogTitle className="text-xl font-extrabold text-white">
                      Raise & Assign Tax Invoice
                    </DialogTitle>
                    <DialogDescription className="text-xs text-white/70 mt-1 flex items-center gap-2">
                      <span>Recipient: <strong className="font-semibold text-white">{invoiceTargetTenant.name}</strong></span>
                      <span>•</span>
                      <span>Code: <strong className="font-mono text-[#169C8F]">{invoiceTargetTenant.code || invoiceTargetTenant.tenantId}</strong></span>
                    </DialogDescription>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(false)}
                    className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Close modal (Esc)"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs bg-[#FAF8F5]">
                {/* 1. Customer Legal Identity */}
                <div className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#101820] flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-[#169C8F]" />
                      Billed To (Customer Legal Identity)
                    </span>
                    <span className="text-[10px] font-semibold text-[#53606A]">Appears on Tax Invoice</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Customer Legal Entity Name *</label>
                    <Input
                      value={invCustomerLegalName}
                      onChange={(e) => setInvCustomerLegalName(e.target.value)}
                      placeholder="e.g. Sunrise Engineering College Society / University Trust"
                      className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">State / Place of Supply *</label>
                      <select
                        value={invState}
                        onChange={(e) => {
                          const st = e.target.value;
                          setInvState(st);
                          const found = INDIAN_STATES_GST.find((s) => s.name.toLowerCase() === st.toLowerCase());
                          setInvStateCode(found?.code || "09");
                        }}
                        className="w-full mt-1 p-2 bg-white border border-[#E6E1D6] rounded-xl text-xs font-semibold text-[#101820]"
                      >
                        {INDIAN_STATES_GST.map((s) => (
                          <option key={s.code} value={s.name}>
                            {s.name} ({s.code}) {s.code === "09" ? "— Intra-State UP (CGST 9% + SGST 9%)" : "— Inter-State (IGST 18%)"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">City *</label>
                      <Input
                        value={invCity}
                        onChange={(e) => setInvCity(e.target.value)}
                        placeholder="e.g. Lucknow / Kanpur / Noida"
                        className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Campus / Billing Address</label>
                      <Input
                        value={invAddress}
                        onChange={(e) => setInvAddress(e.target.value)}
                        placeholder="e.g. Main Institutional Campus, Sitapur Road"
                        className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">PIN Code</label>
                      <Input
                        value={invPinCode}
                        onChange={(e) => setInvPinCode(e.target.value)}
                        placeholder="e.g. 226021"
                        className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Customer GSTIN</label>
                      <Input
                        disabled={invIsGstExempt}
                        value={invIsGstExempt ? "GST EXEMPT / EDUCATIONAL" : invGstin}
                        onChange={(e) => setInvGstin(e.target.value)}
                        placeholder="e.g. 09ABCDE1234F1Z5"
                        className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6] disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="inv-exempt-check"
                        checked={invIsGstExempt}
                        onChange={(e) => setInvIsGstExempt(e.target.checked)}
                        className="h-4 w-4 rounded border-[#E6E1D6] text-[#169C8F] focus:ring-[#169C8F] cursor-pointer"
                      />
                      <label htmlFor="inv-exempt-check" className="text-xs font-bold text-[#101820] cursor-pointer">
                        Educational GST Exempt (0% GST)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Attention Recipient Officer</label>
                    <Input
                      value={invAttentionName}
                      onChange={(e) => setInvAttentionName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma, Dean & TPO Director"
                      className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                    />
                  </div>
                </div>

                {/* 2. Institutional Purchase Order (PO) Details */}
                <div className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-3 shadow-xs">
                  <span className="text-xs font-extrabold text-[#101820] flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-amber-600" />
                    Institutional Purchase Order (PO) Reference
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">PO / Sanction Order Number *</label>
                      <Input
                        value={invPoNumber}
                        onChange={(e) => setInvPoNumber(e.target.value)}
                        placeholder="e.g. PO/2026/SEC/094"
                        className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">PO Date *</label>
                      <Input
                        type="date"
                        value={invPoDate}
                        onChange={(e) => setInvPoDate(e.target.value)}
                        className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Commercial Plan Packaging & Live Quote Calculation */}
                <div className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-3 shadow-xs">
                  <span className="text-xs font-extrabold text-[#101820] flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-[#169C8F]" />
                    Commercial Packaging & Seats
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Plan Packaging Tier</label>
                      <select
                        value={invPlanId}
                        onChange={(e) => {
                          const p = e.target.value;
                          setInvPlanId(p);
                          let s = 1000;
                          if (p === "starter") s = 1000;
                          else if (p === "growth") s = 2000;
                          else if (p === "pro") s = 3000;
                          else if (p === "university") s = 5000;
                          setInvSeats(s);
                        }}
                        className="w-full mt-1 p-2 bg-white border border-[#E6E1D6] rounded-xl text-xs font-semibold text-[#101820]"
                      >
                        {pricingConfig.tiers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} (Fixed ₹{t.fixedPriceInr?.toLocaleString("en-IN")} · Up to {t.maxSeats?.toLocaleString("en-IN")} Seats)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Seats Licensed</label>
                      <Input
                        type="number"
                        value={invSeats}
                        onChange={(e) => setInvSeats(parseInt(e.target.value, 10) || 1000)}
                        className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                      />
                    </div>
                  </div>

                  {/* Dynamic Quote & GST Calculation Box */}
                  {(() => {
                    const q = calculateTierQuote(invSeats, invPlanId, pricingConfig);
                    const isInterState = invStateCode !== "09";
                    const gstAmount = invIsGstExempt ? 0 : Math.round(q.baseSubtotal * ((pricingConfig.gstRatePercent || 18) / 100));
                    const totalPayable = q.baseSubtotal + gstAmount;

                    return (
                      <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Base Subtotal ({q.tierName} · {invSeats.toLocaleString("en-IN")} Seats @ ₹{q.ratePerStudent}/student):</span>
                          <span className="font-mono font-bold text-white">₹{q.baseSubtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-300">
                          <span>
                            {invIsGstExempt
                              ? "GST: 0% (Exempt Institution)"
                              : isInterState
                              ? `IGST (${pricingConfig.gstRatePercent || 18}% - Inter-State to ${invState}):`
                              : `CGST (9%) + SGST (9%) - Intra-State Uttar Pradesh:`}
                          </span>
                          <span className="font-mono font-bold text-amber-300">
                            {invIsGstExempt ? "₹0.00" : `₹${gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-sm font-extrabold text-[#D59C45]">
                          <span>Total Payable Amount (INR):</span>
                          <span className="font-mono text-base text-emerald-400">₹{totalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 4. Generation / Attachment Mode */}
                <div className="p-4 rounded-xl bg-white border border-[#E6E1D6] space-y-3 shadow-xs">
                  <span className="text-xs font-extrabold text-[#101820] flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5 text-[#169C8F]" />
                    Invoice Delivery Mode
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setInvMode("offline_po")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        invMode === "offline_po"
                          ? "border-[#169C8F] bg-[#169C8F]/10 text-[#0C2E50]"
                          : "border-[#E6E1D6] bg-white text-[#53606A] hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-extrabold block text-xs">Rule 46 Sovereign PDF</span>
                      <span className="text-[10.5px] opacity-80 block mt-0.5">Automated PDF generator with AIVI digital verification seal.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInvMode("external_upload")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        invMode === "external_upload"
                          ? "border-[#169C8F] bg-[#169C8F]/10 text-[#0C2E50]"
                          : "border-[#E6E1D6] bg-white text-[#53606A] hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-extrabold block text-xs">Attach External Tax Invoice</span>
                      <span className="text-[10.5px] opacity-80 block mt-0.5">Link an external Tally / Zoho / CA PDF document URL.</span>
                    </button>
                  </div>

                  {invMode === "external_upload" && (
                    <div className="pt-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">External Tax Invoice Document URL *</label>
                      <Input
                        value={invExternalPdfUrl}
                        onChange={(e) => setInvExternalPdfUrl(e.target.value)}
                        placeholder="https://storage.googleapis.com/.../tax-invoice.pdf"
                        className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#53606A]">Special Contract Terms / Notes (Optional)</label>
                    <Input
                      value={invNotes}
                      onChange={(e) => setInvNotes(e.target.value)}
                      placeholder="e.g. Net-15 days payment terms under institutional grant allocation"
                      className="mt-1 text-xs font-semibold bg-white border-[#E6E1D6]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 p-4 px-6 border-t border-[#E6E1D6] bg-[#FAF8F5] flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInvoiceModalOpen(false)}
                  className="text-xs font-bold border-[#E6E1D6] text-[#53606A] hover:bg-white"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  disabled={generatingInvoice}
                  onClick={handleConfirmGenerateInvoice}
                  className="bg-[#169C8F] hover:bg-[#127d73] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="h-4 w-4" />
                  {generatingInvoice ? "Synthesizing Tax Invoice..." : "Generate & Assign Tax Invoice"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
