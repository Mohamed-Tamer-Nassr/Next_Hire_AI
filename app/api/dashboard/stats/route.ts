import { getInterviewStats } from "@/backend/controller/interview.controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const res = await getInterviewStats(request);

    if (res?.error) {
      return NextResponse.json(
        { error: { message: res?.error?.message } },
        { status: res?.error?.statusCode || 500 }
      );
    }

    // ✅ FIXED: Add proper headers for caching
    return NextResponse.json(
      { data: res },
      {
        headers: {
          "Cache-Control": "private, max-age=60, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[API] Error fetching interview stats:", error);

    // ✅ FIXED: Return appropriate status codes based on error
    const statusCode = error.message?.includes("authenticated")
      ? 401
      : error.message?.includes("not found")
      ? 404
      : 500;

    return NextResponse.json(
      {
        error: {
          message: error?.message || "Internal server error",
          ...(process.env.NODE_ENV === "development" && {
            stack: error?.stack,
          }),
        },
      },
      { status: statusCode }
    );
  }
}
