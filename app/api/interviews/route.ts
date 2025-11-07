import { getInterviews } from "@/backend/controller/interview.controller";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const res = await getInterviews(request);
  // ✅ CRITICAL FIX: Use new pagination structure
  const { interviews, pagination } = res;
  return NextResponse.json({ interviews, pagination });
}
