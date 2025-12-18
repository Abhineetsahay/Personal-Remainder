"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { Task } from "@/models/User.Tasks";
import { useRouter } from "next/navigation";

export default function AddTaskPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Task>();

  const router = useRouter();

  const onSubmit = async (data: Task) => {
    const email = localStorage.getItem("email");
    if (!email) {
      alert("Email not defined");
      router.push("/"); 
    }
    const res = await axios.post("/api/tasks/add", {
      email,
      task: data,
    });

    alert(res.data.message);
    reset();
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-6 bg-white dark:bg-zinc-900 rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4 text-center">Add Task</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Task Name</label>
          <input
            {...register("taskName", { required: "Task name is required" })}
            className="w-full border p-3 rounded bg-zinc-100 dark:bg-zinc-800"
            placeholder="Enter task name"
          />
          {errors.taskName && (
            <p className="text-red-500 text-sm">{errors.taskName.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Task Description</label>
          <textarea
            {...register("taskDescription", {
              required: "Description is required",
            })}
            className="w-full border p-3 rounded bg-zinc-100 dark:bg-zinc-800"
            placeholder="Describe the task..."
          />
          {errors.taskDescription && (
            <p className="text-red-500 text-sm">
              {errors.taskDescription.message}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              {...register("taskStartDate", {
                required: "Start date required",
              })}
              className="w-full border p-3 rounded bg-zinc-100 dark:bg-zinc-800"
            />
            {errors.taskStartDate && (
              <p className="text-red-500 text-sm">
                {errors.taskStartDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              {...register("taskEndDate", { required: "End date required" })}
              className="w-full border p-3 rounded bg-zinc-100 dark:bg-zinc-800"
            />
            {errors.taskEndDate && (
              <p className="text-red-500 text-sm">
                {errors.taskEndDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Time</label>
            <input
              type="time"
              {...register("taskStartTime", {
                required: "Start time required",
              })}
              className="w-full border p-3 rounded bg-zinc-100 dark:bg-zinc-800"
            />
            {errors.taskStartTime && (
              <p className="text-red-500 text-sm">
                {errors.taskStartTime.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">End Time</label>
            <input
              type="time"
              {...register("taskEndTime", { required: "End time required" })}
              className="w-full border p-3 rounded bg-zinc-100 dark:bg-zinc-800"
            />
            {errors.taskEndTime && (
              <p className="text-red-500 text-sm">
                {errors.taskEndTime.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Priority (1–10)</label>
          <input
            type="number"
            min={1}
            max={10}
            {...register("priority", { required: "Priority required" })}
            className="w-full border p-3 rounded bg-zinc-100 dark:bg-zinc-800"
          />
          {errors.priority && (
            <p className="text-red-500 text-sm">{errors.priority.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}
