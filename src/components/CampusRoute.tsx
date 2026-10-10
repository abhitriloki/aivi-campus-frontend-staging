import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { RBACMatrix } from "@/config/rbac";
import { toast } from "sonner";
import { useEffect } from "react";

const CampusRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, tenant } = useAuth();
  const location = useLocation();

  const normalizedRole = RBACMatrix.normalizeRole(tenant.role);
  const isAllowed = RBACMatrix.isRouteAllowed(normalizedRole, location.pathname);

  useEffect(() => {
    if (!loading && user && !isAllowed) {
      toast.info(`Student Access Notice: Administrative route '${location.pathname}' is restricted to Placement Staff.`);
    }
  }, [loading, user, isAllowed, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default CampusRoute;
