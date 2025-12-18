import { NextResponse } from "next/server";
import { sendReminderEmails } from "@/lib/reminder";

export async function GET() {
  try {
    await sendReminderEmails();
    return NextResponse.json({
      message: "Reminder emails processed",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}
