// import ListInvoices from "@/components/invoice/ListInvoices";
import ListInvoices from "@/components/invoice/ListInvoices";
import { getAuthHeader } from "@/helper/auth";
import { cookies } from "next/headers";

async function getInvoices() {
  try {
    const nextCookies = await cookies();
    const authHeader = getAuthHeader(nextCookies);

    const url = `${process.env.API_URL}/api/invoices`;

    const response = await fetch(url, {
      ...authHeader,
      cache: "no-store", // ✅ Don't cache invoice data
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || "Failed to fetch invoices");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    throw new Error(error?.message || "Error fetching invoices");
  }
}

async function InvoicesPage() {
  try {
    const data = await getInvoices();

    return (
      <div className="container mx-auto px-4 py-4 ">
        <ListInvoices invoices={data?.invoices || []} />
      </div>
    );
  } catch (error: any) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-semibold text-danger mb-2">
            Error Loading Invoices
          </p>
          <p className="text-sm text-default-500">
            {error.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }
}

export default InvoicesPage;
