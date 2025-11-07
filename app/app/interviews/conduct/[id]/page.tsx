// "use client";
import Interview from "@/components/interview/Interview";
import { getAuthHeader } from "@/helper/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getInterview(id: string) {
  try {
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);
    const response = await fetch(
      `${process.env?.API_URL}/api/interviews/${id}`,
      {
        ...authHeader,
        cache: "no-store", // Important: Prevent stale data
      }
    );
    if (!response.ok) {
      throw new Error("Something wrong occurred while fetching data");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Error fetching interviews");
  }
}

async function InterviewConductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getInterview(id);

  // More robust status checking
  const interview = data?.interview;

  if (!interview) {
    throw new Error("Interview not found");
  }

  // Check if interview is truly completed (all questions answered AND time is 0)
  const isActuallyCompleted =
    interview.status === "completed" && interview.durationLeft === 0;

  // Check if interview has expired but not marked as completed
  const hasTimeExpired = interview.durationLeft <= 0;

  if (isActuallyCompleted) {
    // Redirect to results page instead of throwing error
    redirect(`/app/interviews/${id}/results`);
  }

  if (hasTimeExpired && interview.status !== "completed") {
    // Interview time expired but not completed - allow viewing with 0 time
    // The Interview component will handle the auto-exit
    console.warn("Interview time expired, allowing final view");
  }

  return <Interview interview={interview} />;
}

export default InterviewConductPage;
