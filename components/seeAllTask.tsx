"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/models/User.Tasks";

export default function SeeAllTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const email = localStorage.getItem("email");

      if (!email) {
        alert("Email not found");
        router.push("/");
        return;
      }

      const response = await axios.get("/api/tasks/all", { params: { email } });
      setTasks(response.data.tasks || []);
    };

    getData();
  }, [router]);

  const openUpdateModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const updateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    if (!email || !editingTask?._id) return;

    const form = new FormData(e.currentTarget);

    const updatedTask = {
      taskName: form.get("taskName"),
      taskDescription: form.get("taskDescription"),
      taskStartDate: form.get("taskStartDate"),
      taskEndDate: form.get("taskEndDate"),
      taskStartTime: form.get("taskStartTime"),
      taskEndTime: form.get("taskEndTime"),
      priority: Number(form.get("priority")),
    };

    await axios.put("/api/tasks/update", {
      email,
      taskId: editingTask._id,
      updatedTask,
    });

    alert("Task Updated Successfully!");

    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-300">No tasks added yet.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task: Task, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg bg-zinc-100 dark:bg-zinc-800"
            >
              <h3 className="font-bold">{task.taskName}</h3>
              <p className="text-sm opacity-80">{task.taskDescription}</p>

              <div className="text-xs mt-2 opacity-70">
                <p>
                  📅 {new Date(task.taskStartDate).toLocaleDateString()} →{" "}
                  {new Date(task.taskEndDate).toLocaleDateString()}
                </p>
                <p>
                  ⏰{" "}
                  {new Date(task.taskStartTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  →{" "}
                  {new Date(task.taskEndTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>⭐ Priority: {task.priority}</p>
              </div>

              <button
                onClick={() => openUpdateModal(task)}
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          ))}
        </div>
      )}

      {/* UPDATE MODAL */}
      {modalOpen && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Update Task</h2>

            <form onSubmit={updateTask} className="space-y-4">

              <input
                name="taskName"
                defaultValue={editingTask.taskName}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="taskDescription"
                defaultValue={editingTask.taskDescription}
                className="w-full border p-2 rounded"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="taskStartDate"
                  defaultValue={new Date(editingTask.taskStartDate)
                    .toISOString()
                    .split("T")[0]}
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  name="taskEndDate"
                  defaultValue={new Date(editingTask.taskEndDate)
                    .toISOString()
                    .split("T")[0]}
                  className="border p-2 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  name="taskStartTime"
                  defaultValue={new Date(editingTask.taskStartTime)
                    .toISOString()
                    .substring(11, 16)}
                  className="border p-2 rounded"
                />
                <input
                  type="time"
                  name="taskEndTime"
                  defaultValue={new Date(editingTask.taskEndTime)
                    .toISOString()
                    .substring(11, 16)}
                  className="border p-2 rounded"
                />
              </div>

              <input
                type="number"
                name="priority"
                min="1"
                max="10"
                defaultValue={editingTask.priority}
                className="border p-2 rounded"
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 rounded text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
