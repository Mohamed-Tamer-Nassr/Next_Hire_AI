import { subscriptionWebHook } from "@/backend/controller/payment.controller";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const result = await subscriptionWebHook(request);
  return NextResponse.json(
    { success: result.success, error: result.error },
    { status: result.status }
  );
}
