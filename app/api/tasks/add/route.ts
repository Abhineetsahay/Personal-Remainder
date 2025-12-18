import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User.Tasks";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, task } = body;

    if (!email || !task) {
      return NextResponse.json(
        { message: "Email and task required" },
        { status: 400 }
      );
    }

    const start = new Date(`${task.taskStartDate}T${task.taskStartTime}:00`);
    const end = new Date(`${task.taskEndDate}T${task.taskEndTime}:00`);

    task.taskStartDate = start;
    task.taskEndDate = end;
    task.taskStartTime = start;
    task.taskEndTime = end;

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.tasks.push(task);
    await user.save();

    return NextResponse.json(
      { message: "Task added successfully", tasks: user.tasks },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
