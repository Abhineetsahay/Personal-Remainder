import "dotenv/config";
import cron from "node-cron";
import { updateTaskStatus } from "@/lib/updateTaskStatus";

// Schedule the task status update job to run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("Running task status update cron job...");
  await updateTaskStatus();
});

console.log("Task status update cron job scheduled to run every 10 minutes.");