// For /api/admin/stats/route.ts
import { getDashboardStats } from "@/backend/controller/auth.controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("🎯 [API Stats] GET request received");
  console.log("🔗 [API Stats] Request URL:", request.url);

  try {
    const res = await getDashboardStats(request);
    // console.log("✅ [API Stats] Controller response:", res);

    if (res?.error) {
      // console.error("❌ [API Stats] Error from controller:", res.error);
      return NextResponse.json(
        { error: { message: res?.error?.message } },
        { status: res.error?.statusCode || 500 }
      );
    }

    // console.log("📤 [API Stats] Sending success response");
    return NextResponse.json({ data: res });
  } catch (error: any) {
    console.error("💥 [API Stats] Uncaught error:", error);
    return NextResponse.json(
      { error: { message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
