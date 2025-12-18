import { NextResponse } from "next/server";
import { updateTaskStatus } from "@/lib/updateTaskStatus";

export async function GET() {
  try {
    await updateTaskStatus();
    return NextResponse.json({
      message: "Task status updated",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}