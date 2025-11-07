// For /api/admin/interviews/route.ts
import { getInterviews } from "@/backend/controller/interview.controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // console.log("🎯 [API Interviews] GET request received");
  // console.log("🔗 [API Interviews] Request URL:", request.url);

  try {
    const res = await getInterviews(request, "admin");
    // console.log("✅ [API Interviews] Controller response:", res);

    if (res?.error) {
      console.error("❌ [API Interviews] Error from controller:", res.error);
      return NextResponse.json(
        { error: { message: res?.error?.message } },
        { status: res.error?.statusCode || 500 }
      );
    }

    const { interviews, pagination } = res;
    // console.log(
    //   "📤 [API Interviews] Sending response - interviews:",
    //   interviews?.length,
    //   "pagination:",
    //   pagination
    // );

    return NextResponse.json({ interviews, pagination });
  } catch (error: any) {
    console.error("💥 [API Interviews] Uncaught error:", error);
    return NextResponse.json(
      { error: { message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
