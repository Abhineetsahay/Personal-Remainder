import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/User.Tasks";

interface Task {
  _id?: string;
  taskName: string;
  taskEndTime: Date | string;
  reminderSent?: boolean;
}

export async function sendReminderEmails() {
  try {
    await connectDB();

    const now = new Date();
    const fifteenMinLater = new Date(now.getTime() + 15 * 60000);

    const users = await User.find({
      "tasks.taskEndTime": {
        $gte: now,
        $lte: fifteenMinLater,
      },
      "tasks.reminderSent": false,
    });

    if (!users.length) {
      console.log("No emails to send");
      return;
    }

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Loop through users + tasks
    for (const user of users) {
      const dueTasks = (user.tasks || []).filter((task: Task) => {
        const end = new Date(task.taskEndTime);
        return end >= now && end <= fifteenMinLater && !task.reminderSent;
      });

      if (!dueTasks.length) continue;

      const html = `
        <h2>⏰ Reminder: Tasks Ending Soon</h2>
        <p>Hi ${user.name}, the following tasks are ending in the next 15 minutes:</p>
        <ul>
          ${dueTasks
            .map(
              (t: Task) => `<li><b>${t.taskName}</b> — Ends at: ${new Date(
                t.taskEndTime
              ).toLocaleTimeString()}</li>`
            )
            .join("")}
        </ul>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "⏰ Task Deadline Reminder",
        html,
      });

      // Mark reminders as sent for these tasks
      for (const task of dueTasks) {
        const taskIndex = user.tasks.findIndex((t: Task) => t._id?.toString() === task._id?.toString());
        if (taskIndex !== -1) {
          user.tasks[taskIndex].reminderSent = true;
        }
      }

      await user.save();
    }

    console.log("Reminder emails processed");
  } catch (err) {
    console.error("Error sending reminders:", err);
  }
}