"use client";

import InterviewError from "@/components/interview/InterviewError";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <InterviewError error={error} reset={reset} />;
}
