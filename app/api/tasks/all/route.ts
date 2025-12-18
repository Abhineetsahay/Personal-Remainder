import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
// import Request
import User from "@/models/User.Tasks";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    console.log(email);

    if (!email)
      return NextResponse.json({ message: "Email required" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ tasks: user.tasks }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
