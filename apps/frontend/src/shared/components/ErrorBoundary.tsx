"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
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
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-navy-950 p-4">
          <div className="max-w-md w-full bg-navy-900 border border-navy-700 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-heading">Оh không, đã có lỗi xảy ra!</h2>
            <p className="text-slate-400 mb-6 text-sm">
              Chúng tôi rất xin lỗi vì sự cố này. Hệ thống đã tự động ghi nhận lỗi để đội ngũ kỹ thuật xử lý.
            </p>
            <div className="bg-navy-950/50 rounded-lg p-4 mb-6 border border-red-500/10 text-left overflow-hidden">
              <p className="text-xs font-mono text-red-300 truncate">
                {this.state.error?.message || "An unexpected error occurred."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-glow-indigo transition-all font-medium text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Thử lại
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-lg transition-all font-medium text-sm"
              >
                <Home className="w-4 h-4" />
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
