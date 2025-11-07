"use client";

import { ReactNode } from "react";
// import ErrorBoundary from "../ErrorBoundary";
import ErrorBoundary from "../ErrorBoundary";
interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Wrapper component for dashboard pages
 * Provides error boundary and consistent layout
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-6 max-w-7xl">{children}</div>
    </ErrorBoundary>
  );
}
