import { connectDB } from "@/lib/db";
import User from "@/models/User.Tasks";

interface Task {
  _id?: string;
  taskName: string;
  taskEndTime: Date | string;
  taskStatus: string;
}

export async function updateTaskStatus() {
  try {
    await connectDB();

    const now = new Date();

    // Get all users
    const users = await User.find({});

    if (!users.length) {
      console.log("No users found for status update");
      return;
    }

    // Loop through users and update tasks
    for (const user of users) {
      let updated = false;

      for (let i = 0; i < user.tasks.length; i++) {
        const task = user.tasks[i];
        const taskEndTime = new Date(task.taskEndTime);

        // If task end time has passed and status is not completed, update it
        if (taskEndTime <= now && task.taskStatus !== "Completed") {
          user.tasks[i].taskStatus = "Completed";
          updated = true;
          console.log(`Updated task "${task.taskName}" to Completed for user ${user.email}`);
        }
      }

      if (updated) {
        await user.save();
      }
    }

    console.log("Task status update completed");
  } catch (err) {
    console.error("Error updating task status:", err);
  }
}