import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { Task } from "@/models/User.Tasks";

export async function PUT(req: Request) {
  try {
    const { email, taskId, updatedTask } = await req.json();

    if (!email || !taskId || !updatedTask) {
      return NextResponse.json(
        { message: "Email, Task ID, and updated data required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const convertToDateTime = (date: string, time: string) => {
      return new Date(`${date}T${time}:00`);
    };

    // Convert strings → proper date objects
    const fixedTask = {
      ...updatedTask,
      taskStartDate: convertToDateTime(updatedTask.taskStartDate, updatedTask.taskStartTime),
      taskEndDate: convertToDateTime(updatedTask.taskEndDate, updatedTask.taskEndTime),
      taskStartTime: convertToDateTime(updatedTask.taskStartDate, updatedTask.taskStartTime),
      taskEndTime: convertToDateTime(updatedTask.taskEndDate, updatedTask.taskEndTime),
    };

    const taskIndex = user.tasks.findIndex((t: Task) => t._id == taskId);
    if (taskIndex === -1) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    user.tasks[taskIndex] = { ...user.tasks[taskIndex]._doc, ...fixedTask };

    await user.save();

    return NextResponse.json({ message: "Task updated successfully" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
