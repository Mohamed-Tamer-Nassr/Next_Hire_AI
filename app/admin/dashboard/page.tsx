import Dashboard from "@/components/admin/dashboard/Dashboard";
import { getAuthHeader } from "@/helper/auth";
import { cookies } from "next/headers";

async function getDashboardStats(
  searchParams: Record<string, string | string[] | undefined>
) {
  try {
    const urlParams = new URLSearchParams();

    // ✅ FIXED: Properly handle searchParams object
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        urlParams.append(key, Array.isArray(value) ? value[0] : value);
      }
    });

    const queryStr = urlParams.toString();

    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const response = await fetch(
      `${process.env?.API_URL}/api/admin/stats?${queryStr}`,
      authHeader
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching the data");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message);
  }
}

const AdminDashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // ✅ FIXED
}) => {
  const searchParamsValue = await searchParams;
  const data = await getDashboardStats(searchParamsValue);

  return <Dashboard data={data?.data} />;
};

export default AdminDashboardPage;
