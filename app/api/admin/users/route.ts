// For /api/admin/users/route.ts
import { getAllUsers } from "@/backend/controller/auth.controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("🎯 [API Users] GET request received");
  console.log("🔗 [API Users] Request URL:", request.url);

  try {
    const res = await getAllUsers(request);
    // console.log("✅ [API User  s] Controller response:", res);

    if (res?.error) {
      console.error("❌ [API Users] Error from controller:", res.error);
      return NextResponse.json(
        { error: { message: res?.error?.message } },
        { status: res.error?.statusCode || 500 }
      );
    }

    const { users, pagination } = res;
    console.log(
      "📤 [API Users] Sending response - users:",
      users?.length,
      "pagination:",
      pagination
    );

    return NextResponse.json({ users, pagination });
  } catch (error: any) {
    console.error("💥 [API Users] Uncaught error:", error);
    console.error("📍 [API Users] Error stack:", error.stack);
    return NextResponse.json(
      { error: { message: error.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
