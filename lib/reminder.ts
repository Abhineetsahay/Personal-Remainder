import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/User.Tasks";

interface Task {
  _id?: string;
  taskName: string;
  taskEndDate: Date | string;
  taskEndTime: Date | string;
  reminderSent?: boolean;
}

export async function sendReminderEmails() {
  try {
    await connectDB();

    const now = new Date();
    const fifteenMinLater = new Date(now.getTime() + 15 * 60000);

    // Get all users
    const users = await User.find({});

    if (!users.length) {
      console.log("No users found");
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
        // Handle both old format (ISO date) and new format (date + time string)
        let endDateTime: Date;
        
        if (typeof task.taskEndTime === 'string' && task.taskEndTime.includes('T')) {
          // Old format: ISO date string
          endDateTime = new Date(task.taskEndTime);
        } else if (typeof task.taskEndTime === 'string' && task.taskEndTime.match(/^\d{2}:\d{2}/)) {
          // New format: "HH:MM" string, combine with taskEndDate
          const dateStr = new Date(task.taskEndDate).toISOString().split('T')[0];
          endDateTime = new Date(`${dateStr}T${task.taskEndTime}:00`);
        } else {
          // Fallback
          endDateTime = new Date(task.taskEndTime);
        }
        
        const isInRange = endDateTime >= now && endDateTime <= fifteenMinLater;
        const notSent = !task.reminderSent;
        
        if (isInRange && notSent) {
          console.log(`Task "${task.taskName}" ends at ${endDateTime.toLocaleString()}, sending reminder`);
        }
        
        return isInRange && notSent;
      });

      if (!dueTasks.length) continue;

      console.log(`Found ${dueTasks.length} tasks to remind for user ${user.email}`);

      const html = `
        <h2>⏰ Reminder: Tasks Ending Soon</h2>
        <p>Hi ${user.name}, the following tasks are ending in the next 15 minutes:</p>
        <ul>
          ${dueTasks
            .map((t: Task) => {
              let endTimeStr: string;
              if (typeof t.taskEndTime === 'string' && t.taskEndTime.includes('T')) {
                endTimeStr = new Date(t.taskEndTime).toLocaleTimeString();
              } else {
                endTimeStr = t.taskEndTime as string;
              }
              return `<li><b>${t.taskName}</b> — Ends at: ${endTimeStr}</li>`;
            })
            .join("")}
        </ul>
      `;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "⏰ Task Deadline Reminder",
          html,
        });

        console.log(`Email sent to ${user.email}`);

        // Mark reminders as sent for these tasks
        for (const task of dueTasks) {
          const taskIndex = user.tasks.findIndex((t: Task) => t._id?.toString() === task._id?.toString());
          if (taskIndex !== -1) {
            user.tasks[taskIndex].reminderSent = true;
          }
        }

        await user.save();
      } catch (emailErr) {
        console.error(`Failed to send email to ${user.email}:`, emailErr);
      }
    }

    console.log("Reminder emails processed");
  } catch (err) {
    console.error("Error sending reminders:", err);
  }
}