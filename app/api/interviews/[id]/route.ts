import { getInterviewById } from "@/backend/controller/interview.controller";
import { NextResponse } from "next/server";

// ✅ FIXED: Params is now a Promise in Next.js 15+
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: { message: "Interview ID is required" } },
        { status: 400 }
      );
    }

    const res = await getInterviewById(id);

    if (res?.error) {
      return NextResponse.json(
        { error: { message: res?.error?.message } },
        { status: res?.error?.statusCode || 500 }
      );
    }

    if (!res?.interview) {
      return NextResponse.json(
        { error: { message: "Interview not found" } },
        { status: 404 }
      );
    }

    // Don't prevent access to completed interviews here
    // Let the page component decide what to do
    return NextResponse.json({
      interview: res?.interview,
    });
  } catch (error: any) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: { message: error?.message || "Internal server error" } },
      { status: 500 }
    );
  }
}
