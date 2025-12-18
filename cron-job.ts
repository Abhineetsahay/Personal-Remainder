import "dotenv/config";
import cron from "node-cron";
import { sendReminderEmails } from "@/lib/reminder";

// Schedule the reminder job to run every minute
cron.schedule("* * * * *", async () => {
  console.log("Running reminder cron job...");
  await sendReminderEmails();
});

console.log("Cron job scheduled to run every minute.");