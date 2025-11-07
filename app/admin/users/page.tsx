import ListUsers from "@/components/admin/users/ListUsers";
import { getAuthHeader } from "@/helper/auth";
import { cookies } from "next/headers";

async function getUsers(
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

    const queryString = urlParams.toString();
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const url = `${process.env?.API_URL}/api/admin/users?${queryString}`;

    const response = await fetch(url, authHeader);

    if (!response.ok) {
      throw new Error("Something wrong occurred while fetching data");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error?.message || "Error fetching users");
  }
}

async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // ✅ FIXED
}) {
  const searchParamsObj = await searchParams;
  const data = await getUsers(searchParamsObj);
  return <ListUsers data={data} />;
}

export default UsersPage;
