"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

interface InterviewErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function InterviewError({ error, reset }: InterviewErrorProps) {
  const router = useRouter();

  const errorMessage = error.message || "An unexpected error occurred";
  const isCompletedError = errorMessage.toLowerCase().includes("completed");
  const isTimeExpiredError =
    errorMessage.toLowerCase().includes("time") ||
    errorMessage.toLowerCase().includes("expired");

  const handleBackToInterviews = () => {
    router.push("/app/interviews");
  };

  const handleRetry = () => {
    // Clear any corrupted session data
    const urlParams = new URLSearchParams(window.location.search);
    const interviewId = window.location.pathname.split("/").pop();

    if (interviewId) {
      // Clear localStorage for this interview
      localStorage.removeItem(`interview_${interviewId}_session`);
      localStorage.removeItem(`interview_${interviewId}_answers`);
    }

    // Try to reset the error boundary
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 md:p-12 shadow-2xl">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-500/10 p-4">
              <Icon
                icon={
                  isCompletedError
                    ? "solar:check-circle-bold"
                    : "solar:danger-triangle-bold"
                }
                className={
                  isCompletedError ? "text-yellow-500" : "text-red-500"
                }
                width={64}
              />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            {isCompletedError ? "Interview Completed" : "OOPS!"}
          </h1>

          {/* Error Message */}
          <p className="text-lg text-center text-gray-300 mb-6">
            {isCompletedError
              ? "This interview has already been completed. You cannot conduct it again."
              : isTimeExpiredError
              ? "The interview time has expired. Your progress has been saved."
              : errorMessage}
          </p>

          {/* Additional Info */}
          <div className="bg-gray-900/50 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Icon
                icon="solar:info-circle-linear"
                className="text-blue-400 flex-shrink-0 mt-1"
                width={20}
              />
              <div className="text-sm text-gray-400">
                {isCompletedError ? (
                  <>
                    <p className="mb-2">
                      This interview was marked as completed. If you believe
                      this is an error:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Check if you already submitted this interview</li>
                      <li>
                        Contact support if you need to retake the interview
                      </li>
                      <li>View your results in the Interviews section</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="mb-2">What you can do:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Try again to reload the interview</li>
                      <li>Go back to your interviews dashboard</li>
                      <li>Contact support if the issue persists</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isCompletedError && (
              <Button
                size="lg"
                color="primary"
                variant="solid"
                className="font-semibold"
                startContent={<Icon icon="solar:restart-bold" width={20} />}
                onPress={handleRetry}
              >
                Try Again
              </Button>
            )}

            <Button
              size="lg"
              color={isCompletedError ? "primary" : "default"}
              variant={isCompletedError ? "solid" : "bordered"}
              className="font-semibold"
              startContent={<Icon icon="solar:home-2-linear" width={20} />}
              onPress={handleBackToInterviews}
            >
              Back to Interviews
            </Button>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-8">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                Debug Information
              </summary>
              <pre className="mt-2 text-xs bg-gray-900 rounded p-3 overflow-auto text-red-400">
                {error.stack || error.message}
              </pre>
            </details>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          NextHire AI — Smart Interviews, Smarter You 🚀
        </div>
      </div>
    </div>
  );
}
