import dbConnect from "@/backend/config/dbConnect";
import { User } from "@/backend/config/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resetId = searchParams.get("id");

    if (!resetId) {
      return NextResponse.json(
        { valid: false, error: "Reset ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({
      resetPasswordId: resetId,
      resetPasswordExpire: { $gt: Date.now() },
      resetPasswordUsed: { $ne: true },
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Error verifying reset ID:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
