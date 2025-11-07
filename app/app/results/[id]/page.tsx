// "use client";
import Interview from "@/components/interview/Interview";
import ResultDetails from "@/components/result/ResultDetails";
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

async function ResultDetailsPage({
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

  return <ResultDetails interview={interview} />;
}

export default ResultDetailsPage;
