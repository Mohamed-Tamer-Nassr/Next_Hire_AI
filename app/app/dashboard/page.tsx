import Dashboard from "@/components/dashboard/Dashboard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getAuthHeader } from "@/helper/auth";
import { cookies } from "next/headers";

type SearchParams = {
  start?: string;
  end?: string;
  [key: string]: string | string[] | undefined;
};

async function getDashboardStats(searchParams: SearchParams = {}) {
  try {
    const urlParams = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && typeof value === "string") {
        urlParams.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => urlParams.append(key, v));
      }
    });

    const queryString = urlParams.toString();
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const url = queryString
      ? `${process.env?.API_URL}/api/dashboard/stats?${queryString}`
      : `${process.env?.API_URL}/api/dashboard/stats`;

    const response = await fetch(url, {
      ...authHeader,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.error?.message ||
          "Something wrong occurred while fetching data"
      );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("[getDashboardStats] Error:", error.message);
    return null;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ✅ In Next.js 15+, searchParams is async — must await
  const resolvedSearchParams = await searchParams;

  const data = await getDashboardStats(resolvedSearchParams);

  return (
    <DashboardLayout>
      <Dashboard data={data?.data ?? null} />
    </DashboardLayout>
  );
}
