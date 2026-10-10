import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantBrandingProvider } from "@/contexts/TenantBrandingContext";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import TenantRoute from "@/components/TenantRoute";
import CookieConsent from "@/components/CookieConsent";
import ErrorBoundary from "@/components/ErrorBoundary";

// Load Landing Page Eagerly
import Landing from "./pages/Landing";

// Lazy Load Heavy Components
const Auth = lazy(() => import("./pages/Auth"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const About = lazy(() => import("./pages/AboutConceptB"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const WhatIsAivi = lazy(() => import("./pages/WhatIsAiviConceptB"));
const AIResumeBuilderPage = lazy(() => import("./pages/AIResumeBuilderPageConceptB"));
const LinkedInOptimizationPage = lazy(() => import("./pages/LinkedInOptimizationPageConceptB"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const DataRightsPage = lazy(() => import("./pages/DataRightsPage"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const ResumeIntelligence = lazy(() => import("./pages/ResumeIntelligence"));
const JobFitAnalysis = lazy(() => import("./pages/JobFitAnalysis"));
const SkillRoadmap = lazy(() => import("./pages/SkillRoadmap"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));
const PromotionReadiness = lazy(() => import("./pages/PromotionReadiness"));
const PortfolioAnalyzer = lazy(() => import("./pages/PortfolioAnalyzer"));
const LinkedInAnalyzer = lazy(() => import("./pages/LinkedInAnalyzer"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const StudentDrivesPage = lazy(() => import("./pages/campus/StudentDrivesPage"));
const StudentProfilePage = lazy(() => import("./pages/campus/StudentProfilePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LinkedInCallback = lazy(() => import("./pages/LinkedInCallback"));
const AuthAction = lazy(() => import("./pages/AuthAction"));

// SEO CU & Product Pages
const AIResumeBuilderFreshers = lazy(() => import("./pages/AIResumeBuilderFreshersConceptB"));
const ResumeScoringSoftware = lazy(() => import("./pages/ResumeScoringSoftwareConceptB"));
const JobFitAnalysisTool = lazy(() => import("./pages/JobFitAnalysisToolConceptB"));
const CareerGapAnalysisAI = lazy(() => import("./pages/CareerGapAnalysisAIConceptB"));
const AIVsChatGPTVsGemini = lazy(() => import("./pages/AIVsChatGPTVsGeminiConceptB"));
const InterviewIntelligencePublic = lazy(() => import("./pages/InterviewIntelligenceConceptB"));
const PromotionReadinessPublic = lazy(() => import("./pages/PromotionReadinessConceptB"));
const PortfolioAnalyzerPublic = lazy(() => import("./pages/PortfolioAnalyzerConceptB"));

// Campus Multi-Tenant Pages
const CampusLayout = lazy(() => import("./layouts/CampusLayout"));
const CampusDashboard = lazy(() => import("./pages/campus/CampusDashboard"));
const StudentsDirectory = lazy(() => import("./pages/campus/StudentsDirectory"));
const StudentImportWizard = lazy(() => import("./pages/campus/StudentImportWizard"));
const ImportHistory = lazy(() => import("./pages/campus/ImportHistory"));
const BrandedLogin = lazy(() => import("./pages/campus/BrandedLogin"));
const StaffManagement = lazy(() => import("./pages/campus/StaffManagement"));

const PlacementDrives = lazy(() => import("./pages/campus/PlacementDrives"));
const ResumeVault = lazy(() => import("./pages/campus/ResumeVault"));
const StudentVaultPage = lazy(() => import("./pages/StudentVaultPage"));
const CampusInterviews = lazy(() => import("./pages/campus/CampusInterviews"));
const AccreditationReports = lazy(() => import("./pages/campus/AccreditationReports"));
const CampusBilling = lazy(() => import("./pages/campus/CampusBilling"));
const PlatformAdminConsole = lazy(() => import("./pages/campus/PlatformAdminConsole"));
const GroupOverview = lazy(() => import("./pages/campus/GroupOverview"));
const CampusCalendar = lazy(() => import("./pages/campus/CampusCalendar"));
const AuditLogsPage = lazy(() => import("./pages/campus/AuditLogsPage"));
const DpaPage = lazy(() => import("./pages/DpaPage"));
const ForCollegesPage = lazy(() => import("./pages/ForCollegesPage"));
const VerifyPublicQrToken = lazy(() => import("./pages/VerifyPublicQrToken"));

const {
  PlacementSprints,
  TenantSettingsPage,
} = {
  PlacementSprints: lazy(() => import("./pages/campus/CampusPlaceholders").then((m) => ({ default: m.PlacementSprints }))),
  TenantSettingsPage: lazy(() => import("./pages/campus/TenantSettingsPage")),
};

// Basic loader to prevent layout shifts
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

import { isCampusDomain } from "@/utils/domainHelper";

const RootDomainRouter = () => {
  const isCampus = isCampusDomain(window.location.hostname);
  return isCampus ? <ForCollegesPage /> : <Landing />;
};

const ForCollegesRedirect = () => {
  useEffect(() => {
    window.location.replace("https://aivicampus.com");
  }, []);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-[#20CFC0]/30 selection:text-[#101820]">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <TenantBrandingProvider>
                <ScrollToTop />
                <CookieConsent />
                <Suspense fallback={<PageLoader />}>
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<RootDomainRouter />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/__/auth/action" element={<AuthAction />} />
                    <Route path="/auth/action" element={<AuthAction />} />
                    <Route path="/_/auth/action" element={<AuthAction />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/what-is-aivi" element={<WhatIsAivi />} />
                    <Route path="/ai-resume-builder" element={<AIResumeBuilderPage />} />
                    <Route path="/linkedin-optimization" element={<LinkedInOptimizationPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/data-rights" element={<DataRightsPage />} />
                    <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />

                    <Route path="/for-colleges" element={<ForCollegesPage />} />
                    <Route path="/features/voice-interviews" element={<ForCollegesPage />} />

                    {/* Branded Institutional Login & Student Self-Registration */}
                    <Route path="/campus/login" element={<BrandedLogin />} />
                    <Route path="/campus/login/:tenantCode" element={<BrandedLogin />} />
                    <Route path="/campus/register" element={<BrandedLogin defaultMode="register" />} />
                    <Route path="/campus/register/:tenantCode" element={<BrandedLogin defaultMode="register" />} />

                    {/* Public QR Credential Verification */}
                    <Route path="/verifyPublicQrToken" element={<VerifyPublicQrToken />} />
                    <Route path="/verify/:token" element={<VerifyPublicQrToken />} />

                    {/* Product Marketing Pages */}
                    <Route path="/interview-intelligence" element={<InterviewIntelligencePublic />} />
                    <Route path="/promotion-readiness-ai" element={<PromotionReadinessPublic />} />
                    <Route path="/portfolio-analyzer-ai" element={<PortfolioAnalyzerPublic />} />

                    {/* CU SEO Pages */}
                    <Route path="/ai-resume-builder-for-freshers" element={<AIResumeBuilderFreshers />} />
                    <Route path="/resume-scoring-software" element={<ResumeScoringSoftware />} />
                    <Route path="/job-fit-analysis-tool" element={<JobFitAnalysisTool />} />
                    <Route path="/career-gap-analysis-ai" element={<CareerGapAnalysisAI />} />
                    <Route path="/ai-vs-chatgpt-vs-gemini" element={<AIVsChatGPTVsGemini />} />

                    <Route path="/interview-prep" element={<Navigate to="/dashboard/interview" replace />} />
                    <Route path="/interview" element={<Navigate to="/dashboard/interview" replace />} />
                    <Route path="/report/:sessionId" element={<ProtectedRoute><DashboardLayout><InterviewPrep /></DashboardLayout></ProtectedRoute>} />

                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<DashboardHome />} />
                      <Route path="resume" element={<ResumeIntelligence />} />
                      <Route path="job-fit" element={<JobFitAnalysis />} />
                      <Route path="roadmap" element={<SkillRoadmap />} />
                      <Route path="interview" element={<InterviewPrep />} />
                      <Route path="promotion" element={<PromotionReadiness />} />
                      <Route path="portfolio" element={<PortfolioAnalyzer />} />
                      <Route path="linkedin" element={<LinkedInAnalyzer />} />
                      <Route path="drives" element={<StudentDrivesPage />} />
                      <Route path="vault" element={<StudentVaultPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="admin" element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } />
                      <Route path="builder" element={<ResumeBuilder />} />
                    </Route>

                    {/* Campus Multi-Tenant Application Area */}
                    {/* Campus Multi-Tenant Application Area */}
                    <Route path="/tpo" element={
                      <TenantRoute>
                        <CampusLayout />
                      </TenantRoute>
                    }>
                      <Route index element={<CampusDashboard />} />
                      <Route path="students" element={<StudentsDirectory />} />
                      <Route path="students/import" element={<StudentImportWizard />} />
                      <Route path="import" element={<StudentImportWizard />} />
                      <Route path="history" element={<ImportHistory />} />
                      <Route path="drives" element={<PlacementDrives />} />
                      <Route path="sprints" element={<PlacementSprints />} />
                      <Route path="vault" element={<ResumeVault />} />
                      <Route path="interviews" element={<CampusInterviews />} />
                      <Route path="accreditation" element={<AccreditationReports />} />
                      <Route path="billing" element={<CampusBilling />} />
                      <Route path="calendar" element={<CampusCalendar />} />
                      <Route path="audit-logs" element={<AuditLogsPage />} />
                      <Route path="staff" element={<StaffManagement />} />
                      <Route path="settings" element={<TenantSettingsPage />} />
                      <Route path="group-overview" element={<GroupOverview />} />
                    </Route>

                    <Route path="/campus" element={
                      <TenantRoute>
                        <CampusLayout />
                      </TenantRoute>
                    }>
                      <Route index element={<CampusDashboard />} />
                      <Route path="students" element={<StudentsDirectory />} />
                      <Route path="students/import" element={<StudentImportWizard />} />
                      <Route path="import" element={<StudentImportWizard />} />
                      <Route path="history" element={<ImportHistory />} />
                      <Route path="drives" element={<PlacementDrives />} />
                      <Route path="sprints" element={<PlacementSprints />} />
                      <Route path="vault" element={<ResumeVault />} />
                      <Route path="interviews" element={<CampusInterviews />} />
                      <Route path="accreditation" element={<AccreditationReports />} />
                      <Route path="billing" element={<CampusBilling />} />
                      <Route path="calendar" element={<CampusCalendar />} />
                      <Route path="audit-logs" element={<AuditLogsPage />} />
                      <Route path="staff" element={<StaffManagement />} />
                      <Route path="settings" element={<TenantSettingsPage />} />
                      <Route path="group-overview" element={<GroupOverview />} />
                      {/* Student Workspace Routes */}
                      <Route path="student-drives" element={<StudentDrivesPage />} />
                      <Route path="profile" element={<StudentProfilePage />} />
                      <Route path="student-profile" element={<StudentProfilePage />} />
                      <Route path="student-vault" element={<StudentVaultPage />} />
                      <Route path="resume-intelligence" element={<ResumeIntelligence />} />
                      <Route path="resume-studio" element={<ResumeBuilder />} />
                      <Route path="job-fit" element={<JobFitAnalysis />} />
                      <Route path="linkedin-analyzer" element={<LinkedInAnalyzer />} />
                      <Route path="skill-roadmap" element={<SkillRoadmap />} />
                      <Route path="promotion-readiness" element={<PromotionReadiness />} />
                      <Route path="portfolio-analyzer" element={<PortfolioAnalyzer />} />
                    </Route>

                    <Route path="/campus/platform-admin" element={
                      <AdminRoute>
                        <PlatformAdminConsole />
                      </AdminRoute>
                    } />
                    <Route path="/campus-admin" element={
                      <AdminRoute>
                        <PlatformAdminConsole />
                      </AdminRoute>
                    } />
                    <Route path="/platform-admin" element={
                      <AdminRoute>
                        <PlatformAdminConsole />
                      </AdminRoute>
                    } />

                    <Route path="/dpa" element={<DpaPage />} />
                    <Route path="/for-colleges" element={<ForCollegesPage />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </Suspense>
              </TenantBrandingProvider>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
