import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const authContext = useAuth();
  const { user, loading } = authContext;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isCampus = typeof window !== "undefined" && (
    import.meta.env.VITE_APP_PRODUCT === "CAMPUS_OS" ||
    window.location.hostname === "aivicampus.com" ||
    window.location.hostname === "www.aivicampus.com" ||
    window.location.hostname === "staging.aivicampus.com" ||
    window.location.hostname === "isolation-staging.aivicampus.com" ||
    window.location.hostname.endsWith(".aivicampus.com") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );

  const userEmail = user?.email?.toLowerCase();
  const isAdmin =
    authContext.isAdmin ||
    userEmail === "abhi.triloki@gmail.com" ||
    userEmail === "abhitriloki@gmail.com" ||
    userEmail === "staging.admin@aivicampus.com" ||
    userEmail === "qa.admin@aivicampus.com";

  if (!user) return <Navigate to={isCampus ? "/campus/login" : "/auth"} replace />;
  if (!user.emailVerified && userEmail !== "staging.admin@aivicampus.com" && userEmail !== "qa.admin@aivicampus.com") {
    return <Navigate to="/verify-email" replace />;
  }
  if (!isAdmin) return <Navigate to={isCampus ? "/campus" : "/dashboard"} replace />;

  return <>{children}</>;
};

export default AdminRoute;
