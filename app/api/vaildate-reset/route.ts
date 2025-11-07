import dbConnect from "@/backend/config/dbConnect";
import { User } from "@/backend/config/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resetId = searchParams.get("id");

    // console.log("🔍 Validate Reset - Received ID:", resetId);

    if (!resetId) {
      // console.log("❌ No reset ID provided");
      return NextResponse.json(
        { valid: false, error: "Reset ID is required" },
        { status: 400 }
      );
    }

    // ✅ Check format (32 hex characters)
    const isValidFormat = /^[a-f0-9]{32}$/i.test(resetId);
    // console.log(
    //   "🔍 ID Format valid:",
    //   isValidFormat,
    //   "Length:",
    //   resetId.length
    // );

    if (!isValidFormat) {
      // console.log("❌ Invalid reset ID format");
      return NextResponse.json(
        { valid: false, error: "Invalid reset link format" },
        { status: 400 }
      );
    }

    await dbConnect();
    // console.log("✅ DB Connected");

    // ✅ First, let's see if ANY user has this resetPasswordId
    const userCheck = await User.findOne({ resetPasswordId: resetId });
    // console.log("🔍 User found with this ID:", !!userCheck);

    // if (userCheck) {
    //   console.log("🔍 User details:", {
    //     email: userCheck.email,
    //     resetPasswordId: userCheck.resetPasswordId,
    //     resetPasswordExpire: userCheck.resetPasswordExpire,
    //     resetPasswordUsed: userCheck.resetPasswordUsed,
    //     now: new Date(),
    //     isExpired: userCheck.resetPasswordExpire
    //       ? userCheck.resetPasswordExpire < Date.now()
    //       : "No expiry set",
    //   });
    // }

    const user = await User.findOne({
      resetPasswordId: resetId,
      resetPasswordExpire: { $gt: Date.now() },
      resetPasswordUsed: { $ne: true },
    });

    if (!user) {
      // console.log("❌ No valid user found with all conditions met");
      return NextResponse.json(
        { valid: false, error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // console.log("✅ Valid reset link found for user:", user.email);
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("❌ Error verifying reset ID:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
