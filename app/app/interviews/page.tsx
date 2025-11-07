import ListInterviews from "@/components/interview/listInterviews";
import { getAuthHeader } from "@/helper/auth";
import { cookies } from "next/headers";

// ✅ FIXED: Accept searchParams as an object, not a string
async function getInterviews(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  try {
    const urlParams = new URLSearchParams();

    // Convert searchParams object to URLSearchParams
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => urlParams.append(key, v));
        } else {
          urlParams.append(key, value);
        }
      }
    });

    const queryString = urlParams.toString();
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    // Add the query string to the URL
    const url = queryString
      ? `${process.env?.API_URL}/api/interviews?${queryString}`
      : `${process.env?.API_URL}/api/interviews`;

    const response = await fetch(url, authHeader);

    if (!response.ok) {
      throw new Error("Something wrong occurred while fetching data");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Error fetching interviews");
  }
}

// ✅ FIXED: searchParams is a Promise in Next.js 15
async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsObj = await searchParams;
  const data = await getInterviews(searchParamsObj);
  return <ListInterviews data={data} />;
}

export default InterviewsPage;
