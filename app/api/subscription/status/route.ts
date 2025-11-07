import { NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConnect";
import { User } from "@/backend/config/models/user.model";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email }).select("subscription");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { subscription: user.subscription },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
