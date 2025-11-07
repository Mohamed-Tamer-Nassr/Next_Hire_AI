import { getInvoices } from "@/backend/controller/payment.controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const res = await getInvoices(request);

    if (!res) {
      return NextResponse.json(
        { error: { message: "Failed to fetch invoices" } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      invoices: res.invoices || [],
      message: res.message,
    });
  } catch (error: any) {
    console.error("API Error fetching invoices:", error);

    return NextResponse.json(
      {
        error: {
          message: error.message || "Failed to fetch invoices",
        },
      },
      { status: 500 }
    );
  }
}
