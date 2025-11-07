"use client";

import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// ✅ NEW: Error Boundary component for better error handling
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to your error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-8 m-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Icon
              icon="solar:danger-circle-broken"
              className="text-danger"
              width={64}
            />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Something Went Wrong
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try refreshing the page."}
            </p>
            <div className="flex gap-3">
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
              >
                Refresh Page
              </Button>
              <Button
                variant="bordered"
                onClick={() => {
                  this.setState({ hasError: false });
                }}
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 w-full">
                <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
