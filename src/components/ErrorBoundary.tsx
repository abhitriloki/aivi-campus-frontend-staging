import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[AIVI ErrorBoundary caught error]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign("/campus");
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#E7ECEF] p-8 shadow-[0_24px_48px_-12px_rgba(17,32,49,0.12)] text-center">
            <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h2 className="font-display text-xl font-extrabold text-[#112031] tracking-tight">
              Something went wrong
            </h2>
            <p className="text-xs text-[#53606A] mt-2 leading-relaxed">
              We encountered an unexpected display issue while loading this section. Your account and saved data are completely safe.
            </p>

            {this.state.error && (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-left overflow-auto max-h-32 text-[11px] font-mono text-slate-700">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Button
                onClick={this.handleReset}
                className="w-full sm:w-auto bg-[#169C8F] hover:bg-[#13857A] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto border-[#E7ECEF] hover:bg-[#F8FAFC] text-[#112031] font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer"
              >
                <Home className="h-3.5 w-3.5 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
